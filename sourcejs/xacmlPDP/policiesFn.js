/**
 * Classe contenente le funzioni per il tag Policy/PolicySet.
 */

//Carico le utilities.
const utils = require("./utils");

/**
 * Ottiene le politiche della PolicySet.
 * @param {*} objPolicy Intera policy XACML.
 * @returns Array di policy.
 */
exports.getPolicies = (objPolicy) => {
    var policies = [];
    var firstTag = objPolicy.elements[0];
    if(firstTag.name !== "PolicySet"){
        policies.push(firstTag); //Ho solo una politica.
    }
    else{
        policies = firstTag.elements;
    }

    return policies;
}

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