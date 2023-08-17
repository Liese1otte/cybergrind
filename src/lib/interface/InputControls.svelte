<script lang="ts">
import File from "$src/lib/interface/File.svelte";
import Edit from "$lib/interface/Edit.svelte";
import View from "$lib/interface/View.svelte";

import { Tab } from "$userTypes";
import { activeTab } from "$stores";

let items = [
    {tab: Tab.File, component: File},
    {tab: Tab.Edit, component: Edit},
    {tab: Tab.View, component: View}
]
</script>

<div class="input-controls">
    <ul class="tab-selector">
        {#each items as item}
            <li class={item.tab == $activeTab ? "active" : ""} >
                <button on:click={() => {$activeTab = item.tab}}>
                    <span>{item.tab.toUpperCase()}</span>
                </button>
            </li>
        {/each}
    </ul>
    {#each items as item}
        {#if $activeTab == item.tab}
            <div class="tab-container">
                <svelte:component this={item.component} />
            </div>
        {/if}
    {/each}
</div>

<style lang="less">
div.input-controls {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
}

ul.tab-selector {
    display: flex;
    list-style: none;
    margin: 0px;
    padding: 0px;
    margin-bottom: 10px;
    & :nth-child(n) {
        margin-inline-start: 10px;
    }
    & :nth-child(1) {
        margin-inline-start: 0px;
    }
    & :nth-last-child(1) {
        margin-inline-end: 0px;
    }
}
li {
    flex: 1;
    border: 3px solid rgba(200, 200, 200, 1);
    &:hover {
        filter: brightness(75%);
    }
    cursor: pointer;
}

button {
    width: 100%;
    height: 100%;
    background: none;
    font-size: 1.5rem;
}

div.tab-container {
    flex: 1
}
</style>