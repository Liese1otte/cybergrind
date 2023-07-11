<script lang="ts">
import { PerspectiveCamera, DirectionalLight, AmbientLight, Mesh, useFrame, Group } from "@threlte/core";
import { useTexture } from "@threlte/core";
import { MeshBasicMaterial } from "three";
import { BoxGeometry, RepeatWrapping } from "three";

function range(start: number, stop: number, step: number = 1): Array<number> {
    let returnArray = [];
    for (let i = start; i <= stop; i += step) {
        returnArray.push(i);
    }
    return returnArray;
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
const pillarRotationModifier = 0.0025

useFrame(() => { pillarRotation += pillarRotationModifier});

console.log(document.getElementById("mesh"));
</script>

<PerspectiveCamera
    position={{y: 25, z: 30}}
    lookAt={{x: 0, y: 0, z: 0}}
></PerspectiveCamera>

<DirectionalLight />

<AmbientLight
    color="white"
    intensity={0}
/>

<Group rotation={{y: pillarRotation}}>
    {#each range(-8.5, 8.5) as xPosition, index (index)}
        {#each range(-8.5, 8.5) as zPosition, index (index)}
            <Mesh
            geometry={pillarGeometry}
            material={pillarMaterialMap}
            position={{x: xPosition, y: 0, z: zPosition}}
            />
        {/each}
    {/each}
</Group>
