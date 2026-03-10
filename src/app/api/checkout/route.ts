import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: "2026-02-25.clover",
});

export async function POST(req: Request) {
    try {
        const { priceId, mode, metadata, successPath } = await req.json();

        if (!priceId || !mode) {
            return NextResponse.json(
                { error: "priceId and mode are required" },
                { status: 400 }
            );
        }

        if (mode !== "subscription" && mode !== "payment") {
            return NextResponse.json(
                { error: "mode must be 'subscription' or 'payment'" },
                { status: 400 }
            );
        }

        const origin = req.headers.get("origin") || "";
        const referer = req.headers.get("referer") || `${origin}/products`;

        const session = await stripe.checkout.sessions.create({
            mode,
            line_items: [{ price: priceId, quantity: 1 }],
            success_url: `${origin}${successPath || "/dashboard"}?success=true`,
            cancel_url: referer,
            ...(metadata && { metadata }),
        });

        return NextResponse.json({ url: session.url });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Internal server error";
        console.error("Checkout session error:", message);
        return NextResponse.json(
            { error: message },
            { status: 500 }
        );
    }
}
