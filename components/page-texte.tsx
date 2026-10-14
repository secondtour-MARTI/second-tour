import Link from "next/link";

// Mise en page commune des pages légales.
export default function PageTexte({ titre, maj, children }: { titre: string; maj: string; children: React.ReactNode }) {
  return (
    <main className="min-h-dvh px-5 pb-12 pt-6">
      <article className="mx-auto max-w-xl">
        <Link href="/" className="inline-flex min-h-11 items-center font-semibold underline">← Accueil</Link>
        <h1 className="mt-4 font-titre text-3xl leading-tight text-vert">{titre}</h1>
        <p className="mt-1 text-sm text-gris">Dernière mise à jour : {maj}</p>
        <div className="mt-6 space-y-4 [&_h2]:mt-8 [&_h2]:font-titre [&_h2]:text-xl [&_li]:ml-5 [&_li]:list-disc [&_strong]:text-encre">
          {children}
        </div>
      </article>
    </main>
  );
}
