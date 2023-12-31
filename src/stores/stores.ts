import type { Writable } from 'svelte/store';
import { writable } from 'svelte/store';
import { browser } from '$app/environment';
import { blankMap } from '$utils';

import { MirrorState } from '$scripts/mirroring';
import { Tab } from '$userTypes';

// ### Persistent store setup ### //

const enum Storage {
	Session = 0,
	Local = 1
}

const resolveStorage = (storageType: Storage) => {
	return storageType == Storage.Local ? localStorage : sessionStorage;
};

function persistent<T>(type: Storage, key: string, startValue: T): Writable<T> {
	const storedValue = browser && resolveStorage(type).getItem(key);
	const store: Writable<T> = writable(
		storedValue == null ? startValue : JSON.parse(storedValue as string)
	);
	store.subscribe((value: T) => {
		browser && resolveStorage(type).setItem(key, JSON.stringify(value));
	});
	return store;
}

// ### Camera settings ### //

type cameraPosition = [x: number, y: number, z: number];
export const defaultCameraPosition: [x: 0, y: 20, z: 25] = [0, 20, 25];
export const cameraPosition = persistent<cameraPosition>(
	Storage.Session,
	'cameraPosition',
	defaultCameraPosition
);

type cameraTarget = [x: number, y: number, z: number];
export const defaultCameraTarget: [x: 0, y: 10, z: 0] = [0, 10, 0];
export const cameraTarget = persistent<cameraTarget>(
	Storage.Session,
	'cameraTarget',
	defaultCameraTarget
);

export function resetCamera(): void {
	cameraPosition.set(defaultCameraPosition);
	cameraTarget.set(defaultCameraTarget);
	gridRotationAngle.set(0);
}

// ### Interface persistence ### // 

export const activeTab = persistent(Storage.Session, "activeTab", Tab.Edit);

// ### Display settings ### //

export const mipMapsEnabled = persistent(Storage.Session, 'mipMapsEnabled', true);

export const enableDamping = persistent(Storage.Session, 'enableDamping', true);

// ### Arena settings ### //

export const showKillZone = persistent(Storage.Session, 'showKillZone', true);

export const isGridRotating = persistent(Storage.Session, 'isGridRotating', false);

export const gridRotationAngle = persistent(Storage.Session, 'gridRotationAngle', 0);

export const mirrorState = persistent(Storage.Session, "mirrorState", MirrorState.None)

// ### Map stores ### //

const prefabCount = 6;

export type MapStore = Writable<number[][]> & {
	updateMap: (index: number, increment: number) => void;
	setMap: (index: number, value: number) => void;
};

export const heightMap: MapStore = {
	...persistent<number[][]>(Storage.Local, 'heightMap', blankMap(0)),
	updateMap: (index: number, increment: number) => {
		increment = increment > 99 ? 99 : increment < -99 ? -99 : increment;
		heightMap.update((v) => {
			v[Math.floor(index / 16)][index % 16] += increment;
			return v;
		});
	},
	setMap: (index: number, value: number) => {
		value = value > 99 ? 99 : value < -99 ? -99 : value;
		heightMap.update((v) => {
			v[Math.floor(index / 16)][index % 16] = value;
			return v;
		});
	}
};

export const prefabMap: MapStore = {
	...persistent<number[][]>(Storage.Local, 'prefabMap', blankMap(0)),
	updateMap: (index: number, increment: number) => {
		prefabMap.update((v) => {
			let nextPrefab = (v[Math.floor(index / 16)][index % 16] + increment % prefabCount) % prefabCount;
			v[Math.floor(index / 16)][index % 16] = nextPrefab < 0 ? prefabCount + nextPrefab : nextPrefab;
			return v;
		});
	},
	setMap: (index: number, value: number) => {
		prefabMap.update((v) => {
			value = value % prefabCount;
			v[Math.floor(index / 16)][index % 16] = value < 0 ? prefabCount + value : value;
			return v;
		});
	}
};

export const enum MapType {
	Height,
	Prefab
}

export let currentMap = heightMap;

export const currentMapId = persistent<MapType>(Storage.Session, 'currentMapId', 0);

currentMapId.subscribe((v) => {
	currentMap = v == MapType.Height ? heightMap : prefabMap;
});

// ### Brush ### //

export const enum BrushMode {
	Set,
	Increment,
	None
}

export const brushSettings = persistent(Storage.Session, "brushSettings", {mode: BrushMode.None, value: 0});

let brushMode: BrushMode, brushValue: number;

brushSettings.subscribe((v) => {
	brushMode = v.mode; brushValue = v.value == null ? 1 : v.value;
})

export function brushStroke(index: number, modifier: 1 | -1): void {
	switch (brushMode) {
		case BrushMode.None:
			currentMap.updateMap(index, 1 * modifier);
			break;
		case BrushMode.Increment:
			currentMap.updateMap(index, brushValue * modifier);
			break;
		case BrushMode.Set:
			currentMap.setMap(index, brushValue * modifier);
			break;
	}
}

const prefabWithAnIndexOf = {
	0: '0',
	1: 'n',
	2: 'p',
	3: 'J',
	4: 's',
	5: 'H'
} as const;

type PrefabIndex = keyof typeof prefabWithAnIndexOf;

export function resolvePrefabs(prefabs: number[][]): string[][] {
	return prefabs.map((r) => {
		return r.map((e) => {
			return prefabWithAnIndexOf[e as PrefabIndex];
		});
	});
}