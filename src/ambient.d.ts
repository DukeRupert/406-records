// Website

interface Link {
  label: string;
  href: string;
}

// Directus
interface Schema {
  settings: Settings
  page: Page[]
}

interface Page {
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

type Block =
  Block_Hero |
  Block_Content |
  Block_Discography

interface Seo {
  id: string
  title: string
  meta_description: string
  canonical_url: string
  og_image: Og_Image
}

interface Og_Image {
  id: string
  description: string
  height: number
  width: number
}

interface Settings {
  id: string
  name: string
  logo: string
  email: string
  telephone: string
  street_address: string
  city: string
  state: string
  postal_code: string
  socials: Social[]
}

interface Social {
  name: string
  url: string
}

// Common block types
interface Image {
  id: string;
  description: string;
  height: string;
  width: string;
}

type Button_Variants = 'default' | 'secondary' | 'destructive' | 'ghost' | 'link';

// Individual collections
// block_hero
interface Block_Hero {
  collection: 'block_hero';
  item: Hero_Data;
}

interface Hero_Data {
  id: string;
  headline: string;
  description: string;
  buttons?: Button[];
  image: Image;
}

interface Button {
  label: string;
  href: string;
  variant: Button_Variants;
}



// block_discography
interface Block_Discography {
  collection: 'block_discography';
  item: Discography_Data;
}

interface Discography_Data {
  id: string;
  title: string;
  description: string;
  albums: Album[];
}

interface Album {
  id: string;
  sort: any;
  name: string;
  link: string;
  tags: string[];
  discography_id: string;
  artist: string;
  image: Image;
}

// block_content
interface Block_Content {
  collection: 'block_content';
  item: Content_Data;
}

interface Content_Data {
  id: string;
  title: string;
  content: string;
  testimonial: Testimonial[];
}

interface Testimonial {
  id: string;
  testimony: string;
  name: string;
}

