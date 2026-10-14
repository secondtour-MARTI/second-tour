import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { stripe } from "@/lib/stripe";

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

  switch (evt.type) {
    case "checkout.session.completed": {
      const s = evt.data.object as Stripe.Checkout.Session;
      // Étape 4 : on enregistrera ici l'abonnement dans Supabase et on ouvrira l'accès.
      console.log("Paiement confirmé", {
        session: s.id,
        client: s.customer,
        email: s.customer_details?.email,
        plan: s.metadata?.plan,
      });
      break;
    }
    case "customer.subscription.deleted": {
      const sub = evt.data.object as Stripe.Subscription;
      console.log("Abonnement résilié", { abonnement: sub.id, client: sub.customer });
      break;
    }
    default:
      break;
  }

  return NextResponse.json({ recu: true });
}
