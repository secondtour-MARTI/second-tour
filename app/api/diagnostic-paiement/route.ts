import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Vérifie la configuration Stripe sans jamais afficher la clé secrète.
export async function GET() {
  const pk = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? "";
  const sk = process.env.STRIPE_SECRET_KEY ?? "";

  const resultat: Record<string, unknown> = {
    cle_publique_presente: pk.length > 0,
    cle_publique_debut: pk.slice(0, 12),
    cle_publique_longueur: pk.length,
    cle_publique_caracteres_bizarres: /[^A-Za-z0-9_]/.test(pk),
    cle_secrete_presente: sk.length > 0,
    cle_secrete_debut: sk.slice(0, 8),
    cle_secrete_longueur: sk.length,
    cle_secrete_caracteres_bizarres: /[^A-Za-z0-9_]/.test(sk),
  };

  if (sk) {
    try {
      const compte = await stripe().accounts.retrieve();
      resultat.cle_secrete_fonctionne = true;
      resultat.compte_id_fin = compte.id.slice(-6);
      resultat.meme_compte_que_cle_publique = pk.includes(compte.id.replace("acct_", "").slice(0, 10));
    } catch (e) {
      resultat.cle_secrete_fonctionne = false;
      resultat.erreur_stripe = e instanceof Error ? e.message.slice(0, 160) : "inconnue";
    }
  }

  return NextResponse.json(resultat);
}
