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
const regex = ['(','aguila','|','buitre',')','*','aguila','buitre','buitre'] 
// const regex = ['(','aguila','buitre',')'] 
// const regex = ['aguila','buitre'] 
// regex.slice()

const regexDefs = new Automata()



regexDefs.setAlfabeto(['aguila','buitre'])
regexDefs.regexDefToGraph([
    {leftSide: 'Animales', rightSide: regex},
    {leftSide: 'Paises', rightSide: ['buitre','aguila']},
    {leftSide: 'Pais', rightSide: ['aguila','buitre']},
])
// regexDefs.regexToThompson('Animales',regex)
// regexDefs.regexToThompson(['(','buitre','aguila',')'])

// Estaba transformando toafd para que haga es nomas y me faltaba pasar del DTran al grafo

// const afd = regexDefs.toAfd();

const [nodes,links] = Graph.toDraw(regexDefs.graph.nodes);
// const [nodes,links] = Graph.toDraw(afn.graph.nodes);
makeGraph(nodes,links)

// const entrada = stringToArrayList('')
// regexDefs.run('aguila buitre buitre'.split(' ')) 
regexDefs.run(['buitre', 'aguila']) 

