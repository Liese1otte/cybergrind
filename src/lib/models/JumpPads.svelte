<script lang="ts">
import { T } from "@threlte/core";
import { mipMapsEnabled, heightMap, prefabMap } from "$stores";
import { InstancedMesh, useGltf, Instance } from "@threlte/extras";
import { base } from "$app/paths";

const jumpPadGlb = useGltf(`${base}/jumpPad.glb`).then((gltf) => {
    gltf.nodes["JumpPad"].material.map.colorSpace = '';
    gltf.nodes["JumpPad"].material.map.generateMipmaps = $mipMapsEnabled;
	return gltf.nodes["JumpPad"];
});

function generateJumpPadConfig(prefabs: number[][]): {i: number, j: number}[] {
    let outArray: {i: number, j: number}[] = [];
    for (let i = 0; i < prefabs.length; i++) {
        for (let j = 0; j < prefabs[i].length; j++) {
            if (prefabs[i][j] == 3) {
                outArray.push({i: i, j: j});
            }
        }
    }
    return outArray;
}

let jumpPadConfig: {i: number, j: number}[];

$: jumpPadConfig = generateJumpPadConfig($prefabMap);

</script>

{#await jumpPadGlb then jumpPadModel}
    <InstancedMesh>
        <T is={jumpPadModel.geometry} />
        <T is={jumpPadModel.material} />
        {#each jumpPadConfig as jumpPad}
            <Instance position={[jumpPad.j - 7.5, $heightMap[jumpPad.i][jumpPad.j] * 0.5 + 5.05, jumpPad.i - 7.5]} />
        {/each}
    </InstancedMesh>
{/await}