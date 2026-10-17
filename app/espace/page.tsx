import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { accesCourant } from "@/lib/acces";
import { supabaseAdmin } from "@/lib/supabase/server";
import { euros } from "@/lib/diagnostic";
import { seDeconnecter } from "@/app/connexion/actions";
import { FormClient, FormGarage, FormOffre } from "./formulaires";
import { marquerSmsEnvoye } from "./actions";
import { envoisDus } from "@/lib/rappels";
import { lienSms, RELANCE_APRES_JOURS } from "@/lib/messages";

export const metadata: Metadata = { title: "Mon espace — Second Tour", robots: { index: false } };
export const dynamic = "force-dynamic";

const dateFr = (iso: string) =>
  new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });

export default async function Espace() {
  const { user, garage, actif } = await accesCourant();
  if (!user) redirect("/connexion");

  if (!garage || !actif) {
    return (
      <main className="flex min-h-dvh flex-col justify-center px-5">
        <div className="etiquette mx-auto w-full max-w-md bg-papier p-6">
          <p className="font-titre text-2xl text-vert">Ton abonnement n&apos;est pas actif.</p>
          <p className="mt-3 text-gris">
            Pour ajouter tes clients et lancer les rappels, active une formule. Si tu viens de payer, attends une minute
            et recharge la page.
          </p>
          <Link href="/activer" className="bouton-pouce mt-6 flex items-center justify-center border-[3px] border-encre bg-jaune font-titre text-vert">
            Voir les formules
          </Link>
          <form action={seDeconnecter} className="mt-4 text-center">
            <button className="text-sm text-gris underline">Me déconnecter</button>
          </form>
        </div>
      </main>
    );
  }

  const admin = supabaseAdmin();
  const dans30j = new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10);
  const [{ data: stats }, { count: nbClients }, { data: prochains }, aEnvoyer] = await Promise.all([
    admin
      .from("passages")
      .select("rappel_envoye_le, relance_envoyee_le, offre_utilisee_le, montant_retour, date_rappel, erreur_envoi")
      .eq("garage_id", garage.id),
    admin.from("clients").select("id", { count: "exact", head: true }).eq("garage_id", garage.id),
    admin
      .from("passages")
      .select("id, date_rappel, code_offre, offre_utilisee_le, rappel_envoye_le, relance_envoyee_le, clients(prenom, telephone, email, desinscrit_le)")
      .eq("garage_id", garage.id)
      .order("created_at", { ascending: false })
      .limit(8),
    envoisDus(garage.id),
  ]);

  const lignes = stats ?? [];
  const revenus = lignes.filter((p) => p.offre_utilisee_le);
  const nbRevenus = revenus.length;
  const chiffre = revenus.reduce((t, p) => t + Number(p.montant_retour ?? 0), 0);
  const nbRappels = lignes.filter((p) => p.rappel_envoye_le).length;
  const nbRelances = lignes.filter((p) => p.relance_envoyee_le).length;
  const revenusApresRappel = revenus.filter((p) => p.rappel_envoye_le).length;
  const taux = nbRappels > 0 ? Math.round((revenusApresRappel / nbRappels) * 100) : null;
  const aVenir = lignes.filter((p) => !p.rappel_envoye_le && !p.offre_utilisee_le && p.date_rappel <= dans30j).length;
  const smsDus = aEnvoyer.filter((e) => e.canal === "sms");
  const emailsEnAttente = aEnvoyer.filter((e) => e.canal === "email").length;
  const configure = !!garage.nom;

  return (
    <main className="min-h-dvh pb-14">
      <header className="flex items-center justify-between bg-vert px-5 py-3">
        <p className="font-titre text-lg tracking-wide text-creme">
          SECOND<span className="text-jaune"> TOUR</span>
        </p>
        <form action={seDeconnecter}>
          <button className="min-h-11 text-sm text-creme/80 underline">Déconnexion</button>
        </form>
      </header>

      <section className="bg-vert px-5 pb-7 pt-3 text-creme">
        <h1 className="font-titre text-2xl leading-tight">{garage.nom ?? "Bienvenue dans ton espace"}</h1>
        <p className="mt-4 text-sm font-semibold uppercase tracking-widest text-jaune">Chiffre récupéré</p>
        <div className="mt-2 border-2 border-jaune p-4">
          <p className="font-titre text-4xl leading-none text-jaune">{euros(chiffre)}</p>
          <p className="mt-1 text-sm">générés par les clients revenus grâce aux rappels</p>
        </div>
        <div className="mt-3 grid grid-cols-3 gap-2 text-center">
          <div className="border-2 border-creme/40 p-2">
            <p className="font-titre text-2xl leading-none text-jaune">{nbRappels + nbRelances}</p>
            <p className="mt-1 text-xs leading-tight">messages envoyés</p>
          </div>
          <div className="border-2 border-creme/40 p-2">
            <p className="font-titre text-2xl leading-none text-jaune">{nbRevenus}</p>
            <p className="mt-1 text-xs leading-tight">{nbRevenus > 1 ? "clients revenus" : "client revenu"}</p>
          </div>
          <div className="border-2 border-creme/40 p-2">
            <p className="font-titre text-2xl leading-none text-jaune">{taux === null ? "—" : `${taux} %`}</p>
            <p className="mt-1 text-xs leading-tight">taux de retour</p>
          </div>
        </div>
        <p className="mt-3 text-sm text-creme/75">
          {nbClients ?? 0} {(nbClients ?? 0) > 1 ? "clients enregistrés" : "client enregistré"} · {aVenir} rappel
          {aVenir > 1 ? "s" : ""} prévu{aVenir > 1 ? "s" : ""} dans les 30 jours
          {nbRelances > 0 ? ` · ${nbRelances} relance${nbRelances > 1 ? "s" : ""}` : ""}
        </p>
      </section>

      <div className="mx-auto max-w-xl space-y-10 px-5 pt-8">
        {!configure ? (
          <section>
            <p className="text-sm font-semibold uppercase tracking-widest text-gris">Étape 1 sur 2</p>
            <h2 className="mt-1 font-titre text-xl">Présente ton garage</h2>
            <p className="mt-1 text-gris">Ton nom apparaîtra dans chaque rappel. Ça prend 20 secondes.</p>
            <div className="etiquette mt-4 bg-papier p-5">
              <FormGarage nom="" metier={garage.metier ?? ""} offre={garage.offre_texte} />
            </div>
          </section>
        ) : (
          <>
            {smsDus.length > 0 && (
              <section>
                <h2 className="font-titre text-xl">À envoyer aujourd&apos;hui ({smsDus.length})</h2>
                <p className="mt-1 text-gris">
                  Ces clients n&apos;ont laissé qu&apos;un numéro. Touche « Envoyer » : ton appli SMS s&apos;ouvre avec le message
                  déjà écrit, il ne reste qu&apos;à l&apos;envoyer.
                </p>
                <ul className="mt-4 space-y-3">
                  {smsDus.slice(0, 15).map((e) => (
                    <li key={`${e.passageId}-${e.type}`} className="border-[3px] border-encre bg-papier p-4">
                      <p className="font-semibold">
                        {e.ctx.prenom ?? e.destinataire}{" "}
                        <span className="text-sm font-normal text-gris">
                          · {e.type === "rappel" ? "rappel" : "relance (dernier message)"}
                        </span>
                      </p>
                      <div className="mt-3 grid grid-cols-2 gap-2">
                        <a
                          href={lienSms(e.destinataire, e.texte)}
                          className="flex min-h-12 items-center justify-center border-[3px] border-encre bg-jaune font-titre text-vert"
                        >
                          Envoyer
                        </a>
                        <form action={marquerSmsEnvoye}>
                          <input type="hidden" name="passage_id" value={e.passageId} />
                          <input type="hidden" name="type" value={e.type} />
                          <button className="flex min-h-12 w-full items-center justify-center border-[3px] border-encre font-semibold">
                            C&apos;est envoyé ✓
                          </button>
                        </form>
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {emailsEnAttente > 0 && (
              <p className="border-[3px] border-dashed border-gris/60 p-4 text-sm text-gris">
                {emailsEnAttente} rappel{emailsEnAttente > 1 ? "s" : ""} par email partira{emailsEnAttente > 1 ? "ont" : ""} automatiquement lors du prochain envoi, chaque matin vers 9 h.
              </p>
            )}

            <section>
              <h2 className="font-titre text-xl">Ajouter un client</h2>
              <p className="mt-1 text-gris">Au moment où il paie. Le rappel partira tout seul au bon moment.</p>
              <div className="etiquette mt-4 bg-papier p-5">
                <FormClient />
              </div>
              <Link
                href="/espace/affiche"
                className="mt-4 flex min-h-14 items-center justify-center border-[3px] border-dashed border-encre px-4 text-center font-semibold"
              >
                Ou laisse tes clients s&apos;inscrire seuls : imprime ton affiche QR →
              </Link>
            </section>

            <section>
              <h2 className="font-titre text-xl">Un client revient avec son code ?</h2>
              <p className="mt-1 text-gris">Valide son offre : c&apos;est ce qui fait avancer ton compteur.</p>
              <div className="etiquette mt-4 bg-papier p-5">
                <FormOffre />
              </div>
            </section>

            <section>
              <h2 className="font-titre text-xl">Derniers clients ajoutés</h2>
              {!prochains || prochains.length === 0 ? (
                <p className="mt-3 border-[3px] border-dashed border-gris/60 p-5 text-gris">
                  Personne pour l&apos;instant. Ajoute ton premier client ci-dessus : c&apos;est le début de ton compteur.
                </p>
              ) : (
                <ul className="mt-3 divide-y-2 divide-encre/10 border-[3px] border-encre bg-papier">
                  {prochains.map((p) => {
                    const c = (Array.isArray(p.clients) ? p.clients[0] : p.clients) as
                      | { prenom: string | null; telephone: string | null; email: string | null; desinscrit_le: string | null }
                      | null;
                    return (
                      <li key={p.id} className="flex items-center justify-between gap-3 p-4">
                        <div className="min-w-0">
                          <p className="truncate font-semibold">{c?.prenom || c?.telephone || c?.email || "Client"}</p>
                          <p className="text-sm text-gris">
                            {p.offre_utilisee_le
                              ? "Revenu ✓"
                              : c?.desinscrit_le
                                ? "Désinscrit"
                                : p.relance_envoyee_le
                                  ? `Relancé le ${dateFr(p.relance_envoyee_le)}`
                                  : p.rappel_envoye_le
                                    ? `Rappel envoyé le ${dateFr(p.rappel_envoye_le)}`
                                    : `Rappel prévu le ${dateFr(p.date_rappel)}`}
                          </p>
                        </div>
                        <span className="shrink-0 font-mono text-sm tracking-widest text-gris">{p.code_offre}</span>
                      </li>
                    );
                  })}
                </ul>
              )}
            </section>

            <section>
              <details className="border-[3px] border-encre bg-papier">
                <summary className="flex min-h-14 cursor-pointer list-none items-center px-4 font-semibold">
                  Modifier mon garage et mon offre
                </summary>
                <div className="px-4 pb-5">
                  <p className="mb-4 text-sm text-gris">
                    Relance automatique : si un client n&apos;est pas revenu {RELANCE_APRES_JOURS / 7} semaines après son rappel,
                    il reçoit un second et dernier message. Les clients désinscrits ne reçoivent plus rien.
                  </p>
                  <FormGarage nom={garage.nom ?? ""} metier={garage.metier ?? ""} offre={garage.offre_texte} />
                </div>
              </details>
            </section>
          </>
        )}
      </div>
    </main>
  );
}
