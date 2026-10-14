"use client";

import Link from "next/link";

export default function Erreur({ reset }: { error: Error; reset: () => void }) {
  return (
    <main className="flex min-h-dvh flex-col justify-center px-5">
      <div className="etiquette mx-auto w-full max-w-md bg-papier p-6">
        <p className="font-titre text-2xl text-vert">Petit souci de moteur.</p>
        <p className="mt-3">Quelque chose n&apos;a pas fonctionné de notre côté. Réessaie, ça repart en général tout de suite.</p>
        <button
          type="button"
          onClick={reset}
          className="bouton-pouce mt-6 flex w-full items-center justify-center border-[3px] border-encre bg-jaune font-titre text-vert"
        >
          Réessayer
        </button>
        <Link href="/" className="mt-3 flex min-h-12 items-center justify-center font-semibold underline">
          Revenir à l&apos;accueil
        </Link>
      </div>
    </main>
  );
}
