/**
 * Classe per gestire il Combining algorhitm del FirstApplicable
 * Viene applicata la prima regola che soddisfa i target e le condizioni di ogni politica.
 * Se non presente viene applicata quella di default.
 * Se non presente quella di default viene restituito un NOT-APPLICABLE.
 */
const utils = require("./utils");               //Importo le utilities.
const matchRules = require("./matchRules");
const rulFunctions = require("./rulesFn");      //Importo le funzioni delle regole.
const validate = require ("./validate")

/**
 * Ottiene la prima regola applicabile che soddisfa sia i Target che le condizioni.
 * @param {*} rules Regole della policy.
 * @returns Regola da applicare.
 */
function getApplicableRule(rule){
    utils.setHistory('Rule', {ruleId: rule.attributes.RuleId})
    var returnRule = false; //Inizializzo la regola da applicare a undefined.
 
    //Se entrambi condizioni e target sono soddisfatti allora ho la regola da applicare.
    if(matchRules.applicableRules(rule)){
        returnRule=true
    }

    return returnRule;
}

function getApplicableRules(rules, defaultRule){    
    var i=0; 
    while(i<rules.length){
        if(rules[i]!=defaultRule){
            if(getApplicableRule(rules[i])){
               return rules[i]
            }
        }
        i++
    }
    return undefined
}

/**
 * Funzione utilizzata dal server per determinare la regola da applicare con l'algoritmo FIRST APPLICABLE.
 * @param {*} objPolicy Intera policy XACML
 * @param {*} subj Soggetto per le condizioni.
 * @param {*} act Azione richiesta per Target.
 * @param {*} rsc Risorsa richiesta per Target.
 * @returns Risposta dal PDP.
 */
exports.handleFirstApplicable = (policy, subj, act, rsc) => {
    utils.setHistory('Policy', {policyId: policy.attributes.PolicyId, alg: `first-applicable`})
    validate.setElements(subj, act, rsc)
    var messageReturn  = 'Not applicable'; //Messaggio di default.
    //Regole della policy.
    var rulesPolicy = rulFunctions.getRules(policy);
    //Regola di default.
    var defaultRule = rulFunctions.getDefaultRule(policy);
    //Regola da applicare con FirstApplicable.
    var firstRule = getApplicableRules(rulesPolicy, defaultRule);
    var rule;
    //Verifico esistenza della firstRule.
    if(!utils.isUndefined(firstRule)){
        rule = firstRule
        messageReturn = firstRule.attributes.Effect;
        utils.setHistory('FinalRule', {ruleId: rule.attributes.RuleId, defaultRule: false})
    }
    else {
        //Verifico esistenza della defaultRule
        if(!utils.isUndefined(defaultRule)){
            rule = defaultRule
            messageReturn = defaultRule.attributes.Effect;
            utils.setHistory('FinalRule', {ruleId: rule.attributes.RuleId, defaultRule: true})
        }
    }
    //Attualmente è una stringa, diverrà un JSON.
    return {messageReturn, rule};
}