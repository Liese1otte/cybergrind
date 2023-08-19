<script lang="ts">
import { MirrorState } from "$src/scripts/mirroring";
import { blankMap } from "$src/scripts/utils";
import { currentMap, mirrorState, brushSettings } from "$stores";

const brushModeNames = ["SET", "INCREMENT", "NONE"];
</script>

<div class="edit">
	<div class="controls">
		<div class="mirroring">
			<span class="title">MIRRORING:</span>
			<div class="selectors">
				<button
					class="mirror-selector fourth"
					on:click={() => {
						$mirrorState = MirrorState.Fourth;
					}}>F</button
				>
				<button
					class="mirror-selector half-h"
					on:click={() => {
						$mirrorState = MirrorState.Horizontal;
					}}>H</button
				>
				<button
					class="mirror-selector half-v"
					on:click={() => {
						$mirrorState = MirrorState.Vertical;
					}}>V</button
				>
				{#if $mirrorState != MirrorState.None}
					<button
						class="mirror-selector cancel"
						on:click={() => {
							$mirrorState = MirrorState.None;
						}}>CANCEL</button
					>
				{/if}
			</div>
		</div>
		<div class="brush">
			<span class="title">BRUSH:</span>
            <div class="inputs">
                <button class="mode" on:click={() => {$brushSettings.mode = ($brushSettings.mode + 1) % 3}}>{brushModeNames[$brushSettings.mode]}</button>
                <input placeholder="VALUE" type="number" bind:value={$brushSettings.value} />
            </div>
		</div>
	</div>
	<button
		class="reset-pattern"
		on:click={() => {
			$currentMap = blankMap(0);
		}}
	>
		RESET PATTERN
	</button>
</div>

<style lang="less">
div.edit {
	display: grid;
	grid-template-rows: repeat(4, 1fr);
	width: 100%;
	height: 100%;
	gap: 10px;
	font-size: 1.25rem;
}

div.controls {
	grid-row: 1 / span 3;
	display: flex;
	flex-direction: column;
	& > * {
		display: flex;
		flex: 1;
		align-items: center;
		justify-content: space-between;
	}
}

div.selectors {
	display: flex;
	& > * {
		margin-inline-end: 10px;
	}
	& :nth-last-child(1) {
		margin: 0px;
	}
}

button.mirror-selector {
	display: block;
	font-size: 1.25rem;
	height: 2rem;
	min-width: 2rem;
	background: none;
	border: 3px solid rgba(200, 200, 200, 1);
	&:hover {
		filter: brightness(75%);
	}
	cursor: pointer;
}

button.reset-pattern {
	width: 100%;
	background: none;
	border: 3px solid rgba(200, 200, 200, 1);
	font-size: 2rem;
	grid-row: 4 / span 1;
	&:hover {
		filter: brightness(75%);
		border: 3px solid rgba(255, 150, 150, 1);
		color: rgba(255, 150, 150, 1);
	}
	cursor: pointer;
}

div.inputs {
    display: flex;
}
button.mode {
	display: block;
	font-size: 1.25rem;
	height: 2rem;
	min-width: 2rem;
	background: none;
	border: 3px solid rgba(200, 200, 200, 1);
    margin-inline-end: 10px;
	&:hover {
		filter: brightness(75%);
	}
	cursor: pointer;
}

input {
    width: calc(2rem * 3 + 10px);
    background: none;
    outline: none;
    border: 3px solid rgba(200, 200, 200, 1);
    font-size: 1.5rem;
}
</style>
