<script lang="ts">
import { Canvas } from '@threlte/core';

import InputMenu from '$lib/InputMenu.svelte';
import MainScene from '$src/lib/MainScene.svelte';
</script>

<div class="wrapper">
	<div class="canvas">
		<Canvas toneMapping={0} colorSpace={'srgb-linear'}>
			<MainScene />
		</Canvas>
	</div>
	<div class="menu">
		<InputMenu />
	</div>
</div>

<style>
@import '/src/styles/globals.css';
.wrapper {
	width: 100%;
	height: 100%;
	display: flex;
}

.canvas {
	flex: 1;
	background: radial-gradient(#282828, #171717);
	background-attachment: fixed;
}
</style>
