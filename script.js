"use strict"

import { getRandomPkmn, getRandomPkmnList } from "./client/pokeapiClient.js";
import { getPkmnListFromLocalStorage, savePkmnListToLocalStorage } from "./utils/pkmnCacheHelper.js";
import { sortById } from "./utils/filtersHelper.js";

const appContainer = document.getElementById("appContainer");

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


const renderPkmn = (pkmn, listContainer) => {
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

    const newPkmnAbilityContainer = document.createElement("div");
    newPkmnAbilityContainer.className = "abilityContainer";

    const newPkmnAbility = document.createElement("p");
    newPkmnAbility.className = "abilityName";
    newPkmnAbility.innerHTML = formatAbilityName(pkmn.ability);
    newPkmnAbilityContainer.appendChild(newPkmnAbility);
    newPkmnContainer.appendChild(newPkmnAbilityContainer);

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

    listContainer.appendChild(newPkmnContainer);
};

function formatAbilityName(name) {
    return name
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

const renderPkmnList = (pkmnList, listContainer) => {
    pkmnList.forEach(pkmn => renderPkmn(pkmn, listContainer));
};

function handleSinglePull(listContainer) {
    clearShownPkmn(listContainer);
    getRandomPkmn().then(pkmn => {
        renderPkmn(pkmn, listContainer);
        obtainedPkmnList.push({...pkmn});
        savePkmnListToLocalStorage(obtainedPkmnList);
    });
};

function handleMultiPull(listContainer) {
    clearShownPkmn(listContainer);
    getRandomPkmnList().then(pkmnList => {
        renderPkmnList(pkmnList, listContainer);
        obtainedPkmnList.push(...pkmnList);
        savePkmnListToLocalStorage(obtainedPkmnList);
    });
};

const clearShownPkmn = (listContainer) => {
    while(listContainer.firstChild) {
        listContainer.removeChild(listContainer.lastChild);
    }
};

function clearView() {
    while(appContainer.firstChild) {
        appContainer.removeChild(appContainer.lastChild);
    }
}

function renderNavbar(listContainer) {
    const navbar = document.createElement("nav");
    navbar.id = "navbar";

    const gachaButton = document.createElement("button");
    gachaButton.innerHTML = "Gacha";
    gachaButton.className = "navbarButton";
    gachaButton.addEventListener("click", () => renderGachaView(listContainer));
    navbar.appendChild(gachaButton);

    const obtainedPkmnButton = document.createElement("button");
    obtainedPkmnButton.innerHTML = "Obtained Pokemon";
    obtainedPkmnButton.className = "navbarButton";
    obtainedPkmnButton.addEventListener("click", () => renderObtainedView(listContainer));
    navbar.appendChild(obtainedPkmnButton);

    appContainer.appendChild(navbar);
}

const renderPullButtons = (viewContainer, listContainer) => {
    const buttonsContainer = document.createElement("div");
    buttonsContainer.className = "gachaButtonsContainer";

    const singlePullButton = document.createElement("button");
    singlePullButton.className = "button pull";
    singlePullButton.innerHTML = "x1 pull";
    singlePullButton.addEventListener("click", () => handleSinglePull(listContainer));
    buttonsContainer.appendChild(singlePullButton);

    const multiPullButton = document.createElement("button");
    multiPullButton.className = "button pull";
    multiPullButton.innerHTML = "x10 pull";
    multiPullButton.addEventListener("click", () => handleMultiPull(listContainer));
    buttonsContainer.appendChild(multiPullButton);

    viewContainer.appendChild(buttonsContainer);
};

function renderObtainedPkmn(listContainer) {
    obtainedPkmnList.forEach(pkmn => renderPkmn(pkmn, listContainer));
};

function getColorByType(type) {
    return pkmnColorByTypes[type.toUpperCase()];
}

function renderGachaView(listContainer) {
    clearShownPkmn(listContainer);
    clearView();
    const main = document.createElement("main");
    const viewContainer = document.createElement("div");
    viewContainer.className = "gachaView";

    renderNavbar(listContainer);
    renderPullButtons(viewContainer, listContainer);
    viewContainer.appendChild(listContainer);
    main.appendChild(viewContainer);
    appContainer.appendChild(main);
}

function renderObtainedView(listContainer) {
    clearShownPkmn(listContainer);
    clearView();
    renderNavbar(listContainer);

    renderObtainedPkmn(listContainer);
    appContainer.appendChild(listContainer);
}

function loadPkmnListFromLocalStorage() {
    const obtainedList = getPkmnListFromLocalStorage();
    if (!!obtainedList) {
        obtainedPkmnList.push(...JSON.parse(obtainedList));
    }
}


const pkmnListContainer = document.createElement("div");
pkmnListContainer.id = "pkmnListContainer";

loadPkmnListFromLocalStorage();
renderGachaView(pkmnListContainer);

