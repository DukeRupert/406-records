import { createDirectus, rest } from "@directus/sdk";
import { PUBLIC_DIRECTUS_ENDPOINT } from "$env/static/public";
import type { Block_Hero } from './components/Hero.svelte'
import type { Block_Content } from "./components/Content_with_testimonial.svelte";

export interface Schema {
  site_settings: Site_Settings
  page: Page[]
}

export interface Page {
  id: string
  status: string
  sort: null | string
  user_created: null | string
  date_created: null | string
  user_updated: null | string
  date_updated: null | string
  eyebrow?: string
  title: string
  description?: string
  slug: string
  seo: Seo
  blocks: Block[]
}

export type Block =
  Block_Hero |
  Block_Content

export interface Seo {
  id: string
  title: string
  meta_description: string
  canonical_url: string
  og_image: Og_Image
}

export interface Og_Image {
  id: string
  description: string
  height: number
  width: number
}

export interface Site_Settings {
  id: string
  status: string
  user_created: string
  date_created: string
  user_updated: string
  date_updated: string
  name: string
  logo?: string
  schema_type: string
  description: string
  email: string
  telephone: string
  street_address: string
  city: string
  state: string
  postal_code: string
  socials: Social[]
  logo_full?: string
}

export interface Social {
  name: string
  url: string
}

const endpoint = PUBLIC_DIRECTUS_ENDPOINT || ''
if (!endpoint) console.log('ERROR: endpoint not provided for Directus instance')

// Client with REST support
const client = createDirectus<Schema>(endpoint).with(rest())

export default client
