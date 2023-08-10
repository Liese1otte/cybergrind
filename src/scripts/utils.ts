export const blankMap: <T>(v: T) => T[][] = <T>(v: T) => {
	return Array.from(Array(16), () => Array(16).fill(v));
};

export const degToRad = (d: number) => {
	return d * (Math.PI / 180);
};
