

function areMovesEqual(savedPkmn, obtainedPkmn) {
    if (arr1.length !== arr2.length) return false;
    const savedPkmnSorted = savedPkmn.slice().sort();
    const obtainedPkmnSorted = obtainedPkmn.slice().sort();
    return savedPkmnSorted.every((val, index) => val === obtainedPkmnSorted[index]);
} 

function isPkmnAlreadyObtained(alreadyObtainedPkmnList, moves, isShiny) {
    const obtainedPkmnMoves = moves.slice().sort();
    return alreadyObtainedPkmnList.some(pkmn => {
        if(obtainedPkmnMoves.every((val, index) => pkmn.moves.slice().sort()[index])) {
            return pkmn.isShiny === isShiny;
        }
    });
}