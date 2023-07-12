<script lang="ts">
    import { Canvas } from '@threlte/core';
    import MainScene from '../lib/MainScene.svelte';
	import InputMenu from '$lib/InputMenu.svelte';
</script>

<div class="wrapper">
	<div class="canvas">
		<Canvas>
			<MainScene />
		</Canvas>
	</div>
	<div class="menu">
		<InputMenu />
	</div>
</div>

<!-- <div>
	<Canvas>
		<T.PerspectiveCamera makeDefault position={[10, 10, 10]} fov={24}>
			<OrbitControls maxPolarAngle={degToRad(80)} enableZoom={false} target={{ y: 0.5 }} />
		</T.PerspectiveCamera>

		<T.DirectionalLight castShadow position={[3, 10, 10]} />
		<T.DirectionalLight position={[-3, 10, -10]} intensity={0.2} />
		<T.AmbientLight intensity={0.2} />

		<T.Group scale={$scale}>
			<T.Mesh position.y={0.5} castShadow let:ref>
				<InteractiveObject
					object={ref}
					interactive
					on:pointerenter={() => ($scale = 2)}
					on:pointerleave={() => ($scale = 1)}
				/>

				<T.BoxGeometry />
				<T.MeshStandardMaterial color="#333333" />
			</T.Mesh>
		</T.Group>

		<T.Mesh receiveShadow rotation.x={degToRad(-90)}>
			<T.CircleGeometry args={[3, 72]} />
			<T.MeshStandardMaterial color="white" />
		</T.Mesh>
	</Canvas>
</div> -->

<style>
	.wrapper {
		width: 100%;
		height: 100%;
		background: radial-gradient(#282828, #171717);
		background-attachment: fixed;
		display: flex;
	}
    .canvas {
        flex: 1;
    }
	.menu {
		width: 33.3%;
		height: 100%;
	}
</style>