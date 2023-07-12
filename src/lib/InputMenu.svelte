<script lang="ts">
import { positionMapStore } from "./positionMapStore";

function getCoordsFromIndex(index: number): {x: number, y: number} {
    return {x: Math.floor(index / 16), y: (index % 16)};
}

function echo(index: number, value: number): void {
    positionMapStore.update((positionMapStore) => {positionMapStore[index] += value; return positionMapStore})
}

let positions: number[] = [];

positionMapStore.subscribe((positionMapStore) => { positions = positionMapStore });
</script>

<div class="menu-background">
    CYBERGRIND VISUALIZER
    <div class="elevation-map" on:contextmenu={() => {return false;}}>
        {#each Array(256) as _, index (index)}
            <button class="cell" id={index.toString()} on:click={() => {echo(index, 0.5)}} on:contextmenu={() => {echo(index, -0.5);}} oncontextmenu="return false;">{positions[index]}</button>
        {/each}
    </div>
</div>

<style lang="less">
    .menu-background {
        width: 100%;
        height: 100%;
        background: #111111;
    }
    .elevation-map {
        display: grid;
        width: 100%;
        aspect-ratio: 1 / 1;
        grid-template-columns: repeat(16, 1fr);
        grid-template-rows: repeat(16, 1fr);
        gap: 1px;
    }
    .cell {
        background:white;
    }
</style>