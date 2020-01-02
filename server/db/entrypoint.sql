comment on database postgres is 'Test task for venture investment start-up and house-scanner';

create table public.users (
    user_id         integer not null primary key,
    username        varchar(50) not null unique,
    pass_hash       varchar(100) not null unique,
    created_at       timestamp default now() not null
);

comment on table public.users is 'Users table';
create sequence public.user_id_seq
    start with 1
    increment by 1
    no minvalue
    no maxvalue
    cache 1;

alter table public.users_id_seq owner to postgres;
alter table only public.users alter column user_id set default nextval('public.user_id_seq'::regclass);
alter table public.users owner to postgres;

create unique index user_id_uindex on public.users (user_id);
create unique index user_username_uindex on public.users (username);

create table public.notes (
    note_id         integer not null primary key,
    text            text not null,
    author          integer not null primary key,
    created_at       timestamp default now() not null,
    updated_at       timestamp,
    deleted         bool default false,
    lat             numeric not null,
    lng             numeric not null,
    deleted_at       timestamp,
    foreign key (author) references public.users(user_id)
);

comment on table public.notes is 'Notes table';
create sequence public.notes_id_seq
    start with 1
    increment by 1
    no minvalue
    no maxvalue
    cache 1;

alter table public.notes_id_seq owner to postgres;
alter table only public.notes alter column note_id set default nextval('public.notes_id_seq'::regclass);
alter table public.notes owner to postgres;

create unique index note_id_uindex on public.notes(note_id);
create unique index author_uindex on public.notes(author);