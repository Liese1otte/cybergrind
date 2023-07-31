const cgpValidationRegex =
	/^(([0-9]|\((-[1-9]|-[1-4][0-9]|[1-4][0-9]|-?50)\)){16}(\r?\n){1}){16}(\r?\n){1}([0nsJHp]{16}(\r?\n){1}){15}([0nsJHp]{16}){1}$/g;

/*
^
(
    (
        [0-9]                // match a number between 0 and 9 inclusive
        |
        \(
            (
                -[1-9]       // match a number between -1 and -9 inclusive
                |
                -[1-4][0-9]  // match a number between -10 and -49 inclusive
                |
                [1-4][0-9]   // match a number between 10 and 49 inclusive
                |
                -?50         // match 50 and -50
            )
        \)
    ){16}                    // match a (number between -50 and 50 inclusive where non-digit positive and negative numbers are enclosed in parens) (1) 16 times
    (
        \r?\n                // match a newline
    ){1}                     // match a newline once
){16}                        // match a string of (1) that ends in a newline 16 times
(
    \r?\n                    // match a newline
){1}                         // match a newline once
(
    [0nsJHp]{16}             // match acceptable prefab character 16 times
    (
        \r?\n                // match a newline
    ){1}                     // match a newline once
){15}                        // match a string of length 16 of acceptable prefab characters followed by a newline 15 times
(
    [0nsJHp]{16}             // match acceptable prefab character 16 times
){1}                         // match a string of length 16 of acceptable prefab characters once
$
*/

export function cgpStringToMapArrays(cgp: string): void {}

const possiblePrefabs = {
	n: 1,
	p: 2,
	J: 3,
	s: 4,
	H: 5
};

const possiblePrefabsAgain = {
	0: '0',
	1: 'n',
	2: 'p',
	3: 'J',
	4: 's',
	5: 'H'
};

function parseCGPRow(row: string): number[] {
	let outArray = Array<number>();
	let isInParens = false;
	let inParensString = '';
	for (let i = 0; i < row.length; i++) {
		if (row[i] >= '0' && row[i] <= '9' && !isInParens) {
			outArray.push(parseInt(row[i]));
		}
		if (((row[i] >= '0' && row[i] <= '9') || row[i] == '-') && isInParens) {
			inParensString += row[i];
		}
		if (row[i] == '(') {
			isInParens = true;
		}
		if (row[i] == ')') {
			isInParens = false;
			outArray.push(parseInt(inParensString));
			inParensString = '';
		}
		if (row[i] in possiblePrefabs) {
			outArray.push(possiblePrefabs[row[i] as keyof typeof possiblePrefabs]);
		}
	}
	return outArray;
}

// I REALLY NEED TO MAKE ACTUAL TYPES
export function getMapArraysFromCGPString(cgp: string): [number[][], number[][]] {
	if (!new RegExp(cgpValidationRegex).test(cgp)) {
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
					return possiblePrefabsAgain[e as keyof typeof possiblePrefabsAgain];
				})
				.join();
		})
		.join('\n');
	console.log(heightMapString + outString + prefabMapString);
	return (heightMapString + outString + prefabMapString).replaceAll(',', '');
}
