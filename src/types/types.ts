export const enum PrefabTypes {
    None,
    Melee,
    Projectile,
    JumpPad,
    Stair,
    Hideous
}

export const EnemyPrefabs = <const>[PrefabTypes.Melee, PrefabTypes.Projectile, PrefabTypes.Hideous];
export type EnemyPrefab = typeof EnemyPrefabs[number];

export type PrefabInstance = { i: number, j: number };
export type EnemyPrefabInstance = PrefabInstance & { type: number };

export const enum Tab {
    File = "file",
    Edit = "edit",
    View = "view"
}