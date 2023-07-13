import { writable } from "svelte/store";
import type { Writable } from "svelte/store";
import { Vector3 } from "three";
import { browser } from "$app/environment";

export const heightMap: Writable<number[]> = writable([]);

const storedIsRotating = browser && sessionStorage.getItem("isRotating");
export const isRotating = writable(storedIsRotating === null ? true : storedIsRotating === "true" as string);
isRotating.subscribe((value: boolean) => { browser && sessionStorage.setItem("isRotating", value.toString()); })

// Stored values:
// height map
// current rotation
// rotation state
// camera position
// camera view angle
