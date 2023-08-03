<script lang="ts">
import {
	isArenaRotating,
	enableDamping,
	mipMapsEnabled,
	cameraPosition,
	arenaRotationAngle,
	defaultCameraPosition,
	cameraTarget,
	showKillZone,

	defaultCameraTarget

} from '$stores';
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
		<input type="checkbox" id="mipMapsEnabled" bind:checked={$mipMapsEnabled} />
		<label for="enableDamping">Mipmaps? (Reload required)</label>
		<button
			class="camera-reset"
			on:click={() => {
				$cameraPosition = defaultCameraPosition;
				$arenaRotationAngle = 0;
				$cameraTarget = defaultCameraTarget;
			}}>Reset Camera</button
		>
		<input type="checkbox" id="showKillZone" bind:checked={$showKillZone} />
		<label for="showKillZone">Kill Zone?</label>
	</div>
	02.cgp does not pass shit wtf lol
</div>


<style lang="less">
.menu-background {
	width: 100%;
	height: 100%;
	background: #111111;
}
</style>
