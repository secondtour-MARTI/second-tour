-- Second Tour — schéma initial (MVP)
-- 4 tables : garages, abonnements, clients, passages.
-- Chaque garage ne voit que ses propres données (Row Level Security).

create extension if not exists pgcrypto;

-- Un compte = un garage
create table public.garages (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid unique references auth.users (id) on delete cascade,
  email text not null unique,
  nom text,
  metier text,
  delai_rappel_jours integer not null default 335 check (delai_rappel_jours between 7 and 1095),
  offre_texte text not null default '-10 %',
  slug text unique,               -- adresse publique de la page QR du comptoir
  created_at timestamptz not null default now()
);

-- Rempli uniquement par le webhook Stripe (côté serveur)
create table public.abonnements (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  garage_id uuid references public.garages (id) on delete set null,
  stripe_customer_id text,
  stripe_subscription_id text unique,
  plan text,
  statut text not null default 'active',   -- active | past_due | canceled
  periode_fin timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index abonnements_email_idx on public.abonnements (lower(email));

-- Les clients du garage
create table public.clients (
  id uuid primary key default gen_random_uuid(),
  garage_id uuid not null references public.garages (id) on delete cascade,
  prenom text,
  telephone text,
  email text,
  consentement_le timestamptz not null,    -- accord pour recevoir les rappels
  created_at timestamptz not null default now(),
  check (telephone is not null or email is not null)
);
create index clients_garage_idx on public.clients (garage_id);

-- Chaque passage : prestation, rappel prévu, offre de retour à usage unique
create table public.passages (
  id uuid primary key default gen_random_uuid(),
  garage_id uuid not null references public.garages (id) on delete cascade,
  client_id uuid not null references public.clients (id) on delete cascade,
  prestation text,
  montant numeric(10, 2),
  date_passage date not null default current_date,
  date_rappel date not null,
  rappel_envoye_le timestamptz,
  code_offre text not null unique,
  offre_utilisee_le timestamptz,
  montant_retour numeric(10, 2),
  created_at timestamptz not null default now()
);
create index passages_garage_idx on public.passages (garage_id);
create index passages_rappel_idx on public.passages (date_rappel) where rappel_envoye_le is null;

-- Sécurité : chacun ne voit que son garage
alter table public.garages enable row level security;
alter table public.abonnements enable row level security;
alter table public.clients enable row level security;
alter table public.passages enable row level security;

create policy "garage : lecture par son propriétaire" on public.garages
  for select using (owner_id = auth.uid());
create policy "garage : modification par son propriétaire" on public.garages
  for update using (owner_id = auth.uid()) with check (owner_id = auth.uid());

create policy "abonnement : lecture par son titulaire" on public.abonnements
  for select using (lower(email) = lower(auth.jwt() ->> 'email'));

create policy "clients : accès par le garage" on public.clients
  for all using (garage_id in (select id from public.garages where owner_id = auth.uid()))
  with check (garage_id in (select id from public.garages where owner_id = auth.uid()));

create policy "passages : accès par le garage" on public.passages
  for all using (garage_id in (select id from public.garages where owner_id = auth.uid()))
  with check (garage_id in (select id from public.garages where owner_id = auth.uid()));
