<script lang="ts">
	import { Button as Btn } from '$lib/components/ui/button/index.js';
	export let data: Button[];
</script>

{#each data as button}
	<Btn variant={button.variant || 'default'} href={button.href || ''}>{button.label}</Btn>
{/each}
