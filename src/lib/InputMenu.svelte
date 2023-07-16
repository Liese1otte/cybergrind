<script lang="ts">
import { browser } from "$app/environment";
import { heightMap, isRotating, enableDamping, cameraPosition, cameraRotation, rotationAngle, prefabMap } from "./stores";

function updateMap(index: number, value: number): void {
    if (currentMap == 0) {
        $heightMap[Math.floor(index / 16)][index % 16] += value * 0.5;
    } else {
        let currentPrefab = $prefabMap[Math.floor(index / 16)][index % 16];
        let nextPrefab = (prefabOptions.indexOf(currentPrefab) + value) % prefabOptions.length
        nextPrefab = nextPrefab == -1 ? prefabOptions.length - 1 : nextPrefab;
        $prefabMap[Math.floor(index / 16)][index % 16] = prefabOptions[nextPrefab];
    }
}

const prefabOptions = [0, "n", "p", "J", "s", "H"];

let currentMap = 0;

let localHeightMap: number[][] = Array.from(Array(16), () => Array(16).fill(0));

if (browser) {
    heightMap.subscribe((value) => {localHeightMap = value});
}

let maps = [localHeightMap, $prefabMap];

function enterMirroringState(index: number): void {
    for (let i = 0; i < 3; i++) {
        mirroringState[i] = (i == index);
    }
}

function mirrorHalf(direction: number): void {
    console.log(direction);
    let loopCheckI: CallableFunction = () => {};
    let loopCheckJ: CallableFunction = () => {};
    let incrementFunction = 0;
    let i, j, c;
    let ignoreAxis = 0;
    switch (direction) {
        case 0: // up
            loopCheckI = (i: number) => {return i >= 8};
            loopCheckJ = (j: number) => {return j >= 0};
            incrementFunction = -1;
            i = j = c = 15;
            ignoreAxis = 1;
            break;
        case 1: // left
            loopCheckI = (i: number) => {return i >= 0};
            loopCheckJ = (j: number) => {return j >= 8};
            incrementFunction = -1;
            i = j = c = 15;
            ignoreAxis = 0;
            break;
        case 2: // down
            loopCheckI = (i: number) => {return i <= 7};
            loopCheckJ = (j: number) => {return j <= 15};
            incrementFunction = 1;
            i = j = c = 0;
            ignoreAxis = 1;
            break;
        case 3: // right
            loopCheckI = (i: number) => {return i <= 15};
            loopCheckJ = (j: number) => {return j <= 7};
            incrementFunction = 1;
            i = j = c = 0;
            ignoreAxis = 0;
            break;
    }
    for (i; loopCheckI(i); (i as number) += incrementFunction) {
        for (j; loopCheckJ(j); (j as number) += incrementFunction) {
            if (ignoreAxis == 0) {
                (maps[currentMap])[i as number][15 - (j as number)] = (maps[currentMap])[i as number][j as number];
            } else {
                (maps[currentMap])[15 - (i as number)][j as number] = (maps[currentMap])[i as number][j as number];
            }
        }
        j = c;
    }
    enterMirroringState(-1);
}

function mirrorFourth(index: number): void {
    switch(index) {
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
</script>

<!-- ### -->

<div class="menu-background">
    <div class="maps">
        <div class="map" on:contextmenu={(e) => { e.preventDefault(); }}>
            {#each Array(256) as _, index (index)}
                <button class="map-cell" id={index.toString()} on:click={() => { updateMap(index, 1); }} on:contextmenu={() => { updateMap(index, -1); }}>{currentMap ? $prefabMap[Math.floor(index / 16)][index % 16] : localHeightMap[Math.floor(index / 16)][index % 16] / 0.5}</button>
            {/each}
        </div>
        {#if mirroringState[0] || mirroringState[1] || mirroringState[2]}
            <div class="mirror-overlay">
                {#if mirroringState[0]}
                    <button class="mirror-selector fourth" on:click={() => { mirrorFourth(1); }}></button>
                    <button class="mirror-selector fourth" on:click={() => { mirrorFourth(0); }}></button>
                    <button class="mirror-selector fourth" on:click={() => { mirrorFourth(2); }}></button>
                    <button class="mirror-selector fourth" on:click={() => { mirrorFourth(3); }}></button>
                {/if}
                {#if mirroringState[1]}
                    <button class="mirror-selector half vertical" on:click={() => { mirrorHalf(3); }}></button>
                    <button class="mirror-selector half vertical" on:click={() => { mirrorHalf(1); }}></button>
                {/if}
                {#if mirroringState[2]}
                    <button class="mirror-selector half horizontal" on:click={() => { mirrorHalf(2); }}></button>
                    <button class="mirror-selector half horizontal" on:click={() => { mirrorHalf(0); }}></button>
                {/if}
            </div>
        {/if}
    </div>
    <div class="control-menu">
        <button class="toggle-maps" on:click={() => { currentMap = (currentMap + 1) % 2}}>Switch Maps</button>
        <input type="checkbox" id="isRotating" bind:checked={$isRotating}>
        <label for="isRotating">Rotate?</label>
        <input type="checkbox" id="enableDamping" bind:checked={$enableDamping}>
        <label for="enableDamping">Damping?</label>
        <button class="height-reset" on:click={() => { $heightMap = Array.from(Array(16), () => Array(16).fill(0)); }}>Reset Pattern</button>
        <button class="camera-reset" on:click={() => { $cameraPosition = {x: 0, y: 15, z: 20}; $cameraRotation = {x: 0, y: 0, z:0}; $rotationAngle = 0; }}>Reset Camera</button>
        <br />
        <button class="mirror-fourth" on:click={() => { enterMirroringState(0); }}>Mirror 4th</button>
        <button class="mirror-half-vertical" on:click={() => { enterMirroringState(1); }}>Mirror half (v)</button>
        <button class="mirror-half-hprizontal" on:click={() => { enterMirroringState(2  ); }}>Mirror half(h)</button>
        <button class="mirror-cancel" on:click={() => { enterMirroringState(-1); }}>Cancel</button>
    </div>
</div>

<style lang="less">
.menu-background {
    width: 100%;
    height: 100%;
    background: #111111;
}
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