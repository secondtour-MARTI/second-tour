import type { Metadata } from "next";
import PageTexte from "@/components/page-texte";
import { EDITEUR, EMAIL_CONTACT } from "@/lib/config";

export const metadata: Metadata = {
  title: "Politique de confidentialité — Second Tour",
  description: "Quelles données Second Tour collecte, pourquoi, et comment exercer vos droits.",
};

export default function Confidentialite() {
  return (
    <PageTexte titre="Politique de confidentialité" maj="14 octobre 2026">
      <p>
        Second Tour est édité par {EDITEUR.nom}, {EDITEUR.statut}. Pour toute question sur vos données :{" "}
        {EMAIL_CONTACT}.
      </p>

      <h2>Vous êtes un garage client de Second Tour</h2>
      <p>
        <strong>Données :</strong> email, mot de passe (chiffré, jamais lisible), nom du garage, réglages, historique
        d&apos;abonnement. Les données de carte bancaire sont traitées uniquement par Stripe et ne passent jamais par nos
        serveurs.
      </p>
      <p>
        <strong>Pourquoi :</strong> fournir le service, gérer l&apos;abonnement et la facturation (exécution du contrat).
      </p>
      <p>
        <strong>Durée :</strong> pendant l&apos;abonnement, puis 3 ans pour la relation commerciale ; les pièces
        comptables 10 ans, comme la loi l&apos;impose.
      </p>

      <h2>Vous êtes client d&apos;un garage qui utilise Second Tour</h2>
      <p>
        <strong>Données :</strong> prénom (facultatif), numéro de portable ou email, date de votre accord, date de votre
        passage et de votre rappel.
      </p>
      <p>
        <strong>Pourquoi :</strong> vous envoyer un rappel au moment de votre prochain entretien, avec une offre de
        retour, sur la base de votre consentement. Le garage est responsable de ce traitement ; Second Tour agit pour son
        compte, comme sous-traitant.
      </p>
      <p>
        <strong>Vos données ne sont jamais revendues</strong> ni utilisées pour d&apos;autres publicités. Vous pouvez
        retirer votre accord à tout moment : répondez STOP au message reçu, ou écrivez à {EMAIL_CONTACT}.
      </p>
      <p>
        <strong>Durée :</strong> jusqu&apos;au retrait de votre accord, et au plus 3 ans après votre dernier passage.
      </p>

      <h2>Prestataires techniques</h2>
      <ul>
        <li>Vercel (hébergement du site)</li>
        <li>Supabase (base de données et connexion)</li>
        <li>Stripe (paiements)</li>
      </ul>
      <p>
        Lorsque des données sont traitées hors de l&apos;Union européenne, ces prestataires s&apos;appuient sur les clauses
        contractuelles types de la Commission européenne.
      </p>

      <h2>Cookies et mesure d&apos;audience</h2>
      <p>
        Le site n&apos;utilise qu&apos;un cookie de connexion à l&apos;espace garage, indispensable au service. La mesure
        d&apos;audience est anonyme, sans cookie, et ne permet pas de vous identifier.
      </p>

      <h2>Vos droits</h2>
      <p>
        Vous disposez d&apos;un droit d&apos;accès, de rectification, d&apos;effacement, d&apos;opposition et de portabilité de vos
        données. Écrivez à {EMAIL_CONTACT} : nous répondons sous 30 jours. Vous pouvez aussi saisir la CNIL (cnil.fr).
      </p>
    </PageTexte>
  );
}
