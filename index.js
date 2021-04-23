import graph from './exampleGraph.js'
import makeGraph from './draw.js'
import Automata from './Automata.js'
import Graph from './Graph.js'

// const regex = "a"
const regex = "(a|b)*abb" 

const afn = new Automata()
afn.setAlfabeto(['a','b'])

afn.regexToThompson(regex)
// console.log((afn.graph.nodes));
console.log(JSON.stringify(graph));
// afn.setGraphFromNodes(graph);
// afn.setIniEndStates(0,10)

const afd = afn.toAfd();

const [nodes,links] = Graph.toDraw(afd.graph.nodes);
makeGraph(nodes,links)

afd.run('aaaaabab') 