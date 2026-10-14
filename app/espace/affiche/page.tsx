import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import QRCode from "qrcode";
import { accesCourant } from "@/lib/acces";
import { origineSite } from "@/lib/outils";
import BoutonImprimer from "./imprimer";

export const metadata: Metadata = { title: "Mon affiche QR — Second Tour", robots: { index: false } };
export const dynamic = "force-dynamic";

// Affiche à poser sur le comptoir : le client scanne et laisse son numéro.
export default async function Affiche() {
  const { user, garage, actif } = await accesCourant();
  if (!user) redirect("/connexion");
  if (!garage || !actif) redirect("/espace");

  const lien = `${await origineSite()}/c/${garage.slug}`;
  const svg = await QRCode.toString(lien, {
    type: "svg",
    margin: 1,
    errorCorrectionLevel: "M",
    color: { dark: "#22231f", light: "#ffffff" },
  });

  return (
    <main className="min-h-dvh px-5 pb-12 pt-6">
      <div className="mx-auto max-w-md print:hidden">
        <Link href="/espace" className="inline-flex min-h-11 items-center font-semibold underline">← Mon espace</Link>
        <p className="mt-2 text-gris">Imprime-la en A4 et pose-la près de ta caisse. Tu peux aussi l&apos;enregistrer en PDF.</p>
      </div>

      <div className="mx-auto mt-6 max-w-md border-[6px] border-encre bg-white p-8 text-center print:mt-0 print:border-[10px]">
        <p className="font-titre text-sm tracking-[0.2em] text-gris">{(garage.nom ?? "").toUpperCase()}</p>
        <h1 className="mt-4 font-titre text-[2rem] leading-tight text-vert">
          On vous prévient quand c&apos;est le moment.
        </h1>
        <p className="mt-3 text-lg">
          Scannez, laissez votre numéro : on vous envoie <strong>un seul rappel</strong>, avec une offre{" "}
          <span className="bg-jaune px-1 font-semibold">{garage.offre_texte}</span> pour votre prochain passage.
        </p>
        <div className="mx-auto mt-6 w-60" dangerouslySetInnerHTML={{ __html: svg }} />
        <p className="mt-4 text-sm text-gris">Pas de publicité. Désinscription en un message.</p>
      </div>

      <div className="mx-auto mt-6 max-w-md print:hidden">
        <BoutonImprimer />
        <p className="mt-3 break-all text-center text-sm text-gris">Lien de l&apos;affiche : {lien}</p>
      </div>
    </main>
  );
}
