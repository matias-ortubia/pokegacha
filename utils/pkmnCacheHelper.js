

export const CACHE_KEY_PREFIX = "cachedPkmn_";

const buildPkmnForCache = (pkmn) => {
    return {
        id: pkmn.id,
        name: pkmn.name,
        types: pkmn.types,
        moves: pkmn.moves.map(move => move.move),
        abilities: pkmn.abilities,
        sprites: pkmn.sprites
    };
};

export function savePkmnListToLocalStorage(pkmnList) {
    localStorage.setItem("obtainedPkmnList", JSON.stringify(pkmnList))
}

export function getPkmnFromLocalStorage(pkmnId) {
    const cacheKey = CACHE_KEY_PREFIX + pkmnId;
    return JSON.parse(localStorage.getItem(cacheKey));
}

export function getPkmnListFromLocalStorage() {
    return localStorage.getItem("obtainedPkmnList");
}

export function cachePkmn(pkmn, pkmnId) {
    const cacheKey = CACHE_KEY_PREFIX + pkmnId;
    const pkmnForCache = buildPkmnForCache(pkmn);
    const pkmnData = {
        name: pkmnForCache.name,
        types: pkmnForCache.types,
        sprites: pkmnForCache.sprites,
        moves: pkmnForCache.moves,
        abilities: pkmnForCache.abilities
    };

    localStorage.setItem(cacheKey, JSON.stringify(pkmnData));
}

