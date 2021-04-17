




// class Afn{
//     graph=[]
//     alfabeto=[]
//     setGraph:(g) => {
//         this.graph=g
//     }
// }


const graph= require('./exampleGraph1.js')
const Afn= require('./Afn.js')
// const Destados =[]
// const alfabeto = ['a', 'b']
// const Dtran = []
// console.log(cerradura ([0]))
// console.log(move([ 0, 1, 2, 4, 7 ],'a'))
// console.log(cerradura (move(cerradura ([0]),'a')))
// afnToAfd()
const afn = new Afn()
afn.setGraph(graph)
afn.setAlfabeto(['a','b'])
afn.toAfd()

// console.log('afn: ',afn);
// console.log(afn);

// console.log(move(cerradura ([0]),'a'))
// console.log(move([0]));

// const a =graph
// a[0][0]
// for (const x of a) {
// }
// console.log('a'+''+'a')