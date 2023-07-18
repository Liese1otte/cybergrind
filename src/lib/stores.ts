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

export const heightMap = createPersistentLocalStore<number[][]>(
	'heightMap',
	Array.from(Array(16), () => Array(16).fill(0))
);

export const prefabMap = createPersistentLocalStore<(string | number)[][]>("prefabMap", Array.from(Array(16), () => Array(16).fill(0)));

export const rotationAngle = createPersistentSessionStore('rotationAngle', 0);

export const cameraPosition = createPersistentSessionStore('cameraPosition', { x: 0, y: 15, z: 20 });

export const cameraTarget = createPersistentSessionStore('cameraRotation', { x: 0, y: 0, z: 0 });

export const enableDamping = createPersistentSessionStore('enableDamping', false);

// Stored values:
// height map (done)
// current rotation (done)
// rotation state (done)
// camera position (done)
// camera view angle (done)
