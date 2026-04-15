const rulFunctions = require("./rulesFn");
const matchRules = require("./matchRules");
const utils = require("./utils");
const validate = require("./validate");

/**
 * Ottiene la prima regola applicabile che soddisfa sia i Target che le condizioni.
 * @param {*} rules Regole della policy.
 * @returns Regola da applicare.
 */
function getApplicableRule(rule, method){
    utils.setHistory('Rule', {ruleId: rule.attributes.RuleId})
    var returnRule = false; //Inizializzo la regola da applicare a undefined.
 
    var effect = rulFunctions.getEffect(rule); 
    //Se entrambi condizioni e target sono soddisfatti allora ho la regola da applicare.
    if(matchRules.applicableRules(rule) && effect==method){
        returnRule=true
    }
    utils.setHistory('Effect', {verify: effect==method})

    return returnRule;
}

function getApplicableRules(rules, defaultRule,  method){
    var i=0;
    var applicableRules=[]    
    while(i<rules.length){
        if(rules[i]!=defaultRule){
            if(getApplicableRule(rules[i], method)){
                applicableRules.push(rules[i])
            }
        }
        i++
    }
    return applicableRules
}

exports.handleOverrides = (method, policy, subj, act, rsc) => {
    utils.setHistory('Policy', {policyId: policy.attributes.PolicyId, alg: `${method}-overrides`})
    validate.setElements(subj, act, rsc)

    var messageReturn  = 'Not applicable'; //Messaggio di default
    if((method != 'Permit')&(method != 'Deny'))
        return  messageReturn;

    var targets = rulFunctions.getTargetsPolicy(policy);
    if(validate.validTargets(targets)){
        utils.setHistory('Targets', {verify: true})
        var rulesPolicy = rulFunctions.getRules(policy);
        var defaultRule = rulFunctions.getDefaultRule(policy);
        var applicableRules = getApplicableRules(rulesPolicy, defaultRule, method);
    
        var rule;
        if(applicableRules.length>0){
            rule = applicableRules[0]
            messageReturn = method;
            utils.setHistory('FinalRule', {ruleId: rule.attributes.RuleId, effect: method, defaultRule: false})
        }
        else {
            if(!utils.isUndefined(defaultRule)){
                const defaultRuleEffect=defaultRule.attributes.Effect
                if(defaultRuleEffect==method){
                    rule = defaultRule
                    messageReturn = defaultRule.attributes.Effect;
                    utils.setHistory('FinalRule', {ruleId: rule.attributes.RuleId, effect: method, defaultRule: true})
                }
            }
        }
    } else {
        utils.setHistory('Targets', {verify: false})
    }  
    return {messageReturn, rule};
}