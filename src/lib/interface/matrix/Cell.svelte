<script lang="ts">
import { resolveMap, currentMapId } from "$src/stores/stores";

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
