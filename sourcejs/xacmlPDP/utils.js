/**
 * Verifica se il valore in ingresos è definito o meno.
 * @param {*} pValue Valore da verificare
 * @returns True: valore è undefined, False altrimenti.
 */
exports.isUndefined = (pValue) => {
    return (pValue==undefined);
}

const newAction = (type, elements) => {
    switch (type) {
        case 'PolicySet':
            return `Analicy policySet ${elements.policySetId}, con algoritmo: ${elements.alg}`
        case 'Policy': 
            return `Analisi policy ${elements.policyId}, con algoritmo: ${elements.alg}`
        case 'Targets':
            return `I targets  ${elements.verify ? 'corrispondono' : 'non corrispondono'}`
        case 'Rule':
            return `Analisi regola ${elements.ruleId}`
        case 'Conditions':
            return `Le condizioni ${elements.verify ? 'corrispondono' : 'non corrispondono'}`
        case 'Effect':
            return `L'effetto ${elements.verify ? 'corrisponde' : 'non corrisponde'}`
        case 'FinalRule':
            return `La regola estratta è ${elements.ruleId} ${elements.defaultRule ? 'di default' : ''} ${elements.effect && `, con effetto ${elements.effect}`}`
        case 'Message':
            return `Quindi la request è ${elements.messageReturn}`
    }
}

var history=[];

exports.clearHistory = () => {
    history = [];
}

exports.setHistory = (type, elemts) => {
    history.push(newAction(type, elemts))
}

exports.getHistory = () => {
    return history
}