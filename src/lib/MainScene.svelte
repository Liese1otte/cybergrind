<script lang="ts">
import { T, useFrame, useThrelte } from '@threlte/core';
import { OrbitControls, useTexture } from '@threlte/extras';
import type { OrbitControls as ThreeOrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { cameraPosition, enableDamping, arenaRotationAngle, cameraTarget } from '$stores';
import * as THREE from 'three';

import Arena from '$src/lib/scene/Arena.svelte';
import Stairs from '$src/lib/scene/Stairs.svelte';
import JumpPads from '$src/lib/scene/JumpPads.svelte';
import Enemies from '$src/lib/scene/Enemies.svelte';
import { base } from '$app/paths';

// ### Skybox setup

const skyboxTexture = useTexture(`${base}/skyboxtest_2.png`);

let skyboxRotationAngle = 0;
const skyboxRotationModifier = 0.00025;

useFrame(() => {
	skyboxRotationAngle += skyboxRotationModifier;
});

// ### Camera persistence

const { camera } = useThrelte();

let controls: ThreeOrbitControls;

window.onbeforeunload = () => {
	if (!controls) {
		throw Error('Orbit controls not initialized at the time of reload');
	}
	$cameraTarget = [controls.target.x, controls.target.y, controls.target.z];
	$cameraPosition = [$camera.position.x, $camera.position.y, $camera.position.z];
};
</script>

<T.PerspectiveCamera makeDefault position={$cameraPosition}>
	<OrbitControls enableDamping={$enableDamping} target={$cameraTarget} bind:ref={controls} />
</T.PerspectiveCamera>

<T.AmbientLight intensity={1} color="white" />

<!-- cock blocked by the camera -->
{#await skyboxTexture then texture}
	<T.Group rotation={[0, skyboxRotationAngle, 0]}>
		<T.Mesh>
			<T.SphereGeometry args={[500, 32, 32]} />
			<T.MeshStandardMaterial map={texture} side={THREE.BackSide} />
		</T.Mesh>
	</T.Group>
{/await}

<T.Group rotation={[0, $arenaRotationAngle, 0]}>
	<Arena />
	<Stairs />
	<JumpPads />
	<Enemies />
</T.Group>
