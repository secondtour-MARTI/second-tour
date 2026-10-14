import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { accesCourant } from "@/lib/acces";
import { EMAIL_CONTACT } from "@/lib/config";
import FormulaireConnexion from "./formulaire";

export const metadata: Metadata = { title: "Connexion — Second Tour", robots: { index: false } };

export default async function Connexion() {
  const { user } = await accesCourant();
  if (user) redirect("/espace");

  return (
    <main className="flex min-h-dvh flex-col justify-center px-5 py-10">
      <div className="etiquette mx-auto w-full max-w-md bg-papier p-6">
        <p className="font-titre text-lg tracking-wide">
          SECOND<span className="text-vert"> TOUR</span>
        </p>
        <h1 className="mt-4 font-titre text-3xl leading-tight text-vert">Ton espace garage</h1>
        <FormulaireConnexion />
        <p className="mt-5 text-sm text-gris">
          Mot de passe oublié ? Écris à <strong>{EMAIL_CONTACT}</strong>, on te le réinitialise dans la journée.
        </p>
        <p className="mt-3 text-sm text-gris">
          Pas encore client ?{" "}
          <Link href="/diagnostic" className="font-semibold text-vert underline">
            Faire le diagnostic gratuit
          </Link>
        </p>
      </div>
    </main>
  );
}
