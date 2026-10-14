import type { Metadata } from "next";
import Link from "next/link";
import { stripe } from "@/lib/stripe";
import CreerAcces from "./creer-acces";

export const metadata: Metadata = { title: "Bienvenue — Second Tour", robots: { index: false } };

type Props = { searchParams: Promise<{ session_id?: string }> };

// Écran d'arrivée après le paiement. L'accès réel est ouvert par le webhook (confirmation serveur),
// cette page sert seulement à afficher le résultat.
export default async function Bienvenue({ searchParams }: Props) {
  const { session_id } = await searchParams;
  let statut: "ok" | "echec" | "inconnu" = "inconnu";
  let email: string | null = null;

  if (session_id && /^cs_[A-Za-z0-9_]+$/.test(session_id)) {
    try {
      const s = await stripe().checkout.sessions.retrieve(session_id);
      statut = s.status === "complete" ? "ok" : "echec";
      email = s.customer_details?.email ?? null;
    } catch {
      statut = "inconnu";
    }
  }

  if (statut !== "ok") {
    return (
      <main className="flex min-h-dvh flex-col justify-center px-5">
        <div className="etiquette mx-auto w-full max-w-md bg-papier p-6">
          <p className="font-titre text-2xl text-vert">Le paiement n&apos;est pas passé.</p>
          <p className="mt-3 text-gris">
            Aucun montant n&apos;a été prélevé. Ça arrive : carte refusée, connexion coupée, plafond atteint. Tu peux
            réessayer avec la même carte ou une autre.
          </p>
          <Link href="/activer" className="bouton-pouce mt-6 flex items-center justify-center border-[3px] border-encre bg-jaune font-titre text-vert">
            Réessayer le paiement
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-dvh flex-col justify-center px-5">
      <div className="etiquette mx-auto w-full max-w-md bg-papier p-6">
        <p className="font-titre text-3xl leading-tight text-vert">C&apos;est fait. Bienvenue !</p>
        <p className="mt-3">
          Ton abonnement Second Tour est actif. Tu vas recevoir un reçu par email.
        </p>
        <p className="mt-3 font-semibold">Dernière étape : choisis ton mot de passe pour ouvrir ton espace.</p>
        <CreerAcces sessionId={session_id!} email={email} />
        <p className="mt-4 text-center text-sm text-gris">
          Déjà un accès ?{" "}
          <Link href="/connexion" className="font-semibold text-vert underline">
            Me connecter
          </Link>
        </p>
      </div>
    </main>
  );
}
