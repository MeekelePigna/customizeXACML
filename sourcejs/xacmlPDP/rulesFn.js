/**
 * Classe contenente le funzioni per il tag Rules/Targets/Conditions.
 */

//Carico le utilities.
const utils = require("./utils");

/**
 * Ottiene tutti gli elementi Target presenti nella policy.
 * @param {*} policy policy.
 * @returns Array di Targets.
 */
exports.getTargetsPolicy = (policy) => {
    //Inbizializzo un array di target vuoto.
    var target = [];
    //Verifico l'esistenza degli elementi della policy.
    if(!utils.isUndefined(policy.elements))
    {
        var i=0;
        //Ciclo i vari elementi e aggiungo solo quelli dove il nome è Target.
        while(i < policy.elements.length){
            if(policy.elements[i].name == 'Target')
                if(!utils.isUndefined(policy.elements[i].elements))
                    target.push(policy.elements[i].elements);
            i++;
        }
    }
    return target;
}

/**
 * Ottiene tutte le regole presenti nella policy.
 * @param {*} policy Tag Policy. È per singola policy.
 * @returns Array delle regole presenti nella Policy.
 */
exports.getRules = (policy) => {
    //Inizializzo l'array vuoto.
    var rules = [];
    var i = 0;
    //Itero le policy: se il nome dell'elemento è Rule, la aggiungo all'array.
    while(i < policy.elements.length){
        if(policy.elements[i].name=='Rule')
            rules.push(policy.elements[i]);
        i++;
    }
    return rules;
}

/**
 * Ottiene la regola di default da applicare.
 * @param {*} policy Tag Policy. È per singola policy.
 * @returns Regola di default.
 */
exports.getDefaultRule = (policy) => {
    //Ottengo tutte le regole.
    var rules = this.getRules(policy);
    var i =0;
    //Verifico se esiste una regola che non contiene figli (altri elementi tag sotto di essa).
    while(i < rules.length) {
        if(utils.isUndefined(rules[i].elements))
            return rules[i]; //Ritorno la regola di default.
        i++;
    }
    return undefined;
}

/**
 * Ottiene tutti gli elementi Target presenti nella regola.
 * @param {*} rule Regola.
 * @returns Array di Targets.
 */
exports.getTargets = (rule) => {
    //Inbizializzo un array di target vuoto.
    var target = [];
    //Verirfico l'esistenza degli elementi della regola.
    if(!utils.isUndefined(rule.elements))
    {
        var i=0;
        //Ciclo i vari elementi e aggiungo solo quelli dove il nome è Target.
        while(i < rule.elements.length){
            if(rule.elements[i].name == 'Target')
                if(!utils.isUndefined(rule.elements[i].elements))
                    target.push(rule.elements[i].elements);
            i++;
        }
    }
    return target;
}

/**
 * Ottiene tutti i tag delle condizioni della regola.
 * @param {*} rule Regola.
 * @returns Array delle condizioni.
 */
exports.getConditions = (rule) => {
    var cnds = []; //Inizializzo un array vuoto di condizioni.

    //Se ho degli elementi nella regola.
    if(!utils.isUndefined(rule.elements)) {
        var i=0;
        //Itero gli elementi e mi ricavo solo quelli con il nome uguale a Condition.
        while(i < rule.elements.length) {
            if(rule.elements[i].name == 'Condition')
                cnds.push(rule.elements[i]);
            i++;
        }
    }
    return cnds;
}

/**
 * Ottiene l'effetto della regola.
 * @param {*} rule Regola.
 * @returns Array delle condizioni.
 */
exports.getEffect = (rule) => {
    var cnds=undefined

    //Se ho degli elementi nella regola.
    if(!utils.isUndefined(rule.attributes)) {
        cnds=rule.attributes.Effect
    }
    return cnds;
}

/**
 * Ottiene tutti i valori.
 * @param {*} rule Regola.
 * @returns Array degli AttributeValue.
 */
exports.getValues = (obj) => {
    var values=[]
    var i=0
    while(i<obj.length){
        if(!utils.isUndefined(obj[i])){
            var attributeValue = obj[i].name == 'AttributeValue' ? 
                obj[i].elements : 
                obj[i].name == 'Apply' ? 
                    obj[i].elements[0].elements : 
                    undefined

            if(!utils.isUndefined(attributeValue))
                values.push(attributeValue[0].text)
        }


        i++;
    }

    return values
}

/**
 * Ottiene il valore AttributeDesignator.
 * @param {*} rule Regola.
 * @returns Array degli AttributeDesignator.
 */
exports.getAttributeDesignator = (obj) => {
    var i=0
    while(i<obj.length){
        if(!utils.isUndefined(obj[i])){
            if( obj[i].name == 'AttributeDesignator' ){
                return obj[i].attributes
            }
        }

        i++;
    }

    return undefined
}