<script lang="ts">
import { isRotating, enableDamping, cameraPosition, cameraTarget, rotationAngle, defaultCameraPosition} from "$lib/stores";
import InputMap from "./maps/InputMap.svelte";
</script>

<!-- ### -->

<div class="menu-background">
    <InputMap />
    <div class="control-menu">
        <input type="checkbox" id="isRotating" bind:checked={$isRotating}>
        <label for="isRotating">Rotate?</label>
        <input type="checkbox" id="enableDamping" bind:checked={$enableDamping}>
        <label for="enableDamping">Damping?</label>
        <button class="camera-reset" on:click={() => { $cameraPosition = defaultCameraPosition; $cameraTarget = {x: 0, y: 0, z:0}; $rotationAngle = 0; }}>Reset Camera</button>
        <br />
    </div>
</div>

<style lang="less">
.menu-background {
    width: 100%;
    height: 100%;
    background: #111111;
}
</style>