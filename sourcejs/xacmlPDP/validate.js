const { getValues, getAttributeDesignator } = require("./rulesFn");
const utils = require("./utils");

var subject = '', action = '', resource = '';

exports.setElements = (subj, act, rsc) => {
    subject = subj
    action = act
    resource = rsc
}

exports.getSubject = () => {
    return subject
}
exports.getAction = () => {
    return action
}
exports.getResource = () => {
    return resource
}

const Corresponding = (attributeId, regex) => {
    if(attributeId.includes('action'))
        return(regex.test(action))
            
    if(attributeId.includes('resource'))
        return(regex.test(resource))
        
    if(attributeId.includes('subject'))
        return(regex.test(subject))
}

const MatchCondtion = (func, attributeId, element) => {
    if(attributeId.includes('action'))
        return(func(action, element))
            
    if(attributeId.includes('resource'))
        return(func(resource, element))
        
    if(attributeId.includes('subject'))
        return(func(subject, element))
}

const BasicMatchFunctions = (func, category, values) => {
    const value= values[0]
    if(func.includes('equal'))
        return MatchCondtion((x,y)=>x==y, category, value)
    else if (func.includes('is-in'))
        return MatchCondtion((x,y)=>y.includes(x), category, values)
    else if (func.includes('at-least-one-member-of'))
        return MatchCondtion((x,y)=>y.split('').some(char => x.includes(char)), category, value)
    else if (func.includes('subset'))
        return MatchCondtion((x,y)=>[...y].every(char => x.includes(char)), category, value)
    else return undefined
}

const NumericalMatchFunctions = (func, category, values) => {
    const value= values[0]
    if(func.includes('greater-than-or-equal'))
        return MatchCondtion((x,y)=>x>=y, category, value)  
    else if (func.includes('less-than-or-equal')) 
        return MatchCondtion((x,y)=>x<=y, category, value)   
    else if(func.includes('greater-than'))    
        return MatchCondtion((x,y)=>x>y, category, value)   
    else if (func.includes('less-than'))
        return MatchCondtion((x,y)=>x<y, category, value)
    else return undefined
}

const InRangeMatchFunction = (func, category, values) => {
    const value= values[0]
    if(func.includes('time-in-range')){
        return MatchCondtion(
            (x,y)=>(new Date(`2000-01-01T${targetTime}`) >= new Date(`2000-01-01T${y[0]}`) && 
                    new Date(`2000-01-01T${targetTime}`) <= new Date(`2000-01-01T${y[1]}`), category, value))
    } else return undefined
}

/**
 * Verifica se sono soddisfatti i match per le STRINGHE.
 * @param {*} matchElement Tag element Match nella regola.
 * @returns True per verifica corretta, False altrimenti.
 */
const verifyString = (func, values, category) => {
    return BasicMatchFunctions(func, category, values)
}

/**
 * Verifica se sono soddisfatti i match per i BOOLEAN.
 * @param {*} matchElement Tag element Match nella regola.
 * @returns True per verifica corretta, False altrimenti.
 */
const verifyBoolean = (func, values, category) => {    
    return BasicMatchFunctions(func, category, values)
}

/**
 * Verifica se sono soddisfatti i match per gli INTEGER.
 * @param {*} matchElement Tag element Match nella regola.
 * @returns True per verifica corretta, False altrimenti.
**/
const verifyInteger = (func, values, category) => {
    if(!Corresponding(category, /^-?\d+$/)) return false
    var match = NumericalMatchFunctions(func, category, values)
    if(utils.isUndefined(match)) match=BasicMatchFunctions(func, category, values)
    return match
}

/**
 * Verifica se sono soddisfatti i match per i TIME.
 * @param {*} matchElement Tag element Match nella regola.
 * @returns True per verifica corretta, False altrimenti.
 */
const verifyTime = (func, values, category) => {
    var match = NumericalMatchFunctions(func, category, values)
    if(utils.isUndefined(match)) match=BasicMatchFunctions(func, category, values)
    if(utils.isUndefined(match)) match = InRangeMatchFunction(func, category, values)
    return match
}

/**
 * Verifica se sono soddisfatti i match per le DATE.
 * @param {*} matchElement Tag element Match nella regola.
 * @returns True per verifica corretta, False altrimenti.
 */
const verifyDate = (func, values, category) => {
    var match = NumericalMatchFunctions(func, category, values)
    if(utils.isUndefined(match)) match=BasicMatchFunctions(func, category, values)
    return match
}

/**
 * Verifica se sono soddisfatti i match per i DATETIME.
 * @param {*} matchElement Tag element Match nella regola.
 * @returns True per verifica corretta, False altrimenti.
 */
const verifyDateTime = (func, values, category) => {
    var match = NumericalMatchFunctions(func, category, values)
    if(utils.isUndefined(match)) match=BasicMatchFunctions(func, category, values)
    return match
}

