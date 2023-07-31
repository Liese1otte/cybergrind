<script lang="ts">
import { T, useFrame, useThrelte} from '@threlte/core';
import * as THREE from 'three';
import { OrbitControls, useTexture } from '@threlte/extras';
import Arena from '$lib/models/Arena.svelte';
import { cameraPosition, enableDamping, arenaRotationAngle, cameraTarget } from '$lib/stores';
import type { OrbitControls as threeOrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// ###

const skyboxTexture = useTexture("skyboxtest_2.png");

let skyboxRotationAngle = 0;
const skyboxRotationModifier = 0.00025;

useFrame(() => {
	skyboxRotationAngle += skyboxRotationModifier;
});

window.onbeforeunload = () => {
	if (!controls) {
		console.log("Whoops something is verily fucketh up!!");
		return;
	}
	$cameraTarget = [controls.target.x, controls.target.y, controls.target.z];
	$cameraPosition = [$camera.position.x, $camera.position.y, $camera.position.z];
}

const { camera } = useThrelte();

let controls: threeOrbitControls;
</script>

<T.PerspectiveCamera makeDefault position={$cameraPosition}>
	<OrbitControls enableDamping={$enableDamping} target={$cameraTarget} bind:ref={controls} />
</T.PerspectiveCamera>

<!-- ??? -->
<T.PointLight color="white" intensity={0} position={[0, 0, 0]} />

<T.AmbientLight color="white" />

{#await skyboxTexture then t}
<T.Group rotation={[0, skyboxRotationAngle, 0]}>
	<T.Mesh>
		<T.SphereGeometry args={[500, 32, 32]} />
		<T.MeshPhongMaterial map={t} side={THREE.BackSide} />
	</T.Mesh>	
</T.Group>
{/await}

<T.Group rotation={[0, $arenaRotationAngle, 0]}>
	<Arena />
</T.Group>
