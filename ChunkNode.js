var Helper = require("./Helper");

var ChunkNode = function(header){
    this.text = []
    this.header = header
    this.footer = undefined
    this.nodeList = []
    this.parent = '0'
    this.__attributes = {}
    this.parentRelation = 'root'
    this.name = undefined
    this.type = undefined
    this.POS = undefined
    this.instanceType = "ChunkNode"    
    this.head = undefined
    this.isParent = false
    this.errors = []
    this.upper = undefined
    this.updateDrel()
    this.fsList = undefined
}


ChunkNode.prototype.analyzeChunk = function(){
    var chunkFeats = Helper.getChunkFeats(this.header);
    chunkType = chunkFeats[0]
    chunkFeatDict = chunkFeats[1]
    chunkFSList = chunkFeats[2]

    this.fsList = chunkFSList
    this.type = chunkType
    this.POS = chunkType
    this.updateAttributes(chunkFeatDict)
    
    //THIS NEEDS WORK !!
    // this.text = this.text.split("\n").join("\n"); 
    
    this.text = this.text.join("\n")
    //this.text = '\n'.join([line for line in this.text])
}


ChunkNode.prototype.updateAttributes = function(fsDict){
    for(attribute in fsDict){
        this.__attributes[attribute] = fsDict[attribute]        
    }
    this.assignName()
    this.updateDrel()

}

ChunkNode.prototype.assignName = function(){
    if('name' in this.__attributes) 
        this.name = this.getAttribute('name')
    else
        this.errors.push('No name for this chunk Node')    
}

    
ChunkNode.prototype.updateDrel = function(){
    if('drel' in this.__attributes){
        drelList = this.getAttribute('drel').split(':')
        if(drelList.length == 2){
            this.parent = drelList[1]
            this.parentRelation = this.getAttribute('drel').split(':')[0]              
        }
    }
    else if( 'dmrel' in this.__attributes){
        drelList = this.getAttribute('dmrel').split(':')
        if(drelList.length == 2){
            this.parent = drelList[1]
            this.parentRelation = this.getAttribute('dmrel').split(':')[0]    
        }
    }
}


ChunkNode.prototype.printValue = function(){
    returnString = []
    var node;
    for(_index in this.nodeList){
        node = this.nodeList[_index];
        returnString.push(node.printValue())
    }
    //THIS NEEDS WORK 
    return returnString.join(' ')
    // return ' '.join(x for x in returnString) 
}


ChunkNode.prototype.printSSFValue = function(prefix, allFeat){
    returnStringList = []
    returnValue = [prefix , '((' , this.type]
    if(allFeat == false){
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

    // THIS NEEDS WORK !!
    returnStringList.push(returnValue.join("\t") + "\t" + fs.join(delim))
    // returnStringList.push('\t'.join(x for x in returnValue) + '\t' + delim.join(x for x in fs))
    nodePosn = 0
    var node;
    for(_index in this.nodeList){
        node = this.nodeList[_index]
        nodePosn += 1
        if(node.instanceType == "ChunkNode"){
            returnStringList = returnStringList.concat(node.printSSFValue(prefix + '.' + nodePosn+"", allFeat))
        }   
        else{
            returnStringList.push(node.printSSFValue(prefix + '.' + nodePosn, allFeat))            
        }
    }
    returnStringList.push('\t' + '))')
    return returnStringList
}

ChunkNode.prototype.getAttribute = function(key){
    if(key in this.__attributes)
        return this.__attributes[key]
    else
        return undefined
}


ChunkNode.prototype.addAttribute = function(key,value){
    this.__attributes[key] = value    
}

ChunkNode.prototype.deleteAttribute = function(key){
    delete this.__attributes[key]    
}


module.exports = ChunkNode;