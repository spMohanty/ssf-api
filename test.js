var ssf = require('./index')
var sentence = '<Sentence id="1">\n1\t((\tNP\t\n1.1\tyUnesko\tNNP\t<fs af=\'yUnesko,n,m,pl,3,o,0,0\'>\n1.2\tne\tPSP\t<fs af=\'ne,psp,,,,,,\'>\n\t))\t\t\n2\t((\tNP\t\n2.1\tise\tPRP\t<fs af=\'yaha,pn,any,sg,3,o,ko,ko\'>\n\t))\t\t\n3\t((\tNP\t\n3.1\tvESvika\tJJ\t<fs af=\'vESvika,adj,any,any,,any,,\'>\n3.2\tXarohara\tNN\t<fs af=\'Xarohara,n,f,sg,3,d,0,0\'>\n\t))\t\t\n4\t((\tJJP\t\n4.1\tGoRiwa\tJJ\t<fs af=\'GoRiwa,adj,any,any,,any,,\'>\n\t))\t\t\n5\t((\tVGF\t\n5.1\tkiyA\tVM\t<fs af=\'kara,v,m,sg,any,,yA,yA\'>\n5.2\thE\tVAUX\t<fs af=\'hE,v,any,sg,2,,hE,hE\'>\n5.3\t.\tSYM\t<fs af=\'.,punc,,,,,,\'>\n\t))\t\t\n</Sentence>'

var parsed_sentence = ssf.parse(sentence);

console.log(parsed_sentence.printSSFValue());

function recurse(node){
  if(node.instanceType == "Node"){
    //Your Node level Voodoo goes here...
    node.POS += "_TEST";
    return;
  }else if(node.instanceType == "ChunkNode" || node.instanceType == "Sentence"){

    //Your ChunkNode or Sentence level Voodoo goes here :D
    node.POS += "CHUNK_TEST";
    var childNode;
    for(var _index in node.nodeList){
      childNode = node.nodeList[_index];
      recurse(childNode);
    }
  }
}
recurse(parsed_sentence);

console.log("=========================")
console.log(parsed_sentence.printSSFValue());
