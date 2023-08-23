<script lang="ts">
import { mirror, Half, Fourth, MirrorState, type MirrorSelector } from '$scripts/mirroring';
import { currentMap, mirrorState } from '$stores';

function mirrorAction(selector: MirrorSelector): void {
	console.log($currentMap, selector);
	$currentMap = mirror($currentMap, selector);
	$mirrorState = MirrorState.None;
}
</script>

<div class="mirror-overlay">
	{#if $mirrorState == MirrorState.Fourth}
		<button
			class="mirror-selector fourth"
			on:click={() => {
				mirrorAction(Fourth.TopLeft);
			}}
		></button>
		<button
			class="mirror-selector fourth"
			on:click={() => {
				mirrorAction(Fourth.TopRight);
			}}
		></button>
		<button
			class="mirror-selector fourth"
			on:click={() => {
				mirrorAction(Fourth.BottomLeft);
			}}
		></button>
		<button
			class="mirror-selector fourth"
			on:click={() => {
				mirrorAction(Fourth.BottomRight);
			}}
		></button>
	{:else if $mirrorState == MirrorState.Horizontal}
		<button
			class="mirror-selector half-horizontal"
			on:click={() => {
				mirrorAction(Half.Top);
			}}
		></button>
		<button
			class="mirror-selector half-horizontal"
			on:click={() => {
				mirrorAction(Half.Bottom);
			}}
		></button>
	{:else if $mirrorState == MirrorState.Vertical}
		<button
			class="mirror-selector half-vertical"
			on:click={() => {
				mirrorAction(Half.Left);
			}}
		></button>
		<button
			class="mirror-selector half-vertical"
			on:click={() => {
				mirrorAction(Half.Right);
			}}
		></button>
	{/if}
</div>

<style lang="less">
.mirror-overlay {
	grid-column: 1 / 1;
	grid-row: 1 / 1;
	width: 100%;
	height: 100%;
	display: grid;
	grid-template-columns: 1fr 1fr;
	grid-template-rows: 1fr 1fr;
	pointer-events: none;
}

.mirror-selector {
	pointer-events: initial;
	background: rgba(0, 0, 0, 50%);
	&:hover {
		background: rgba(0, 0, 0, 10%);
	}
}
.half-horizontal {
	grid-column: 1 / span 2;
}

.half-vertical {
	grid-row: 1 / span 2;
}
</style>
