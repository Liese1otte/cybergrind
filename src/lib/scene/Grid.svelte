<script lang="ts">
import { T, useFrame } from "@threlte/core";
import { InstancedMesh, Instance, useTexture, interactivity } from "@threlte/extras";

import * as THREE from "three";

import { ninetyInRads, row, col } from "$utils";
import {
	heightMap,
	isGridRotating,
	gridRotationAngle,
	mipMapsEnabled,
	resolveMap,
	currentMapId,
	showKillZone
} from "$stores";

import { base } from "$app/paths";

// ### Interactivity ### //

interactivity({
	filter: (hits) => {
		return hits.slice(0, 1);
	}
});

// ### Pillars ### //

const pillarPath: string = `${base}/textures/cube.png`;
const killZonePath: string = `${base}/textures/killZone.png`;

const verticalTexture = useTexture(pillarPath).then((texture) => {
	texture = texture.clone();
	texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
	texture.repeat.set(1, 10);
	texture.generateMipmaps = $mipMapsEnabled;
	return texture;
});

const horizontalTexture = useTexture(pillarPath).then((texture) => {
	texture = texture.clone();
	texture.generateMipmaps = $mipMapsEnabled;
	return texture;
});

// ### Kill zone ### //

const killZoneTexture = useTexture(killZonePath).then((texture) => {
	texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
	texture.repeat.set(16, 16);
	texture.generateMipmaps = $mipMapsEnabled;
	texture.magFilter = THREE.NearestFilter;
	return texture;
});

// ### Horizontal coordinates ### //

function horizontalCoords() {
	let outputArray = [];
	for (let i = 0; i < 256; i++) {
		outputArray.push({ x: col(i) - 7.5, z: row(i) - 7.5 });
	}
	return outputArray;
}

const horizontal = horizontalCoords();

// ### Rotation ### //

const gridRotationModifier = -0.0025;

useFrame(() => {
	if ($isGridRotating) {
		$gridRotationAngle += gridRotationModifier;
	}
});

// ### Map ### //

$: currentMap = resolveMap($currentMapId);

// ### Dragging vs Clicking behaviour ### //

const mouse = {
	drag: false,
	down: () => {
		mouse.drag = false;
	},
	move: () => {
		mouse.drag = true;
	},
	up: (button: number, index: number) => {
		if (!mouse.drag && button != 1) {
			currentMap.updateMap(index, button == 0 ? 1 : -1);
		}
	}
};

// ### Shift consts ### //

const unitCoefficient = 0.5;
const killZoneUpperY = 3.1;
const killZoneLowerY = 0.1;
</script>

{#if $showKillZone}
	{#await killZoneTexture then texture}
		<T.Mesh position.y={killZoneUpperY} rotation.x={ninetyInRads}>
			<T.PlaneGeometry args={[16, 16]} />
			<T.MeshStandardMaterial map={texture} side={THREE.BackSide} transparent={true} />
		</T.Mesh>
		<T.Mesh position.y={killZoneLowerY} rotation.x={ninetyInRads}>
			<T.PlaneGeometry args={[16, 16]} />
			<T.MeshStandardMaterial map={texture} side={THREE.FrontSide} transparent={true} />
		</T.Mesh>
	{/await}
{/if}

{#await Promise.all([horizontalTexture, verticalTexture]) then [textureH, textureV]}
	<InstancedMesh>
		<T.BoxGeometry args={[1, 10, 1]} />
		<T.MeshStandardMaterial
			map={textureV}
			attach={(parent, self) => {
				if (Array.isArray(parent.material)) parent.material = [...parent.material, self];
				else parent.material = [self];
			}}
		/>
		<T.MeshStandardMaterial
			map={textureV}
			attach={(parent, self) => {
				if (Array.isArray(parent.material)) parent.material = [...parent.material, self];
				else parent.material = [self];
			}}
		/>
		<T.MeshStandardMaterial
			map={textureH}
			attach={(parent, self) => {
				if (Array.isArray(parent.material)) parent.material = [...parent.material, self];
				else parent.material = [self];
			}}
		/>
		<T.MeshStandardMaterial
			map={textureH}
			attach={(parent, self) => {
				if (Array.isArray(parent.material)) parent.material = [...parent.material, self];
				else parent.material = [self];
			}}
		/>
		<T.MeshStandardMaterial
			map={textureV}
			attach={(parent, self) => {
				if (Array.isArray(parent.material)) parent.material = [...parent.material, self];
				else parent.material = [self];
			}}
		/>
		<T.MeshStandardMaterial
			map={textureV}
			attach={(parent, self) => {
				if (Array.isArray(parent.material)) parent.material = [...parent.material, self];
				else parent.material = [self];
			}}
		/>
		{#each Array(256) as _, i (i)}
			<Instance
				position.x={horizontal[i].x}
				position.y={$heightMap[row(i)][col(i)] * unitCoefficient}
				position.z={horizontal[i].z}
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
