const epsilon = '\0'

const matchesLinks = (vertex, toMatch)=>{
    const onlyMatchesLink = vertex.links.filter(x=>x.value==toMatch)
    return onlyMatchesLink.map(x=>x.to)
}

const getEpsilonLinks = (vertex)=>{
    let links = []
    if(vertex.links){
        links = matchesLinks(vertex,epsilon)
    }
    return links
}

const isIncluded=(element, list)=>{
    list.forEach(aElement => {
        return aElement==element
    });
}

const includeIfnoExists=(conjunt, links)=>{
    links.forEach(link => {
        if(!isIncluded(link,conjunt))
            conjunt.push(link)
    });
}

const e_c =(graph,element)=>{

    let conjunt=[]
    for (let i = 0; i < element.length; i++) {
        const vertex = graph.find((x)=> x.name==element[i]);
        if(!vertex.isVisited){
            vertex.isVisited=true
            conjunt.push(vertex.name)
            const links = getEpsilonLinks(vertex)
            const childrenConj = e_c(graph,links)

            includeIfnoExists(conjunt,childrenConj)    
        }
    }
    return conjunt
}

const copyGraph=()=>{
    return JSON.parse(JSON.stringify(graph))
}

const cerradura = ( conjunt )=>{
    const duplicadedGraph = copyGraph()
    return e_c(duplicadedGraph, conjunt).sort((a,b)=>a-b)

}

const newDestado=(state)=>{
    Destados.push({
        marca:false,
        valor:state
    })
}

const destadosContainsStateUnmarked= () =>{
    return Destados.some(state=>state.marca===false)
}

const markUnmarkedState = (T)=>{
    T.marca = true

}

const getUnmarkedState = ()=>{
    return Destados.find(x=>x.marca===false)
}


const getMatchesLinks = (vertex,a) => {
    
    let links = []
    if(vertex.links){
        links = matchesLinks(vertex,a)
    }
    return links
}

const _move = (newGraph,element,toMatch=epsilon)=>{

    // console.log('element',element);
    let conjunt=[]
    for (let i = 0; i < element.length; i++) {
        const vertex = newGraph.find((x)=> x.name==element[i]);
        // console.log(vertex);
        if(!vertex.isVisited){ 
            vertex.isVisited=true
            const links = getMatchesLinks(vertex,toMatch)
            includeIfnoExists(conjunt,links)   

        }
    }
    return conjunt
}

const move = (T,a) =>{
    const copiedGraph = copyGraph()
    return _move(copiedGraph,T,a)
}

const isArrayEquals = (a, b) => {
    if(a.length!=b.length)
        return false;
    else   {
        for(var i=0;i<a.length;i++)
            if(a[i]!=b[i])
                return false;
        return true;
    }
}

const DestadosContains = (state) => {
    // console.log(state);
    return JSON.stringify(Destados).includes(JSON.stringify(state))
}

const toFriendlyDtran = () => {
    const friendlyDtran= []
    const keys = Destados.map((state,index)=>{
        return {
            value: String.fromCharCode(65+index),
            key:JSON.stringify(state.valor)
        }
    })
    Dtran.forEach(row => {
        const newrow =row.map((column)=>{
            return keys.find(x=>x.key==JSON.stringify(column))?.value
        })
        friendlyDtran.push(newrow)
    });
    return friendlyDtran
}

const afnToAfd=()=>{
    newDestado(cerradura ([0]))
    let row = 0
    while(destadosContainsStateUnmarked()){
        row++
        const T = getUnmarkedState()
        markUnmarkedState(T)
        const temp =[]
        alfabeto.forEach((aEntry) => {
            U = cerradura (move(T.valor,aEntry))

            if(!DestadosContains(U)){
                newDestado(U)
            }
            temp.push(U)
            
        });
        Dtran.push(temp)
        // if(row==2) break

        // console.log('hola');
    }
    console.log('Destados',Destados);
    console.log('Dtran',Dtran);
    console.log('fDtran',toFriendlyDtran());
    

    
    
}

const graph= require('./exampleGraph.js')
const Destados =[]
const alfabeto = ['a', 'b']
const Dtran = []
// console.log(cerradura ([0]))
// console.log(move([ 0, 1, 2, 4, 7 ],'a'))
// console.log(cerradura (move(cerradura ([0]),'a')))
afnToAfd()

// console.log(move(cerradura ([0]),'a'))
// console.log(move([0]));

// const a =graph
// a[0][0]
// for (const x of a) {
// }
// console.log('a'+''+'a')