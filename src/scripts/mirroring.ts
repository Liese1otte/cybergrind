export enum MirrorState {
	Fourth,
	Vertical,
	Horizontal,
	None
}

export enum Half {
	Top = 0,
	Bottom,
	Left,
	Right
}

export enum Fourth {
	TopLeft = 4,
	TopRight,
	BottomLeft,
	BottomRight
}

export type MirrorSelector = Fourth | Half;

export function mirror(map: number[][], caller: MirrorSelector): number[][] {
	return caller in Half ? mirrorHalf(map, caller as Half) : mirrorFourth(map, caller as Fourth);
}

function mirrorFourth(map: number[][], caller: Fourth): number[][] {
	switch (caller) {
		case Fourth.TopLeft:
			map = mirrorHalf(mirrorHalf(map, Half.Top), Half.Left);
			break;
		case Fourth.TopRight:
			map = mirrorHalf(mirrorHalf(map, Half.Top), Half.Right);
			break;
		case Fourth.BottomLeft:
			map = mirrorHalf(mirrorHalf(map, Half.Bottom), Half.Left);
			break;
		case Fourth.BottomRight:
			map = mirrorHalf(mirrorHalf(map, Half.Bottom), Half.Right);
			break;
	}
	return map;
}

function mirrorHalf(map: number[][], caller: Half): number[][] {
	let stop, indexPair;
	// Is this really the only way?
	switch (caller) {
		case Half.Top:
			stop = { i: 8, j: 16 };
			indexPair = (i: number, j: number) => {
				return { from: { i: i, j: j }, to: { i: 15 - i, j: j } };
			};
			break;
		case Half.Left:
			stop = { i: 16, j: 8 };
			indexPair = (i: number, j: number) => {
				return { from: { i: i, j: j }, to: { i: i, j: 15 - j } };
			};
			break;
		case Half.Bottom:
			stop = { i: 8, j: 16 };
			indexPair = (i: number, j: number) => {
				return { from: { i: 15 - i, j: j }, to: { i: i, j: j } };
			};
			break;
		case Half.Right:
			stop = { i: 16, j: 8 };
			indexPair = (i: number, j: number) => {
				return { from: { i: i, j: 15 - j }, to: { i: i, j: j } };
			};
			break;
	}
	for (let i = 0; i < stop.i; i++) {
		for (let j = 0; j < stop.j; j++) {
			let { from, to } = indexPair(i, j);
			map[to.i][to.j] = map[from.i][from.j];
		}
	}
	return map;
}
