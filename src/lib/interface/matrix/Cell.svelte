<script lang="ts">
import { resolveMap, currentMapId } from "$stores";

export let index: number;

$: currentMap = resolveMap($currentMapId);
</script>

<button
	class="cell"
	on:click={() => {
		currentMap.updateMap(index, 1);
	}}
	on:contextmenu={() => {
		currentMap.updateMap(index, -1);
	}}><slot /></button
>
