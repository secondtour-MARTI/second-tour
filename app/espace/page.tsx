import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { accesCourant } from "@/lib/acces";
import { supabaseAdmin } from "@/lib/supabase/server";
import { euros } from "@/lib/diagnostic";
import { seDeconnecter } from "@/app/connexion/actions";
import { FormClient, FormGarage, FormOffre } from "./formulaires";

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
  const [{ data: revenus }, { count: nbClients }, { data: prochains }] = await Promise.all([
    admin.from("passages").select("montant_retour").eq("garage_id", garage.id).not("offre_utilisee_le", "is", null),
    admin.from("clients").select("id", { count: "exact", head: true }).eq("garage_id", garage.id),
    admin
      .from("passages")
      .select("id, date_rappel, code_offre, offre_utilisee_le, clients(prenom, telephone, email)")
      .eq("garage_id", garage.id)
      .order("created_at", { ascending: false })
      .limit(8),
  ]);

  const nbRevenus = revenus?.length ?? 0;
  const chiffre = (revenus ?? []).reduce((t, p) => t + Number(p.montant_retour ?? 0), 0);
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
        <div className="mt-5 grid grid-cols-2 gap-3">
          <div className="border-2 border-creme/40 p-3">
            <p className="font-titre text-3xl leading-none text-jaune">{nbRevenus}</p>
            <p className="mt-1 text-sm">{nbRevenus > 1 ? "clients revenus" : "client revenu"}</p>
          </div>
          <div className="border-2 border-creme/40 p-3">
            <p className="font-titre text-3xl leading-none text-jaune">{euros(chiffre)}</p>
            <p className="mt-1 text-sm">générés par les rappels</p>
          </div>
        </div>
        <p className="mt-3 text-sm text-creme/75">{nbClients ?? 0} {(nbClients ?? 0) > 1 ? "clients enregistrés" : "client enregistré"} au total.</p>
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
                      | { prenom: string | null; telephone: string | null; email: string | null }
                      | null;
                    return (
                      <li key={p.id} className="flex items-center justify-between gap-3 p-4">
                        <div className="min-w-0">
                          <p className="truncate font-semibold">{c?.prenom || c?.telephone || c?.email || "Client"}</p>
                          <p className="text-sm text-gris">
                            {p.offre_utilisee_le ? "Revenu ✓" : `Rappel le ${dateFr(p.date_rappel)}`}
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
