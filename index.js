import graph from './exampleGraph.js'
import makeGraph from './draw.js'
import Automata from './Automata.js'
import Graph from './Graph.js'


// aguila buitre España Brasil

// Animales -> ( aguila | buitre ) * aguila buitre buitre
// Paises -> España | Brasil

const generateAfd = () => {
    regexDefs = new Automata()
    const alphabetInput = document.getElementById('alphabet').value
    const alphabet = alphabetInput.split(' ')
    const defsInput = document.getElementById('defs').value
    const defList = defsInput.split('\n').map(x=>{
        const leftSide = x.split(' -> ')[0]
        const rightSide = x.split(' -> ')[1].split(' ')
        return {leftSide: leftSide, rightSide: rightSide}
    })

    // regexDefs.setAlfabeto(['aguila','buitre'])
    regexDefs.setAlfabeto(alphabet)
    // regexDefs.regexDefToGraph([
    //     {leftSide: 'Animales', rightSide: ['(','aguila','|','buitre',')','*','aguila','buitre','buitre']},
    //     {leftSide: 'Paises', rightSide: ['buitre','aguila']},
    //     {leftSide: 'Pais', rightSide: ['aguila','buitre']},
    // ])
    regexDefs.regexDefToGraph(defList)
    // console.log(defList);
}

const runAfd = () => {
    const input = document.getElementById('input').value
    const inputList = input.split(' ')
    const leftSide = regexDefs.run(inputList) 
    const resultLabel = document.getElementById('result')
    resultLabel.innerText = leftSide
    
}

let regexDefs = new Automata()

document.getElementById('generateButton').addEventListener('click',generateAfd)
document.getElementById('runButton').addEventListener('click',runAfd)

//  ( aguila | buitre ) * aguila buitre buitre  
//  (aguila|buitre)*aguilabuitrebuitre 

// const regex = ['(','aguila','buitre',')'] 
// const regex = ['aguila','buitre'] 
// regex.slice()





// regexDefs.regexToThompson('Animales',regex)
// regexDefs.regexToThompson(['(','buitre','aguila',')'])

// Estaba transformando toafd para que haga es nomas y me faltaba pasar del DTran al grafo

// const afd = regexDefs.toAfd();

// const [nodes,links] = Graph.toDraw(regexDefs.graph.nodes);
// // const [nodes,links] = Graph.toDraw(afn.graph.nodes);
// makeGraph(nodes,links)

// // const entrada = stringToArrayList('')
// // regexDefs.run('aguila buitre buitre'.split(' ')) 
// regexDefs.run(['buitre', 'aguila']) 

