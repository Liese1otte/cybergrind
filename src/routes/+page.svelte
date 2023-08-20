<script lang="ts">
import { Canvas } from "@threlte/core";

import InputMenu from "$lib/InputMenu.svelte";
import MainScene from "$lib/MainScene.svelte";
import HeatMap from "$lib/widgets/HeatMap.svelte";

import { base } from "$app/paths";
import { onMount } from "svelte";

import "$styles/globals.css";
import { Environment } from "@threlte/extras";

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
});
</script>

<svelte:head>
	<title>Cybegrind 3D Editor</title>
	<link rel="icon" type="image/x-icon" href="{base}/favicon.png" />
	<meta
		name="description"
		content="Edit your patterns online with a live 3D recreation of the CyberGrind arena!"
	/>
	<meta charset="UTF-8" />
	<meta
		content="https://user-images.githubusercontent.com/94033753/261272440-4870fe7a-eb97-4179-bfff-0f83858aadfe.png"
		property="og:image"
	/>
	<meta name="twitter:card" content="summary_large_image" />
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
				<!-- TODO: color space fix -->
				<Environment path={`${base}/textures/`} files={"skybox.png"} isBackground />
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
	display: flex;
	height: 100%;
}

div.canvas-container {
	flex: 2;
	position: relative;
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
	flex: 1;
	min-width: 560px; // wtf
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

@media (max-aspect-ratio: 1 / 1) {
	div.website {
		flex-direction: column;
		overflow: visible;
	}
	div.canvas-container {
		overflow: visible;
		margin: 20px;
		min-height: calc(100vh - 40px);
	}
	div.menu-container {
		margin: 20px;
		min-width: unset;
	}
}
</style>
