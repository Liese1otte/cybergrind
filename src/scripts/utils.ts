export const blankMap: <T>(v: T) => T[][] = <T>(v: T) => {
	return Array.from(Array(16), () => Array(16).fill(v));
};

export const degToRad = (d: number) => {
	return d * (Math.PI / 180);
};

export const ninetyInRads = 1.570796;

export function download(fileName: string, content: string): void {
    let link = document.createElement("a");
    link.download = fileName;
    link.href = content;
    link.click();
}

export const row = (i: number) => {
	return Math.floor(i / 16);
};
export const col = (i: number) => {
	return i % 16;
};