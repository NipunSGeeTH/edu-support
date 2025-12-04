create table public.subjects (
  id uuid not null default extensions.uuid_generate_v4 (),
  code text not null,
  name text not null,
  stream_code text not null,
  level_code text not null,
  display_order integer null default 0,
  is_active boolean null default true,
  created_at timestamp with time zone null default timezone ('utc'::text, now()),
  constraint subjects_pkey primary key (id),
  constraint subjects_code_stream_code_level_code_key unique (code, stream_code, level_code)
) TABLESPACE pg_default;

create index IF not exists idx_subjects_stream on public.subjects using btree (stream_code) TABLESPACE pg_default;

create index IF not exists idx_subjects_level on public.subjects using btree (level_code) TABLESPACE pg_default;


create table public.streams (
  id uuid not null default extensions.uuid_generate_v4 (),
  code text not null,
  name text not null,
  level_code text not null,
  display_order integer null default 0,
  is_active boolean null default true,
  created_at timestamp with time zone null default timezone ('utc'::text, now()),
  constraint streams_pkey primary key (id),
  constraint streams_code_level_code_key unique (code, level_code)
) TABLESPACE pg_default;

create index IF not exists idx_streams_level on public.streams using btree (level_code) TABLESPACE pg_default;



create table public.sessions (
  id uuid not null default extensions.uuid_generate_v4 (),
  title text not null,
  description text not null,
  url text not null,
  session_type public.session_type not null,
  level public.resource_level not null,
  stream public.resource_stream not null,
  subject text not null,
  language public.resource_language not null,
  session_date date null,
  start_time time without time zone null,
  end_time time without time zone null,
  contributor_id uuid null,
  contributor_name text null,
  is_anonymous boolean null default false,
  status public.approval_status null default 'pending'::approval_status,
  approved_at timestamp with time zone null,
  approved_by uuid null,
  created_at timestamp with time zone null default timezone ('utc'::text, now()),
  updated_at timestamp with time zone null default timezone ('utc'::text, now()),
  constraint sessions_pkey primary key (id),
  constraint sessions_approved_by_fkey foreign KEY (approved_by) references auth.users (id),
  constraint sessions_contributor_id_fkey foreign KEY (contributor_id) references auth.users (id) on delete set null
) TABLESPACE pg_default;

create index IF not exists idx_sessions_level on public.sessions using btree (level) TABLESPACE pg_default;

create index IF not exists idx_sessions_stream on public.sessions using btree (stream) TABLESPACE pg_default;

create index IF not exists idx_sessions_subject on public.sessions using btree (subject) TABLESPACE pg_default;

create index IF not exists idx_sessions_language on public.sessions using btree (language) TABLESPACE pg_default;

create index IF not exists idx_sessions_type on public.sessions using btree (session_type) TABLESPACE pg_default;

create index IF not exists idx_sessions_status on public.sessions using btree (status) TABLESPACE pg_default;

create index IF not exists idx_sessions_contributor on public.sessions using btree (contributor_id) TABLESPACE pg_default;

create index IF not exists idx_sessions_date on public.sessions using btree (session_date) TABLESPACE pg_default;

create index IF not exists idx_sessions_created_at on public.sessions using btree (created_at desc) TABLESPACE pg_default;

create trigger auto_approve_sessions BEFORE INSERT on sessions for EACH row
execute FUNCTION auto_approve_authenticated ();

create trigger update_sessions_updated_at BEFORE
update on sessions for EACH row
execute FUNCTION update_updated_at_column ();



create table public.resources (
  id uuid not null default extensions.uuid_generate_v4 (),
  type text not null,
  category text not null,
  level text not null,
  stream text not null,
  subject text not null,
  language text not null,
  url text not null,
  description text not null,
  title text not null,
  contributor_id uuid not null,
  contributor_name text null,
  created_at timestamp with time zone null default timezone ('utc'::text, now()),
  updated_at timestamp with time zone null default timezone ('utc'::text, now()),
  constraint resources_pkey primary key (id),
  constraint resources_contributor_id_fkey foreign KEY (contributor_id) references auth.users (id) on delete CASCADE,
  constraint resources_category_check check (
    (
      category = any (
        array[
          'Past Paper'::text,
          'Note'::text,
          'Textbook'::text,
          'Live'::text,
          'Recording'::text
        ]
      )
    )
  ),
  constraint resources_stream_check check (
    (
      stream = any (
        array[
          'Science'::text,
          'Arts'::text,
          'Commerce'::text,
          'Technology'::text
        ]
      )
    )
  ),
  constraint resources_type_check check (
    (
      type = any (array['Material'::text, 'Session'::text])
    )
  ),
  constraint resources_level_check check ((level = any (array['AL'::text, 'OL'::text]))),
  constraint resources_language_check check (
    (
      language = any (
        array['Sinhala'::text, 'Tamil'::text, 'English'::text]
      )
    )
  )
) TABLESPACE pg_default;

