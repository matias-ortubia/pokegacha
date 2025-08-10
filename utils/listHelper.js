import { renderObtainedPkmn, clearShownPkmn } from "../script.js"; 

export function sortById(pkmnList, listContainer, reversed = false) {
    let cmpById;
    if (reversed) cmpById = (a, b) => b.id - a.id;
    else cmpById = (a, b) => a.id - b.id;
    pkmnList.sort(cmpById);
    clearShownPkmn(listContainer);
    renderObtainedPkmn(listContainer);
}

export function sortByName(pkmnList, reversed) {
    let cmpByName;
}

export function sortByType(pkmnList) {
    let cmpByType;
}
