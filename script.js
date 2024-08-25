"use strict"

const MAX_POKEMON = 150;

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

const getRandomPkmn = async () => {
    const randomNum = Math.floor(Math.random() * MAX_POKEMON) + 1;
    const url = "https://pokeapi.co/api/v2/pokemon/" + randomNum.toString();
    const obtainedPkmn = await fetch(url).then(response => response.json());
    const alreadyObtainedPkm = obtainedPkmnList.find(pkmn => pkmn.name.toLowerCase() === obtainedPkmn.name.toLowerCase());
    const pkmnData = {
        name: obtainedPkmn.name,
        types: obtainedPkmn.types,
        img: obtainedPkmn.sprites.front_default,
        moves: resolvePkmnMoves(obtainedPkmn.moves),
        quantity: 1
    };
    const pkmn = alreadyObtainedPkm ?? pkmnData;
    if (alreadyObtainedPkm) {
        pkmn.quantity += 1;
        alreadyObtainedPkm.quantity += 1;
    } else {
        obtainedPkmnList.push({...pkmn});
    }
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
    newPkmnName.innerHTML = pkmn.name + " x" + pkmn.quantity;
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
            moveElement.innerHTML = move?.move?.name ?? " ";
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

loadPkmnListFromLocalStorage();
singlePullButton.addEventListener("click", handleSinglePull);
multiPullButton.addEventListener("click", handleMultiPull);
showObtainedPkmnButton.addEventListener("click", showObtainedPkmn);

// Para probar, borrar despues
handleMultiPull();


