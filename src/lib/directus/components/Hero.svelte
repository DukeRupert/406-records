<script lang="ts">
	import Buttons from './Button.svelte';
	import { build_asset_url } from '../index';
	let { data }: { data: Hero_Data } = $props();
</script>

<div id="hero" class="relative isolate pt-14">
	<div class="py-24 sm:py-32 lg:pb-40">
		<div class="mx-auto max-w-7xl px-6 lg:px-8">
			<img class="spin-animation mx-auto h-32 w-auto sm:h-64" src="/logo.png" alt="406 Records" />
			<div class="mx-auto max-w-2xl text-center">
				<h1 class="mt-10 text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
					{data.headline}
				</h1>
				<p class="mt-6 text-lg leading-8 text-muted-foreground">
					{data.description}
				</p>

				<div class="mt-10 flex items-center justify-center gap-x-6">
					{#if data.buttons && data.buttons.length > 0}
						<Buttons data={data.buttons} />
					{/if}
				</div>
			</div>
			<div class="mt-16 flow-root sm:mt-24">
				<div
					class="-m-2 rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:-m-4 lg:rounded-2xl lg:p-4"
				>
					<img
						class="w-full rounded-md object-fill shadow-2xl ring-1 ring-gray-900/10"
						src={build_asset_url(data.image.id)}
						srcset="{build_asset_url(data.image.id) + '?width=320'} 320w, {build_asset_url(
							data.image.id
						) + '?width=480'} 480w, {build_asset_url(data.image.id) +
							'?width=800'} 800w, {build_asset_url(data.image.id) +
							'?width=1200'} 1200w,{build_asset_url(data.image.id) +
							'?width=1600'} 1600w, {build_asset_url(data.image.id) + '?width=2000'} 2000w"
						sizes="(max-width: 320px) 280px,
                                (max-width: 480px) 440px,
                                (max-width: 800px) 760px,
                                (max-width: 1200px) 1000px,
                                100vw"
						alt={data.image.description}
						height={data.image.height}
						width={data.image.width}
					/>
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	.spin-animation {
		animation: spin 1s cubic-bezier(0.4, 0, 0.2, 1) 0.5s;
	}

	@keyframes spin {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}
</style>
