import { renderObtainedPkmn, clearShownPkmn } from "../script.js"; 

export function sortByObtainedDate(pkmnList, listContainer) {

}

export function sortById(pkmnList, listContainer, reversed = false) {
    let cmpById;
    if (reversed) cmpById = (a, b) => b.id - a.id;
    else cmpById = (a, b) => a.id - b.id;
    pkmnList.sort(cmpById);
    clearShownPkmn(listContainer);
    renderObtainedPkmn(listContainer);
}

export function sortByName(pkmnList, listContainer, reversed = false) {
    let cmpByName;
    if (reversed) cmpByName = (a, b) => b.name.localeCompare(a.name);
    else cmpByName = (a, b) => a.name.localeCompare(b.name)
    pkmnList.sort(cmpByName);
    clearShownPkmn(listContainer);
    renderObtainedPkmn(listContainer);
}

export function sortByType(pkmnList, listContainer) {
    const typeOrder = ["normal", "fire", "water", "grass", "electric", "ice", "fighting", "poison", "ground", "flying", "psychic", "bug", "rock", "ghost", "dragon", "dark", "steel", "fairy"];

    const cmpByType = (a, b) => {
        const aIndex = typeOrder.indexOf(a.types[0].type.name);
        const bIndex = typeOrder.indexOf(b.types[0].type.name);

        // Si no está en la lista, lo mandamos al final
        const aRank = aIndex === -1 ? typeOrder.length : aIndex;
        const bRank = bIndex === -1 ? typeOrder.length : bIndex;

        return aRank - bRank;
    };

    pkmnList.sort(cmpByType);
    console.log(pkmnList);
    clearShownPkmn(listContainer);
    renderObtainedPkmn(listContainer);
}
