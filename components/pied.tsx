import Link from "next/link";

export default function Pied() {
  return (
    <footer className="border-t-[3px] border-encre bg-papier px-5 py-6 text-sm text-gris print:hidden">
      <div className="mx-auto max-w-xl">
        <p className="font-titre text-encre">SECOND TOUR</p>
        <p className="mt-1">Le rappel qui fait revenir les clients.</p>
        <nav className="mt-4 flex flex-wrap gap-x-5 gap-y-2" aria-label="Informations légales">
          <Link href="/mentions-legales" className="underline">Mentions légales</Link>
          <Link href="/cgv" className="underline">CGV</Link>
          <Link href="/confidentialite" className="underline">Confidentialité</Link>
          <Link href="/connexion" className="underline">Espace garage</Link>
        </nav>
      </div>
    </footer>
  );
}
