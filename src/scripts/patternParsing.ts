import { prefabWithAnIndexOf, prefabWithASymbolOf } from "$utils";
import type { prefabIndex, prefabSymbol } from "$utils";

const cgpFormatRegex =
	/^(([0-9]|\((-[1-9]|-[1-4][0-9]|[1-4][0-9]|-?50)\)){16}(\r?\n){1}){16}(\r?\n){1}([0nsJHp]{16}(\r?\n){1}){15}([0nsJHp]{16}){1}$/g;

const parensEscapeIncrement = 3;

function parseCGPRow(row: string): number[] {
	let outArray = Array<number>();
	let matchArray = [...row.matchAll(/\([^\(\)]+\)/g)];
	let matchIndicies = [
		...matchArray.map((m) => {
			return m.index;
		})
	];
	for (let i = 0; i < row.length; i++) {
		if (row[i] in prefabWithASymbolOf) {
			outArray.push(prefabWithASymbolOf[row[i] as prefabSymbol]);
            continue;
		}
		if (matchIndicies.includes(i)) {
			outArray.push(parseInt(matchArray[matchIndicies.indexOf(i)][0].slice(1, -1)));
			i += parensEscapeIncrement;
		} else {
			outArray.push(parseInt(row[i]));
		}
	}
	return outArray;
}

export function getMapArraysFromCGPString(cgp: string): [number[][], number[][]] {
	if (!new RegExp(cgpFormatRegex).test(cgp)) {
		throw Error('Pattern does not pass RegEx validation');
	}
	let maps = cgp
		.split(/(\r?\n){2}/)            // split two maps apart
		.map((s) => {
			return s.split(/\r?\n/);
		})                              // split rows inside of each map apart
		.map((a) => {
			return a.map((r) => {
				return parseCGPRow(r);
			});                         // parse every row of a map
		});                             // do above for both maps'
	maps.splice(1, 1);                  // remove the scrunkly in the middle of split maps
	return maps as [number[][], number[][]];
}

export function getCGPStringFromMapArrays(arrays: [number[][], number[][]]): string {
	let outString = '\n\n';
	let heightMapString = arrays[0]
		.map((r) => {
			return r
				.map((e) => {
					return e <= 9 && e >= 0 ? e.toString() : '(' + e.toString() + ')';
				})
				.join();
		})
		.join('\n');
	let prefabMapString = arrays[1]
		.map((r) => {
			return r
				.map((e) => {
					return prefabWithAnIndexOf[e as prefabIndex];
				})
				.join();
		})
		.join('\n');
	return (heightMapString + outString + prefabMapString).replaceAll(',', '');
}