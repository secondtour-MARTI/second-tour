import type { Metadata } from "next";
import PageTexte from "@/components/page-texte";
import { EDITEUR, EMAIL_CONTACT } from "@/lib/config";
import { GARANTIE_JOURS, PLANS } from "@/lib/plans";

export const metadata: Metadata = {
  title: "Conditions générales de vente — Second Tour",
  description: "Prix, résiliation et garantie satisfait ou remboursé de Second Tour.",
};

export default function CGV() {
  return (
    <PageTexte titre="Conditions générales de vente" maj="14 octobre 2026">
      <h2>1. Objet</h2>
      <p>
        Les présentes conditions régissent l&apos;abonnement au service en ligne Second Tour, édité par {EDITEUR.nom} (
        {EDITEUR.statut}, SIRET {EDITEUR.siret}). Second Tour permet aux professionnels de l&apos;automobile d&apos;enregistrer
        les coordonnées de leurs clients avec leur accord, de leur envoyer un rappel au moment de leur prochaine
        prestation avec une offre de retour à usage unique, et de suivre les clients revenus.
      </p>
      <p>Le service est réservé aux professionnels. Toute souscription vaut acceptation des présentes conditions.</p>

      <h2>2. Formules et prix</h2>
      <ul>
        <li>
          {PLANS.essentiel.nom} : {PLANS.essentiel.prix} € par mois.
        </li>
        <li>
          {PLANS.pro.nom} : {PLANS.pro.prix} € par mois.
        </li>
        <li>
          {PLANS.annuel.nom} : {PLANS.annuel.prix} € par an.
        </li>
      </ul>
      <p>
        Prix nets, TVA non applicable (article 293 B du CGI). Le paiement s&apos;effectue par carte bancaire via Stripe, au
        début de chaque période. L&apos;abonnement est renouvelé automatiquement à chaque échéance.
      </p>

      <h2>3. Accès au service</h2>
      <p>
        L&apos;accès est ouvert dès la confirmation du paiement. Le client choisit un mot de passe et accède à son espace. Il
        est responsable de la confidentialité de ses identifiants.
      </p>

      <h2>4. Satisfait ou remboursé, {GARANTIE_JOURS} jours</h2>
      <p>
        Pendant les {GARANTIE_JOURS} jours qui suivent le premier paiement, le client peut demander le remboursement
        intégral, sans justification, par simple email à {EMAIL_CONTACT}. Le remboursement est effectué sur la carte
        utilisée sous 5 jours ouvrés, et l&apos;abonnement est arrêté.
      </p>

      <h2>5. Sans engagement : résiliation</h2>
      <p>
        L&apos;abonnement est sans engagement. Le client peut le résilier à tout moment, sans frais, par email à{" "}
        {EMAIL_CONTACT}. La résiliation prend effet à la fin de la période déjà payée ; aucun nouveau prélèvement n&apos;est
        effectué.
      </p>

      <h2>6. Obligations du client</h2>
      <p>
        Le client s&apos;engage à n&apos;enregistrer que des personnes ayant donné leur accord pour recevoir un rappel, et à
        honorer les offres de retour qu&apos;il a choisies. Il reste responsable des données de ses propres clients (voir
        la politique de confidentialité).
      </p>

      <h2>7. Disponibilité et responsabilité</h2>
      <p>
        L&apos;éditeur met tout en œuvre pour assurer la disponibilité du service, sans pouvoir garantir une absence totale
        d&apos;interruption. Les résultats (clients revenus, chiffre généré) dépendent de chaque activité et ne sont pas
        garantis. La responsabilité de l&apos;éditeur est limitée au montant payé par le client sur les 12 derniers mois.
      </p>

      <h2>8. Données personnelles</h2>
      <p>Le traitement des données est décrit dans la politique de confidentialité.</p>

      <h2>9. Droit applicable</h2>
      <p>
        Les présentes conditions sont soumises au droit français. En cas de litige, une solution amiable sera recherchée
        en priorité, avant toute action devant les tribunaux compétents.
      </p>
    </PageTexte>
  );
}
