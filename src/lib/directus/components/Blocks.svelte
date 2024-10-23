<script lang="ts">
	import Hero from './Hero.svelte';
	import ContentWithTestimonial from './Content_with_testimonial.svelte';
	import Discography from './Discography.svelte';
	export let data: Block[];
</script>

{#each data as block}
	{#if block.collection === 'block_hero'}
		<Hero data={block.item} />
	{:else if block.collection === 'block_content'}
		<ContentWithTestimonial data={block.item} />
	{:else if block.collection === 'block_discography'}
		<Discography data={block.item} />
	{/if}
{/each}
