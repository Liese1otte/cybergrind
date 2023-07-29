<script lang="ts">
import { InstancedMesh, Instance } from '@threlte/core';
import * as THRELTE from '@threlte/core';
import * as THREE from 'three';
import { newHeightMapStore, isRotating, rotationAngle } from '$lib/stores';

// ### Pillar material

const pillarGeometry = new THREE.BoxGeometry(1, 10, 1);

const textureFilePath: string = '/virtualgriddark.png';

const verticalTexture = THRELTE.useTexture(textureFilePath);
// verticalTexture.generateMipmaps = false;
verticalTexture.wrapS = verticalTexture.wrapT = THREE.RepeatWrapping;
verticalTexture.repeat.set(1, 10);
const verticalMaterial = new THREE.MeshBasicMaterial({ map: verticalTexture });

const horizontalTexture = THRELTE.useTexture(textureFilePath);
// horizontalTexture.generateMipmaps = false;
const horizontalMaterial = new THREE.MeshBasicMaterial({ map: horizontalTexture });

const pillarMaterialMap = [
	verticalMaterial,
	verticalMaterial,
	horizontalMaterial,
	horizontalMaterial,
	verticalMaterial,
	verticalMaterial
];

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

<InstancedMesh geometry={pillarGeometry} material={pillarMaterialMap}>
	{#each Array(256) as _, i (i)}
		<Instance
			position={{
				x: horizontalCoordinatesMap[i].x,
				y: $newHeightMapStore[Math.floor(i / 16)][i % 16] * 0.5,
				z: horizontalCoordinatesMap[i].z
			}}
		/>
	{/each}
</InstancedMesh>
