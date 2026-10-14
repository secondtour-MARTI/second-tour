import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase/server";
import FormulaireInscription from "./formulaire";

export const metadata: Metadata = { title: "Recevoir mon rappel", robots: { index: false } };
export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

// Page ouverte par le client final quand il scanne l'affiche du comptoir.
export default async function Inscription({ params }: Props) {
  const { slug } = await params;
  if (!/^[a-z0-9]{8}$/.test(slug)) notFound();

  const { data: garage } = await supabaseAdmin()
    .from("garages")
    .select("nom, offre_texte")
    .eq("slug", slug)
    .maybeSingle();
  if (!garage) notFound();

  const nom = garage.nom ?? "Votre garage";

  return (
    <main className="flex min-h-dvh flex-col justify-center px-5 py-10">
      <div className="etiquette mx-auto w-full max-w-md bg-papier p-6">
        <p className="font-titre text-sm tracking-[0.2em] text-gris">{nom.toUpperCase()}</p>
        <h1 className="mt-3 font-titre text-[1.8rem] leading-tight text-vert">
          On vous prévient quand c&apos;est le moment.
        </h1>
        <p className="mt-2 text-gris">
          Un seul rappel, au bon moment, avec une offre <strong className="text-encre">{garage.offre_texte}</strong> pour votre
          prochain passage.
        </p>
        <FormulaireInscription slug={slug} garage={nom} offre={garage.offre_texte} />
      </div>
      <p className="mx-auto mt-6 max-w-md text-center text-xs text-gris">
        Service Second Tour. Vos coordonnées servent uniquement à ce rappel et ne sont jamais revendues.
      </p>
    </main>
  );
}
