import { createDirectus, rest } from "@directus/sdk";
import { env } from "$env/dynamic/public";

let _client: ReturnType<typeof createDirectus<Schema>> | null = null;

export function getClient() {
  if (!_client) {
    const endpoint = env.PUBLIC_DIRECTUS_ENDPOINT || '';
    if (!endpoint) console.log('ERROR: endpoint not provided for Directus instance');
    _client = createDirectus<Schema>(endpoint).with(rest());
  }
  return _client;
}

export const build_asset_url = (id: string): string => {
  return `${env.PUBLIC_DIRECTUS_ENDPOINT}/assets/${id}`;
}
export { default as Hero } from './components/Hero.svelte'
export { default as Content } from './components/Content_with_testimonial.svelte'
export { default as Discography } from './components/Discography.svelte'




