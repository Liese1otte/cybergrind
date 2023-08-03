<script lang="ts">
import { isGeneratingMipmaps, newHeightMapStore, newPrefabMapStore } from '$lib/stores';
import { T } from '@threlte/core';
import { InstancedMeshes, Instance, useGltf } from '@threlte/extras';

// EVERY TIME A COORDINATE IS REFERENCED AS i OR j IT IS A MAP COORDINATE FOR A CELL
// EVERY TIME A COORDINATE IS REFERENCED AS x OR uy IT IS A RELATIVE COORDINATE TO CURRENT i OR j
// FUCK MY LIFE
function getStairVectorsAt(i: number, j: number): StairVector[] {
	let stairVectors: StairVector[] = [];
	for (let d of fuckingStairs) {
		let relI = i + d.i,
			relJ = j + d.j;
		if (
			!(
				relI < 0 ||
				relI >= $newPrefabMapStore.length ||
				relJ < 0 ||
				relJ >= $newHeightMapStore[0].length
			) &&
			$newHeightMapStore[relI][relJ] - $newHeightMapStore[i][j] < 3 &&
			$newHeightMapStore[relI][relJ] - $newHeightMapStore[i][j] > 0
		) {
			stairVectors.push({
				x: d.j,
				y: d.i * -1,
				elevation: $newHeightMapStore[relI][relJ] - $newHeightMapStore[i][j]
			});
		}
	}
	return stairVectors;
}

const enum StairTypes {
	Straight = 0,
	Angled = 1,
	None = -1
}

const resolveStraightStairDirection = (x:number, y: number) => {
	if (x == 1 && y == 0) { return 0 }
	if (x == 0 && y == 1) { return 1 }
	if (x == -1 && y == 0) { return 2 }
	if (x == 0 && y == -1) { return 3 }
}

const resolveAngledStairDirection = (x: number, y: number) => {
	if (x == 1 && y == 1) { return 0 }
	if (x == -1 && y == 1) { return 1 }
	if (x == -1 && y == -1) { return 2 }
	if (x == 1 && y == -1) { return 3 }
}

function getConfigFromVectors(i: number, j: number, vectors: StairVector[]): StairConfig {
	let outConfig: StairConfig = {i: i, j: j, type: StairTypes.None, elevation: 0, direction: 0};
	if (!vectors.length) {
		return outConfig;
	}
	let sumVector = {x: 0, y: 0};
	for (let v of vectors) {
		sumVector.x += v.x;
		sumVector.y += v.y;
	}
	if (sumVector.x == 0 && sumVector.y == 0) { // (1)
		return outConfig;
	}
	// Edge case with two adjacent pillars with different elevations:
	if (vectors.length == 2 && vectors[0].elevation != vectors[1].elevation) {
		let lowerVector = vectors[0].elevation < vectors[1].elevation ? vectors[0] : vectors[1];
		outConfig.type = StairTypes.Straight;
		outConfig.elevation = lowerVector.elevation;
		outConfig.direction = resolveStraightStairDirection(lowerVector.x, lowerVector.y) as number;
		return outConfig;
	}
	// No other even count of adjacent colors can exist because of (1) so:
	if (vectors.length == 2 && vectors[0].elevation == vectors[1].elevation) {
		outConfig.type = StairTypes.Angled;
		outConfig.elevation = vectors[0].elevation;
		outConfig.direction = resolveAngledStairDirection(sumVector.x, sumVector.y) as number;
		return outConfig;
	}
	outConfig.type = StairTypes.Straight;
	outConfig.elevation = vectors.filter((v) => {return v.x == sumVector.x && v.y == sumVector.y})[0].elevation;
	outConfig.direction = resolveStraightStairDirection(sumVector.x, sumVector.y) as number;
	return outConfig;
}

function updateStairConfigs(heights: number[][], prefabs: number[][]): StairConfig[] {
	let isStair = prefabs.map((r) => {
		return r.map((p) => {
			return p == 4 ? true : false;
		});
	});
	let stairConfigs: StairConfig[] = [];
	for (let i = 0; i < isStair.length; i++) {
		for (let j = 0; j < isStair[i].length; j++) {
			if (isStair[i][j]) {
				stairConfigs.push(getConfigFromVectors(i, j, getStairVectorsAt(i, j)));
			}
		}
	}
	return stairConfigs;
}

const fuckingStairs = [
	{ i: 0, j: 1 },
	{ i: -1, j: 0 },
	{ i: 0, j: -1 },
	{ i: 1, j: 0 }
] as const;

type StairVector = {
	x: number;
	y: number;
	elevation: number;
};

type StairConfig = {
	i: number;
	j: number;
	type: number;
	elevation: number;
	direction: number;
};

let stairsDeployed: StairConfig[];

$: stairsDeployed = updateStairConfigs($newHeightMapStore, $newPrefabMapStore);

const straightStairGlb = useGltf('/straightStair.glb').then((gltf) => {
	gltf.nodes['StraightStair'].material.map.colorSpace = '';
	gltf.nodes['StraightStair'].material.map.generateMipmaps = $isGeneratingMipmaps;
	return gltf;
});

const angleStairGlb = useGltf("/angleStair.glb").then((gltf) => {
	gltf.nodes['AngleStair'].material.map.colorSpace = '';
	gltf.nodes['AngleStair'].material.map.generateMipmaps = $isGeneratingMipmaps;
	return gltf;
});
</script>

{#await straightStairGlb then straightStairModel}
	{#await angleStairGlb then angleStairModel}
		<InstancedMeshes meshes={{...straightStairModel.nodes, ...angleStairModel.nodes}} let:components={{StraightStair, AngleStair}}>
			{#each stairsDeployed as stair}
				{#if stair.type == StairTypes.Straight}
					<StraightStair
						position={[
							stair.j - 7.5,
							$newHeightMapStore[stair.i][stair.j] * 0.5 + 5.5 - (stair.elevation % 2) * 0.25,
							stair.i - 7.5
						]}
						rotation.y={stair.direction * 1.570796}
						scale.y={stair.elevation * 0.5}
					/>
				{:else if stair.type == StairTypes.Angled}
					{console.log("hi")};
					<AngleStair
						position={[
							stair.j - 7.5,
							$newHeightMapStore[stair.i][stair.j] * 0.5 + 5.5 - (stair.elevation % 2) * 0.25,
							stair.i - 7.5
						]}
						rotation.y={stair.direction * 1.570796}
						scale.y={stair.elevation * 0.5}
					/>
				{/if}
			{/each}
		</InstancedMeshes>
	{/await}
{/await}