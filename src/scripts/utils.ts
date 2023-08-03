export function horizontalCoordinatesAt(index: number): {x: number, z: number} {
	return { x: (index % 16) - 7.5, z: Math.floor(index / 16) - 7.5 };
}