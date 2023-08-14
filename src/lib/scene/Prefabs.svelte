<script lang="ts">
import { prefabMap } from "$stores";

import Enemies from "$lib/scene/prefabs/Enemies.svelte";
import JumpPads from "$lib/scene/prefabs/JumpPads.svelte";
import Stairs from "$lib/scene/prefabs/Stairs.svelte";

import type * as TYPES from "$userTypes"
import { EnemyPrefabs, PrefabTypes } from "$userTypes";

// ### Prefab configuration updates ### /

type PrefabInstances = {enemy: TYPES.EnemyPrefabInstance[], pad: TYPES.PrefabInstance[], stair: TYPES.PrefabInstance[]};

const isEnemyPrefab = (prefab: number): prefab is TYPES.EnemyPrefab => {
    return EnemyPrefabs.indexOf(prefab) != -1;
}

// Refactor this to account for future prefab types.
function updatePrefabInstances(prefabs: number[][]): PrefabInstances {
    let prefabInstances: PrefabInstances = {enemy: [], pad: [], stair: []};
    for (let i = 0; i < prefabs.length; i++) {
        for (let j = 0; j < prefabs[i].length; j++) {
            if (isEnemyPrefab(prefabs[i][j])) {
                prefabInstances.enemy.push({i: i, j: j, type: prefabs[i][j]});
            } else if (prefabs[i][j] == PrefabTypes.JumpPad) {
                prefabInstances.pad.push({i: i, j: j});
            } else if (prefabs[i][j] == PrefabTypes.Stair) {
                prefabInstances.stair.push({i: i, j: j});
            }
        }
    }
    return prefabInstances;
}

let prefabInstances: PrefabInstances;

$: prefabInstances = updatePrefabInstances($prefabMap);
</script>

<Enemies instances={prefabInstances.enemy} />
<JumpPads instances={prefabInstances.pad} />
<Stairs instances={prefabInstances.stair} />