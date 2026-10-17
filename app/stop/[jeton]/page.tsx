import type { Metadata } from "next";
import { supabaseAdmin } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Désinscription", robots: { index: false } };
export const dynamic = "force-dynamic";

type Props = { params: Promise<{ jeton: string }>; searchParams: Promise<{ ok?: string }> };

async function desinscrire(form: FormData) {
  "use server";
  const jeton = String(form.get("jeton") ?? "");
  if (!/^[0-9a-f-]{36}$/i.test(jeton)) return;
  await supabaseAdmin()
    .from("clients")
    .update({ desinscrit_le: new Date().toISOString() })
    .eq("jeton", jeton)
    .is("desinscrit_le", null);
  const { redirect } = await import("next/navigation");
  redirect(`/stop/${jeton}?ok=1`);
}

// Page de désinscription : un toucher et le client ne reçoit plus rien.
export default async function Stop({ params, searchParams }: Props) {
  const { jeton } = await params;
  const { ok } = await searchParams;
  const valide = /^[0-9a-f-]{36}$/i.test(jeton);
  const { data: client } = valide
    ? await supabaseAdmin().from("clients").select("desinscrit_le, garages(nom)").eq("jeton", jeton).maybeSingle()
    : { data: null };
  const g = client ? (Array.isArray(client.garages) ? client.garages[0] : client.garages) : null;
  const nom = (g as { nom: string | null } | null)?.nom ?? "ce garage";

  return (
    <main className="flex min-h-dvh flex-col justify-center px-5">
      <div className="etiquette mx-auto w-full max-w-md bg-papier p-6">
        {!client ? (
          <p className="font-titre text-2xl text-vert">Lien invalide ou expiré.</p>
        ) : ok || client.desinscrit_le ? (
          <>
            <p className="font-titre text-2xl text-vert">C&apos;est fait.</p>
            <p className="mt-3">Vous ne recevrez plus aucun rappel de {nom}.</p>
          </>
        ) : (
          <form action={desinscrire}>
            <input type="hidden" name="jeton" value={jeton} />
            <p className="font-titre text-2xl text-vert">Ne plus recevoir de rappel ?</p>
            <p className="mt-3">Vous ne recevrez plus aucun message de {nom}.</p>
            <button className="bouton-pouce etiquette mt-6 flex w-full items-center justify-center bg-vert font-titre text-lg text-creme">
              Me désinscrire
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
