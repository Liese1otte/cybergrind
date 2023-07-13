<script lang="ts">
import { PerspectiveCamera, DirectionalLight, AmbientLight, Group, InstancedMesh, Instance, OrbitControls } from "@threlte/core";
import * as THRELTE from "@threlte/core";
import * as THREE from "three";

import { heightMap } from "./heightMap";

function range(start: number, stop: number, step: number = 1): number[] {
    let outputArray: number[] = [];
    for (let i = start; i <= stop; i += step) {
        outputArray.push(i);
    }
    return outputArray;
}

function indexToCoordinates(index: number): THREE.Vector2 {
    return new THREE.Vector2(Math.floor(index / 16) - 7.5, (index % 16) - 7.5);
}

const pillarGeometry = new THREE.BoxGeometry(1, 10, 1);

const textureFilePath: string = "/virtualgriddark.png";

const verticalTexture = THRELTE.useTexture(textureFilePath);
verticalTexture.wrapS = verticalTexture.wrapT = THREE.RepeatWrapping;
verticalTexture.repeat.set(1, 10);
const verticalMaterial = new THREE.MeshBasicMaterial({ map: verticalTexture });

const horizontalTexture = THRELTE.useTexture(textureFilePath);
const horizontalMaterial = new THREE.MeshBasicMaterial({ map: horizontalTexture });

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

THRELTE.useFrame(() => { pillarRotation += pillarRotationModifier});

let horizontalPositionMap: THREE.Vector2[] = [];

for (let i = 0; i < 256; i++) {
    horizontalPositionMap.push(indexToCoordinates(i));
}

let localHeightMapCopy: number[] = Array(256).fill(0);
$heightMap = localHeightMapCopy;
</script>

<PerspectiveCamera
    position={{y: 15, z: 20}}
    lookAt={{x: 0, y: 0, z: 0}}
>
    <OrbitControls />
</PerspectiveCamera>

<DirectionalLight />

<AmbientLight
    color="white"
    intensity={0}
/>

<Group rotation={{y: pillarRotation}}>
    <InstancedMesh geometry={pillarGeometry} material={pillarMaterialMap}>
        {#each range(0, 255) as _, index (index)}
            <Instance
                position={{x: horizontalPositionMap[index].x, y: $heightMap[index], z: horizontalPositionMap[index].y}}
            />
        {/each}
    </InstancedMesh>
</Group>
