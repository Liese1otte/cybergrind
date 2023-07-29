import type { Writable } from 'svelte/store';
import { writable } from 'svelte/store';
import { browser } from '$app/environment';

export function createPersistentSessionStore<T>(storageKey: string, startValue: T): Writable<T> {
	const storedValue = browser && sessionStorage.getItem(storageKey);
	const store: Writable<T> = writable(
		storedValue === null ? startValue : JSON.parse(storedValue as string)
	);
	store.subscribe((value: T) => {
		browser && sessionStorage.setItem(storageKey, JSON.stringify(value));
	});
	return store;
}

export function createPersistentLocalStore<T>(storageKey: string, startValue: T): Writable<T> {
	const storedValue = browser && localStorage.getItem(storageKey);
	const store: Writable<T> = writable(
		storedValue === null ? startValue : JSON.parse(storedValue as string)
	);
	store.subscribe((value: T) => {
		browser && localStorage.setItem(storageKey, JSON.stringify(value));
	});
	return store;
}

export const isRotating = createPersistentSessionStore('isRotating', true);

export const rotationAngle = createPersistentSessionStore('rotationAngle', 0);

export const defaultCameraPosition: [x: number, y: number, z: number] = [
	0,
	20,
	25
];

export const cameraPosition = createPersistentSessionStore('cameraPosition', defaultCameraPosition);

export const cameraTarget = createPersistentSessionStore<[x: number, y: number, z: number]>('cameraRotation', [0, 0, 0]);

export const enableDamping = createPersistentSessionStore('enableDamping', false);

// Stored values:
// height map (done)
// current rotation (done)
// rotation state (done)
// camera position (done)
// camera view angle (done)

export const newHeightMap = createPersistentLocalStore<number[][]>("heightMap", Array.from(Array(16), () => Array(16).fill(0)));

export const newHeightMapStore: Writable<number[][]> & {
	updateMap: (index: number, increment: number) => void;
} = {
	subscribe: newHeightMap.subscribe,
	set: newHeightMap.set,
	update: newHeightMap.update,
	updateMap: (index: number, increment: number) => {
		newHeightMap.update((value) => {
			value[Math.floor(index / 16)][index % 16] += increment;
			return value;
		});
	}
};

const prefabTypes = [0, 's', 'n', 'j'];

export const newPrefabMap = createPersistentLocalStore<number[][]>("prefabMap", Array.from(Array(16), () => Array(16).fill(0)));

export const newPrefabMapStore: Writable<number[][]> & {
	updateMap: (index: number, increment: number) => void;
} = {
	subscribe: newPrefabMap.subscribe,
	set: newPrefabMap.set,
	update: newPrefabMap.update,
	updateMap: (index: number, increment: number) => {
		newPrefabMap.update((value) => {
			let nextPrefab = (value[Math.floor(index / 16)][index % 16] + increment) % prefabTypes.length;
			nextPrefab = nextPrefab == -1 ? prefabTypes.length - 1 : nextPrefab;
			value[Math.floor(index / 16)][index % 16] = nextPrefab;
			return value;
		});
	}
};

export type heightMapStoreType = Writable<number[][]> & {
	updateMap: (index: number, increment: number) => void; };

export type prefabMapStoreType = Writable<(number | string)[][]> & {
	updateMap: (index: number, increment: number) => void;
};