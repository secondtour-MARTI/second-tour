import Stripe from "stripe";

// Client Stripe côté serveur uniquement. La clé secrète ne quitte jamais le serveur.
let client: Stripe | null = null;

export function stripe(): Stripe {
  const cle = process.env.STRIPE_SECRET_KEY;
  if (!cle) throw new Error("STRIPE_SECRET_KEY manquante");
  if (!client) client = new Stripe(cle);
  return client;
}
