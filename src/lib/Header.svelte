<script lang="ts">
	import { page } from '$app/stores';
	import { quadOut } from 'svelte/easing';
	import { fade, fly, type FadeParams, type FlyParams } from 'svelte/transition';
	interface Link {
		label: string;
		href: string;
	}

	const links: Link[] = [
		{ label: 'services', href: '#services' },
		{ label: 'discography', href: '#discography' },
		{ label: 'pricing', href: '#pricing' },
		{ label: 'biography', href: '#biography' }
	];

	let nav_open = $state(false);
	const Fade: FadeParams = {
		duration: 250,
		easing: quadOut
	};
	const Fly: FlyParams = {
		x: 500,
		duration: 250,
		easing: quadOut
	};
</script>

{#snippet Navbar(link: Link)}
	<a href={link.href} class="text-sm font-semibold leading-6 text-gray-900">{link.label}</a>
{/snippet}

{#snippet Mobile(link: Link)}
	<a
		href={link.href}
		class="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
		>{link.label}</a
	>
{/snippet}

<header class="bg-white">
	<nav class="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8" aria-label="Global">
		<div class="flex lg:flex-1">
			<a href="/" class="-m-1.5 p-1.5">
				<span class="sr-only">406 Records</span>
				<img
					class="h-8 w-auto {$page.url.pathname === '/' ? 'invisible' : ''}"
					src="/logo.png"
					alt="406 records logo"
				/>
			</a>
		</div>
		<div class="z-10 flex lg:hidden">
			<button
				type="button"
				onclick={() => (nav_open = true)}
				class="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
			>
				<span class="sr-only">Open main menu</span>
				<svg
					class="h-6 w-6"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="currentColor"
					aria-hidden="true"
					data-slot="icon"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
					/>
				</svg>
			</button>
		</div>
		<div class="hidden lg:flex lg:gap-x-12">
			{#each links as link}
				{@render Navbar(link)}
			{/each}
		</div>
		<div class="hidden lg:flex lg:flex-1 lg:justify-end">
			<a href="#contact-us" class="text-sm font-semibold leading-6 text-gray-900"
				>Contact us <span aria-hidden="true">&rarr;</span></a
			>
		</div>
	</nav>
	{#if nav_open}
		<!-- Mobile menu, show/hide based on menu open state. -->
		<div class="lg:hidden" role="dialog" aria-modal="true">
			<!-- Background backdrop, show/hide based on slide-over state. -->
			<div transition:fade={Fade} class="fixed inset-0 z-10"></div>
			<div
				transition:fly={Fly}
				class="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10"
			>
				<div class="flex items-center justify-between">
					<a href="/" class="-m-1.5 p-1.5">
						<span class="sr-only">406 Records</span>
						<img
							class="h-8 w-auto"
							src="https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=600"
							alt=""
						/>
					</a>
					<button
						type="button"
						onclick={() => (nav_open = false)}
						class="-m-2.5 rounded-md p-2.5 text-gray-700"
					>
						<span class="sr-only">Close menu</span>
						<svg
							class="h-6 w-6"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="1.5"
							stroke="currentColor"
							aria-hidden="true"
							data-slot="icon"
						>
							<path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
						</svg>
					</button>
				</div>
				<div class="mt-6 flow-root">
					<div class="-my-6 divide-y divide-gray-500/10">
						<div class="space-y-2 py-6">
							{#each links as link}
								{@render Mobile(link)}
							{/each}
						</div>
						<div class="py-6">
							<a
								href="#contact-us"
								class="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
								>Contact us</a
							>
						</div>
					</div>
				</div>
			</div>
		</div>{/if}
</header>
