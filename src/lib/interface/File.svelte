<script lang="ts">
import { heightMap, prefabMap } from "$stores";

import { getMapArraysFromCGPString, getCGPStringFromMapArrays } from "$scripts/patternParsing";

async function onFileDrop(e: DragEvent): Promise<void> {
	e.preventDefault();
	let file = e.dataTransfer?.files[0];
	let content = "";
	if (file != null && file.name.endsWith(".cgp")) {
		content = await file.text();
	}
	setPatternFromCgp(content);
}

function setPatternFromCgp(cgp: string): void {
	let [heights, prefabs] = getMapArraysFromCGPString(cgp);
	$heightMap = heights;
	$prefabMap = prefabs;
}

async function parsePattern(): Promise<void> {
	if (patternFileInput.files == null) {
		return;
	}
	let [file] = patternFileInput.files;
	if (!file || (file && !file.name.endsWith(".cgp"))) {
		return;
	}
	currentPatternName = file.name.replace(/\.[^/.]+$/, "");
	setPatternFromCgp(await file.text());
}

function downloadCurrentPattern(): void {
	let element = document.createElement('a');
	element.setAttribute(
		'href',
		'data:text/plain;charset=utf-8,' +
			encodeURIComponent(getCGPStringFromMapArrays([$heightMap, $prefabMap]))
	);
	element.setAttribute('download', (currentPatternName ? currentPatternName : "myPattern") + '.cgp');

	element.style.display = 'none';
	document.body.appendChild(element);

	element.click();

	document.body.removeChild(element);
}

let currentPatternName: string = "myPattern";
let patternFileInput: HTMLInputElement;
</script>

<div class="file">
	<div class="import">
		<span class="title">IMPORT</span>
		<!-- svelte-ignore a11y-no-static-element-interactions -->
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<div
			class="drop-zone"
			on:drop={(e) => {
				onFileDrop(e);
			}}
			on:dragover={(e) => {
				e.preventDefault();
			}}
			on:click={() => {
				patternFileInput.click();
			}}
		>
			<span class="drop-text">DROP / BROWSE FILE</span>
			<input
				class="manual-browse"
				type="file"
				on:change={() => {
					parsePattern();
				}}
				bind:this={patternFileInput}
				accept=".cgp"
			/>
		</div>
	</div>
	<div class="export">
		<span class="title">EXPORT</span>
		<div class="export-zone">
			<input class="file-name" type="text" id="fileName" bind:value={currentPatternName} />
			<button
            class="confirm-export"
				on:click={() => {
					downloadCurrentPattern();
				}}>OK</button
			>
		</div>
	</div>
</div>

<style lang="less">
div.file {
	display: flex;
	flex-direction: column;
	height: 100%;
}

div.import {
	flex: 2;
	display: flex;
	flex-direction: column;
	margin-bottom: 10px;
}

span.title {
	display: block;
	font-size: 2rem;
	text-align: end;
}

div.drop-zone {
	flex: 1;
	border: 3px solid rgba(200, 200, 200, 1);
	display: flex;
	justify-content: center;
	align-items: center;
	cursor: pointer;
    &:hover {
        filter: brightness(75%);
    }
}

span.drop-text {
	font-size: 1.5rem;
    padding: 5px;
}

input.manual-browse {
	display: none;
}

div.export {
	flex: 1;
    display: flex;
    flex-direction: column;
}

div.export-zone {
    flex: 1;
    display: flex;
}

input.file-name {
    flex: 1;
    background: none;
    outline: none;
    border: 3px solid rgba(200, 200, 200, 1);
    margin-inline-end: 10px;
    font-size: 1.5rem;
    padding: 5px;
	&:focus {
		filter: brightness(75%);
	}
}

button.confirm-export {
    background: none;
    outline: none;
    border: 3px solid rgba(200, 200, 200, 1);
    font-size: 1.5rem;
    aspect-ratio: 1 / 1;
    &:hover {
        filter: brightness(75%);
    }
    cursor: pointer;
}
</style>
