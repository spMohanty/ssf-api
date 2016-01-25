var Node = require("./Node");
var ChunkNode = require("./ChunkNode");
var Helper = require("./Helper");

var  Sentence = function(sentence, ignoreErrors, nesting, dummySentence){
    if(ignoreErrors == undefined){
        ignoreErrors = true
    }
    if(nesting == undefined){
        nesting = true
    }
    if(dummySentence == undefined){
        dummySentence = false
    }

    this.instanceType = "Sentence"
    this.ignoreErrors = ignoreErrors
    this.nesting = nesting
    this.sentence = undefined
    this.sentenceID = undefined
    this.sentenceType = undefined
    this.length = 0
    this.tree = undefined
    this.nodeList = []
    this.edges = {}
    this.nodes = {}
    this.tokenNodes = {}
    this.rootNode = undefined
    this.fileName = undefined
    this.comment = undefined
    this.probSent = false
    this.errors = []
    this.dummySentence = dummySentence

    sentence = Helper.getSentenceIter(sentence);

    if(!this.dummySentence){
        this.header = sentence[0][1]
        this.footer = sentence[0][4]
        this.name = sentence[0][2]
        this.text = sentence[0][3]
        this.analyzeSentence()
    }
}


 Sentence.prototype.analyzeSentence = function(ignoreErrors , nesting){
    if(ignoreErrors == undefined){
        ignoreErrors = false;
    }
    if(nesting == undefined){
        nesting = true;
    }

    contextList = [this]
    nodeIndex = 0

    var split_line = this.text.split("\n")

    var line;
    for(_index in split_line){
        line = split_line[_index]
        stripLine = line.trim();

        if(stripLine=="")
            continue
        else if(stripLine[0]=="<" && ignoreErrors == false){
                this.errors.push('Encountered a line starting with "<"');
                this.probSent = true
        }
        else{
            splitLine = stripLine.split(/\s+/).filter(Boolean)
            //Chunk Starts
            if(splitLine.length > 1 && splitLine[1] == '(('){

                currentChunkNode = new ChunkNode(line + '\n');
                currentChunkNode.upper = contextList[contextList.length -1]
                currentChunkNode.upper.nodeList.push(currentChunkNode)

                if(currentChunkNode.upper.instanceType != 'Sentence'){
                    currentChunkNode.upper.text.push(line)
                }
                contextList.push(currentChunkNode)
            }
            else if(splitLine.length > 0 && splitLine[0] == '))'){
                currentChunkNode.footer = line + '\n'
                currentChunkNode.analyzeChunk()
                contextList.pop(-1)

                if(contextList[contextList.length - 1].instanceType != "Sentence"){
                    currentChunkNode = contextList[contextList.length-1]
                }
            }
            else{
                currentNode = new Node(line + '\n', this.name+"_"+nodeIndex)
                nodeIndex += 1

                currentNode.upper = contextList[contextList.length-1]
                contextList[contextList.length-1].nodeList.push(currentNode)
            }
        }
    }
 }


Sentence.prototype.addEdge = function(parent , child){
    //THIS NEEDS WORK !!
    if(parent in this.edges){
        if(! child in this.edges[parent]){
            this.edges[parent].push(child)
        }
    }else{
        this.edges[parent] = [child]
    }
    // if parent in this.edges.iterkeys() :
    //     if child not in this.edges[parent] :
    //         this.edges[parent].append(child)
    // else :
    //     this.edges[parent] = [child]
}


Sentence.prototype.updateAttributes = function(){
    var populateNodesStatus = this.populateNodes()
    var populateEdgesStatus = this.populateEdges()
    this.sentence = this.generateSentence()
    if(populateEdgesStatus == 0 || populateNodesStatus == 0)
        return 0
    return 1
}


Sentence.prototype.printSSFValue = function(allFeat){
    if(allFeat == undefined){
        allFeat = true;
    }

    returnStringList = []
    returnStringList.push("<Sentence id=\"" + this.name + "\">")

    if(this.nodeList.length != 0){
        var nodeList = this.nodeList
        var nodePosn = 0
        var node;

        for(_index in nodeList){
            node = nodeList[_index]
            nodePosn += 1
            returnStringList = returnStringList.concat([node.printSSFValue(nodePosn+"", allFeat)])
        }
    }
    returnStringList.push( '</Sentence>\n')

    return [].concat.apply([], returnStringList).join("\n")
}


Sentence.prototype.populateNodes = function(naming){
    if(naming == undefined){
        naming = 'strict';
    }

    if(naming == "strict"){
        for(_index in this.nodeList){
            var nodeElement = this.nodeList[_index];
            if(nodeElement == undefined){
                this.nodes[nodeElement.name] = nodeElement
            }else{
                //Throw Error
                //console.log("Error in Sentence populateNodes", naming);
            }
        }
    }
    return 1;
}

Sentence.prototype.populateEdges = function(){
    for(_index in this.nodeList){
        var node = this.nodeList[_index];
        var nodeName = node.name;
        if(node.parent == "0" || node == this.rootNode){
            this.rootNode = node;
            continue;
        }else if(!(node.parent in this.nodes)){
            //THIS NEEDS WORK DEFINITELYL !!!!!!
            return 0;
        }
        // THIS NEEDS WORK
        //assert node.parent in this.nodes.iterkeys()
        this.addEdge(node.parent, node.name);
    }
    return 1;
}

Sentence.prototype.generateSentence = function(){
    var sentence = [];
    var nodeName;
    for(_index in this.nodeList){
        nodeName = this.nodeList[_index]
        sentence.push(nodeName.printValue());
    }
    return sentence.join(" ");
}

module.exports = Sentence;
