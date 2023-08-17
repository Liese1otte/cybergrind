<script lang="ts">
import MirrorOverlay from "$lib/interface/MirrorOverlay.svelte";
import { blankMap, col, row } from "$utils";
import { heightMap, prefabMap, currentMapId, resolvePrefabs, MapType } from "$stores";
import Cell from "./Cell.svelte";

function updateDisplayedMap(id: MapType): (number | string)[][] {
	return id == MapType.Height ? $heightMap : resolvePrefabs($prefabMap);
}

let displayedMap: (number | string)[][] = blankMap(0);

$: if ($heightMap && $prefabMap) { displayedMap = updateDisplayedMap($currentMapId); }
</script>

<div class="maps">
	<div
		class="map"
		on:contextmenu|preventDefault
		role="grid"
		tabindex="0"
	>
		{#each Array(256) as _, i (i)}
			<Cell index={i}>{displayedMap[row(i)][col(i)]}</Cell>
		{/each}
	</div>
	<MirrorOverlay />
</div>

<style lang="less">
.maps {
	display: grid;
	grid-template: 1fr / 1fr;
}
.map {
	display: grid;
	width: calc(100% - 12px);
	aspect-ratio: 1 / 1;
	grid-template-columns: repeat(16, 1fr);
	grid-template-rows: repeat(16, 1fr);
	gap: 3px;
	padding: 3px;
	grid-column: 1 / 1;
	grid-row: 1 / 1;
	border: 3px solid rgba(200, 200, 200, 1);
}
.map :global(.cell) {
	background: rgba(50, 50, 50, 1);
}
</style>
