-- Table: public.links

-- DROP TABLE IF EXISTS public.links;

CREATE TABLE IF NOT EXISTS public.links
(
    id serial NOT NULL,
    url text COLLATE pg_catalog."default" NOT NULL,
    alias text COLLATE pg_catalog."default" NOT NULL,
    deleted_at date,
    CONSTRAINT links_pkey PRIMARY KEY (id),
    CONSTRAINT unique_alias_constraint UNIQUE (alias),
    CONSTRAINT check_alias_form_constraint CHECK (alias ~* '^[a-zA-Z0-9]{3,15}$'::text),
    CONSTRAINT check_url_not_empty_constraint CHECK (length(url) > 0)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.links
    OWNER to resultanyildizi;
-- Index: idx_links_alias

-- DROP INDEX IF EXISTS public.idx_links_alias;

CREATE INDEX IF NOT EXISTS idx_links_alias
    ON public.links USING btree
    (alias COLLATE pg_catalog."default" ASC NULLS LAST)
    TABLESPACE pg_default;
