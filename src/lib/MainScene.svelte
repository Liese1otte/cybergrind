<script lang="ts">
import { T, useFrame, useThrelte } from "@threlte/core";
import { OrbitControls, useTexture } from "@threlte/extras";

import type { OrbitControls as ThreeOrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as THREE from "three";

import Grid from "$lib/scene/Grid.svelte";
import Prefabs from "$lib/scene/Prefabs.svelte";

import { cameraPosition, cameraTarget, enableDamping, gridRotationAngle, resetCamera } from "$stores";

// ### Camera persistence ### //

const { camera} = useThrelte();

let controls: ThreeOrbitControls;

window.onbeforeunload = () => {
	$cameraTarget = controls.target.toArray();
	$cameraPosition = $camera.position.toArray();
};

// ### Hotkeys ### //

function onKeyDown(e: KeyboardEvent): void {
	if (e.target instanceof HTMLInputElement) { return }
	if (e.code == "KeyR") {
		resetCamera();
	}
}
</script>

<T.PerspectiveCamera makeDefault position={$cameraPosition}>
	<!-- using damping factor as a hack to force controls updates until I figure out a better solution -->
	<OrbitControls
		bind:ref={controls}
		target={$cameraTarget}
		enableDamping
		dampingFactor={$enableDamping ? 0.05 : 1}
	/>
</T.PerspectiveCamera>

<T.AmbientLight intensity={1} color="white" />

<T.Group rotation.y={$gridRotationAngle}>
	<Grid />
	<Prefabs />
</T.Group>

<svelte:window on:keydown={onKeyDown} />
