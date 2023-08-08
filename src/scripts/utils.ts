export const blankMap: () => 0[][] = () => {
	return Array.from(Array(16), () => Array(16).fill(0));
};

export const degToRad = (d: number) => {
	return d * (Math.PI / 180);
};
