<script lang="ts">
import { T } from '@threlte/core';
import { OrbitControls } from '@threlte/extras'
import Arena from '$lib/models/Arena.svelte';
import { cameraPosition, cameraTarget, enableDamping, rotationAngle } from '$lib/stores';

// ### 

// const { camera } = THRELTE.useThrelte();

// window.onbeforeunload = () => {
//     $cameraPosition = {x: $camera.position.x, y: $camera.position.y, z: $camera.position.z };
//     $cameraTarget = {
//         x: $camera.userData.orbitControls.target.x,
//         y: $camera.userData.orbitControls.target.y,
//         z: $camera.userData.orbitControls.target.z,
//     };
// };
</script>

<T.PerspectiveCamera makeDefault position={$cameraPosition} >
	<OrbitControls enableDamping={$enableDamping} target={$cameraTarget} />
</T.PerspectiveCamera>

<!-- ??? -->
<T.AmbientLight color="white" intensity={0.2} position={[0, 0, 0]}/>

<T.Group rotation={[0, $rotationAngle, 0]}>
	<Arena />
</T.Group>