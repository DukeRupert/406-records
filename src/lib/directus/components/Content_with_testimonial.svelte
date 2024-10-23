<script lang="ts">
	let { data }: { data: Content_Data } = $props();
</script>

<div class="relative isolate overflow-hidden bg-white py-24 sm:py-32">
	<div
		class="absolute -top-80 left-[max(6rem,33%)] -z-10 transform-gpu blur-3xl sm:left-1/2 md:top-20 lg:ml-20 xl:top-3 xl:ml-56"
		aria-hidden="true"
	>
		<div
			class="aspect-[801/1036] w-[50.0625rem] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30"
			style="clip-path: polygon(63.1% 29.6%, 100% 17.2%, 76.7% 3.1%, 48.4% 0.1%, 44.6% 4.8%, 54.5% 25.4%, 59.8% 49.1%, 55.3% 57.9%, 44.5% 57.3%, 27.8% 48%, 35.1% 81.6%, 0% 97.8%, 39.3% 100%, 35.3% 81.5%, 97.2% 52.8%, 63.1% 29.6%)"
		></div>
	</div>
	<div class="mx-auto max-w-7xl px-6 lg:px-8">
		{#if data.testimonial && data.testimonial.length > 0}
			<div class="prose mx-auto max-w-2xl lg:prose-xl lg:mx-0">
				<h1
					class="mt-2 text-pretty text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl"
				>
					{data.title}
				</h1>
			</div>
			<div
				class="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:mx-0 lg:mt-10 lg:max-w-none lg:grid-cols-12"
			>
				<div class="relative lg:order-last lg:col-span-5">
					<svg
						class="absolute -top-[40rem] left-1 -z-10 h-[64rem] w-[175.5rem] -translate-x-1/2 stroke-gray-900/10 [mask-image:radial-gradient(64rem_64rem_at_111.5rem_0%,white,transparent)]"
						aria-hidden="true"
					>
						<defs>
							<pattern
								id="e87443c8-56e4-4c20-9111-55b82fa704e3"
								width="200"
								height="200"
								patternUnits="userSpaceOnUse"
							>
								<path d="M0.5 0V200M200 0.5L0 0.499983" />
							</pattern>
						</defs>
						<rect
							width="100%"
							height="100%"
							stroke-width="0"
							fill="url(#e87443c8-56e4-4c20-9111-55b82fa704e3)"
						/>
					</svg>
					<figure class="border-l border-indigo-600 pl-8">
						<blockquote class="text-xl font-semibold leading-8 tracking-tight text-gray-900">
							<p>
								“{data.testimonial[0].testimony}”
							</p>
						</blockquote>
						<figcaption class="mt-8 flex gap-x-4">
							<div class="text-sm leading-6">
								<div class="font-semibold text-gray-900">{data.testimonial[0].name}</div>
							</div>
						</figcaption>
					</figure>
				</div>
				<div class="prose prose-zinc max-w-xl lg:prose-xl lg:col-span-7">
					{@html data.content}
				</div>
			</div>
		{:else}
			<div class="prose mx-auto max-w-2xl lg:prose-xl lg:mx-0">
				<h1
					class="mt-2 text-pretty text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl"
				>
					{data.title}
				</h1>
				{@html data.content}
			</div>
		{/if}
	</div>
</div>
