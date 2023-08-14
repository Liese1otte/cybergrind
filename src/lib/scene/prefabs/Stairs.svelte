<script lang="ts">
import { base } from "$app/paths";
import { mipMapsEnabled, heightMap } from "$stores";
import { InstancedMeshes, useGltf } from "@threlte/extras";
import { ninetyInRads } from "$utils";

import type { PrefabInstance } from "$userTypes";

// ### Props ### //

export let instances: PrefabInstance[];

// ### Models ### //

const straightStairGlb = useGltf(`${base}/models/straightStair.glb`).then((gltf) => {
	gltf.nodes["StraightStair"].material.map.colorSpace = "";
	gltf.nodes["StraightStair"].material.map.generateMipmaps = $mipMapsEnabled;
	return gltf;
});

const angleStairGlb = useGltf(`${base}/models/angleStair.glb`).then((gltf) => {
	gltf.nodes["AngleStair"].material.map.colorSpace = "";
	gltf.nodes["AngleStair"].material.map.generateMipmaps = $mipMapsEnabled;
	return gltf;
});

// ### Stair configuration ### //

/**
 * ? This is mostly for myself:
 * ? 1. In this algorithm, any "i" and "j" are actual indices of a 2D array element. Any "x" and "y"
 * ?    are index offsets relative to some "i" and "j" index.
 * ? 2. Due to the fact that increase in "i" index actually looks like decrease in "y" if a matrix
 * ?    is viewed from above, this algorithm assumes inverted y-axis when talking about "positive" or
 * ?    "negative". In other words, origin of a matrix is located in the top left corner and
 * ?    increments towards right and down directions.
 */

const enum Direction {
	PosX,
	PosY,
	NegX,
	NegY
}

const enum Type {
	Straight,
	Angled
}

type Offset = { x: 1 | -1; y: 0 } | { x: 0; y: -1 | 1 };

const adjacentOffsets: Offset[] = [
	{ x: 1, y: 0 },
	{ x: 0, y: 1 },
	{ x: -1, y: 0 },
	{ x: 0, y: -1 }
];

const elevations = <const>[0, 0.5, 1];
type Elevation = (typeof elevations)[number];

type Stair = PrefabInstance & {
	type: Type;
	direction: Direction;
	elevation: Elevation;
	yOffset: 0.25 | 0; // Used to draw a stair at the a correct height.
};

const outOfBounds = (i: number, j: number, offset: Offset): boolean => {
	return i + offset.y < 0 || i + offset.y > 15 || j + offset.x < 0 || j + offset.x > 15;
};

const isValidElevation = (delta: number): delta is Elevation => {
	return elevations.indexOf(delta as Elevation) != -1 ? true : false;
};

// A quick way to find what direction an angled stair should be is to get the first non-zero
// element in the vector. This runs into an edge case where the array looks like [X, 0, 0, X],
// then the direction is actually the last non-zero element. Convoluted, i know, but works.
const angledStairDirection = (v: Elevation[]): Direction => {
	return v[3] && v[0]
		? Direction.NegY
		: v.findIndex((v) => {
				return v != 0;
		  });
};

function stairAt(i: number, j: number): Stair | undefined {
	let elevationVector: Elevation[] = [];
	let baseHeight = $heightMap[i][j];
	let elevationDelta: number;
	// Iterate over adjacent cells, grab their elevations relative to base cell.
	for (let offset of adjacentOffsets) {
		if (outOfBounds(i, j, offset)) {
			elevationVector.push(0);
			continue;
		}
		elevationDelta = ($heightMap[i + offset.y][j + offset.x] - baseHeight) / 2;
		elevationVector.push(isValidElevation(elevationDelta) ? elevationDelta : 0);
	}
	// Nullify opposing cells if both are elevated, leaving only those that matter.
	if (elevationVector[0] && elevationVector[2]) {
		elevationVector[0] = elevationVector[2] = 0;
	}
	if (elevationVector[1] && elevationVector[3]) {
		elevationVector[1] = elevationVector[3] = 0;
	}
	let type: Type;
	let direction: Direction;
	let elevation: Elevation;
	let relevantElevations = elevationVector.filter((v) => {
		return v != 0;
	});
	// Decide what stair to render and how.
	if (relevantElevations.length == 0) {
		// no relevant cells, no stair
		return;
	} else if (relevantElevations.length == 1) {
		// One relevant cell, type is straight, grab its elevation and its direction,
		// the latter encoded in the elevation vector as index of the relevant cell.
		type = Type.Straight;
		elevation = relevantElevations[0];
		direction = elevationVector.indexOf(elevation);
	} else if (relevantElevations.length == 2 && relevantElevations[0] != relevantElevations[1]) {
		// This is an edge case of two relevant cells with different elevations, in this case
		// we choose to draw a straight stair towards the cell with a lower elevation.
		type = Type.Straight;
		elevation = Math.min(...relevantElevations) as Elevation;
		direction = elevationVector.indexOf(elevation);
	} else {
		// Two relevant cells with same elevations, type is angled, elevation is either of two,
		// direction is encoded such as PosX is a stair facing PosX + PosY.
		type = Type.Angled;
		direction = angledStairDirection(elevationVector);
		elevation = elevationVector[direction];
	}
	// no other cases are possible due to us nullifying opposing cells
	let yOffset = elevation == 0.5 ? 0.25 : 0;
	return {
		i: i,
		j: j,
		type: type,
		direction: direction,
		elevation: elevation,
		yOffset: yOffset as 0.25 | 0
	};
}

function updateStairInstances(instances: PrefabInstance[], heights?: number[][]): Stair[] {
	let stairs: Stair[] = [];
	for (let instance of instances) {
		let stair = stairAt(instance.i, instance.j);
		if (stair != undefined) {
			stairs.push(stair);
		}
	}
	return stairs;
}

let stairs: Stair[];

// Height map is provided purely for reactivity.
$: stairs = updateStairInstances(instances, $heightMap);

// ### Shift consts ### //

const XZOffset = 7.5;
const unitCoefficient = 0.5;
const YOffset = 5.5;
</script>

{#await Promise.all([angleStairGlb, straightStairGlb]) then [angleStairModel, straightStairModel]}
	<InstancedMeshes
		meshes={{ ...straightStairModel.nodes, ...angleStairModel.nodes }}
		let:components={{ StraightStair, AngleStair }}
		frustumCulled={false}
	>
		{#each stairs as stair}
			{#if stair.type == Type.Straight}
				<StraightStair
					position={[
						stair.j - XZOffset,
						$heightMap[stair.i][stair.j] * unitCoefficient + YOffset - stair.yOffset,
						stair.i - XZOffset
					]}
					rotation.y={stair.direction * ninetyInRads * -1}
					scale.y={stair.elevation}
				/>
			{:else}
				<AngleStair
					position={[
						stair.j - XZOffset,
						$heightMap[stair.i][stair.j] * unitCoefficient + YOffset - stair.yOffset,
						stair.i - XZOffset
					]}
					rotation.y={stair.direction * ninetyInRads * -1}
					scale.y={stair.elevation}
				/>
			{/if}
		{/each}
	</InstancedMeshes>
{/await}
