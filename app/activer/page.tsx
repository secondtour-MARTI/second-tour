import Link from "next/link";

export const metadata = { title: "Activer mon plan — Second Tour" };

// Écran provisoire : le paywall avec paiement Stripe arrive juste après.
export default function Activer() {
  return (
    <main className="flex min-h-dvh flex-col justify-center px-5">
      <div className="etiquette mx-auto w-full max-w-md bg-papier p-6">
        <p className="font-titre text-2xl text-vert">L&apos;activation arrive.</p>
        <p className="mt-3 text-gris">Le paiement sécurisé est en cours d&apos;installation.</p>
        <Link href="/" className="bouton-pouce mt-6 flex items-center justify-center border-[3px] border-encre bg-jaune font-titre text-vert">
          Retour à l&apos;accueil
        </Link>
      </div>
    </main>
  );
}
