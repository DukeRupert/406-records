<script lang="ts">
	import { build_asset_url } from '..';
	let { data }: { data: Discography_Data } = $props();
</script>

{#snippet card(tag: string)}
	{#if tag == 'e'}
		<span
			class="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10 dark:bg-red-400/10 dark:text-red-400 dark:ring-red-400/20"
			>engineered</span
		>
	{:else if tag == 'p'}
		<span
			class="inline-flex items-center rounded-md bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-800 ring-1 ring-inset ring-yellow-600/20 dark:bg-yellow-400/10 dark:text-yellow-500 dark:ring-yellow-400/20"
			>produced</span
		>
	{:else if tag == 'mi'}
		<span
			class="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20 dark:bg-green-500/10 dark:text-green-400 dark:ring-green-500/20"
			>mixed</span
		>
	{:else if tag == 'ma'}
		<span
			class="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10 dark:bg-blue-400/10 dark:text-blue-400 dark:ring-blue-400/30"
			>mastered</span
		>
	{/if}
{/snippet}

<div id="discography" class="bg-gray-50 py-24 dark:bg-gray-900 sm:py-32">
	<div class="mx-auto max-w-7xl px-6 lg:px-8">
		<div class="mx-auto max-w-2xl lg:mx-0">
			<h2 class="text-pretty text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
				{data.title}
			</h2>
			{#if data.description}
				<p class="mt-6 text-lg leading-8 text-muted-foreground">
					{data.description}
				</p>
			{/if}
		</div>
		<ul
			role="list"
			class="mx-auto mt-20 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3 xl:grid-cols-4"
		>
			{#each data.albums as album}
				<a href={album.link} target="_blank" rel="noreferrer">
					<li>
						<img
							class="aspect-square w-full rounded-2xl object-cover"
							src={build_asset_url(album.image.id)}
							alt={album.image.description}
							height={album.image.height}
							width={album.image.width}
						/>
						<h3 class="sr-only mt-6 text-lg font-semibold leading-8 tracking-tight text-white">
							{album.artist}
						</h3>
						<div class="mt-4 flex flex-wrap gap-2">
							{#each album.tags as tag}
								{@render card(tag)}
							{/each}
						</div>
					</li>
				</a>
			{/each}
		</ul>
	</div>
</div>
