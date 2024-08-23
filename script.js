"use strict"

const MAX_POKEMON = 150;

const multiPullButton = document.getElementById("multiPullButton");
const singlePullButton = document.getElementById("singlePullButton");
const showObtainedPokemonButton = document.getElementById("showObtainedPokemonButton");
const pkmListContainer = document.getElementById("pkmListContainer");

const pkmColorByTypes = {
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

const obtainedPokemonList = [];

const getRandomPokemon = async () => {
    const randomNum = Math.floor(Math.random() * MAX_POKEMON) + 1;
    const url = "https://pokeapi.co/api/v2/pokemon/" + randomNum.toString();
    const obtainedPokemon = await fetch(url).then(response => response.json());
    const alreadyObtainedPkm = obtainedPokemonList.find(pkm => pkm.name.toLowerCase() === obtainedPokemon.name.toLowerCase());
    const pokemonData = {
        name: obtainedPokemon.name,
        types: obtainedPokemon.types,
        img: obtainedPokemon.sprites.front_default,
        quantity: 1
    };
    const pokemon = alreadyObtainedPkm ?? pokemonData;
    if (alreadyObtainedPkm) {
        pokemon.quantity += 1;
        alreadyObtainedPkm.quantity += 1;
    } else {
        obtainedPokemonList.push({...pokemon});
    }
    return pokemon;
};

const getRandomPokemonList = async () => {
    const pokemonList = [];
    for (let i = 0; i < 10; i++) {
        const pokemon = await getRandomPokemon();
        pokemonList.push(pokemon);
    }
    return pokemonList;
};

const renderPokemon = (pokemon) => {
    const newPokemonContainer = document.createElement("div");
    newPokemonContainer.className = "pkmContainer";
    newPokemonContainer.style.backgroundColor = getColorByType(pokemon.types[0].type.name)

    const newPokemonName = document.createElement("h5");
    newPokemonName.className = "pkmName";
    newPokemonName.innerHTML = pokemon.name + " x" + pokemon.quantity;
    newPokemonContainer.appendChild(newPokemonName);

    const newPokemonImg = document.createElement("img");
    newPokemonImg.className = "pkmImg";
    newPokemonImg.src = pokemon.img;
    newPokemonContainer.appendChild(newPokemonImg);

    pkmListContainer.appendChild(newPokemonContainer);
};

const renderPokemonList = (pokemonList) => {
    pokemonList.forEach(pokemon => renderPokemon(pokemon));
};

const handleSinglePull = () => {
    clearShownPokemon();
    getRandomPokemon().then(pokemon => renderPokemon(pokemon));
};

const handleMultiPull = () => {
    clearShownPokemon();
    getRandomPokemonList().then(pokemonList => renderPokemonList(pokemonList));
};

const clearShownPokemon = () => {
    while(pkmListContainer.firstChild) {
        pkmListContainer.removeChild(pkmListContainer.lastChild);
    }
};

const showObtainedPokemon = () => {
    clearShownPokemon();
    obtainedPokemonList.forEach(pokemon => renderPokemon(pokemon));
};

function getColorByType(type) {
    return pkmColorByTypes[type.toUpperCase()];
};

singlePullButton.addEventListener("click", handleSinglePull);
multiPullButton.addEventListener("click", handleMultiPull);
showObtainedPokemonButton.addEventListener("click", showObtainedPokemon);

// Para probar, borrar despues
handleMultiPull();


