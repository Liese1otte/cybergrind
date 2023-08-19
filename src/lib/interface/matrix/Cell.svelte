<script lang="ts">
import { brushStroke } from "$stores";

export let index: number;
</script>

<button
	class="cell"
	on:click={() => {
		brushStroke(index, 1);
	}}
	on:contextmenu={() => {
		brushStroke(index, -1);
	}}><slot /></button
>
