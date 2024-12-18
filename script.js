"use strict"

import { getRandomPkmn, getRandomPkmnList } from "./client/pokeapiClient.js";
import { getPkmnListFromLocalStorage, savePkmnListToLocalStorage } from "./utils/pkmnCacheHelper.js";

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


const renderPkmn = (pkmn) => {
    const newPkmnContainer = document.createElement("div");
    newPkmnContainer.className = "pkmnContainer";
    newPkmnContainer.style.backgroundColor = getColorByType(pkmn.types[0].type.name)

    const newPkmnName = document.createElement("h5");
    newPkmnName.className = "pkmnName" + (pkmn.isShiny ? " shinyName" : "");
    newPkmnName.innerHTML = pkmn.name + (pkmn.isShiny ? " ✮" : "");
    newPkmnContainer.appendChild(newPkmnName);

    const newPkmnImg = document.createElement("img");
    newPkmnImg.className = "pkmnImg";
    newPkmnImg.src = pkmn.img;
    newPkmnContainer.appendChild(newPkmnImg);

    const newPkmnAbility = document.createElement("p");
    newPkmnAbility.className = "ability";
    newPkmnAbility.innerHtml = pkmn.ability;
    newPkmnContainer.appendChild(newPkmnAbility)

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
    getRandomPkmn().then(pkmn => {
        renderPkmn(pkmn);
        obtainedPkmnList.push({...pkmn});
        savePkmnListToLocalStorage(obtainedPkmnList);
    });
};

const handleMultiPull = () => {
    clearShownPkmn();
    getRandomPkmnList().then(pkmnList => {
        renderPkmnList(pkmnList);
        obtainedPkmnList.push(...pkmnList);
        savePkmnListToLocalStorage(obtainedPkmnList);
    });
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

function getColorByType(type) {
    return pkmnColorByTypes[type.toUpperCase()];
}

function loadPkmnListFromLocalStorage() {
    const obtainedList = getPkmnListFromLocalStorage();
    if (!!obtainedList) {
        obtainedPkmnList.push(...JSON.parse(obtainedList));
    }
}

loadPkmnListFromLocalStorage();
singlePullButton.addEventListener("click", handleSinglePull);
multiPullButton.addEventListener("click", handleMultiPull);
showObtainedPkmnButton.addEventListener("click", showObtainedPkmn);

// Para probar, borrar despues
handleMultiPull();


