<script lang="ts">
import { T, useFrame, useThrelte} from '@threlte/core';
import * as THREE from 'three';
import { OrbitControls, useTexture } from '@threlte/extras';
import Arena from '$lib/models/Arena.svelte';
import Stairs from './models/Stairs.svelte';
import { cameraPosition, enableDamping, arenaRotationAngle, cameraTarget } from '$stores';
import type { OrbitControls as ThreeOrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import JumpPads from './models/JumpPads.svelte';
import Prefabs from './models/Prefabs.svelte';

// ###

const skyboxTexture = useTexture('skyboxtest_2.png');

let skyboxRotationAngle = 0;
const skyboxRotationModifier = 0.00025;

useFrame(() => {
	skyboxRotationAngle += skyboxRotationModifier;
});

const { camera } = useThrelte();

let controls: ThreeOrbitControls;

window.onbeforeunload = () => {
	if (!controls) {
		throw Error('Whoops something is verily fucketh up!!');
	}
	$cameraTarget = [controls.target.x, controls.target.y, controls.target.z];
	$cameraPosition = [$camera.position.x, $camera.position.y, $camera.position.z];
};
</script>

<T.PerspectiveCamera makeDefault position={$cameraPosition} near={0.1}>
	<OrbitControls enableDamping={$enableDamping} target={$cameraTarget} bind:ref={controls} />
</T.PerspectiveCamera>

<!-- cock blocked by the camera -->
{#await skyboxTexture then texture}
	<T.Group rotation={[0, skyboxRotationAngle, 0]}>
		<T.Mesh>
			<T.SphereGeometry args={[500, 32, 32]} />
			<T.MeshBasicMaterial map={texture} side={THREE.BackSide} />
		</T.Mesh>
	</T.Group>
{/await}

<T.Group rotation={[0, $arenaRotationAngle, 0]}>
	<Arena />
	<Stairs />
	<JumpPads />
	<Prefabs />
</T.Group>
