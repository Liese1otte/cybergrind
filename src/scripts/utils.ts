export const blankMap: () => 0[][] = () => { return Array.from(Array(16), () => Array(16).fill(0)); }

// ### Prefab types and tables

export const prefabWithASymbolOf = {
	"0": 0,
	"n": 1,
	"p": 2,
	"J": 3,
	"s": 4,
	"H": 5
} as const;

export const prefabWithAnIndexOf = {
	0: '0',
	1: 'n',
	2: 'p',
	3: 'J',
	4: 's',
	5: 'H'
} as const;

export type prefabIndex = keyof typeof prefabWithAnIndexOf;

export type prefabSymbol = keyof typeof prefabWithASymbolOf;

// ### Three.js event type

export type Event = THREE.Intersection & {
	intersections: THREE.Intersection[],
	object: THREE.Object3D,
	eventObject: THREE.Object3D,
	camera: THREE.Camera,
	delta: THREE.Vector2,
	nativeEvent: MouseEvent | PointerEvent | WheelEvent,
	pointer: THREE.Vector2,
	ray: THREE.Ray,
	stopPropagation: () => void,
	stopped: Boolean
};

// ### Rotation 

const degToRad = (d: number) => { return d * (Math.PI / 180 )};