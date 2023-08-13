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

const meleeTexture = useTexture(`${base}/melee.png`).then((texture) => {
	texture.generateMipmaps = $mipMapsEnabled;
	texture.magFilter = THREE.NearestFilter;
	return texture;
});

const projectileTexture = useTexture(`${base}/projectile.png`).then((texture) => {
	texture.generateMipmaps = $mipMapsEnabled;
	texture.magFilter = THREE.NearestFilter;
	return texture;
});

const hideousTexture = useTexture(`${base}/hideous.png`).then((texture) => {
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
		return new THREE.Mesh(new THREE.PlaneGeometry(), material);
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
		on:create={({ ref }) => { ref.computeBoundingSphere(); }}
		on:change={({ ref }) => { ref.computeBoundingSphere(); }}
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
				/>
			{:else if enemy.type == PrefabTypes.Projectile}
				<Projectile
					position={[
						enemy.j - XZOffset,
						$heightMap[enemy.i][enemy.j] * unitCoefficient + YOffset,
						enemy.i - XZOffset
					]}
					rotation.x={ninetyInRads}
				/>
			{:else}
				<Hideous
					position={[
						enemy.j - XZOffset,
						$heightMap[enemy.i][enemy.j] * unitCoefficient + YOffset,
						enemy.i - XZOffset
					]}
					rotation.x={ninetyInRads}
				/>
			{/if}
		{/each}
	</InstancedMeshes>
{/await}
<!-- {#await meleeTexture then texture}
	<InstancedMesh>
		<T.PlaneGeometry />
		<T.MeshStandardMaterial map={texture} transparent={true} side={THREE.DoubleSide} />
		{#each enemyPrefabConfig as enemyPrefab}
			{#if enemyPrefab.type == 1}
				<Instance
					position={[
						enemyPrefab.j - 7.5,
						$heightMap[enemyPrefab.i][enemyPrefab.j] * 0.5 + 5.01,
						enemyPrefab.i - 7.5
					]}
					rotation.x={ninetyInRads}
				/>
			{/if}
		{/each}
	</InstancedMesh>
{/await}
{#await projectileTexture then texture}
	<InstancedMesh>
		<T.PlaneGeometry />
		<T.MeshStandardMaterial map={texture} transparent={true} side={THREE.DoubleSide} />
		{#each enemyPrefabConfig as enemyPrefab}
			{#if enemyPrefab.type == 2}
				<Instance
					position={[
						enemyPrefab.j - 7.5,
						$heightMap[enemyPrefab.i][enemyPrefab.j] * 0.5 + 5.01,
						enemyPrefab.i - 7.5
					]}
					rotation.x={ninetyInRads}
				/>
			{/if}
		{/each}
	</InstancedMesh>
{/await}
{#await hideousTexture then texture}
	<InstancedMesh>
		<T.PlaneGeometry />
		<T.MeshStandardMaterial map={texture} transparent={true} side={THREE.DoubleSide} />
		{#each enemyPrefabConfig as enemyPrefab}
			{#if enemyPrefab.type == 5}
				<Instance
					position={[
						enemyPrefab.j - 7.5,
						$heightMap[enemyPrefab.i][enemyPrefab.j] * 0.5 + 5.01,
						enemyPrefab.i - 7.5
					]}
					rotation.x={ninetyInRads}
				/>
			{/if}
		{/each}
	</InstancedMesh>
{/await} -->
