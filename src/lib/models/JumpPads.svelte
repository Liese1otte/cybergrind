<script lang="ts">
import { T } from "@threlte/core";
import { isGeneratingMipmaps, newHeightMapStore, newPrefabMapStore } from "$lib/stores";
import { InstancedMeshes, useGltf } from "@threlte/extras";

const jumpPadGlb = useGltf("/jumpPad.glb").then((gltf) => {
    Object.keys(gltf.nodes).forEach((k) => {
        if (gltf.nodes[k].type == "Mesh") {
            gltf.nodes[k].material.map.colorSpace = '';
            gltf.nodes[k].material.map.generateMipmaps = $isGeneratingMipmaps;
        }
    })
	return gltf.nodes;
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

$: jumpPadConfig = generateJumpPadConfig($newPrefabMapStore);
</script>

{#await jumpPadGlb then jumpPadModel}
    <InstancedMeshes meshes={jumpPadModel} let:components={{Pad0, Pad1, Pad2, Pad3, Pad4, Pad5, Pad6, Pad7}}>
        {#each jumpPadConfig as jumpPad}
            <T.Group position={[jumpPad.j - 7.5, $newHeightMapStore[jumpPad.i][jumpPad.j] * 0.5 + 5, jumpPad.i - 7.5]}>
                <Pad0 />
                <Pad1 />
                <Pad2 />
                <Pad3 />
                <Pad4 />
                <Pad5 />
                <Pad6 />
                <Pad7 />
            </T.Group>
        {/each}
    </InstancedMeshes>
{/await}