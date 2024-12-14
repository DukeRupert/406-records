<script lang="ts">
	import type { PageData, ActionData } from './$types';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { enhance } from '$app/forms';
	import { Button } from '$lib/components/ui/button/index.js';
	import Blocks from '$lib/directus/components/Blocks.svelte';
	export let data: PageData;
	export let form: ActionData;

	// Optional loading state
	let submitting = false;

	const handleEnhance: SubmitFunction = ({ formElement, formData, action, cancel, submitter }) => {
		submitting = true;

		// You can validate or modify form data here before submission
		// If validation fails, call cancel()

		return async ({ result, update }) => {
			submitting = false;

			if (result.type === 'success') {
				// Optional: Reset the form on success
				formElement.reset();
			}

			// Run the default update
			await update();
		};
	};
</script>

<Blocks data={data.page.blocks} />
<div id="contact-us" class="relative isolate pt-14">
	<div class="py-24 sm:py-32 lg:pb-40">
		<div class="mx-auto max-w-7xl px-6 lg:px-8">
	<div>
		<h1 class="mt-2 text-pretty text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
			406 Records
		</h1>
		<p class="mt-2">Contact us about your recording project</p>
		<form method="POST" use:enhance={handleEnhance} class="mt-12 max-w-lg">
			<div class="grid gap-y-6">
				<div>
					<label for="name" class="block text-sm font-semibold">Name</label>
					<div class="mt-2.5">
						<input
							type="text"
							name="name"
							id="name"
							class="block w-full rounded-md border border-border px-3.5 py-2 focus:outline-none focus:ring-2 focus:ring-ring"
							required
							max="80"
						/>
					</div>
					{#if form?.errors?.name}
						<p class="mt-2.5 text-sm text-red-600">{form.errors.name}</p>
					{/if}
				</div>

				<div>
					<label for="email" class="block text-sm font-semibold">Email</label>
					<div class="mt-2.5">
						<input
							type="email"
							name="email"
							id="email"
							class="block w-full rounded-md border border-border px-3.5 py-2 focus:outline-none focus:ring-2 focus:ring-ring"
							required
						/>
					</div>
					{#if form?.errors?.email}
						<p class="mt-2.5 text-sm text-red-600">{form.errors.email}</p>
					{/if}
				</div>

				<div>
					<label for="phone" class="block text-sm font-semibold">Phone</label>
					<div class="mt-2.5">
						<input
							type="tel"
							name="phone"
							id="phone"
							class="block w-full rounded-md border border-border px-3.5 py-2 focus:outline-none focus:ring-2 focus:ring-ring"
							required
						/>
					</div>
					{#if form?.errors?.phone}
						<p class="mt-2.5 text-sm text-red-600">{form.errors.phone}</p>
					{/if}
				</div>
				<div class="hidden" aria-hidden="true">
					<input type="text" name="bot_trap" tabindex="-1" autocomplete="off" />
				</div>
				<div class="hidden" aria-hidden="true">
					<input type="text" name="address" tabindex="-1" autocomplete="off" />
				</div>
			</div>

			<div class="mt-10">
				<Button type="submit" disabled={submitting}
					>{submitting ? 'Sending...' : 'Send Message'}</Button
				>
			</div>
			<div class="mt-10">
				{#if form?.success}
					<p class="text-green-600">{form.message}</p>
				{:else if form?.errors}
					<p class="text-red-600">Please correct the errors below</p>
				{/if}
			</div>
		</form>
	</div>
</div>
</div>
</div>
