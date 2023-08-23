<script lang="ts">
import {
	enableDamping,
	isGridRotating,
	mipMapsEnabled,
	showKillZone,
	resetCamera
} from "$stores";
</script>

<div class="view">
	<div class="toggles">
		<button
			class="toggle"
			on:click={() => {
				$isGridRotating = !$isGridRotating;
			}}
		>
			<span class="toggle-title">ARENA ROTATION</span>
			<span class={`toggle-value ${$isGridRotating ? "green" : "red"}`}
				>{$isGridRotating}</span
			>
		</button>
		<button
			class="toggle"
			on:click={() => {
				$enableDamping = !$enableDamping;
			}}
		>
			<span class="toggle-title">CAMERA DAMPING</span>
			<span class={`toggle-value ${$enableDamping ? "green" : "red"}`}>{$enableDamping}</span>
		</button>
		<button
			class="toggle"
			on:click={() => {
				$mipMapsEnabled = !$mipMapsEnabled;
				window.location.reload();
			}}
		>
			<span class="toggle-title">ENABLE MIPMAPS</span>
			<span class={`toggle-value ${$mipMapsEnabled ? "green" : "red"}`}
				>{$mipMapsEnabled}</span
			>
		</button>
		<button
			class="toggle"
			on:click={() => {
				$showKillZone = !$showKillZone;
			}}
		>
			<span class="toggle-title">SHOW KILL ZONE</span>
			<span class={`toggle-value ${$showKillZone ? "green" : "red"}`}>{$showKillZone}</span>
		</button>
	</div>
	<button class="reset-camera" on:click={resetCamera}> RESET CAMERA </button>
</div>

<style lang="less">
div.view {
	height: 100%;
	display: grid;
	grid-template-rows: repeat(4, 1fr);
	gap: 10px;
}
div.toggles {
	display: flex;
	flex-direction: column;
	grid-row: 1 / span 3;
}

button.toggle {
	flex: 1;
	display: flex;
	align-items: center;
	justify-content: space-between;
	background: none;
	font-size: 1.25rem;
	&:hover {
		filter: brightness(75%);
	}
}

button.reset-camera {
	width: 100%;
	background: none;
	border: 3px solid rgba(200, 200, 200, 1);
	font-size: 2rem;
	grid-row: 4 / span 1;
	&:hover {
        filter: brightness(75%);
    }
    cursor: pointer;
}

.red {
	color: red;
}

.green {
	color: green;
}
</style>
