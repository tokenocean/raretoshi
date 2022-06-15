CREATE OR REPLACE FUNCTION public.artwork_views(artwork_row artworks)
 RETURNS bigint
 LANGUAGE sql
 STABLE
AS $function$
    SELECT SUM(views)
    FROM editions e
    WHERE e.artwork_id = artwork_row.id
$function$;
