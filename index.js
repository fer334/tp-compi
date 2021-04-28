import graph from './exampleGraph.js'
import makeGraph from './draw.js'
import Automata from './Automata.js'
import Graph from './Graph.js'

// const regex = "a"
const regex = "(a|b)*abb" 

const afn = new Automata()
afn.setAlfabeto(['a','b','c'])

afn.regexToThompson(regex)
const afd = afn.toAfd();
console.log(afn.getDestados());
// afn.test()


const [nodes,links] = Graph.toDraw(afd.graph.nodes);
makeGraph(nodes,links)

// afd.run('aaaaabab') 
