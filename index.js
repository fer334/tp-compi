import graph from './exampleGraph.js'
// import makeGraph from './draw.js'
import Graph from './Graph.js'
import {LexicalAnalizer} from './LexicalAnalizer.js'
import { toFriendlyDtran } from './utils.js'


// aguila buitre España Brasil

// Animales -> ( aguila | buitre ) * aguila buitre buitre
// Paises -> España | Brasil

const generateAfd = () => {
    // lexAnalizer = new Automata()
    const alphabetInput = document.getElementById('alphabet').value
    const alphabet = alphabetInput.split(' ')
    const defsInput = document.getElementById('defs').value
    const defList = defsInput.split('\n').map(x=>{
        const leftSide = x.split(' -> ')[0]
        const rightSide = x.split(' -> ')[1].split(' ')
        return {leftSide: leftSide, rightSide: rightSide}
    })

    lexAnalizer = new LexicalAnalizer()

    // lexAnalizer.setAlfabeto(['aguila','buitre'])
    lexAnalizer.setAlfabeto(alphabet)

    // const  defList = [
    //     {leftSide: 'Animales', rightSide: ['(','aguila','|','buitre',')','*','aguila','buitre','buitre']},
    //     {leftSide: 'Paises', rightSide: ['buitre','aguila']},
    //     {leftSide: 'Pais', rightSide: ['aguila','buitre']},
    // ]

    lexAnalizer.regexDefToGraph(defList)

    const a = toFriendlyDtran(lexAnalizer.finalDtranDestados.Dtran,lexAnalizer.finalDtranDestados.Destados)
    console.log(lexAnalizer);
    console.log(a);
}

const runAfd = () => {
    const input = document.getElementById('input').value
    const inputList = input.split(' ')
    const leftSide = lexAnalizer.run(inputList) 
    const resultLabel = document.getElementById('result')
    resultLabel.innerText = leftSide
    
}

let lexAnalizer = new LexicalAnalizer()

document.getElementById('generateButton').addEventListener('click',generateAfd)
document.getElementById('runButton').addEventListener('click',runAfd)

//  ( aguila | buitre ) * aguila buitre buitre  
//  (aguila|buitre)*aguilabuitrebuitre 

// const regex = ['(','aguila','buitre',')'] 
// const regex = ['aguila','buitre'] 
// regex.slice()





// lexAnalizer.regexToThompson('Animales',regex)
// lexAnalizer.regexToThompson(['(','buitre','aguila',')'])

// Estaba transformando toafd para que haga es nomas y me faltaba pasar del DTran al grafo

// const afd = lexAnalizer.toAfd();

// const [nodes,links] = Graph.toDraw(lexAnalizer.graph.nodes);
// // const [nodes,links] = Graph.toDraw(afn.graph.nodes);
// makeGraph(nodes,links)

// // const entrada = stringToArrayList('')
// // lexAnalizer.run('aguila buitre buitre'.split(' ')) 
// lexAnalizer.run(['buitre', 'aguila']) 

