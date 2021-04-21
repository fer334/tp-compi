import graph from './exampleGraph2.js'
import makeGraph from './draw.js'
import Automata from './Automata.js'
import Graph from './Graph.js'
// const Destados =[]
// const alfabeto = ['a', 'b']
// const Dtran = []
// console.log(cerradura ([0]))
// console.log(move([ 0, 1, 2, 4, 7 ],'a'))
// console.log(cerradura (move(cerradura ([0]),'a')))
// afnToAfd()
const afn = new Automata()
// console.log('index', afn);
afn.setGraphFromNodes(graph)
afn.setAlfabeto(['a','b'])

// const afd = afn.toAfd()
// console.log(afd.graph.nodes);
// {"name":0,"links":[{"to":1,"value":"a"},

const [nodes,links] = Graph.toDraw(graph);
// var nodes = { 0: { name: "0" }, 1: { name: "1" } };
// console.log(JSON.stringify(nodes));
// const links = [
//   { source: "0", target: "0", label: "a" },
//   { source: "0", target: "1", label: "b" },
//   { source: "1", target: "1", label: "a" },
// ];

makeGraph(nodes,links)

// console.log('afn: ',afn);
// console.log(afn);

// console.log(move(cerradura ([0]),'a'))
// console.log(move([0]));

// const a =graph
// a[0][0]
// for (const x of a) {
// }
// console.log('a'+''+'a')