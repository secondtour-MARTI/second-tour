-- Envoi des rappels, relances et désinscription
alter table public.clients add column if not exists desinscrit_le timestamptz;
alter table public.clients add column if not exists jeton uuid not null default gen_random_uuid();
create unique index if not exists clients_jeton_idx on public.clients (jeton);
alter table public.passages add column if not exists rappel_canal text;
alter table public.passages add column if not exists relance_envoyee_le timestamptz;
alter table public.passages add column if not exists erreur_envoi text;
