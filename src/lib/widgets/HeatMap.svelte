<script lang="ts">
import { onMount } from 'svelte';

import { heatColorOf } from '$scripts/heatMap';

import { heightMap } from '$stores';

let expanded = false;

// ### Heat Map ### //

let heatCanvas: HTMLCanvasElement;

onMount(() => {
	function redrawHeatCanvas(heightMap: number[][]): void {
		if( heatCanvas == null) { return }
		let heatContext = heatCanvas.getContext('2d') as CanvasRenderingContext2D;
		for (let i = 0; i < heightMap.length; i++) {
			for (let j = 0; j < heightMap[i].length; j++) {
				heatContext.fillStyle = heatColorOf(heightMap[i][j]);
				heatContext.fillRect(8 * j, 8 * i, 8, 8);
			}
		}
	}

	heightMap.subscribe((v) => {
		redrawHeatCanvas(v);
	});
});

function exportHeatMap(): void {
	let link = document.createElement("a");
	link.download = currentPatternName ? currentPatternName : 'myPattern' + ".png";
	link.href = heatCanvas.toDataURL();
	link.click();
}

// use stores ffs lmao
let currentPatternName = "heatMap";

// ### Hotkeys ### //

function onKeyDown(e: KeyboardEvent): void {
	if (e.target instanceof HTMLInputElement) { return }
	if (e.code == "KeyH") {
		expanded = !expanded;
	}
}
</script>

<div class="heat-map">
    <button class="expand" on:click={() => {expanded = !expanded}}>HEATMAP</button>
	<div class={`content ${!expanded ? "hidden" : ""}`}>
        <div class="heat-canvas">
            <canvas width="128px" height="128px" bind:this={heatCanvas} />
        </div>
        <button on:click={() => { exportHeatMap(); }}>DOWNLOAD</button>
	</div>
</div>

<svelte:window on:keydown={onKeyDown}/>

<style lang="less">
div.heat-map {
	width: fit-content;
	min-width: 128px;
    border: 3px solid rgba(200, 200, 200, 1);
	pointer-events: initial;
	padding: 5px;
	background: rgba(20, 20, 20, 1);
}

button {
    width: 100%;
	margin: 0px;
	padding: 5px;
    font-size: 1.5rem;
	background: none;
	&:hover {
        filter: brightness(75%);
    }
    cursor: pointer;
	
}

div.content {
	overflow: hidden;
}

.hidden {
	height: 0px;
}
</style>