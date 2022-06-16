export const artworkFields = `
  id,
  editions {
    edition
  } 
  title
  description
  artist_id
  filename
  filetype
  created_at
  slug
  is_physical
  open_edition
  open_edition_start
  open_edition_end
  views
  artist {
    id
    address
    username
    avatar_url
  },
  tags {
    tag
  } 
  num_favorites
`;

export const marketFields = `
  id
  title
  description
  filename
  filetype
  slug
  favorited
  created_at
  views
  artist {
    id
    username
    avatar_url
    address
  },
`;

export const editionFields = `
  id
  list_price
  transferred_at
  owner_id
  held
  artwork {
    ${artworkFields}
  } 
  owner {
    id
    username
    avatar_url
    address
  },
  edition
  bid {
    id
    user {
      id
      username
    }
    amount
  }
  royalty_recipients {
    id
    name
    edition_id 
    asking_asset
    amount
    address
    type
  }
  comments {
    created_at
    comment
    id
    user {
      username
      avatar_url
      id
      address
    }
  }
`;

export const txFields = `
  id
  psbt
  amount
  hash
  type
  created_at
  asset
  confirmed
  bid {
    id
    user {
      id
      username
    }
  }
  user {
    id
    username
    avatar_url
    full_name
    email
    address
  }
`;

export const getFeatured = `query {
 featured {
    id
    start_date
    end_date
    white
    artwork {
      ${artworkFields}
    }
  }
}`;

export const getLimited = `query($where: artworks_bool_exp!, $limit: Int, $offset: Int, $order_by: artworks_order_by!) {
 artworks(where: $where, limit: $limit, offset: $offset, order_by: [$order_by]) {
    ${marketFields}
  }
}`;

export const getArtworks = `query($where: artworks_bool_exp!, $limit: Int, $offset: Int, $order_by: artworks_order_by!) {
 artworks(where: $where, limit: $limit, offset: $offset, order_by: [$order_by]) {
    ${artworkFields}
    tags {
      tag
    }
  }
}`;

export const getUserArtworks = `query($id: uuid!) {
 artworks(where: { _or: [{ artist_id: { _eq: $id }}, { owner_id: { _eq: $id }}, { favorited: { _eq: true }}]}) {
    ${artworkFields}
    tags {
      tag
    }
  }
}`;

export const getArtworksByOwner = (id) => `query {
 artworks(where: { owner_id: { _eq: "${id}" }}) {
    ${artworkFields}
    tags {
      tag
    }
  }
}`;

export const getEdition = `query($slug: String!, $edition: Int!) {
  editions(where: {artwork: { slug: {_eq: $slug}}, edition: {_eq: $edition}}) {
    ${editionFields}
    transactions(where: { type: { _neq: "royalty" }}, order_by: { created_at: desc }) {
      ${txFields}
    }
  }
}`;

export const getEditionByAsset = `query($asset: String!) {
  editions(where: {asset: {_eq: $asset}}, limit: 1) {
    ${editionFields}
  }
}`;


export const getArtworkBySlug = `query($slug: String!, $limit: Int) {
  artworks(where: {slug : {_eq: $slug}}, limit: 1) {
    ${artworkFields}
    sold
    comments(limit: $limit, order_by: {created_at: desc}) {
      created_at
      comment
      id
      user {
        username
        avatar_url
        id
        address
      }
    }
    tags {
      tag
    },
    num_favorites,
  }
}`;

export const getArtworksByArtist = `query($id: uuid!, $limit: Int) {
  artworks(where: {artist_id: {_eq: $id}}, limit: $limit) {
    ${artworkFields}
  }
}`;

export const getArtworksByUsername = (username) => `query {
  artworks(where: {artist: { username: {_eq: "${username}"}}}) {
    ${artworkFields}
  }
}`;

export const getCollectionByUsername = `query($username: String!) {
  artworks(where: {owner: { username: {_eq: $username }}}) {
    ${marketFields}
  }
}`;

export const getArtworksByTag = (tag) => `query {
  artworks(where: {tags: {tag: {_ilike: "${tag}"}}}, order_by: { created_at: asc }) {
    ${artworkFields}
  }
}`;

export const updateArtwork = `mutation update_artwork($artwork: artworks_set_input!, $id: uuid!) {
  update_artworks_by_pk(pk_columns: { id: $id }, _set: $artwork) {
    id
  }
}`;

export const deleteArtwork = `mutation delete_artwork($id: uuid!) {
  delete_artworks_by_pk(id: $id) {
    id
  }
}`;

export const deleteComment = `mutation delete_comment($id: uuid!) {
  delete_comments_by_pk(id: $id) {
    id
  }
}`;

export const updateArtworkWithRoyaltyRecipients = `mutation update_artwork_with_royalty_recipients($artwork: artworks_set_input!, $id: uuid!, $royaltyRecipients: [royalty_recipients_insert_input!]!) {
  update_artworks_by_pk(pk_columns: { id: $id }, _set: $artwork) {
    id
  }
  delete_royalty_recipients(where: {artwork_id: {_eq: $id}}) {
    affected_rows
  }
  insert_royalty_recipients(objects: $royaltyRecipients) {
    affected_rows
  }
}`;

export const updateTags = `mutation insert_tags($tags: [tags_insert_input!]!, $artwork_id: uuid!) {
  delete_tags(where: {artwork_id: {_eq: $artwork_id}}) {
    affected_rows
  }
  insert_tags(objects: $tags) {
    affected_rows
  }
}`;

export const getArtwork = `query($id: uuid!) {
  artworks_by_pk(id: $id) {
    ${artworkFields}
    tags {
      tag
    },
    num_favorites,
    favorites_aggregate(where: {artwork_id: {_eq: $id}}) {
      aggregate {
        count
      }
    }
  }
}`;

export const countArtworks = `query($where: artworks_bool_exp!) {
  artworks_aggregate(where: $where) {
    aggregate {
      count
    }
  }
}`;

export const getTags = `query {
  tags {
    tag
  }
}`;

export const getTagsWithArtwork = `query {
  tags {
    tag
    artwork {
      ${artworkFields}
    }
  }
}`;

export const createComment = `mutation ($comment: comments_insert_input!) {
  insert_comments_one(object: $comment) {
    id
  }
}`;
