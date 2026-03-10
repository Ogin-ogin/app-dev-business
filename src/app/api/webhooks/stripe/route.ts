import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { adminDb } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: "2026-02-25.clover",
});

export async function POST(req: Request) {
    const body = await req.text();
    const headersList = await headers();
    const signature = headersList.get("stripe-signature") as string;

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET as string
        );
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Unknown error";
        console.error(`Webhook signature verification failed: ${message}`);
        return NextResponse.json(
            { error: `Webhook Error: ${message}` },
            { status: 400 }
        );
    }

    try {
        switch (event.type) {
            case "checkout.session.completed": {
                const session = event.data.object as Stripe.Checkout.Session;
                await handleCheckoutCompleted(session);
                break;
            }
            case "customer.subscription.updated": {
                const subscription = event.data.object as Stripe.Subscription;
                await handleSubscriptionUpdated(subscription);
                break;
            }
            case "customer.subscription.deleted": {
                const subscription = event.data.object as Stripe.Subscription;
                await handleSubscriptionDeleted(subscription);
                break;
            }
            default:
                console.log(`Unhandled event type: ${event.type}`);
        }
    } catch (error) {
        console.error(`Error processing webhook event ${event.type}:`, error);
        return NextResponse.json(
            { error: "Webhook handler failed" },
            { status: 500 }
        );
    }

    return NextResponse.json({ received: true }, { status: 200 });
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
    const uid = session.client_reference_id;
    if (!uid) {
        console.error("No client_reference_id found on checkout session");
        return;
    }

    // 注文をordersコレクションに保存
    await adminDb.collection("orders").add({
        uid,
        stripeSessionId: session.id,
        stripeCustomerId: session.customer as string,
        amount: session.amount_total,
        currency: session.currency,
        mode: session.mode,
        status: "completed",
        createdAt: FieldValue.serverTimestamp(),
    });

    // ユーザーのプランを更新
    const userRef = adminDb.collection("users").doc(uid);
    if (session.mode === "subscription") {
        const subscriptionId = session.subscription as string;
        const subscriptionRes = await stripe.subscriptions.retrieve(subscriptionId);
        const subscriptionData = subscriptionRes as Stripe.Subscription;
        const firstItem = subscriptionData.items.data[0];

        await userRef.set(
            {
                plan: "PRO",
                stripeCustomerId: session.customer as string,
                updatedAt: FieldValue.serverTimestamp(),
            },
            { merge: true }
        );

        // サブスクリプション情報を保存
        await userRef.collection("subscriptions").doc(subscriptionId).set({
            stripeCustomerId: session.customer as string,
            priceId: firstItem?.price.id,
            status: subscriptionData.status,
            currentPeriodEnd: firstItem
                ? new Date(firstItem.current_period_end * 1000)
                : null,
            createdAt: FieldValue.serverTimestamp(),
        });
    } else {
        // 買い切りの場合
        await userRef.set(
            {
                plan: "PRO_LIFETIME",
                stripeCustomerId: session.customer as string,
                updatedAt: FieldValue.serverTimestamp(),
            },
            { merge: true }
        );
    }
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
    const uid = await findUidByCustomerId(subscription.customer as string);
    if (!uid) return;

    const userRef = adminDb.collection("users").doc(uid);
    const firstItem = subscription.items.data[0];
    await userRef.collection("subscriptions").doc(subscription.id).set(
        {
            status: subscription.status,
            priceId: firstItem?.price.id,
            currentPeriodEnd: firstItem
                ? new Date(firstItem.current_period_end * 1000)
                : null,
            updatedAt: FieldValue.serverTimestamp(),
        },
        { merge: true }
    );

    // アクティブでないステータスの場合はプランをFREEに
    if (subscription.status !== "active" && subscription.status !== "trialing") {
        await userRef.set(
            {
                plan: "FREE",
                updatedAt: FieldValue.serverTimestamp(),
            },
            { merge: true }
        );
    }
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
    const uid = await findUidByCustomerId(subscription.customer as string);
    if (!uid) return;

    const userRef = adminDb.collection("users").doc(uid);

    // サブスクリプションのステータスを更新
    await userRef.collection("subscriptions").doc(subscription.id).set(
        {
            status: "canceled",
            updatedAt: FieldValue.serverTimestamp(),
        },
        { merge: true }
    );

    // プランをFREEに戻す
    await userRef.set(
        {
            plan: "FREE",
            updatedAt: FieldValue.serverTimestamp(),
        },
        { merge: true }
    );
}

async function findUidByCustomerId(customerId: string): Promise<string | null> {
    const snapshot = await adminDb
        .collection("users")
        .where("stripeCustomerId", "==", customerId)
        .limit(1)
        .get();

    if (snapshot.empty) {
        console.error(`No user found for Stripe customer: ${customerId}`);
        return null;
    }

    return snapshot.docs[0].id;
}
