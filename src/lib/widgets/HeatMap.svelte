<script lang="ts">
import { onMount } from 'svelte';

import { heatColorOf } from '$scripts/heatMap';

import { heightMap } from '$stores';

let expanded = false;

// ### Heat Map ### //

let heatCanvas: HTMLCanvasElement;

onMount(() => {
	function redrawHeatCanvas(heightMap: number[][]): void {
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

let currentPatternName = "pattern";
</script>

<div class="heat-map">
    <button class="expand" on:click={() => {expanded = !expanded}}></button>
    {#if expanded}
        <div class="heat-canvas">
            <canvas width="128px" height="128px" bind:this={heatCanvas} />
        </div>
        <button on:click={() => { exportHeatMap(); }}>Download</button>
    {/if}
</div>

<style lang="less">
div.heat-map {
    width: 5%;
    aspect-ratio: 1 / 1;
    border: 3px solid rgba(200, 200, 200, 1);
}

button.expand {
    width: 5%;
    height: 5%;
}

canvas {
    width: 128px;
    aspect-ratio: 1 / 1;
}
</style>