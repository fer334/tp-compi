import graph from './exampleGraph2.js'
import makeGraph from './draw.js'
import Automata from './Automata.js'
import Graph from './Graph.js'

// const entrada = "(a)*aa"
const entrada = "(a|b)*abb"

const afn = new Automata()
afn.setAlfabeto(['a','b'])

afn.regexToThompson(entrada)
console.log(JSON.stringify(afn.graph.nodes));
// console.log(JSON.stringify(graph));
// afn.setGraphFromNodes(graph)

// const afd = afn.toAfd()

const [nodes,links] = Graph.toDraw(afn.graph.nodes);
// console.log(nodes);
makeGraph(nodes,links)

// console.log('a'+''+'a')