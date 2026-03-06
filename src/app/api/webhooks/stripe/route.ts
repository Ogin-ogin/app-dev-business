import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";

// Stripeの初期化
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: "2026-02-25.clover", // 最新のAPIバージョンに変更
});

export async function POST(req: Request) {
    const body = await req.text();
    const headersList = await headers();
    const signature = headersList.get("stripe-signature") as string;

    let event: Stripe.Event;

    try {
        // リクエストの署名を読み込み、検証する
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET as string
        );
    } catch (error: any) {
        console.error(`⚠️  Webhook signature verification failed. ${error.message}`);
        return NextResponse.json(
            { error: `Webhook Error: ${error.message}` },
            { status: 400 }
        );
    }

    // イベントを処理する
    switch (event.type) {
        case "checkout.session.completed":
            const session = event.data.object as Stripe.Checkout.Session;
            console.log(`決済成功! Session ID: ${session.id}`);
            // ここでデータベースの更新などを行います
            break;
        case "payment_intent.succeeded":
            const paymentIntent = event.data.object as Stripe.PaymentIntent;
            console.log(`PaymentIntent成功! 金額: ${paymentIntent.amount}`);
            break;
        default:
            console.log(`Unhandled event type: ${event.type}`);
    }

    // コード 200 のレスポンスを返す (Stripeに受信成功を伝える)
    return NextResponse.json({ received: true }, { status: 200 });
}
