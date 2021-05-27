import graph from './exampleGraph.js'
// import makeGraph from './draw.js'
import Graph from './Graph.js'
import makeGraph from './draw.js'
import {LexicalAnalizer} from './LexicalAnalizer.js'
import { toPrettyDtran } from './utils.js'


// aguila buitre España Brasil

// Animales -> ( aguila | buitre ) * aguila buitre buitre
// Paises -> España | Brasil

const createTable = (lexAnalizer) => {

    if(document.getElementsByTagName('table').length==1)
        document.getElementsByTagName('table')[0].remove()
    
    const tableData = toPrettyDtran(lexAnalizer.finalDtranDestados.Dtran,lexAnalizer.finalDtranDestados.Destados)
    const div = document.getElementById('table')
    const table = document.createElement("table")
    const row1 = document.createElement('tr')

    
    const foo = document.createElement('th')
    foo.append(document.createTextNode(''))
    row1.append(foo)

    for (const entry of lexAnalizer.alfabeto) {
        const header = document.createElement('th')
        const text = document.createTextNode(entry)
        header.append(text)
        row1.append(header)
    }
    table.append(row1)

    console.log(tableData);
    for (let i = 0; i < tableData.Dtran.length; i++) {
        const states = tableData.Dtran[i].map(x=>x==undefined?'-':x);
        console.log(states);
        
        const row = document.createElement('tr')
        
        const firstCol = document.createElement('th')
        firstCol.append(document.createTextNode('Estado '+tableData.keys[i].key))
        row.append(firstCol)
        for (const state of states) {
            const col = document.createElement('td')
            const text = document.createTextNode(state)
            col.append(text)
            row.append(col) 
        }
        table.append(row)
        // const header = document.createElement('th')
        // const text = document.createTextNode(entry)
        // header.append(text)
        // table.append(header)
    }
    div.append(table)
    // console.log(a);
    
}

const drawGraph = (lexAnalizer) => {
    document.getElementById('graph').innerHTML='' 
    const [nodes,links] = Graph.toDraw(lexAnalizer);
    makeGraph(nodes,links)
}


const generateAfd = () => {
    document.getElementById('alert').style='display:none !important';
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

    try {
        lexAnalizer.regexDefToGraph(defList)
        console.log(lexAnalizer);
        drawGraph(lexAnalizer);
        createTable(lexAnalizer);
    } catch (error) {
        const alert  = document.getElementById('alert')
        alert.innerHTML = ''+error
        alert.style = ""
        console.log(error+'');
    }
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

// // const entrada = stringToArrayList('')
// // lexAnalizer.run('aguila buitre buitre'.split(' ')) 
// lexAnalizer.run(['buitre', 'aguila']) 

