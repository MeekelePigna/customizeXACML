/**
 * Classe per determinare i Combining Algorhitms delle policy e regole.
 */

/**
 * Ottiene il primo elemento della policy set.
 * @param {*} objPolicy Intera policy XACML.
 * @returns Attrributo della policy contenente il combining algorhitm.
 */
exports.getPolicySetAttributes = (objPolicy) => {
    var firstTag = objPolicy.elements[0];

    //Se non ho una policyset, allora cerco una policy.
    if(firstTag.name !== "PolicySet"){
        if(firstTag.name !== "Policy")
            return "Formato policy XACML non valido.";
        else
            return firstTag.attributes;
    }
    else{
        return firstTag.attributes;
    }
}