import graph from './exampleGraph.js'
import makeGraph from './draw.js'
import Automata from './Automata.js'
import Graph from './Graph.js'

// const entrada = "a"
const entrada = "(a|b)*abb" 

const afn = new Automata()
afn.setAlfabeto(['a','b'])

// afn.regexToThompson(entrada)
// console.log((afn.graph.nodes));
// console.log(JSON.stringify(graph));
afn.setGraphFromNodes(graph);
afn.setIniEndStates(0,10)

const afd = afn.toAfd();
// console.log(graph);
// console.log(afn.graph.nodes);


const [nodes,links] = Graph.toDraw(afd.graph.nodes);
// const [nodes,links] = Graph.toDraw(afn.graph.nodes);
// console.log(nodes);
makeGraph(nodes,links)

// console.log('a'+''+'a')