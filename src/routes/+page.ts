import type { PageLoad } from './$types';
import client from '$lib/directus/index';
import { readItems } from '@directus/sdk';
import { error } from '@sveltejs/kit';

export const load = (async () => {
  const path = '/';

  const res = await client.request(
    readItems('page', {
      filter: {
        slug: {
          _eq: path
        }
      }, fields: ['status', 'title', 'description', { seo: ['*', { og_image: ['id', 'description', 'height', 'width'] }] }, { blocks: ['*', { item: ['*', { image: ['id', 'description', 'height', 'width'] }] }] }]
    },
    ),
  );
  if (!res || res.length < 1)
    throw error(404, { message: `The following slug failed to return a page:  [ ${path} ]` });
  const page = res[0];
  return {
    page
  };
}) satisfies PageLoad;
