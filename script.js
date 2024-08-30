"use strict"

const MAX_POKEMON = 151;
const CACHE_KEY_PREFIX = "cachedPkmn_";
const SHINY_CHANCE = 4096;

const multiPullButton = document.getElementById("multiPullButton");
const singlePullButton = document.getElementById("singlePullButton");
const showObtainedPkmnButton = document.getElementById("showObtainedPokemonButton");
const pkmnListContainer = document.getElementById("pkmnListContainer");

const pkmnColorByTypes = {
    "BUG": "#88950c",
    "DARK": "#3a2c21",
    "DRAGON": "#755ddf",
    "ELECTRIC": "#e79306",
    "FAIRY": "#de8fe0",
    "FIGHTING": "#5e2414",
    "FIRE": "#cb2501",
    "FLYING": "#5d73d6",
    "GHOST": "#444593",
    "GRASS": "#379b00",
    "GROUND": "#cfb054",
    "ICE": "#6dd2f4",
    "NORMAL": "#c3bfb6",
    "POISON": "#8c428d",
    "PSYCHIC": "#dc3164",
    "ROCK": "#9c873d",
    "STEEL": "#8f8e9f",
    "WATER": "#0d67c0"
};

const obtainedPkmnList = [];

const buildPkmnForCache = (pkmn) => {
    return {
        id: pkmn.id,
        name: pkmn.name,
        types: pkmn.types,
        moves: pkmn.moves.map(move => move.move),
        sprites: pkmn.sprites
    };
};

const buildPkmn = (pkmn, moves, isShiny) => {
    return {
        id: pkmn.id,
        name: pkmn.name,
        types: pkmn.types,
        moves: moves,
        img: isShiny ? pkmn.sprites.front_shiny : pkmn.sprites.front_default
    };
};

async function fetchPkmn(id) {
    const url = "https://pokeapi.co/api/v2/pokemon/" + id.toString();
    return await fetch(url).then(response => response.json());
}

const getRandomPkmn = async () => {
    const randomNum = Math.floor(Math.random() * MAX_POKEMON) + 1;
    const isShiny = Math.floor(Math.random() * SHINY_CHANCE) == 0;
    const cacheKey = CACHE_KEY_PREFIX + randomNum;

    const cachedPkmn = JSON.parse(localStorage.getItem(cacheKey));
    let pkmn;
    if (cachedPkmn) {
        const moves = resolvePkmnMoves(cachedPkmn.moves);
        pkmn = buildPkmn(cachedPkmn, moves, isShiny);
    } else {
        const obtainedPkmn = await fetchPkmn(randomNum);
        const moves = resolvePkmnMoves(obtainedPkmn.moves).map(move => move.move);
        cachePkmn(buildPkmnForCache(obtainedPkmn), cacheKey);
        pkmn = buildPkmn(obtainedPkmn, moves, isShiny);
    }
    obtainedPkmnList.push({...pkmn});
    savePkmnListToLocalStorage();
    return pkmn;
};

const getRandomPkmnList = async () => {
    const pkmnList = [];
    for (let i = 0; i < 10; i++) {
        const pkmn = await getRandomPkmn();
        pkmnList.push(pkmn);
    }
    return pkmnList;
};

const renderPkmn = (pkmn) => {
    const newPkmnContainer = document.createElement("div");
    newPkmnContainer.className = "pkmnContainer";
    newPkmnContainer.style.backgroundColor = getColorByType(pkmn.types[0].type.name)

    const newPkmnName = document.createElement("h5");
    newPkmnName.className = "pkmnName";
    newPkmnName.innerHTML = pkmn.name;
    newPkmnContainer.appendChild(newPkmnName);

    const newPkmnImg = document.createElement("img");
    newPkmnImg.className = "pkmnImg";
    newPkmnImg.src = pkmn.img;
    newPkmnContainer.appendChild(newPkmnImg);

    const newPkmnMovesContainer = document.createElement("ul");
    newPkmnMovesContainer.className = "movesContainer";
    if (pkmn.moves) {
        pkmn.moves.forEach(move => {
            const moveElement = document.createElement("li");
            moveElement.className = "pkmnMove";
            moveElement.innerHTML = move?.name ?? " ";
            newPkmnMovesContainer.appendChild(moveElement);
        });
    }
    newPkmnContainer.appendChild(newPkmnMovesContainer);

    pkmnListContainer.appendChild(newPkmnContainer);
};

const renderPkmnList = (pkmnList) => {
    pkmnList.forEach(pkmn => renderPkmn(pkmn));
};

const handleSinglePull = () => {
    clearShownPkmn();
    getRandomPkmn().then(pkmn => renderPkmn(pkmn));
};

const handleMultiPull = () => {
    clearShownPkmn();
    getRandomPkmnList().then(pkmnList => renderPkmnList(pkmnList));
};

const clearShownPkmn = () => {
    while(pkmnListContainer.firstChild) {
        pkmnListContainer.removeChild(pkmnListContainer.lastChild);
    }
};

const showObtainedPkmn = () => {
    clearShownPkmn();
    obtainedPkmnList.forEach(pkmn => renderPkmn(pkmn));
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

function getColorByType(type) {
    return pkmnColorByTypes[type.toUpperCase()];
}

function savePkmnListToLocalStorage() {
    localStorage.setItem("obtainedPkmnList", JSON.stringify(obtainedPkmnList))
}

function loadPkmnListFromLocalStorage() {
    const obtainedList = localStorage.getItem("obtainedPkmnList");
    if (obtainedList) {
        obtainedPkmnList.push(...JSON.parse(obtainedList));
    }
}

function cachePkmn(pkmn, cacheKey) {
    const pkmnData = {
        name: pkmn.name,
        types: pkmn.types,
        sprites: pkmn.sprites,
        moves: pkmn.moves
    };

    localStorage.setItem(cacheKey, JSON.stringify(pkmnData));
}

function areMovesEqual(savedPkmn, obtainedPkmn) {
    if (arr1.length !== arr2.length) return false;
    const savedPkmnSorted = savedPkmn.slice().sort();
    const obtainedPkmnSorted = obtainedPkmn.slice().sort();
    return savedPkmnSorted.every((val, index) => val === obtainedPkmnSorted[index]);
} 

function isPkmnAlreadyObtained(alreadyObtainedPkmnList, moves, isShiny) {
    const obtainedPkmnMoves = moves.slice().sort();
    return alreadyObtainedPkmnList.some(pkmn => {
        if(obtainedPkmnMoves.every((val, index) => pkmn.moves.slice().sort()[index])) {
            return pkmn.isShiny === isShiny;
        }
    });
}


loadPkmnListFromLocalStorage();
singlePullButton.addEventListener("click", handleSinglePull);
multiPullButton.addEventListener("click", handleMultiPull);
showObtainedPkmnButton.addEventListener("click", showObtainedPkmn);

// Para probar, borrar despues
handleMultiPull();


