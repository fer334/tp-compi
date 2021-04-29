import graph from './exampleGraph.js'
import makeGraph from './draw.js'
import Automata from './Automata.js'
import Graph from './Graph.js'

// // const regex = "a"
// const regex = "(a|b)*abb" 

// const afn = new Automata()
// afn.setAlfabeto(['a','b','c'])

// afn.regexToThompson(regex)
// const afd = afn.toAfd();
// console.log(afn.getDestados());
// // afn.test()


// const [nodes,links] = Graph.toDraw(afd.graph.nodes);
// makeGraph(nodes,links)


// TODO (alba|buitre)*alba -> '(','alba','|','buitre',')','*','alba'
    // var string = "abcdeabcde";
    // var newstringreplaced = string.replaceAll(/d/gi, ",d");
    // var newstring = newstringreplaced.split(",");
    // return newstring;
// const regex = ['(','alba','|','buitre',')','*','alba'] 
// const regex = ['(','aguila','|','buitre',')','*','aguila','buitre','buitre'] 
// const regex = ['(','aguila','buitre',')'] 
const regex = ['aguila','buitre'] 
// regex.slice()

const afn = new Automata()
afn.setAlfabeto(['aguila','buitre'])
afn.regexDefToGraph([
    {leftSide: 'Animales', rightSide: regex},
    {leftSide: 'Paises', rightSide: ['buitre','aguila']},
])
// afn.regexToThompson('Animales',regex)
// afn.regexToThompson(['(','buitre','aguila',')'])

// EF finale

const afd = afn.toAfd();

const [nodes,links] = Graph.toDraw(afd.graph.nodes);
// const [nodes,links] = Graph.toDraw(afn.graph.nodes);
makeGraph(nodes,links)

// const entrada = stringToArrayList('')
afd.run('aguila buitre buitre'.split(' ')) 
