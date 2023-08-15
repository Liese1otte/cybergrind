<script lang="ts">
import { Canvas } from "@threlte/core";

import InputMenu from "$lib/InputMenu.svelte";
import MainScene from "$lib/MainScene.svelte";
import HeatMap from "$lib/widgets/HeatMap.svelte";

import { base } from "$app/paths";
</script>

<svelte:head>
	<title>Cybegrind 3D Editor</title>
	<link rel="icon" type="image/x-icon" href="{base}/favicon.png" />
	<link rel="stylesheet" type="text/css" href="src/styles/globals.css" />
</svelte:head>

<!-- mirroring fourth then switching maps then mirroring fourth again doesn't work lol -->
<div class="website">
	<div class="canvas-container">
		<div class="widgets">
			<HeatMap />
		</div>
		<div class="canvas">
			<Canvas toneMapping={0} colorSpace={"srgb-linear"}>
				<MainScene />
			</Canvas>
		</div>
	</div>
	<div class="menu-container">
		<InputMenu />
	</div>
</div>

<style lang="less">
div.website {
	display: grid;
	grid-template-rows: 1fr;
	grid-template-columns: 1fr 1fr 1fr;
	height: 100%;
}

div.canvas-container {
	position: relative;
	grid-column: 1 / span 2;
	margin: 20px 10px 20px 20px;
	border: 3px solid rgba(200, 200, 200, 1);
	& > * {
		position: absolute;
	}
}

div.canvas {
	width: 100%;
	height: 100%;
}

div.menu-container {
	min-width: 560px; // wtf
	grid-column: 3 / span 1;
	margin: 20px 20px 20px 10px;
}

div.widgets {
	width: 100%;
	height: 100%;
	z-index: 1;
	margin: 20px;
	pointer-events: none;
}
</style>