create index IF not exists idx_resources_type on public.resources using btree (type) TABLESPACE pg_default;

create index IF not exists idx_resources_level on public.resources using btree (level) TABLESPACE pg_default;

create index IF not exists idx_resources_stream on public.resources using btree (stream) TABLESPACE pg_default;

create index IF not exists idx_resources_subject on public.resources using btree (subject) TABLESPACE pg_default;

create index IF not exists idx_resources_language on public.resources using btree (language) TABLESPACE pg_default;

create index IF not exists idx_resources_category on public.resources using btree (category) TABLESPACE pg_default;

create index IF not exists idx_resources_contributor on public.resources using btree (contributor_id) TABLESPACE pg_default;

create index IF not exists idx_resources_created_at on public.resources using btree (created_at desc) TABLESPACE pg_default;

create trigger update_resources_updated_at BEFORE
update on resources for EACH row
execute FUNCTION update_updated_at_column ();


create table public.materials (
  id uuid not null default extensions.uuid_generate_v4 (),
  title text not null,
  description text not null,
  url text not null,
  category public.material_category not null,
  level public.resource_level not null,
  stream public.resource_stream not null,
  subject text not null,
  language public.resource_language not null,
  contributor_id uuid null,
  contributor_name text null,
  is_anonymous boolean null default false,
  status public.approval_status null default 'pending'::approval_status,
  approved_at timestamp with time zone null,
  approved_by uuid null,
  created_at timestamp with time zone null default timezone ('utc'::text, now()),
  updated_at timestamp with time zone null default timezone ('utc'::text, now()),
  constraint materials_pkey primary key (id),
  constraint materials_approved_by_fkey foreign KEY (approved_by) references auth.users (id),
  constraint materials_contributor_id_fkey foreign KEY (contributor_id) references auth.users (id) on delete set null
) TABLESPACE pg_default;

create index IF not exists idx_materials_level on public.materials using btree (level) TABLESPACE pg_default;

create index IF not exists idx_materials_stream on public.materials using btree (stream) TABLESPACE pg_default;

create index IF not exists idx_materials_subject on public.materials using btree (subject) TABLESPACE pg_default;

create index IF not exists idx_materials_language on public.materials using btree (language) TABLESPACE pg_default;

create index IF not exists idx_materials_status on public.materials using btree (status) TABLESPACE pg_default;

create index IF not exists idx_materials_contributor on public.materials using btree (contributor_id) TABLESPACE pg_default;

create index IF not exists idx_materials_created_at on public.materials using btree (created_at desc) TABLESPACE pg_default;

create index IF not exists idx_materials_category on public.materials using btree (category) TABLESPACE pg_default;

create trigger auto_approve_materials BEFORE INSERT on materials for EACH row
execute FUNCTION auto_approve_authenticated ();

create trigger update_materials_updated_at BEFORE
update on materials for EACH row
execute FUNCTION update_updated_at_column ();


create table public.material_categories (
  id uuid not null default extensions.uuid_generate_v4 (),
  code text not null,
  name text not null,
  display_order integer null default 0,
  is_active boolean null default true,
  created_at timestamp with time zone null default timezone ('utc'::text, now()),
  constraint material_categories_pkey primary key (id),
  constraint material_categories_code_key unique (code)
) TABLESPACE pg_default;



create table public.levels (
  id uuid not null default extensions.uuid_generate_v4 (),
  code text not null,
  name text not null,
  display_order integer null default 0,
  is_active boolean null default true,
  created_at timestamp with time zone null default timezone ('utc'::text, now()),
  constraint levels_pkey primary key (id),
  constraint levels_code_key unique (code)
) TABLESPACE pg_default;



create table public.languages (
  id uuid not null default extensions.uuid_generate_v4 (),
  code text not null,
  name text not null,
  display_order integer null default 0,
  is_active boolean null default true,
  created_at timestamp with time zone null default timezone ('utc'::text, now()),
  constraint languages_pkey primary key (id),
  constraint languages_code_key unique (code)
) TABLESPACE pg_default;



create table public.contributors (
  id uuid not null,
  email text not null,
  full_name text null,
  avatar_url text null,
  created_at timestamp with time zone null default timezone ('utc'::text, now()),
  constraint contributors_pkey primary key (id),
  constraint contributors_id_fkey foreign KEY (id) references auth.users (id) on delete CASCADE
) TABLESPACE pg_default;