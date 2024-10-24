<script>
	import '../app.css';
	import Header from '$lib/components/Header.svelte';
	import { ModeWatcher } from 'mode-watcher';
</script>

<ModeWatcher />
<div class="bg-background">
	<Header />
	<slot></slot>
</div>
