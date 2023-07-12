<script lang="ts">
import { heightMap } from "./heightMap";

function updateHeightMap(index: number, value: number): void {
    $heightMap[index] += value;
}

let localHeightMapCopy: number[] = Array();

heightMap.subscribe((heightMap) => { localHeightMapCopy = heightMap });
</script>

<!-- ### -->

<div class="menu-background">
    <div class="height-map">
        {#each Array(256) as _, index (index)}
            <button class="map-cell" id={index.toString()} on:click={() => { updateHeightMap(index, 0.5); }} on:contextmenu={() => { updateHeightMap(index, -0.5); }}>{localHeightMapCopy[index]}</button>
        {/each}
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
    width: 100%;
    aspect-ratio: 1 / 1;
    grid-template-columns: repeat(16, 1fr);
    grid-template-rows: repeat(16, 1fr);
    gap: 1px;
}
.map-cell {
    background: #222222;
}
</style>