create table IF NOT EXISTS posts (
    id serial primary key,
    title varchar(50) not null default '',
    owner varchar(30) not null default '',
    body varchar(1000) not null default '',
    created timestamptz not null default now(),
    updated timestamptz not null default now()
);
