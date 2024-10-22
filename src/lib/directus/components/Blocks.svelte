<script lang="ts">
	import type { Block } from '../index';
	import ContentWithTestimonial from './Content_with_testimonial.svelte';
	import Hero from './Hero.svelte';

	export let data: Block[];
</script>

{#each data as block}
	{#if block.collection === 'block_hero'}
		<Hero data={block.item} />
	{:else if block.collection === 'block_content'}
		<ContentWithTestimonial data={block.item} />
	{/if}
{/each}
