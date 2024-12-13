import { cachePkmn, savePkmnListToLocalStorage, getPkmnFromLocalStorage, CACHE_KEY_PREFIX } from "../utils/pkmnCacheHelper.js";


const MAX_POKEMON = 151;
const SHINY_CHANCE = 4096;


const buildPkmn = (pkmn, moves, isShiny) => {
    return {
        id: pkmn.id,
        name: pkmn.name,
        types: pkmn.types,
        moves: moves,
        ability: resolvePkmnAbility(pkmn.abilities),
        img: isShiny ? pkmn.sprites.front_shiny : pkmn.sprites.front_default,
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
        pkmn = buildPkmn(cachedPkmn, moves, isShiny);
    } else {
        const obtainedPkmn = await fetchPkmn(randomNum);
        const moves = resolvePkmnMoves(obtainedPkmn.moves).map(move => move.move);
        cachePkmn(obtainedPkmn, randomNum);
        pkmn = buildPkmn(obtainedPkmn, moves, isShiny);
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
