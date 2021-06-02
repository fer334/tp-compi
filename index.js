// import graph from './exampleGraph.js'
// import makeGraph from './draw.js'
import Graph from './Graph.js'
import makeGraph from './draw.js'
import {LexicalAnalizer} from './LexicalAnalizer.js'
import { toPrettyDtran } from './utils.js'


// aguila buitre España Brasil

// Animales -> ( aguila | buitre ) * aguila buitre buitre
// Paises -> España | Brasil

/*Encargado de crear la tabla Dtrans, que es enviada
al html, para que sea mostrado en la interfaz del usuario

En caso que haya algo en la tabla se vacia, y se vuelve a crear 
una actual, de acuerdo a lo que el usuario definio, en las 
definiciones regulares.
*/
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

    // console.log(tableData);
    for (let i = 0; i < tableData.Dtran.length; i++) {
        const states = tableData.Dtran[i].map(x=>x==undefined?'-':x);
        // console.log(states);
        
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
        
    }
    div.append(table)
    
}

/*Encargado de crear el grafo Dtrans, que es enviada
al html, para que sea mostrado en la interfaz del usuario

En caso que haya algo en el grafo, este se vacia, y se vuelve a crear 
una actual, de acuerdo a lo que el usuario definio, en las 
definiciones regulares.
*/
const drawGraph = (lexAnalizer) => {
    document.getElementById('graph').innerHTML='' 
    const [nodes,links] = Graph.toDraw(lexAnalizer);
    makeGraph(nodes,links)
}

/*Funcion que captura el alfabeto y las definiciones regulares 
    Del html se guardan los valores del alfabeto y de las definiciones regulares
    los cuales seran pasado para el analizador Lexico.
*/
const generateAfd = () => {
    if(document.getElementsByTagName('table').length==1)
        document.getElementsByTagName('table')[0].remove()
        document.getElementById('graph').innerHTML='' 
    document.getElementById('alert').style='display:none !important';

    const alphabetInput = document.getElementById('alphabet').value
    const alphabet = alphabetInput.split(' ')
    const defsInput = document.getElementById('defs').value
    var defList = null;
    try{
        defList = defsInput.split('\n').map(x=>{
            const leftSide = x.split(' -> ')[0]
            const rightSide = x.split(' -> ')[1].split(' ')
            return {leftSide: leftSide, rightSide: rightSide}
        })
        
    }catch(error){
        const alert  = document.getElementById('alert')
        alert.innerHTML = 'Definicion regular No Definida'
        alert.style = ""
        console.log(error+'');
        return 0;
    }
    lexAnalizer = new LexicalAnalizer()
    lexAnalizer.setAlfabeto(alphabet)

    try {
        lexAnalizer.regexDefToGraph(defList)
        // console.log(lexAnalizer);
        drawGraph(lexAnalizer);
        createTable(lexAnalizer);
    } catch (error) {
        const alert  = document.getElementById('alert')
        alert.innerHTML = ''+error
        alert.style = ""
        console.log(error+'');
    }

}


/*Funcion que captura la entrada en el paso 2, el cual
se encarga de validar y comprobar el AFD, y se encarga de decir
a que produccion pertenece lo que se carga en la entrada.
Se encarga de recorrer el grafo de acuerdo a la entrada ingresada
Y ver si se llega a un estado final de aceptacion y a cual.
*/
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
