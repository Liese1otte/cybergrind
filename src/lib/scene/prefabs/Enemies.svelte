<script lang="ts">
import { useTexture, InstancedMeshes } from "@threlte/extras";

import * as THREE from "three";

import { mipMapsEnabled, heightMap } from "$stores";
import { ninetyInRads } from "$utils";
import { base } from "$app/paths";

import { PrefabTypes } from "$userTypes";
import type { EnemyPrefabInstance } from "$userTypes";

// ### Props ### //

export let instances: EnemyPrefabInstance[];

// ### Textures ### //

const meleeTexture = useTexture(`${base}/textures/melee.png`).then((texture) => {
	texture.generateMipmaps = $mipMapsEnabled;
	texture.magFilter = THREE.NearestFilter;
	return texture;
});

const projectileTexture = useTexture(`${base}/textures/projectile.png`).then((texture) => {
	texture.generateMipmaps = $mipMapsEnabled;
	texture.magFilter = THREE.NearestFilter;
	return texture;
});

const hideousTexture = useTexture(`${base}/textures/hideous.png`).then((texture) => {
	texture.generateMipmaps = $mipMapsEnabled;
	texture.magFilter = THREE.NearestFilter;
	return texture;
});

const texturePromises = [meleeTexture, projectileTexture, hideousTexture];

function constructMeshes(textures: THREE.Texture[]): THREE.Mesh[] {
	return textures.map((v): THREE.Mesh => {
		let material = new THREE.MeshStandardMaterial({ map: v });
		material.transparent = true;
		material.side = THREE.DoubleSide;
		let mesh = new THREE.Mesh(new THREE.PlaneGeometry(), material);
		return mesh;
	});
}

// ### Shift consts ### //

const XZOffset = 7.5;
const unitCoefficient = 0.5;
const YOffset = 5.01;
</script>

{#await Promise.all(texturePromises) then textures}
	<InstancedMeshes
		meshes={constructMeshes(textures)}
		let:components={[Melee, Projectile, Hideous]}
		frustumCulled={false}
	>
		{#each instances as enemy}
			{#if enemy.type == PrefabTypes.Melee}
				<Melee
					position={[
						enemy.j - XZOffset,
						$heightMap[enemy.i][enemy.j] * unitCoefficient + YOffset,
						enemy.i - XZOffset
					]}
					rotation.x={ninetyInRads}
					frustumCulled={false}
				/>
			{:else if enemy.type == PrefabTypes.Projectile}
				<Projectile
					position={[
						enemy.j - XZOffset,
						$heightMap[enemy.i][enemy.j] * unitCoefficient + YOffset,
						enemy.i - XZOffset
					]}
					rotation.x={ninetyInRads}
					frustumCulled={false}
				/>
			{:else}
				<Hideous
					position={[
						enemy.j - XZOffset,
						$heightMap[enemy.i][enemy.j] * unitCoefficient + YOffset,
						enemy.i - XZOffset
					]}
					rotation.x={ninetyInRads}
					frustumCulled={false}
				/>
			{/if}
		{/each}
	</InstancedMeshes>
{/await}