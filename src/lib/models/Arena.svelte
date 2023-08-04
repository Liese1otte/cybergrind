<script lang="ts">
import { InstancedMesh, Instance, useTexture, interactivity } from '@threlte/extras';
import { T, useFrame } from '@threlte/core';
import * as THREE from 'three';
import {
	heightMap,
	isArenaRotating,
	arenaRotationAngle,
	mipMapsEnabled,
	resolveMap,
	currentMapId,
	showKillZone
} from '$stores';
import { base } from '$app/paths';

// ### Interactivity

interactivity({
	filter: (hits) => {
		return hits.slice(0, 1);
	}
});

// ### Pillars

const textureFilePathTheFirst: string = `${base}/cube1.png`;
const textureFilePathTheSecond: string = `${base}/cube2.png`;
const killZoneTextureFilePath: string = `${base}/killZone.png`;

const verticalTexture = useTexture(textureFilePathTheFirst).then((texture) => {
	texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
	texture.repeat.set(1, 10);
	texture.generateMipmaps = $mipMapsEnabled;
	return texture;
});

const horizontalTexture = useTexture(textureFilePathTheSecond).then((texture) => {
	texture.generateMipmaps = $mipMapsEnabled;
	return texture;
});

const unitCoefficient = 0.5;

const row = (i: number) => { return Math.floor(i / 16); };
const col = (i: number) => { return i % 16; };

// ### Kill zone texture

const killZoneTexture = useTexture(killZoneTextureFilePath).then((texture) => {
	texture.generateMipmaps = $mipMapsEnabled;
	texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
	texture.repeat.set(16, 16);
	return texture;
});

// ### Horizontal coordinates

function generateHorizontalCoordinates(): { x: number; z: number }[] {
	let outputArray = [];
	for (let i = 0; i < 256; i++) {
		outputArray.push({ x: (i % 16) - 7.5, z: Math.floor(i / 16) - 7.5 });
	}
	return outputArray;
}


const XZCoordinates = generateHorizontalCoordinates();

// ### Rotation

const pillarRotationModifier = -0.0025;

useFrame(() => {
	if ($isArenaRotating) {
		$arenaRotationAngle += pillarRotationModifier;
	}
});

// ### Map

$: currentMap = resolveMap($currentMapId);

// ### Dragging vs Clicking behaviour

const mouse = {
	drag: false,
	down: () => {
		mouse.drag = false;
	},
	move: () => {
		mouse.drag = true;
	},
	up: (button: number, index: number) => {
		if (!mouse.drag) {
			currentMap.updateMap(index, button == 0 ? 1 : -1);
		}
	}
};
</script>

{#if $showKillZone}
	{#await killZoneTexture then texture}
		<T.Mesh position={[0, 3.1, 0]} rotation={[1.570796, 0, 0]}>
			<T.PlaneGeometry args={[16, 16]} />
			<T.MeshBasicMaterial map={texture} side={THREE.BackSide} transparent={true} />
		</T.Mesh>
		<T.Mesh position={[0, 0.1, 0]} rotation={[1.570796, 0, 0]}>
			<T.PlaneGeometry args={[16, 16]} />
			<T.MeshBasicMaterial map={texture} side={THREE.FrontSide} transparent={true} />
		</T.Mesh>
	{/await}
{/if}

{#await Promise.all([horizontalTexture, verticalTexture]) then [textureH, textureV]}
	<InstancedMesh>
		<T.BoxGeometry args={[1, 10, 1]} />
		<T.MeshBasicMaterial
			map={textureV}
			attach={(parent, self) => {
				if (Array.isArray(parent.material))
					parent.material = [...parent.material, self];
				else parent.material = [self];
			}}
		/>
		<T.MeshBasicMaterial
			map={textureV}
			attach={(parent, self) => {
				if (Array.isArray(parent.material))
					parent.material = [...parent.material, self];
				else parent.material = [self];
			}}
		/>
		<T.MeshBasicMaterial
			map={textureH}
			attach={(parent, self) => {
				if (Array.isArray(parent.material))
					parent.material = [...parent.material, self];
				else parent.material = [self];
			}}
		/>
		<T.MeshBasicMaterial
			map={textureH}
			attach={(parent, self) => {
				if (Array.isArray(parent.material))
					parent.material = [...parent.material, self];
				else parent.material = [self];
			}}
		/>
		<T.MeshBasicMaterial
			map={textureV}
			attach={(parent, self) => {
				if (Array.isArray(parent.material))
					parent.material = [...parent.material, self];
				else parent.material = [self];
			}}
		/>
		<T.MeshBasicMaterial
			map={textureV}
			attach={(parent, self) => {
				if (Array.isArray(parent.material))
					parent.material = [...parent.material, self];
				else parent.material = [self];
			}}
		/>
		{#each Array(256) as _, i (i)}
			<Instance
				position.x={XZCoordinates[i].x}
				position.y={$heightMap[row(i)][col(i)] * unitCoefficient}
				position.z={XZCoordinates[i].z}
				on:pointermove={() => {
					mouse.move();
				}}
				on:pointerup={(e) => {
					mouse.up(e.nativeEvent.button, i);
				}}
				on:pointerdown={() => {
					mouse.down();
				}}
			/>
		{/each}
	</InstancedMesh>
{/await}
