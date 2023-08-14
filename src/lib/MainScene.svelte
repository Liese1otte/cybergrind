<script lang="ts">
import { T, useFrame, useThrelte } from "@threlte/core";
import { OrbitControls, useTexture } from "@threlte/extras";

import type { OrbitControls as ThreeOrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as THREE from "three";

import Grid from "$lib/scene/Grid.svelte";
import Prefabs from "$lib/scene/Prefabs.svelte";

import { cameraPosition, cameraTarget, enableDamping, gridRotationAngle } from "$stores";

import { base } from "$app/paths";

// ### Skybox setup (needs rework) ### //

const skyboxTexture = useTexture(`${base}/textures/skybox.png`);

let skyboxRotationAngle = 0;
const skyboxRotationModifier = 0.00025;

useFrame(() => {
	skyboxRotationAngle += skyboxRotationModifier;
});

// ### Camera persistence ### //

const { camera } = useThrelte();

let controls: ThreeOrbitControls;

window.onbeforeunload = () => {
	$cameraTarget = controls.target.toArray();
	$cameraPosition = $camera.position.toArray();
};
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

<!-- ! needs rework -->
{#await skyboxTexture then texture}
	<T.Group rotation.y={skyboxRotationAngle}>
		<T.Mesh>
			<T.SphereGeometry args={[500, 32, 32]} />
			<T.MeshStandardMaterial map={texture} side={THREE.BackSide} />
		</T.Mesh>
	</T.Group>
{/await}

<T.Group rotation.y={$gridRotationAngle}>
	<Grid />
	<Prefabs />
</T.Group>
