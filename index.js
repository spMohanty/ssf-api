var Sentence = require("./Sentence");
module.exports = {
  parse : function(s){
    this.Sentence = new Sentence(s);
    return this.Sentence;
  },
  getAllNodes: function(sentence){

    var nodes = [];

    function recurse(node){
      if(node.instanceType == "Node"){
        nodes.push(node);
        return;
      }else if(node.instanceType == "ChunkNode" || node.instanceType == "Sentence"){
        var childNode;
        for(var _index in node.nodeList){
          childNode = node.nodeList[_index];
          recurse(childNode);
        }
      }

    }

    recurse(sentence);
    return nodes;
  }
}