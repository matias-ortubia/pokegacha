

export function areMovesEqual(savedPkmn, obtainedPkmn) {
    if (arr1.length !== arr2.length) return false;
    const savedPkmnSorted = savedPkmn.slice().sort();
    const obtainedPkmnSorted = obtainedPkmn.slice().sort();
    return savedPkmnSorted.every((val, index) => val === obtainedPkmnSorted[index]);
} 

export function isPkmnAlreadyObtained(alreadyObtainedPkmnList, moves, isShiny) {
    const obtainedPkmnMoves = moves.slice().sort();
    return alreadyObtainedPkmnList.some(pkmn => {
        if(obtainedPkmnMoves.every((val, index) => pkmn.moves.slice().sort()[index])) {
            return pkmn.isShiny === isShiny;
        }
    });
}

export function getPkmnIdFromUrl(url) {
    const parts = url.split('/');
    return parts[parts.length - 2];
}

    // TODO
export function getTier(rarityNum) {
    // Segun el num, dice si es R, SR, S, SS
    TODO
}