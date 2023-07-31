<script lang="ts">
import { InstancedMesh, Instance, useTexture } from '@threlte/extras';
import * as THRELTE from '@threlte/core';
import * as THREE from 'three';
import { T } from '@threlte/core';
import { newHeightMapStore, isArenaRotating, arenaRotationAngle, isGeneratingMipmaps, highlightedPillar, lastHighlightedPillar } from '$lib/stores';
import { interactivity } from '@threlte/extras'

interactivity({
    filter: (hits) => {
      // Only return the first hit
      return hits.slice(0, 1)
    }
})

// ### Pillar material

const textureFilePathTheFirst: string = '/virtualgriddark.png';
const textureFilePathTheSecond: string = '/virtualgriddark_1.png';

const verticalTexture = useTexture(textureFilePathTheFirst).then((texture) => {
	texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
	texture.repeat.set(1, 10);
	texture.generateMipmaps = $isGeneratingMipmaps;
	return texture;
});

const horizontalTexture = useTexture(textureFilePathTheSecond).then((texture) => {
	texture.generateMipmaps = $isGeneratingMipmaps;
	return texture;
}); // la la la I'm a giggly glaggle

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

const pillarRotationModifier = -0.0025;

THRELTE.useFrame(() => {
	if ($isArenaRotating) {
		$arenaRotationAngle += pillarRotationModifier;
	}
});
</script>

{#await horizontalTexture then value1}
	{#await verticalTexture then value2}
		<InstancedMesh>
			<T.BoxGeometry args={[1, 10, 1]}/>
			<T.MeshBasicMaterial map={value2} attach={(parent, self) => {
				if (Array.isArray(parent.material)) parent.material = [...parent.material, self]
				else parent.material = [self]
			}} />
			<T.MeshBasicMaterial map={value2} attach={(parent, self) => {
				if (Array.isArray(parent.material)) parent.material = [...parent.material, self]
				else parent.material = [self]
			}} />
			<T.MeshBasicMaterial map={value1} attach={(parent, self) => {
				if (Array.isArray(parent.material)) parent.material = [...parent.material, self]
				else parent.material = [self]
			}} />
			<T.MeshBasicMaterial map={value1} attach={(parent, self) => {
				if (Array.isArray(parent.material)) parent.material = [...parent.material, self]
				else parent.material = [self]
			}} />
			<T.MeshBasicMaterial map={value2} attach={(parent, self) => {
				if (Array.isArray(parent.material)) parent.material = [...parent.material, self]
				else parent.material = [self]
			}} />
			<T.MeshBasicMaterial map={value2} attach={(parent, self) => {
				if (Array.isArray(parent.material)) parent.material = [...parent.material, self]
				else parent.material = [self]
			}} />
			{#each Array(256) as _, i (i)}
				<Instance
					position.x={horizontalCoordinatesMap[i].x}
					position.y={$newHeightMapStore[Math.floor(i / 16)][i % 16] * 0.5}
					position.z={horizontalCoordinatesMap[i].z}
					on:pointerleave={(e) => {$lastHighlightedPillar = $highlightedPillar}}
					on:pointerenter={(e) => {$highlightedPillar = e.instanceId}}
					on:click={(e) => {console.log(e);}}
					on:contextmenu={(e) => {}}
				/>
			{/each}
		</InstancedMesh>
	{/await}
{/await}