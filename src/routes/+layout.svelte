<script lang="ts">
	import type { LayoutData } from './$types';
	import '../app.css';
	import { ModeWatcher } from 'mode-watcher';
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';

	export let data: LayoutData;

	const links: Link[] = [
		{ label: 'services', href: '#services' },
		{ label: 'discography', href: '#discography' },
		{ label: 'pricing', href: '#pricing' },
		{ label: 'meet the artists', href: '#meet-the-artists' },
		{ label: 'biography', href: '#biography' },
		{ label: 'contact us', href: '#contact-us' }
	];
</script>

<ModeWatcher />
<div class="bg-background">
	<Header {links} logo={data.settings.logo} />
	<slot />
	<Footer {links} socials={data.settings.socials} name={data.settings.name} />
</div>
