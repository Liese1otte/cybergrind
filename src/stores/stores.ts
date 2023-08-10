import type { Writable } from 'svelte/store';
import { writable } from 'svelte/store';
import { browser } from '$app/environment';
import { blankMap } from '$utils';

// ### Persistent store setup

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

// ### Camera settings

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

// ### Display settings

export const mipMapsEnabled = persistent(Storage.Session, 'mipMapsEnabled', true);

export const enableDamping = persistent(Storage.Session, 'enableDamping', true);

// ### Arena settings

export const showKillZone = persistent(Storage.Session, 'showKillZone', true);

export const isArenaRotating = persistent(Storage.Session, 'isArenaRotating', false);

export const arenaRotationAngle = persistent(Storage.Session, 'arenaRotationAngle', 0);

// Possibly create another store for skybox rotation so it is configurable?

// ### Map stores

const prefabCount = 6;

type MapStore = Writable<number[][]> & {
	updateMap: (index: number, increment: number) => void;
	setMap: (index: number, value: number) => void;
};

export const heightMap: MapStore = {
	...persistent<number[][]>(Storage.Local, 'heightMap', blankMap(0)),
	updateMap: (index: number, increment: number) => {
		heightMap.update((v) => {
			v[Math.floor(index / 16)][index % 16] += increment;
			return v;
		});
	},
	setMap: (index: number, value: number) => {
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
			console.log(nextPrefab);
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

type MapId = 0 | 1;

export const currentMapId = persistent<MapId>(Storage.Session, 'currentMapId', 0);

export function resolveMap(mapId: MapId): MapStore {
	return mapId == 0 ? heightMap : prefabMap;
}

// ### Screenshot event dispatcher

type Subscriber = (params?: any) => void;
type Unsubscriber = () => void;

function notifying(): { subscribe: (run: Subscriber) => Unsubscriber, ping: (params?: any) => void } {
	const subscribers = new Set<Subscriber>();
	function subscribe(run: Subscriber): Unsubscriber {
		subscribers.add(run);
		return () => {
			subscribers.delete(run);
		}
	}
	function ping(params?: any): void {
		for (let subscriber of subscribers) {
			subscriber(params);
		}
	}
	return { subscribe, ping };
}

export const screenshotManager = notifying();