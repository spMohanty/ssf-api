RegExp.prototype.findAll = function(str) {
  var match = null, results = [];
  while ((match = this.exec(str)) !== null) {
    switch (match.length) {
      case 1:
        results[results.length] = match[0];
        break;
      case 2:
        results[results.length] = match[1];
        break;
      default:
        results[results.length] = match.slice(1);
    }
    if (!this.global) {
      break;
    }
  }
  return results;
}

RegExp.findAll = function(re, str, flags) {
  if (Object.prototype.toString.call(re) != '[object RegExp]') {
    re = new RegExp(re, flags);
  }
  return re.findAll(str);
}

var Helper = {

    findAll : function(re, str){
        return re.findAll(str);
    },

    getAddressNode : function(address, node, level){
        if(level == undefined){
            level = "ChunkNode";
        }

        currentContext = node

        if(level != 'Relative'){
            while(currentContext.instanceType != level){
                currentContext = currentContext.upper                    
            }
        } 

        currentContext = currentContext.upper

        stepList = address.split('%')
        
        var step;
        for(var _index in stepList){
            step = stepList[_index];

            if(step == '..'){
                currentContext = currentContext.upper            
            }
            else {
                var iterNode;
                var refNode = []
                for(var _index in currentContext.nodeList){
                    iterNode = currentContext.nodeList[_index]
                    if(iterNode.name == step){
                        refNode.push(iterNode);
                    }
                }
                refNode = refNode[0]
                currentContext = refNode
            }
        }
        return refNode
    },

    getChunkFeats : function(line){
        lineList = line.trim().split(/\s+/).filter(Boolean)
        chunkType = undefined
        fsList = []
        if(lineList.length >= 3) 
            chunkType = lineList[2]
            
        returnFeats = {}
        multipleFeatRE = /<fs.*?>/
        featRE = /(?:\W*)(\S+)=([\'|\"])?([^ \t\n\r\f\v\'\"]*)[\'|\"]?(?:.*)/
        fsList = this.findAll(multipleFeatRE, lineList.join(" "))

        var line
        for(_index in lineList){
            line = lineList[_index]
            feat = this.findAll(featRE, line)
            if(feat.length != 0){
                if(feat.length > 1){
                    returnErrors.push('Feature with more than one value');
                    continue;
                }
                returnFeats[feat[0][0]] = feat[0][2]
            }

            return [chunkType, returnFeats, fsList]
        }
    },

    getTokenFeats : function(lineList){
        tokenType = undefined
        token = undefined

        returnFeats = {}
        fsList = []
        if(lineList.length >=3)
            tokenType = lineList[2]

        token = lineList[1]
        multipleFeatRE = /<fs.*?>/
        featRE = /(?:\W*)(\S+)=([\'|\"])?([^ \t\n\r\f\v\'\"]*)[\'|\"]?(?:.*)/
        fsList = this.findAll(multipleFeatRE, lineList.join(" "))

        var line
        for(_index in lineList){
            line = lineList[_index]
            feat = this.findAll(featRE, line)
            if(feat.length != 0){
                if(feat.length > 1){
                    returnErrors.push('Feature with more than one value');
                    continue;
                }
                returnFeats[feat[0][0]] = feat[0][2]
            }
        }
        return [token,tokenType,returnFeats,fsList]    
    }

    ,

    getSentenceIter : function(text) {
        sentenceRE = /((<Sentence id=[\'\"]?(\d+)[\'\"]?>)([\s\S]*?)(<\/Sentence>))/ 
        return this.findAll(sentenceRE, text)
    },

    get_fs_line : function(tree){
        output = "<fs "
        count = 0
        if("attr_af" in tree.attrib){
            output+="af='"+tree.attrib["attr_af"]+"' "
            count+=1
        }

        for(attr in tree.attrib){
            if(attr!="attr_af" && /attr_.*/.match(attr)){
                output += attr.replace("attr_","")+'="'+tree.attrib[attr]+'" '
                count += 1
            }
        }

        output += " >"

        if(count == 0)
            return ""
        else
            return output
    }
}

module.exports = Helper