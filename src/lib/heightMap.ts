import { writable } from "svelte/store";
import type { Writable } from "svelte/store";

export const heightMap: Writable<number[]> = writable([]);