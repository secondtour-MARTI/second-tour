import Link from "next/link";

export const metadata = { title: "Ton plan de rappels — Second Tour" };

// Écran provisoire : l'avant-goût et le paywall arrivent à l'étape 3.
export default function Plan() {
  return (
    <main className="flex min-h-dvh flex-col justify-center px-5">
      <div className="etiquette mx-auto w-full max-w-md bg-papier p-6">
        <p className="font-titre text-2xl text-vert">Ton plan arrive.</p>
        <p className="mt-3 text-gris">
          Cette page est en cours de construction : ton affiche QR, ton calendrier de rappels et ton premier message.
        </p>
        <Link href="/" className="bouton-pouce mt-6 flex items-center justify-center border-[3px] border-encre bg-jaune font-titre text-vert">
          Retour à l&apos;accueil
        </Link>
      </div>
    </main>
  );
}
