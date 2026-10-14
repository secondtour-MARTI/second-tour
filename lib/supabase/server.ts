import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

const URL_SB = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const CLE_PUBLIQUE = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

// Client lié à la session de l'utilisateur connecté (cookies).
export async function supabaseSession() {
  const store = await cookies();
  return createServerClient(URL_SB, CLE_PUBLIQUE, {
    cookies: {
      getAll() {
        return store.getAll();
      },
      setAll(liste) {
        try {
          liste.forEach(({ name, value, options }) => store.set(name, value, options));
        } catch {
          // Appelé depuis un Server Component : le middleware rafraîchit la session.
        }
      },
    },
  });
}

// Client administrateur : uniquement côté serveur, jamais exposé au navigateur.
export function supabaseAdmin() {
  const cle = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!URL_SB || !cle) throw new Error("Configuration Supabase manquante");
  return createClient(URL_SB, cle, { auth: { persistSession: false, autoRefreshToken: false } });
}
