<script lang="ts">
import { InstancedMesh, Instance } from '@threlte/extras';
import { useLoader } from '@threlte/core';
import * as THRELTE from '@threlte/core';
import * as THREE from 'three';
import { T } from '@threlte/core';
import { newHeightMapStore, isRotating, rotationAngle } from '$lib/stores';

// ### Pillar material

const textureFilePath: string = '/virtualgriddark.png';

const verticalTexture = useLoader(THREE.TextureLoader).load(textureFilePath).then(
	(texture) => {
		texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
		texture.repeat.set(1, 10);
		return texture;
	}
);

const horizontalTexture = useLoader(THREE.TextureLoader).load(textureFilePath);

// ### Horizontal coordinates

type Point2D = { x: number; z: number };

function generateHorizontalCoordinates(): Point2D[] {
    let outputArray: Point2D[] = [];
    for (let i = 0; i < 256; i++) {
	    outputArray.push({ x: (i % 16) - 7.5, z: Math.floor(i/ 16) - 7.5 });
    }
	return outputArray;
}

const horizontalCoordinatesMap = generateHorizontalCoordinates();

// ### Rotation

const pillarRotationModifier = 0.0025;

THRELTE.useFrame(() => {
	if ($isRotating) {
		$rotationAngle += pillarRotationModifier;
	}
});
</script>

{#await horizontalTexture then value1}
	{#await verticalTexture then value2}
		<InstancedMesh>
			<T.BoxGeometry args={[1, 10, 1]}/>
			<T.MeshStandardMaterial map={value2} attach={(parent, self) => {
				if (Array.isArray(parent.material)) parent.material = [...parent.material, self]
				else parent.material = [self]
			}} />
			<T.MeshStandardMaterial map={value2} attach={(parent, self) => {
				if (Array.isArray(parent.material)) parent.material = [...parent.material, self]
				else parent.material = [self]
			}} />
			<T.MeshStandardMaterial map={value1} attach={(parent, self) => {
				if (Array.isArray(parent.material)) parent.material = [...parent.material, self]
				else parent.material = [self]
			}} />
			<T.MeshStandardMaterial map={value2} attach={(parent, self) => {
				if (Array.isArray(parent.material)) parent.material = [...parent.material, self]
				else parent.material = [self]
			}} />
			<T.MeshStandardMaterial map={value2} attach={(parent, self) => {
				if (Array.isArray(parent.material)) parent.material = [...parent.material, self]
				else parent.material = [self]
			}} />
			<T.MeshStandardMaterial map={value2} attach={(parent, self) => {
				if (Array.isArray(parent.material)) parent.material = [...parent.material, self]
				else parent.material = [self]
			}} />
			{#each Array(256) as _, i (i)}
				<Instance
					position.x={horizontalCoordinatesMap[i].x}
					position.y={$newHeightMapStore[Math.floor(i / 16)][i % 16] * 0.5}
					position.z={horizontalCoordinatesMap[i].z}
				/>
			{/each}
		</InstancedMesh>
	{/await}
{/await}