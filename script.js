"use strict"

const MAX_POKEMON = 150;

const multiPullButton = document.getElementById("multiPullButton");
const singlePullButton = document.getElementById("singlePullButton");
const showObtainedPokemonButton = document.getElementById("showObtainedPokemonButton");
const pokemonContainer = document.getElementById("pokemonContainer");
const obtainedPokemon = [];

const getRandomPokemon = async () => {
    const randomNum = Math.floor(Math.random() * MAX_POKEMON) + 1;
    const url = "https://pokeapi.co/api/v2/pokemon/" + randomNum.toString();
    const pokemon = await fetch(url).then(response => response.json())
    obtainedPokemon.push(pokemon);
    return pokemon;
};

const getRandomPokemons = async () => {
    const pokemonList = [];
    for (let i = 0; i < 10; i++) {
        const pokemon = await getRandomPokemon();
        pokemonList.push(pokemon);
    }
    return pokemonList;
};

const renderPokemon = (name) => {
    const newPokemonElement = document.createElement("p");
    newPokemonElement.innerHTML = name;
    pokemonContainer.appendChild(newPokemonElement);
};

const renderPokemons = (pokemonList) => {
    pokemonList.forEach(pokemon => renderPokemon(pokemon.name));
};

const handleSinglePull = () => {
    clearPulledPokemon();
    getRandomPokemon().then(pokemon => renderPokemon(pokemon.name));
};

const handleMultiPull = () => {
    clearPulledPokemon();
    getRandomPokemons().then(pokemonList => renderPokemons(pokemonList));
};

const clearPulledPokemon = () => {
    while(pokemonContainer.firstChild) {
        pokemonContainer.removeChild(pokemonContainer.lastChild);
    }
};

const showObtainedPokemon = () => {
    console.log(obtainedPokemon);
};

singlePullButton.addEventListener("click", handleSinglePull);
multiPullButton.addEventListener("click", handleMultiPull);
showObtainedPokemonButton.addEventListener("click", showObtainedPokemon);

