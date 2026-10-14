import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { supabaseAdmin } from "@/lib/supabase/server";

export const runtime = "nodejs";

// Stripe appelle cette adresse à chaque événement de paiement.
// La signature est vérifiée : personne d'autre que Stripe ne peut confirmer un paiement.
export async function POST(req: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const signature = req.headers.get("stripe-signature");
  if (!secret || !signature) {
    return NextResponse.json({ erreur: "Non autorisé." }, { status: 400 });
  }

  const corps = await req.text();
  let evt: Stripe.Event;
  try {
    evt = stripe().webhooks.constructEvent(corps, signature, secret);
  } catch {
    return NextResponse.json({ erreur: "Signature invalide." }, { status: 400 });
  }

  try {
    const admin = supabaseAdmin();
    switch (evt.type) {
      case "checkout.session.completed": {
        const s = evt.data.object as Stripe.Checkout.Session;
        const email = s.customer_details?.email?.toLowerCase();
        const abonnementId = typeof s.subscription === "string" ? s.subscription : s.subscription?.id;
        if (!email || !abonnementId) break;
        const { data: garage } = await admin.from("garages").select("id").eq("email", email).maybeSingle();
        const { error } = await admin.from("abonnements").upsert(
          {
            email,
            garage_id: garage?.id ?? null,
            stripe_customer_id: typeof s.customer === "string" ? s.customer : s.customer?.id ?? null,
            stripe_subscription_id: abonnementId,
            plan: s.metadata?.plan ?? null,
            statut: "active",
            updated_at: new Date().toISOString(),
          },
          { onConflict: "stripe_subscription_id" }
        );
        if (error) throw error;
        break;
      }
      case "customer.subscription.deleted": {
        const sub = evt.data.object as Stripe.Subscription;
        const { error } = await admin
          .from("abonnements")
          .update({ statut: "canceled", updated_at: new Date().toISOString() })
          .eq("stripe_subscription_id", sub.id);
        if (error) throw error;
        break;
      }
      default:
        break;
    }
  } catch (e) {
    console.error("Webhook : enregistrement impossible", e);
    // Stripe réessaiera automatiquement plus tard.
    return NextResponse.json({ erreur: "Enregistrement impossible." }, { status: 500 });
  }

  return NextResponse.json({ recu: true });
}
