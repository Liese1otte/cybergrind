<script lang="ts">
import { PerspectiveCamera, DirectionalLight, AmbientLight, useFrame, Group, Instance, InstancedMesh } from "@threlte/core";
import { useTexture } from "@threlte/core";
import { MeshBasicMaterial } from "three";
import { BoxGeometry, RepeatWrapping } from "three";
import { positionMapStore } from "./positionMapStore";

//

function range(start: number, stop: number, step: number = 1): Array<number> {
    let returnArray = [];
    for (let i = start; i <= stop; i += step) {
        returnArray.push(i);
    }
    return returnArray;
}

function getCoordsFromIndex(index: number): {x: number, y: number, z: number} {
    return {x: Math.floor(index / 16) - 7.5, y: 0, z: (index % 16) - 7.5};
}

const pillarGeometry = new BoxGeometry(1, 10, 1);

const textureFilePath = "/virtualgriddark.png";

const verticalTexture = useTexture(textureFilePath);
verticalTexture.wrapS = verticalTexture.wrapT = RepeatWrapping;
verticalTexture.repeat.set(1, 10);
const verticalMaterial = new MeshBasicMaterial({ map: verticalTexture });

const horizontalTexture = useTexture(textureFilePath);
const horizontalMaterial = new MeshBasicMaterial({ map: horizontalTexture });

const pillarMaterialMap = [
    verticalMaterial,
    verticalMaterial,
    horizontalMaterial,
    horizontalMaterial,
    verticalMaterial,
    verticalMaterial
];

var pillarRotation = 0;
const pillarRotationModifier = 0.0025;

useFrame(() => { pillarRotation += pillarRotationModifier});

//

let positionMap: {x: number, y: number, z: number}[] = [];

let positions: number[] = Array(256).fill(0);

for (let i = 0; i < 256; i++) {
    positionMap.push(getCoordsFromIndex(i));
}

positionMapStore.set(positions);
</script>

<PerspectiveCamera
    position={{y: 15, z: 25}}
    lookAt={{x: 0, y: 0, z: 0}}
></PerspectiveCamera>

<DirectionalLight />

<AmbientLight
    color="white"
    intensity={0}
/>

<Group rotation={{y: pillarRotation}}>
    <InstancedMesh geometry={pillarGeometry} material={pillarMaterialMap}>
        {#each range(0, 255) as _, index (index)}
            <Instance
                position={{x: positionMap[index].x, y: $positionMapStore[index], z: positionMap[index].z}}
            />
        {/each}
    </InstancedMesh>
</Group>
