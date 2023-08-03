<script lang="ts">
import {
	resolveMap,
	currentMapId,
	heightMap,
	prefabMap
} from '$stores';
import { getMapArraysFromCGPString, getCGPStringFromMapArrays } from '$scripts/patternParsing';

function enterMirroringState(index: number): void {
	for (let i = 0; i < 3; i++) {
		mirroringState[i] = i == index;
	}
}

function mirrorHalf(direction: number): void {
	let loopCheckI: CallableFunction = () => {};
	let loopCheckJ: CallableFunction = () => {};
	let incrementFunction = 0;
	let i, j, c;
	let ignoreAxis = 0;
	switch (direction) {
		case 0: // up
			loopCheckI = (i: number) => {
				return i >= 8;
			};
			loopCheckJ = (j: number) => {
				return j >= 0;
			};
			incrementFunction = -1;
			i = j = c = 15;
			ignoreAxis = 1;
			break;
		case 1: // left
			loopCheckI = (i: number) => {
				return i >= 0;
			};
			loopCheckJ = (j: number) => {
				return j >= 8;
			};
			incrementFunction = -1;
			i = j = c = 15;
			ignoreAxis = 0;
			break;
		case 2: // down
			loopCheckI = (i: number) => {
				return i <= 7;
			};
			loopCheckJ = (j: number) => {
				return j <= 15;
			};
			incrementFunction = 1;
			i = j = c = 0;
			ignoreAxis = 1;
			break;
		case 3: // right
			loopCheckI = (i: number) => {
				return i <= 15;
			};
			loopCheckJ = (j: number) => {
				return j <= 7;
			};
			incrementFunction = 1;
			i = j = c = 0;
			ignoreAxis = 0;
			break;
	}
	for (i; loopCheckI(i); (i as number) += incrementFunction) {
		for (j; loopCheckJ(j); (j as number) += incrementFunction) {
			if (ignoreAxis == 0) {
				$currentMap[i as number][15 - (j as number)] =
					$currentMap[i as number][j as number];
			} else {
				$currentMap[15 - (i as number)][j as number] =
					$currentMap[i as number][j as number];
			}
		}
		j = c;
	}
	enterMirroringState(-1);
}

function mirrorFourth(index: number): void {
	switch (index) {
		case 0: // top right
			mirrorHalf(1); // left
			mirrorHalf(2); // down
			break;
		case 1: // top left
			mirrorHalf(3); // right
			mirrorHalf(2); // down
			break;
		case 2: // down left
			mirrorHalf(3); // right
			mirrorHalf(0); // up
			break;
		case 3: // down right
			mirrorHalf(1); // left
			mirrorHalf(0); // up
			break;
	}
}

let mirroringState = [false, false, false];

function swapMaps(): void {
	$currentMapId = $currentMapId == 0 ? 1 : 0;
}

$: currentMap = resolveMap($currentMapId);

let patternFileInput: HTMLInputElement;

async function parsePattern(): Promise<void> {
	if (patternFileInput.files == null) {
		return;
	}
	let [file] = patternFileInput.files;
	if (!file || (file && !file.name.endsWith('.cgp'))) {
		return;
	}
	currentPatternName = file.name.replace(/\.[^/.]+$/, "");
	setPatternFromCgp(await file.text());
}

function setPatternFromCgp(cgp: string): void {
	let [heights, prefabs] = getMapArraysFromCGPString(cgp);
	$heightMap = heights;
	$prefabMap = prefabs;
}

// move to utils
function downloadCurrentPattern(): void {
	let element = document.createElement('a');
	element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(getCGPStringFromMapArrays([$heightMap, $prefabMap])));
	element.setAttribute('download', currentPatternName + ".cgp");

	element.style.display = 'none';
	document.body.appendChild(element);

	element.click();

	document.body.removeChild(element);
}

let currentPatternName: string;
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
		{#each Array(256) as _, index (index)}
			<button
				class="map-cell"
				id={index.toString()}
				on:click={() => {
					currentMap.updateMap(index, 1);
				}}
				on:contextmenu={() => {
					currentMap.updateMap(index, -1);
				}}
				>{$currentMap[Math.floor(index / 16)] === undefined
					? 0
					: $currentMap[Math.floor(index / 16)][index % 16]}</button
			>
		{/each}
	</div>
	{#if mirroringState[0] || mirroringState[1] || mirroringState[2]}
		<div class="mirror-overlay">
			{#if mirroringState[0]}
				<button
					class="mirror-selector fourth"
					on:click={() => {
						mirrorFourth(1);
					}}
				></button>
				<button
					class="mirror-selector fourth"
					on:click={() => {
						mirrorFourth(0);
					}}
				></button>
				<button
					class="mirror-selector fourth"
					on:click={() => {
						mirrorFourth(2);
					}}
				></button>
				<button
					class="mirror-selector fourth"
					on:click={() => {
						mirrorFourth(3);
					}}
				></button>
			{/if}
			{#if mirroringState[1]}
				<button
					class="mirror-selector half vertical"
					on:click={() => {
						mirrorHalf(3);
					}}
				></button>
				<button
					class="mirror-selector half vertical"
					on:click={() => {
						mirrorHalf(1);
					}}
				></button>
			{/if}
			{#if mirroringState[2]}
				<button
					class="mirror-selector half horizontal"
					on:click={() => {
						mirrorHalf(2);
					}}
				></button>
				<button
					class="mirror-selector half horizontal"
					on:click={() => {
						mirrorHalf(0);
					}}
				></button>
			{/if}
		</div>
	{/if}
</div>
<button
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
		enterMirroringState(0);
	}}>Mirror 4th</button
>
<button
	class="mirror-half-vertical"
	on:click={() => {
		enterMirroringState(1);
	}}>Mirror half (v)</button
>
<button
	class="mirror-half-hprizontal"
	on:click={() => {
		enterMirroringState(2);
	}}>Mirror half(h)</button
>
{#if mirroringState[0] || mirroringState[1] || mirroringState[2]}
	<button
		class="mirror-cancel"
		on:click={() => {
			enterMirroringState(-1);
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

<style lang="less">
.maps {
	display: grid;
	grid-template: 1fr / 1fr;
	& > * {
		grid-column: 1 / 1;
		grid-row: 1 / 1;
	}
}
.map {
	display: grid;
	width: calc(100% - 10px);
	aspect-ratio: 1 / 1;
	grid-template-columns: repeat(16, 1fr);
	grid-template-rows: repeat(16, 1fr);
	gap: 5px;
	padding: 5px;
}
.map-cell {
	background: #222222;
	color: #999999;
}
.mirror-overlay {
	display: grid;
	grid-template-columns: 1fr 1fr;
	grid-template-rows: 1fr 1fr;
}
.mirror-selector {
	background: rgba(0, 0, 0, 50%);
	&:hover {
		background: rgba(0, 0, 0, 10%);
	}
	&.half.vertical {
		grid-row: 1 / span 2;
	}
	&.half.horizontal {
		grid-column: 1 / span 2;
	}
}
</style>
