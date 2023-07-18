<script lang="ts">
import { Canvas } from '@threlte/core';
import InputMenu from '$lib/InputMenu.svelte';
import PatternPreview from '$lib/PatternPreview.svelte';
</script>

<div class="wrapper">
	<div class="canvas">
		<Canvas>
			<PatternPreview />
		</Canvas>
	</div>
	<div class="menu">
		<InputMenu />
	</div>
</div>

<!-- TODO: background radial gradient shift with menu slide -->
<!-- TODO: hightlight cell when hovered on the corresponding pillar -->

<style>
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
	.menu {
		width: 33.3%;
		height: 100%;
	}
</style>