/**
 * Verifica se sono soddisfatti i match per gli URI.
 * @param {*} matchElement Tag element Match nella regola.
 * @returns True per verifica corretta, False altrimenti.
 */
const verifyAnyUri = (func, values, category) => {    
    return BasicMatchFunctions(func, category, values)
}

/**
 * Verifica se sono soddisfatti i match per le STRINGHE ESADECIMALI.
 * @param {*} matchElement Tag element Match nella regola.
 * @returns True per verifica corretta, False altrimenti.
 */
const verifyHexBinary = (func, values, category) => {    
    return BasicMatchFunctions(func, category, values)
}

/**
 * Verifica se sono soddisfatti i match per le STRINGHE IN BASE 64.
 * @param {*} matchElement Tag element Match nella regola.
 * @returns True per verifica corretta, False altrimenti.
 */
const verifyBase64Binary = (func, values, category) => {
    return BasicMatchFunctions(func, category, values)
}

/**
 * Wrapper method: in base al dataType si rimanda alla funzione vera e propria.
 * Verifica dei matching.
 * @param {*} dataType Tipo di dato da confrontare
 * @param {*} values Valori da confrontare
 * @param {*} func Funzione che deve essere eseguita per il matching
 * @param {*} category Entità da confrontare: subject; action; resource.
 * @returns 
 */
const verify = (dataType, values, func, category) => {
    var charTabs = '    '; //4 spazi (BCKSP)
    values = values.map(v=> v.replaceAll("\n", ""));
    values = values.map(v=> v.replaceAll(charTabs, ""));

    if(dataType.includes('#string')){
        return verifyString(func, values, category);
    } else if(dataType.includes('#boolean')){
        return verifyBoolean(func, values, category);
    } else if(dataType.includes('#integer')){
        return verifyInteger(func, values, category);
    } else if(dataType.includes('#time')){
        return verifyTime(func, values, category);
    } else if(dataType.includes('#date')){
        return verifyDate(func, values, category);
    } else if(dataType.includes('#dateTime')){
        return verifyDateTime(func, values, category);
    } else if(dataType.includes('#anyURI')){
        return verifyAnyUri(func, values, category);
    } else if(dataType.includes('#hexBinary')){
        return verifyHexBinary(func, values, category);
    } else if(dataType.includes('#base64Binary')){
        return verifyBase64Binary(func, values, category);
    }
}

/**
 * Verifica se i target delle regole sono soddisfatti.
 * @param {*} targetsRule Targets della regola.
 * @returns True per soddisfatto, False altrimenti.
**/
exports.validTargets = (targetsRule) => {
    if(targetsRule.length==0) return true
    anyOfRulesArray=targetsRule[0][0].elements
    var allOfId = 0;
    //Ciclo tutti i gruppi di target AnyOf
    while(allOfId < anyOfRulesArray.length){
        if(!utils.isUndefined(anyOfRulesArray[allOfId])){
            var allOfMatchArray = anyOfRulesArray[allOfId];
            var matchId=0
            var isVerified = true
            //Per ogni gruppo di AnyOf, controllo se i Match sono tutti verificati
            while(matchId<allOfMatchArray.elements.length){
                if(!utils.isUndefined(allOfMatchArray.elements[matchId])){
                    var match = allOfMatchArray.elements[matchId];
                    if(isVerified){
                        var func = match.attributes.MatchId;
                        const attributeDesignator = getAttributeDesignator(match.elements)
                        var dataType = attributeDesignator.DataType;
                        var category = attributeDesignator.Category;
                        var values = getValues(match.elements)

                        isVerified = verify(dataType, values, func, category)               
                    }                    
                }
                matchId++
            }
            //se tutti i match sono verificati va bene, altrimenti, rimettiamo isVerified a true e controlliamo il prossimo AnyOf se c'è
            if(isVerified) return true
            isVerified=true
        }
        allOfId++;
    }
    return false;
}

/**
 * Verifica se la condizione viene soddifatta.
 * @param {*} conditions Array di condizioni.
 * @returns True: condizione soddisfatta, False altrimenti
**/
exports.validConditions = (conditions) => {
    const condition = conditions[0]  
    if(!utils.isUndefined(condition)){
        //Verifico se esiste l'elemento denominato con Apply.
        var applyElement = condition.elements[0];
        if(applyElement.name =='Apply'){
            var func = applyElement.elements[0].attributes.FunctionId
            const attributeDesignator = getAttributeDesignator(applyElement.elements)
            var dataType = attributeDesignator.DataType;
            var category = attributeDesignator.Category;
            var values = getValues(applyElement.elements);
            
            return verify(dataType, values, func, category)
        }
    }
    return false
}