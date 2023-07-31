<script lang="ts">
import { InstancedMesh, Instance, useTexture, type DomEvent } from '@threlte/extras';
import * as THRELTE from '@threlte/core';
import * as THREE from 'three';
import { T } from '@threlte/core';
import { newHeightMapStore, isArenaRotating, arenaRotationAngle, isGeneratingMipmaps, highlightedPillar, lastHighlightedPillar, newPrefabMapStore, resolveStore, currentStoreIndex } from '$lib/stores';
import { interactivity } from '@threlte/extras'

type Event = THREE.Intersection & {
  intersections: THREE.Intersection[] // The first intersection of each intersected object
  object: THREE.Object3D // The object that was actually hit
  eventObject: THREE.Object3D // The object that registered the event
  camera: THREE.Camera // The camera used for raycasting
  delta: THREE.Vector2 //  Distance between mouse down and mouse up event in pixels
  nativeEvent: MouseEvent | PointerEvent | WheelEvent // The native browser event
  pointer: THREE.Vector2 // The pointer position in normalized device coordinates
  ray: THREE.Ray // The ray used for raycasting
  stopPropagation: () => void // Function to stop propagation of the event
  stopped: Boolean // Whether the event propagation has been stopped
}

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

$: currentMapStore = resolveStore($currentStoreIndex);

let drag = false;

document.addEventListener('mousedown', () => drag = false);
document.addEventListener('mousemove', () => drag = true);
document.addEventListener('mouseup', () => {if (!drag) {}});

const dragWizard = {
	drag: false,
	onDown: () => {
		drag = false;
	},
	onMove: () => {
		drag = true;
	},
	onUp: (e: Event) => {
		if (!drag) {
			return {click: true, increment: 1 * ((e.nativeEvent.button == 0) ? 1 : -1)};
		} else {
			return {click: false, increment: 69420};
		}
	}
}
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
					on:pointerleave={() => {$lastHighlightedPillar = $highlightedPillar}}
					on:pointerenter={(e) => {$highlightedPillar = e.instanceId}}
					on:pointermove={() => {dragWizard.onMove();}}
					on:pointerup={(e) => {let {click, increment} = dragWizard.onUp(e); if (click) currentMapStore.updateMap(i, increment); }}
					on:pointerdown={() => {dragWizard.onDown();}}
				/>
			{/each}
		</InstancedMesh>
	{/await}
{/await}