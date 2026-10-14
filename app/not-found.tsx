import Link from "next/link";

export default function PageIntrouvable() {
  return (
    <main className="flex min-h-dvh flex-col justify-center px-5">
      <div className="etiquette mx-auto w-full max-w-md bg-papier p-6">
        <p className="font-titre text-6xl text-vert">404</p>
        <p className="mt-3 text-lg">
          Cette page a pris un mauvais virage. Rien de grave.
        </p>
        <Link
          href="/"
          className="bouton-pouce mt-6 flex items-center justify-center border-[3px] border-encre bg-jaune font-titre text-vert"
        >
          Revenir à l&apos;accueil
        </Link>
      </div>
    </main>
  );
}
