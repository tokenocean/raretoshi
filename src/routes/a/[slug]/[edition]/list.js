import { getEdition } from "$queries/artworks";
import { getDefaultRoyaltyRecipients } from "$queries/royalty_recipients";

export async function get({ locals: { q, user }, params }) {
  let { edition: n, slug } = params;
  let { editions } = await q(getEdition, { slug, edition: n });
  let edition = editions[0];

  let { default_royalty_recipients } = await q(getDefaultRoyaltyRecipients);

  return {
    body: { edition, default_royalty_recipients, user },
  };
}
