<script lang="ts">
import { T } from '@threlte/core';
import { InstancedMesh, useGltf, Instance } from '@threlte/extras';

import { mipMapsEnabled, heightMap } from '$stores';
import { base } from '$app/paths';

import type { PrefabInstance } from '$userTypes';

// ### Props ### //

export let instances: PrefabInstance[];

// ### Models ### //

const jumpPadGlb = useGltf(`${base}/models/jumpPad.glb`).then((gltf) => {
	gltf.nodes['JumpPad'].material.map.colorSpace = '';
	gltf.nodes['JumpPad'].material.map.generateMipmaps = $mipMapsEnabled;
	return gltf.nodes['JumpPad'];
});

// ### Shift consts ### //

const XZOffset = 7.5;
const unitCoefficient = 0.5;
const YOffset = 5.05;
</script>

{#await jumpPadGlb then jumpPadModel}
	<InstancedMesh frustumCulled={false}>
		<T is={jumpPadModel.geometry} />
		<T is={jumpPadModel.material} />
		{#each instances as pad}
			<Instance
				position={[
					pad.j - XZOffset,
					$heightMap[pad.i][pad.j] * unitCoefficient + YOffset,
					pad.i - XZOffset
				]}
			/>
		{/each}
	</InstancedMesh>
{/await}
