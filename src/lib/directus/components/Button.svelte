<script lang="ts" context="module">
	export type Button_Variants = 'default' | 'secondary' | 'destructive' | 'ghost' | 'link';
</script>

<script lang="ts">
	import type { Button as Btn } from './Hero.svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	export let data: Btn[];
</script>

{#each data as button}
	<Button variant={button.variant || 'default'} href={button.href || ''}>{button.label}</Button>
{/each}
