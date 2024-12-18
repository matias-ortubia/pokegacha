import { cachePkmn, getPkmnFromLocalStorage } from "../utils/pkmnCacheHelper.js";
import { getPkmnEvolutions, getPkmnPreEvolution, getPkmnEvolutionStage } from "../utils/evolutionChainHelper.js";

const MAX_POKEMON = 151;
const SHINY_CHANCE = 4096;


const buildPkmn = (pkmn, moves, preEvolution, evolutions, evolutionStage, isShiny) => {
    return {
        id: pkmn.id,
        name: pkmn.name,
        types: pkmn.types,
        moves: moves,
        ability: resolvePkmnAbility(pkmn.abilities).ability.name,
        img: isShiny ? pkmn.sprites.front_shiny : pkmn.sprites.front_default,
        evolutions: evolutions,
        preEvolution: preEvolution,
        evolutionStage: evolutionStage,
        isShiny: isShiny
    };
};

async function fetchPkmn(id) {
    const url = "https://pokeapi.co/api/v2/pokemon/" + id.toString();
    return await fetch(url).then(response => response.json());
}

export const getRandomPkmn = async () => {
    const randomNum = Math.floor(Math.random() * MAX_POKEMON) + 1;
    const isShiny = Math.floor(Math.random() * SHINY_CHANCE) == 0;
    const cachedPkmn = getPkmnFromLocalStorage(randomNum);
    let pkmn;
    if (cachedPkmn) {
        const moves = resolvePkmnMoves(cachedPkmn.moves);
        pkmn = buildPkmn(cachedPkmn, moves, cachedPkmn.evolutions, cachedPkmn.preEvolution, cachedPkmn.evolutionStage, isShiny);
    } else {
        const obtainedPkmn = await fetchPkmn(randomNum);
        const moves = resolvePkmnMoves(obtainedPkmn.moves).map(move => move.move);
        const pkmnSpecies = await getPkmnSpecies(obtainedPkmn);
        const evolutionChain = await getPkmnEvolutionChain(pkmnSpecies);
        const preEvolution = getPkmnPreEvolution(evolutionChain.chain, obtainedPkmn.name);
        const evolutions = getPkmnEvolutions(evolutionChain.chain, obtainedPkmn.name);
        const evolutionStage = getPkmnEvolutionStage(evolutionChain.chain, obtainedPkmn.name);
        pkmn = buildPkmn(obtainedPkmn, moves, preEvolution, evolutions, evolutionStage, isShiny);
        cachePkmn(obtainedPkmn, evolutionChain.chain, randomNum);
    }
    return pkmn;
};

export const getRandomPkmnList = async () => {
    const pkmnList = [];
    for (let i = 0; i < 10; i++) {
        const pkmn = await getRandomPkmn();
        pkmnList.push(pkmn);
    }
    return pkmnList;
};

function resolvePkmnMoves(moves) {
    const movesQty = 4;
    const movesCopy = [...moves];
    for (let i = movesCopy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [movesCopy[i], movesCopy[j]] = [movesCopy[j], movesCopy[i]];
    }
    return movesCopy.slice(0, movesQty);
}

function resolvePkmnAbility(abilities) {
    const index = Math.floor(Math.random() * abilities.length);
    return abilities[index];
}

async function getPkmnSpecies(pkmn) {
    try {
        const response = await fetch(pkmn.species.url);
        if (!response.ok) {
            throw new Error(`HTTP error: Status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Failed to fetch Pokemon with ID ${pkmn.id}: `, error);
        throw error;
    }
}

async function getPkmnEvolutionChain(pkmnSpecies) {
    try {
        const response = await fetch(pkmnSpecies.evolution_chain.url);
        if (!response.ok) {
            throw new Error(`HTTP error: Status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Failed to fetch Pokemon Evolution Chain: `, error);
        throw error;
    }
}
