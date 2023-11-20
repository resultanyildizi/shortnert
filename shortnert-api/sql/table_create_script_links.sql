-- Table: public.links

-- DROP TABLE IF EXISTS public.links;

CREATE TABLE IF NOT EXISTS public.links
(
    id serial NOT NULL,
    url text COLLATE pg_catalog."default" NOT NULL,
    key text COLLATE pg_catalog."default" NOT NULL,
    deleted_at date,
    CONSTRAINT links_pkey PRIMARY KEY (id),
    CONSTRAINT unique_key_constraint UNIQUE (key),
    CONSTRAINT check_key_form_constraint CHECK (key ~* '^[a-zA-Z0-9]{3,15}$'::text),
    CONSTRAINT check_url_not_empty_constraint CHECK (length(url) > 0)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.links
    OWNER to resultanyildizi;
-- Index: idx_links_key

-- DROP INDEX IF EXISTS public.idx_links_key;

CREATE INDEX IF NOT EXISTS idx_links_key
    ON public.links USING btree
    (key COLLATE pg_catalog."default" ASC NULLS LAST)
    TABLESPACE pg_default;
