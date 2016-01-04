# SSF API for NodeJS

SSF is the file specification used to store sentences in the Sampark Machine Translation Framework

### Installation
```sh
$ npm install --save spMohanty/ssf-api
```

### Usage
```javascript
var sentence = '<Sentence id="1">\n1\t((\tNP\t\n1.1\tyUnesko\tNNP\t<fs af=\'yUnesko,n,m,pl,3,o,0,0\'>\n1.2\tne\tPSP\t<fs af=\'ne,psp,,,,,,\'>\n\t))\t\t\n2\t((\tNP\t\n2.1\tise\tPRP\t<fs af=\'yaha,pn,any,sg,3,o,ko,ko\'>\n\t))\t\t\n3\t((\tNP\t\n3.1\tvESvika\tJJ\t<fs af=\'vESvika,adj,any,any,,any,,\'>\n3.2\tXarohara\tNN\t<fs af=\'Xarohara,n,f,sg,3,d,0,0\'>\n\t))\t\t\n4\t((\tJJP\t\n4.1\tGoRiwa\tJJ\t<fs af=\'GoRiwa,adj,any,any,,any,,\'>\n\t))\t\t\n5\t((\tVGF\t\n5.1\tkiyA\tVM\t<fs af=\'kara,v,m,sg,any,,yA,yA\'>\n5.2\thE\tVAUX\t<fs af=\'hE,v,any,sg,2,,hE,hE\'>\n5.3\t.\tSYM\t<fs af=\'.,punc,,,,,,\'>\n\t))\t\t\n</Sentence>'

var ssf = require('ssf-api');
var parsed_sentence = ssf.parse(sentence);
//The object this function returns is a nested object, 
// you can access the children objects by 
// .nodeList() function
var child_nodes = parsed_sentence.nodeList();

//You can get a flattened list of nodes by 
// ssf.getAllNodes(parsed_sentence);
var flattened_list_of_nodes = ssf.getAllNodes(parsed_sentence);

var node = flattened_list_nodes[0];
//The first node in this flattened_list represents the following node in SSF
//1.1 isake PRP  <fs af=\'yaha,pn,any,sg,3,o,kA,kA\' agr_gen=\'m\' agr_cas=\'d\' agr_num=\'pl\'>


console.log(node.instanceType);
//this should return "Node";
//You can obtain the instance type of an object by 
// .instanceType
// This can have three values
// "Node" : represents a leaf node in the SSF graph
// "ChunkNode" : represents a ChunkNode in the SSF graph
// "Sentence" : represents the sentence 


console.log(node.POS);
//this should return "PRP"
// You can access the POS tag of the node by 
// .POS attribute
//
// NOTE the .POS attribute is only available in 
// `Node` and `ChunkNode` objects. So if you are recursively
// doing something with the parsed_sentence object
// remember to check for `parsed_sentence.instanceType`

console.log(node.lex);
//this should return "isake"
// You can access the lexical item associated with the node by
// .lex

console.log(node.__attributes);
//this should return :
// { af: 'yaha,pn,any,sg,3,o,kA,kA',
//     agr_gen: 'm',
//     agr_cas: 'd',
//     agr_num: 'pl' }
//
//You can access the fs-attributes of the node by 
// .__attributes parameter


// You can programattically modify all these parameters, and then finally 
// create the new SSF by "
console.log(parsed_sentence.printSSFValue());


// If you want to recursively access all the objects you can easily do so 
// with a function like this :

function recurse(node){
  if(node.instanceType == "Node"){
    //Your Node level Voodoo goes here...
    return;
  }else if(node.instanceType == "ChunkNode" || node.instanceType == "Sentence"){
    
    //Your ChunkNode or Sentence level Voodoo goes here :D

    var childNode;
    for(var _index in node.nodeList){
      childNode = node.nodeList[_index];
      recurse(childNode);
    }
  }
}
recurse(parsed_sentence);

// All the changes you do to the SSF object in the above function are persistent, so they will 
// reflect if you do a parsed_sentence.printSSFValue() after that :D

```
### Todo's

 - Write Tests
 - Add better documentation
 - Refactor Code
 - Add support for more than one sentences

### License
----

MIT

### Author
S.P. Mohanty <spmohanty91@gmail.com>
