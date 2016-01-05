var Helper = require("./Helper");

var Node = function(text, nodeIndex){
    if(!nodeIndex){
        this.nodeIndex = undefined;
    }
    this.text = text
    this.lex = undefined
    this.type = undefined
    this.POS = undefined
    this.instanceType = "Node"
    this.__attributes = {}
    this.errors = []
    this.name = undefined
    this.parent = undefined
    this.parentRelation = undefined
    this.alignedTo = undefined
    this.fsList = undefined
    this.analyzeNode(this.text)

}

Node.prototype.analyzeNode = function(text){

    var tokenFeats = Helper.getTokenFeats(text.trim().split(/\s+/).filter(Boolean))
    var token = tokenFeats[0]
    var tokenType = tokenFeats[1]
    var fsDict = tokenFeats[2]
    var fsList = tokenFeats[3]

    attributeUpdateStatus = this.updateAttributes(token, tokenType, fsDict, fsList)
    if(attributeUpdateStatus == 0){
        this.errors.push("Can't update attributes for node")
        this.probSent = true
    }
}

Node.prototype.updateAttributes = function(token, tokenType, fsDict, fsList){
    this.fsList = fsList
    this.lex = token
    this.type = tokenType
    this.POS = tokenType
    var attribute;

    for(_index in fsDict){
        this.__attributes[_index] = fsDict[_index];
    }
    this.assignName();
}

Node.prototype.assignName = function(){
    if('name' in this.__attributes)
        this.name = this.getAttribute('name')
    else
        this.errors.push('No name for this token Node')
}


Node.prototype.assignNames = function(){
    //uses the index as a name for the node
    this.__attributes['name'] = this.index+"";
    this.assignName()
}

Node.prototype.printValue = function(){
    return this.lex;
}

Node.prototype.printSSFValue = function(prefix, allFeat){
    returnValue = [prefix , this.printValue() , this.POS]

    if(allFeat == undefined){
        fs = ['<fs']
        for(key in this.__attributes){
            fs.push(key + "='" + this.getAttribute(key) + "'")
        }
        delim = ' '
        fs[fs.length-1] = fs[fs.length-1] + '>'
    }
    else{
        fs = this.fsList
        delim = '|'
    }

    var s = ""
    s += returnValue.join("\t")
    s += "\t"
    s += fs.join(delim)
    return s;
}

Node.prototype.getAttribute = function(key){
    if(key in this.__attributes)
        return this.__attributes[key]
    else
        return undefined
}

Node.prototype.getAttributeList = function(){
    return Object.keys(this.__attributes);
}

Node.prototype.addAttribute = function(key,value){
    this.__attributes[key] = value;
}

Node.prototype.deleteAttribute = function(key){
    delete this.__attributes[key]
}


module.exports = Node;
