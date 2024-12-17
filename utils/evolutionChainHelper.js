import { getPkmnIdFromUrl } from "./pkmnHelper.js";

const MAX_PKMN_NUMBER = 151; // For now, it only supports Pokemon from the first gen

/* 
*    Returns the pokemon possible evolutions IDs using Breadth First Search (BFS) algorithm.
*/
export function getPkmnEvolutions(evolutionChain, pkmnName) {
    let queue = [evolutionChain];

    while (queue.length > 0) {
        const currentEvolution = queue.shift();
        const currentName = currentEvolution.species.name.toLowerCase();

        if (currentName === pkmnName) {
            return resolveEvolutionsIds(currentEvolution.evolves_to);
        }

        if (currentEvolution.evolves_to.length > 0) {
            queue.push(...currentEvolution.evolves_to);
        }
    }

    return null;
}

export function getPkmnPreEvolution(evolutionChain, pkmnName) {
    const queue = [{ evolution: evolutionChain, parent: null }];

    while (queue.length > 0) {
        const { evolution, parent } = queue.shift();
        const currentName = evolution.species.name.toLowerCase();

        if (currentName === pkmnName) {
            return parent ? getPkmnIdFromUrl(parent.species.url) : null;
        }

        for (const nextEvolution of evolution.evolves_to) {
            queue.push({ evolution: nextEvolution, parent: evolution });
        }
    }

    return null;
}

export function getPkmnEvolutionStage(evolutionChain, pkmnName) {
    let queue = [{ evolution: evolutionChain, stage: 0 }];

    while (queue.length > 0) {
        const { evolution, stage } = queue.shift();
        const currentName = evolution.species.name.toLowerCase();

        if (currentName === pkmnName) {
            return stage;
        }

        for (const nextEvolution of evolution.evolves_to) {
            queue.push({ evolution: nextEvolution, stage: stage + 1 });
        }
    }

    return null;
}

function resolveEvolutionsIds(evolutions) {
    return evolutions
            .map(evolution => evolution.species.url)
            .map(evolutionUrl => getPkmnIdFromUrl(evolutionUrl))
            .filter(evolutionId => evolutionId <= MAX_PKMN_NUMBER);
}