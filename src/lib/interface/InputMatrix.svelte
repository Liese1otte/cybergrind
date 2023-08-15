<script lang="ts">
import { resolveMap, currentMapId, heightMap, prefabMap } from '$stores';
import { getMapArraysFromCGPString, getCGPStringFromMapArrays } from '$scripts/patternParsing';
import { MirrorState } from '$scripts/mirroring';
import MirrorOverlay from './MirrorOverlay.svelte';

let mirrorState = MirrorState.None;

function swapMaps(): void {
	$currentMapId = $currentMapId == 0 ? 1 : 0;
}

$: currentMap = resolveMap($currentMapId);

// ###

// In-canvas edits do not support brushes obviously

const enum BrushType {
	None = 'None',
	Increment = 'Increment',
	Set = 'Set'
}

function resolveMapEdit(index: number, sign: -1 | 1): void {
	if (brushType == BrushType.None || brushValue == null) {
		currentMap.updateMap(index, 1 * sign);
	} else if (brushType == BrushType.Increment) {
		currentMap.updateMap(index, brushValue * sign);
	} else {
		currentMap.setMap(index, brushValue * sign);
	}
}

let brushValue: number | null = 0;

let brushType: string = BrushType.None;
</script>

<div class="maps">
	<!-- resolve this is probably for disabled people -->
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div
		class="map"
		on:contextmenu={(e) => {
			e.preventDefault();
		}}
	>
		{#each Array(256) as _, i (i)}
			<button
				class="map-cell"
				id={i.toString()}
				on:click={() => {
					resolveMapEdit(i, 1);
				}}
				on:contextmenu={() => {
					resolveMapEdit(i, -1);
				}}
				>{$currentMap[Math.floor(i / 16)] === undefined
					? 0
					: $currentMap[Math.floor(i / 16)][i % 16]}</button
			>
		{/each}
	</div>
	<MirrorOverlay {mirrorState} />
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
.map-cell {
	background: rgba(50, 50, 50, 1);
}
</style>
