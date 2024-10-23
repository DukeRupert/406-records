import { createDirectus, rest } from "@directus/sdk";
import { PUBLIC_DIRECTUS_ENDPOINT } from "$env/static/public";

const endpoint = PUBLIC_DIRECTUS_ENDPOINT || ''
if (!endpoint) console.log('ERROR: endpoint not provided for Directus instance')

// Client with REST support
const client = createDirectus<Schema>(endpoint).with(rest())

export const build_asset_url = (id: string): string => {
  return `${endpoint}/assets/${id}`
}

export default client
export { default as Hero } from './components/Hero.svelte'
export { default as Content } from './components/Content_with_testimonial.svelte'
export { default as Discography } from './components/Discography.svelte'




