<script lang="ts">
import { heightMap, isRotating } from "./stores";

function updateHeightMap(index: number, value: number): void {
    $heightMap[index] += value;
}
</script>

<!-- ### -->

<div class="menu-background">
    <div class="height-map" on:contextmenu={(e) => { e.preventDefault(); }}>
        {#each Array(256) as _, index (index)}
            <button class="map-cell" id={index.toString()} on:click={() => { updateHeightMap(index, 0.5); }} on:contextmenu={() => { updateHeightMap(index, -0.5); }}>{$heightMap[index] / 0.5}</button>
        {/each}
    </div>
    <div class="control-menu">
        <input type="checkbox" id="isRotating" bind:checked={$isRotating}>
        <label for="isRotating">Rotate?</label>
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