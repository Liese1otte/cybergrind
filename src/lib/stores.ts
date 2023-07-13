import { writable } from "svelte/store";
import type { Writable } from "svelte/store";
import { browser } from "$app/environment";

export function createPersistentStore<T>(storageKey: string, startValue: T): Writable<T> {
    const storedValue = browser && sessionStorage.getItem(storageKey);
    const store: Writable<T> = writable(storedValue === null ? startValue : JSON.parse(storedValue as string));
    store.subscribe((value: T) => { browser && sessionStorage.setItem(storageKey, JSON.stringify(value)); });
    return store;
}

export const isRotating = createPersistentStore("isRotating", true);

export const heightMap = createPersistentStore("heightMap", Array(256).fill(0));

export const rotationAngle = createPersistentStore("rotationAngle", 0);

export const cameraPosition = createPersistentStore("cameraPosition", {x: 0, y: 15, z: 20});

export const cameraRotation = createPersistentStore("cameraRotation", {x: 0, y: 0, z: 0});

export const enableDamping = createPersistentStore("enableDamping", false);

// Stored values:
// height map (done)
// current rotation (done)
// rotation state (done)
// camera position (done)
// camera view angle (done)

