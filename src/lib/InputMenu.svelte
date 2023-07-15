<script lang="ts">
import { browser } from "$app/environment";
import { heightMap, isRotating, enableDamping, cameraPosition, cameraRotation, rotationAngle } from "./stores";

function updateHeightMap(index: number, value: number): void {
    console.log($heightMap[Math.floor(index / 16)][index % 16]);
    $heightMap[Math.floor(index / 16)][index % 16] += value;
}

let localHeightMap: number[][] = Array(16).fill(new Array(16).fill(0));

if (browser) {
    heightMap.subscribe((value) => {localHeightMap = value});
}
</script>

<!-- ### -->

<div class="menu-background">
    <div class="height-map" on:contextmenu={(e) => { e.preventDefault(); }}>
        {#each Array(256) as _, index (index)}
            <button class="map-cell" id={index.toString()} on:click={() => { updateHeightMap(index, 0.5); }} on:contextmenu={() => { updateHeightMap(index, -0.5); }}>{localHeightMap[Math.floor(index / 16)][index % 16]}</button>
        {/each}
    </div>
    <div class="control-menu">
        <input type="checkbox" id="isRotating" bind:checked={$isRotating}>
        <label for="isRotating">Rotate?</label>
        <input type="checkbox" id="enableDamping" bind:checked={$enableDamping}>
        <label for="enableDamping">Damping?</label>
        <button class="height-reset" on:click={() => { $heightMap = Array(16).fill(Array(16).fill(0)); }}>Reset Pattern</button>
        <button class="camera-reset" on:click={() => { $cameraPosition = {x: 0, y: 15, z: 20}; $cameraRotation = {x: 0, y: 0, z:0}; $rotationAngle = 0; }}>Reset Camera</button>
    </div>
</div>

<style lang="less">
.menu-background {
    width: 100%;
    height: 100%;
    background: #111111;
}
.height-map {
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
</style>