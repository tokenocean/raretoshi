import { getEditions } from "$queries/artworks";

export async function get({ request: { headers }, locals, params }) {
  let { slug } = params;
  let { q } = locals;
let { editions } = await q(getEditions, { slug });
  return { body: { editions }};
}
