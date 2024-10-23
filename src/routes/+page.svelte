<script lang="ts">
	import type { PageData } from './$types';
	import Blocks from '$lib/directus/components/Blocks.svelte';
	export let data: PageData;
</script>

<Blocks data={data.page.blocks} />
