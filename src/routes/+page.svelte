<script lang="ts">
import { Canvas } from "@threlte/core";

import InputMenu from "$lib/InputMenu.svelte";
import MainScene from "$lib/MainScene.svelte";
import HeatMap from "$lib/widgets/HeatMap.svelte";

import { base } from "$app/paths";
import { onMount } from "svelte";

function previewOnlineStatus(): boolean {
	try {
		let canvas = document.createElement("canvas");
		let context =
			(!!window.WebGLRenderingContext && canvas.getContext("webgl")) ||
			canvas.getContext("experimental-webgl");
		return context == null ? false : true;
	} catch (e) {
		return false;
	}
}

let mounted = false;

onMount(() => {
	mounted = true;
})
</script>

<svelte:head>
	<title>Cybegrind 3D Editor</title>
	<link rel="icon" type="image/x-icon" href="{base}/favicon.png" />
	<link rel="stylesheet" type="text/css" href="src/styles/globals.css" />
</svelte:head>

{#if !mounted}
	<div class="loading" />
{/if}
<div class="website">
	<div class="canvas-container">
		<div class="widgets">
			<HeatMap />
		</div>
		<div class="thing">
			<span class="thingy">// PREVIEW: {previewOnlineStatus() ? "ONLINE" : "OFFLINE"}</span>
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
	overflow: hidden;
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

div.thing {
	z-index: 1;
	margin: 20px;
	bottom: 0;
	opacity: 25%;
	font-size: 1.5rem;
}

div.widgets {
	width: 100%;
	height: 100%;
	z-index: 1;
	margin: 20px;
	pointer-events: none;
}

.loading {
	width: 100%;
	height: 100%;
	background: rgba(20, 20, 20, 1);
}
</style>
