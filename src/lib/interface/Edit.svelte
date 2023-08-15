<script lang="ts">
import { currentMapId, resolveMap } from "$stores";

$: currentMap = resolveMap($currentMapId);
</script>

<div class="edit">
    <div class="mirroring">
    </div>
    <div class="brush">
    </div>
    <button class="reset-pattern" on:click={() => {
		$currentMap = Array.from(Array(16), () => Array(16).fill(0));
	}}>
        RESET PATTERN
    </button>
</div>

<style lang="less">
div.edit {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(4, 1fr);
    grid-template-areas: "m b" "m b" "m b" "r r";
    width: 100%;
    height: 100%;
    gap: 10px;
}

div.mirroring {
    grid-area: m;
}

div.brush {
    grid-area: b;
}

button.reset-pattern {
    grid-area: r;
    background: none;
    border: 3px solid rgba(200, 200, 200, 1);
    font-size: 2rem;
}
</style>