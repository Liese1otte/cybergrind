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

export const heightMap = createPersistentStore("heightMap", Array<number>());

// Stored values:
// height map
// current rotation
// rotation state
// camera position
// camera view angle
