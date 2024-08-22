"use strict"

const MAX_POKEMON = 150;

const multiPullButton = document.getElementById("multiPullButton");
const singlePullButton = document.getElementById("singlePullButton");
const showObtainedPokemonButton = document.getElementById("showObtainedPokemonButton");
const pkmListContainer = document.getElementById("pkmListContainer");
const obtainedPokemonList = [];

const getRandomPokemon = async () => {
    const randomNum = Math.floor(Math.random() * MAX_POKEMON) + 1;
    const url = "https://pokeapi.co/api/v2/pokemon/" + randomNum.toString();
    const obtainedPokemon = await fetch(url).then(response => response.json());
    const alreadyObtainedPkm = obtainedPokemonList.find(pkm => pkm.data.name.toLowerCase() === obtainedPokemon.name.toLowerCase());
    const pokemon = alreadyObtainedPkm ?? {data: obtainedPokemon, quantity: 1};
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

    const newPokemonName = document.createElement("h5");
    newPokemonName.className = "pkmName";
    newPokemonName.innerHTML = pokemon.data.name + " x" + pokemon.quantity;
    newPokemonContainer.appendChild(newPokemonName);

    const newPokemonImg = document.createElement("img");
    newPokemonImg.className = "pkmImg";
    newPokemonImg.src = pokemon.data.sprites.front_default;
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

singlePullButton.addEventListener("click", handleSinglePull);
multiPullButton.addEventListener("click", handleMultiPull);
showObtainedPokemonButton.addEventListener("click", showObtainedPokemon);

// Para probar, borrar despues
handleMultiPull();


