import type { Metadata } from "next";
import PageTexte from "@/components/page-texte";
import { EDITEUR, EMAIL_CONTACT } from "@/lib/config";

export const metadata: Metadata = {
  title: "Mentions légales — Second Tour",
  description: "Éditeur, hébergement et contact du site Second Tour.",
};

export default function MentionsLegales() {
  return (
    <PageTexte titre="Mentions légales" maj="14 octobre 2026">
      <h2>Éditeur du site</h2>
      <p>
        {EDITEUR.nom}
        <br />
        {EDITEUR.statut}
        <br />
        SIRET : {EDITEUR.siret}
        <br />
        Adresse : {EDITEUR.adresse}
        <br />
        Email : {EMAIL_CONTACT}
      </p>
      <p>Directeur de la publication : {EDITEUR.nom}.</p>
      <p>TVA non applicable, article 293 B du Code général des impôts.</p>

      <h2>Hébergement</h2>
      <p>
        Site hébergé par Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis (vercel.com).
        <br />
        Base de données hébergée par Supabase Inc. (supabase.com).
        <br />
        Paiements traités par Stripe Payments Europe Ltd, 1 Grand Canal Street Lower, Dublin 2, Irlande (stripe.com).
      </p>

      <h2>Propriété intellectuelle</h2>
      <p>
        Les textes, la marque Second Tour et l&apos;interface du site sont la propriété de l&apos;éditeur. Toute reproduction
        sans autorisation est interdite.
      </p>

      <h2>Contact</h2>
      <p>Pour toute question : {EMAIL_CONTACT}.</p>
    </PageTexte>
  );
}
