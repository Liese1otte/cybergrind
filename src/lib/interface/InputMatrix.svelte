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



// move to utils
async function parsePattern(): Promise<void> {
	if (patternFileInput.files == null) {
		return;
	}
	let [file] = patternFileInput.files;
	if (!file || (file && !file.name.endsWith('.cgp'))) {
		return;
	}
	currentPatternName = file.name.replace(/\.[^/.]+$/, '');
	setPatternFromCgp(await file.text());
}

function setPatternFromCgp(cgp: string): void {
	let [heights, prefabs] = getMapArraysFromCGPString(cgp);
	$heightMap = heights;
	$prefabMap = prefabs;
}

// .cgp is not appended
function downloadCurrentPattern(): void {
	let element = document.createElement('a');
	element.setAttribute(
		'href',
		'data:text/plain;charset=utf-8,' +
			encodeURIComponent(getCGPStringFromMapArrays([$heightMap, $prefabMap]))
	);
	element.setAttribute('download', currentPatternName ? currentPatternName : 'myPattern' + '.cgp');

	element.style.display = 'none';
	document.body.appendChild(element);

	element.click();

	document.body.removeChild(element);
}



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
<!-- <button
	class="toggle-maps"
	on:click={() => {
		swapMaps();
	}}>Switch Maps</button
>
<button
	class="height-reset"
	on:click={() => {
		$currentMap = Array.from(Array(16), () => Array(16).fill(0));
	}}>Reset Pattern</button
>
<button
	class="mirror-fourth"
	on:click={() => {
		mirrorState = MirrorState.Fourth;
	}}>Mirror 4th</button
>
<button
	class="mirror-half-vertical"
	on:click={() => {
		mirrorState = MirrorState.Vertical;
	}}>Mirror half (v)</button
>
<button
	class="mirror-half-hprizontal"
	on:click={() => {
		mirrorState = MirrorState.Horizontal;
	}}>Mirror half(h)</button
>
{#if mirrorState != MirrorState.None}
	<button
		class="mirror-cancel"
		on:click={() => {
			mirrorState = MirrorState.None;
		}}>Cancel</button
	>
{/if}
<input
	type="file"
	on:change={() => {
		parsePattern();
	}}
	bind:this={patternFileInput}
	accept=".cgp"
/>
<br />
<input type="text" id="patternName" bind:value={currentPatternName} />
<label for="patternName">Pattern Name</label>
<button
	on:click={() => {
		downloadCurrentPattern();
	}}>Export</button
>
<select bind:value={brushType}>
	<option>None</option>
	<option>Set</option>
	<option>Increment</option>
</select>
<input type="number" bind:value={brushValue} /> -->

<style lang="less">
.maps {
	display: grid;
	grid-template: 1fr / 1fr;
}
.map {
	display: grid;
	width: calc(100% - 10px);
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
