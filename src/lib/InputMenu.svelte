<script lang="ts">
import InputMatrix from "$lib/interface/InputMatrix.svelte";
import InputControls from "$lib/interface/InputControls.svelte";

import { currentMapId, MapType } from "$stores";
</script>

<!-- refactoring when redoing ui -->

<div class="background">
	<div class="map-selection">
		<button class="height" on:click={() => { $currentMapId = MapType.Height; }}>HEIGHTS</button>
		<button class="prefab" on:click={() => { $currentMapId = MapType.Prefab; }}>PREFABS</button>
	</div>
	<div class="matrix">
		<InputMatrix />
	</div>
	<div class="controls">
		<InputControls />
	</div>
</div>

<style lang="less">
div.background {
	display: flex;
	flex-direction: column;
	width: 100%;
	height: 100%;
	background: rgba(20, 20, 20, 1);
}

div.map-selection {
	display: flex;
	margin-bottom: 10px;
	& > * {
		flex: 1;
		background: none;
		border: 3px solid rgba(200, 200, 200, 1);
		font-size: 2rem;
	}
	& :nth-child(1) {
		margin-inline-end: 10px;
	}
}

div.matrix {
	margin-block-end: 10px;
}
div.controls {
	flex: 1;
}
</style>
