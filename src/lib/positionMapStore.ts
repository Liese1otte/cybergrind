import { writable } from "svelte/store";
import type { Writable } from "svelte/store";

export const positionMapStore: Writable<number[]> = writable([]);