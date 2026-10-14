import Link from "next/link";

export const metadata = { title: "Diagnostic — Second Tour" };

// Écran provisoire : les 3 questions arrivent à l'étape 2.
export default function Diagnostic() {
  return (
    <main className="flex min-h-dvh flex-col justify-center px-5">
      <div className="etiquette mx-auto w-full max-w-md bg-papier p-6">
        <p className="font-titre text-2xl text-vert">Le diagnostic arrive.</p>
        <p className="mt-3 text-gris">
          Trois questions pour chiffrer ce que tes clients oubliés te coûtent.
          Cette page est en cours de construction.
        </p>
        <Link
          href="/"
          className="bouton-pouce mt-6 flex items-center justify-center border-[3px] border-encre bg-jaune font-titre text-vert"
        >
          Retour à l&apos;accueil
        </Link>
      </div>
    </main>
  );
}
