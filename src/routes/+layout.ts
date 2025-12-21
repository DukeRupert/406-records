import type { LayoutLoad } from './$types';
import { getClient } from '$lib/directus';
import { readSingleton } from '@directus/sdk';

export const load = (async () => {
  const client = getClient();
  const response: Settings = await client.request(
    readSingleton('settings', {
      fields: ['*']
    })
  );

  return {
    settings: response
  };
}) satisfies LayoutLoad;
