import { getPkmnEvolutions, getPkmnPreEvolution, getPkmnEvolutionStage} from "./evolutionChainHelper.js";

export const CACHE_KEY_PREFIX = "cachedPkmn_";

const buildPkmnForCache = (pkmn, evolutionChain) => {
    return {
        id: pkmn.id,
        name: pkmn.name,
        types: pkmn.types,
        moves: pkmn.moves.map(move => move.move),
        abilities: pkmn.abilities,
        evolutions: getPkmnEvolutions(evolutionChain, pkmn.name),
        preEvolution: getPkmnPreEvolution(evolutionChain, pkmn.name),
        evolutionStage: getPkmnEvolutionStage(evolutionChain, pkmn.name),
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

export function cachePkmn(pkmn, evolutionChain, pkmnId) {
    const cacheKey = CACHE_KEY_PREFIX + pkmnId;
    const pkmnForCache = buildPkmnForCache(pkmn, evolutionChain);
    const pkmnData = {
        name: pkmnForCache.name,
        types: pkmnForCache.types,
        moves: pkmnForCache.moves,
        abilities: pkmnForCache.abilities,
        evolutions: pkmnForCache.evolutions,
        preEvolution: pkmnForCache.preEvolution,
        evolutionStage: pkmnForCache.evolutionStage,
        sprites: pkmnForCache.sprites
    };

    localStorage.setItem(cacheKey, JSON.stringify(pkmnData));
}

