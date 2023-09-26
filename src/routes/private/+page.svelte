<script lang="ts">
	import type { PageServerData } from './$types';
	export let data: PageServerData;
</script>

<div>private</div>
{JSON.stringify(data)}
