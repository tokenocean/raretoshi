CREATE OR REPLACE FUNCTION public.artwork_num_editions(artwork_row artworks)
 RETURNS bigint
 LANGUAGE sql
 STABLE
AS $function$
    SELECT count(*)
    FROM editions e
    WHERE e.artwork_id = artwork_row.id
$function$;
