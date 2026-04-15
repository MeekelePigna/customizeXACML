
const convert = require("xml-js");
const firstAppl = require("../sourcejs/xacmlPDP/firstApplicableAlg");
const overrAppl = require("../sourcejs/xacmlPDP/overridesAlg");
const combAlg = require("../sourcejs/xacmlPDP/combiningAlgorhitm");
const utils = require("../sourcejs/xacmlPDP/utils");

const polFunctions = require("../sourcejs/xacmlPDP/policiesFn");

var policy = '';
var resource = '';
var subject = '';
var action = '';

const firstApplicable = (policies, subject, action, resource, policySetId) => {    
    utils.setHistory('PolicySet', {policySetId, alg: `first-applicable`})
    var messageReturn = 'Not applicable';
    var policyId=0;
    
    while(messageReturn == 'Not applicable' && policyId<policies.length){
        var result;
        const combAlgo = policies[policyId].attributes.RuleCombiningAlgId
        if(combAlgo.includes('first-applicable'))
            result = firstAppl.handleFirstApplicable(policies[policyId], subject, action, resource);
        else if(combAlgo.includes('permit-overrides'))
            result = overrAppl.handleOverrides('Permit',policies[policyId], subject, action, resource);
        else if(combAlgo.includes('deny-overrides'))
            result = overrAppl.handleOverrides('Deny', policies[policyId], subject, action, resource);

        policyId++;
    }

    return {
        messageReturn: result.messageReturn || messageReturn, 
        rule: result.rule,
        policy: policies[policyId]
    }
}

const overrides = (method, policies, subject, action, resource, policySetId) => {      
    utils.setHistory('PolicySet', {policySetId, alg: `${method}-overrides`})
    var messageReturn = 'Not applicable';
    var policyId=0;

    var result;
    while(policyId<policies.length){
        const combAlgo = policies[policyId].attributes.RuleCombiningAlgId

        if(combAlgo.includes('first-applicable'))
            result = firstAppl.handleFirstApplicable(policies[policyId], subject, action, resource);
        else if(combAlgo.includes('permit-overrides') && method=='Permit')
            result = overrAppl.handleOverrides('Permit',policies[policyId], subject, action, resource);
        else if(combAlgo.includes('deny-overrides') && method=='Deny')
            result = overrAppl.handleOverrides('Deny', policies[policyId], subject, action, resource);

        if(result.messageReturn==method)
            break

        policyId++;
    }

    return {
        messageReturn: result.messageReturn || messageReturn, 
        rule: result.rule,
        policy: policies[policyId]
    }
}

exports.postTryIt = (req, res) => {

    utils.clearHistory();

    //Mi ricavo i parametri.
    policy = req.query.policyXacmlSec; //Intera politica XACML
    resource = req.query.resource;  //Risorsa.
    subject = req.query.subject;    //Target.
    action = req.query.action;      //Azione

    var obj = convert.xml2js(policy);
    var policyAttributes = combAlg.getPolicySetAttributes(obj);
    var combAlgo = policyAttributes.RuleCombiningAlgId;
    var messageReturn = '';
    var finalPolicy;
    var finalRule;

    var policies = polFunctions.getPolicies(obj);
    //PolicySet
    if(policies.length>1){
        var result;
        const policySetId = obj.elements[0].attributes.PolicySetId
        if(combAlgo.includes('first-applicable'))
            result = firstApplicable(policies, subject, action, resource, policySetId);
        else if(combAlgo.includes('permit-overrides'))
            result = overrides('Permit',policies, subject, action, resource, policySetId);
        else if(combAlgo.includes('deny-overrides'))
            result = overrides('Deny', policies, subject, action, resource, policySetId);
        messageReturn = result.messageReturn
        finalRule = result.rule
        finalPolicy = result.policy
    } 
    //Policy
    else {
        var result;
        if(combAlgo.includes('first-applicable'))
            result = firstAppl.handleFirstApplicable(policies[0], subject, action, resource);
        else if(combAlgo.includes('permit-overrides'))
            result = overrAppl.handleOverrides('Permit',policies[0], subject, action, resource);
        else if(combAlgo.includes('deny-overrides'))
            result = overrAppl.handleOverrides('Deny', policies[0], subject, action, resource);
        finalPolicy = policies[0]
        messageReturn = result.messageReturn
        finalRule = result.rule
    }
    utils.setHistory('Message', {messageReturn})

    res.send({
        message : messageReturn,
        history: utils.getHistory(),
        rule: finalRule,
        policy: finalPolicy
    });
}