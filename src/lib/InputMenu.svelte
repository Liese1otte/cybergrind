<script lang="ts">
import {
	isArenaRotating,
	enableDamping,
	isGeneratingMipmaps,
	cameraPosition,
	arenaRotationAngle,
	defaultCameraPosition,
	cameraTarget
} from '$lib/stores';
import InputMap from './maps/InputMap.svelte';
</script>

<!-- ### -->

<div class="menu-background">
	<InputMap />
	<div class="control-menu">
		<input type="checkbox" id="isRotating" bind:checked={$isArenaRotating} />
		<label for="isRotating">Rotate?</label>
		<input type="checkbox" id="enableDamping" bind:checked={$enableDamping} />
		<label for="enableDamping">Damping?</label>
		<input type="checkbox" id="isGeneratingMipmaps" bind:checked={$isGeneratingMipmaps} />
		<label for="enableDamping">Mipmaps? (Reload required)</label>
		<button
			class="camera-reset"
			on:click={() => {
				$cameraPosition = defaultCameraPosition;
				$arenaRotationAngle = 0;
				$cameraTarget = [0, 0, 0];
			}}>Reset Camera</button
		>
	</div>
</div>

<style lang="less">
.menu-background {
	width: 100%;
	height: 100%;
	background: #111111;
}
</style>
