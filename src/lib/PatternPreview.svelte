<script lang="ts">
import {
	PerspectiveCamera,
	DirectionalLight,
	AmbientLight,
	Group,
	OrbitControls
} from '@threlte/core';
import * as THRELTE from "@threlte/core";
import Arena from '$lib/models/Arena.svelte';
import { cameraPosition, cameraTarget, enableDamping, rotationAngle } from '$lib/stores';

// ### 

const { camera } = THRELTE.useThrelte();

window.onbeforeunload = () => {
    $cameraPosition = {x: $camera.position.x, y: $camera.position.y, z: $camera.position.z };
    $cameraTarget = {
        x: $camera.userData.orbitControls.target.x,
        y: $camera.userData.orbitControls.target.y,
        z: $camera.userData.orbitControls.target.z,
    };
};
</script>

<PerspectiveCamera position={$cameraPosition}>
	<OrbitControls enableDamping={$enableDamping} target={$cameraTarget} />
</PerspectiveCamera>

<!-- ??? -->
<DirectionalLight />

<!-- ??? -->
<AmbientLight color="white" intensity={0} />

<Group rotation={{ y: $rotationAngle }}>
	<Arena />
</Group>
