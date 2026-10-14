import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { PLANS, estPlan } from "@/lib/plans";
import { lireReponses } from "@/lib/diagnostic";

export const runtime = "nodejs";

// Crée une session de paiement intégrée (Stripe Embedded Checkout) pour la formule choisie.
export async function POST(req: Request) {
  let corps: Record<string, unknown>;
  try {
    corps = await req.json();
  } catch {
    return NextResponse.json({ erreur: "Requête invalide." }, { status: 400 });
  }

  // Validation serveur : seule une formule connue est acceptée, le prix vient du serveur.
  if (!estPlan(corps.plan)) {
    return NextResponse.json({ erreur: "Formule inconnue." }, { status: 400 });
  }
  const plan = PLANS[corps.plan];
  const diag = lireReponses({
    m: typeof corps.m === "string" ? corps.m : undefined,
    c: typeof corps.c === "string" ? corps.c : undefined,
    r: typeof corps.r === "string" ? corps.r : undefined,
  });

  const origine = new URL(req.url).origin;

  try {
    const session = await stripe().checkout.sessions.create({
      ui_mode: "embedded",
      mode: "subscription",
      locale: "fr",
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "eur",
            unit_amount: plan.prix * 100,
            recurring: { interval: plan.intervalle },
            product_data: { name: `Second Tour — ${plan.nom}` },
          },
        },
      ],
      billing_address_collection: "auto",
      metadata: {
        plan: corps.plan,
        metier: diag?.metier ?? "",
        clients: diag ? String(diag.clients) : "",
      },
      subscription_data: { metadata: { plan: corps.plan } },
      return_url: `${origine}/bienvenue?session_id={CHECKOUT_SESSION_ID}`,
    });
    return NextResponse.json({ clientSecret: session.client_secret });
  } catch (e) {
    console.error("Création de session Stripe impossible", e);
    return NextResponse.json(
      { erreur: "Le paiement n'a pas pu démarrer. Réessaie dans un instant." },
      { status: 500 }
    );
  }
}
