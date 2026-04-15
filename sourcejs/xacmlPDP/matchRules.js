const rulFunctions = require("./rulesFn");
const utils = require("./utils");
const validate = require("./validate");

exports.applicableRules = (rule) => {
    //Inizializzo le variabili che servono:
    var foundCondition = false; //Per determinare se è stata trovata la condizione soddisfatta.
    var foundTarget = false;    //Per determinare se è stato trovato un target soddisfatto.

    //Mi ricavo i target e le condizioni della regola iterata.
    var targetsRule = rulFunctions.getTargets(rule);
    var conditions = rulFunctions.getConditions(rule);
    //Controllo se ho delle condizioni soddisfatte e dei target soddisfatti.
    foundTarget = validate.validTargets(targetsRule);
    utils.setHistory('Targets', {verify: foundTarget})
    foundCondition = validate.validConditions(conditions);
    utils.setHistory('Conditions', {verify: foundCondition})

    
    const applicable=foundCondition && foundTarget
    return applicable
}
