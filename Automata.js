import Graph from "./Graph.js";

function Automata() {
  this.graph = new Graph();
  let alfabeto = null;
  let lastState=0;
  const epsilon = "\0";
  const endStateList = []
  let finalDtranDestados = []
  let regexDefList = []
  let initialState

  this.setGraph = (g) => {
    this.graph = new Graph();
    this.graph.setGraph(g.nodes);
  };

  this.setGraphFromNodes = (g) => {
    this.graph = new Graph();
    this.graph.setGraph(g);
  };

  this.setAlfabeto = (a) => {
    alfabeto = a;
  };

  const toAfd = (initialState,endState) => {
    let Destados = [];
    const Dtran = [];

    const newDestado = (state) => {
      Destados.push({
        marca: false,
        valor: state,
      });
    };

    const destadosContainsStateUnmarked = () => {
      return Destados.some((state) => state.marca === false);
    };

    const getUnmarkedState = () => {
      return Destados.find((x) => x.marca === false);
    };

    const markUnmarkedState = (T) => {
      T.marca = true;
    };

    const move = (T, a) => {
      this.graph.unmarkStates();
      return _move(this.graph, T, a);
    };

    const _move = (newGraph, element, toMatch = epsilon) => {
      let conjunt = [];
      for (let i = 0; i < element.length; i++) {
        const node = newGraph.findNode(element[i]);
        if (!node.isVisited) {
          node.isVisited = true;
          const links = getMatchesLinks(node, toMatch);
          includeIfnoExists(conjunt, links);
        }
      }
      return conjunt;
    };

    const getMatchesLinks = (node, a) => {
      let links = [];
      if (node.links) {
        links = matchesLinks(node, a);
      }
      return links;
    };

    const matchesLinks = (node, toMatch) => {
      const onlyMatchesLink = node.links.filter((x) => x.value == toMatch);
      return onlyMatchesLink.map((x) => x.to);
    };

    const includeIfnoExists = (conjunt, links) => {
      links.forEach((link) => {
        if (!isIncluded(link, conjunt)) {
          conjunt.push(link);
        }
      });
    };

    const isIncluded = (element, list) => {
      list.forEach((aElement) => {
        return aElement == element;
      });
    };

    const cerradura = (conjunt) => {
      this.graph.unmarkStates();
      return e_c(this.graph, conjunt).sort((a, b) => a - b);
    };

    const e_c = (otherGraph, conjunt) => {
      let newConjunt = [];
      for (let i = 0; i < conjunt.length; i++) {
        // console.log(this.graph.nodes);
        const node = otherGraph.findNode(conjunt[i]);
        if (!node.isVisited) {
          node.isVisited = true;
          newConjunt.push(node.id);
          const links = getEpsilonLinks(node);
          const childrenConj = e_c(otherGraph, links);

          includeIfnoExists(newConjunt, childrenConj);
        }
      }
      return newConjunt;
    };

    const getEpsilonLinks = (node) => {
      let links = [];
      if (node.links) {
        links = matchesLinks(node, epsilon);
      }
      return links;
    };

    const DestadosContains = (state) => {
      return JSON.stringify(Destados).includes(JSON.stringify(state));
    };

    const deleteNodesFrom = (parents) => {
      // console.log(Destados);
      const allNodes = Destados.reduce((prev,curr)=>{
        return curr=[...prev,...curr.valor]
      },[]);
      this.graph.nodes = this.graph.nodes.filter(x=>!allNodes.includes(x.id))
      // console.log(this.graph.nodes);
    }

    // console.log(initialState,endState)
    console.log(this.graph.nodes);
    this.graph.unmarkStates();
    newDestado(cerradura([initialState]));
    // console.log(Destados);

    while (destadosContainsStateUnmarked()) {
      const T = getUnmarkedState();
      markUnmarkedState(T);
      const temp = [];

      alfabeto.forEach((aEntry) => {
        let U = cerradura(move(T.valor, aEntry));

        if (!DestadosContains(U)) {
          newDestado(U);
        }
        temp.push(U);
      });
      Dtran.push(temp);
    }

    
    Destados = Destados.map((x,i)=>{return{
      marca:x.marca,
      valor:x.valor,
      key: String.fromCharCode(65 + i),
      value: JSON.stringify(x.valor),
    }})
    // console.log(Destados);
    
    deleteNodesFrom([initialState])

    // console.log(Dtran,endState);
    const graphProps = {
      initialState: initialState,
      endState: endState,
      Dtran: Dtran,
      Destados: Destados
    }

    // console.log(graphProps);
    // const [newIniState,newEndState] = DtranToGraph(graphProps);
    // console.log(newIniState,newEndState);
    // const afd = new Automata();
    // afd.setGraph(afdGraph);
    // console.log(initialState,endState);
    // afd.setIniEndStates(newIniState,newEndState)
    // return afd;

    console.log(Dtran);
    return graphProps;
  };

  const toFriendlyDtran = (Dtran, keys) => {
    const friendlyDtran = [];
    
    Dtran.forEach((row) => {
      const newrow = row.map((column) => {
        // console.log(keys);
        // console.log(keys.find((x) => x.value == JSON.stringify(column))?.key);
        return keys.find((x) => x.value == JSON.stringify(column))?.key;
      });
      friendlyDtran.push(newrow);
    });
    // console.log(Dtran);
    return { keys: keys, Dtran: friendlyDtran };
  };
  
  this.setIniEndStates = (ini,end) => {
    initialState = ini
    endState = end
  }

  this.regexDefToGraph = (defList) => {
    const graphsProps = []
    defList.forEach(regexDef => {
      // console.log(regexDef);
      const regexDefGraphProps = regexToThompson(regexDef.rightSide)
      const {initialState,endState} = toAfdMinimized(regexDefGraphProps.initialState,regexDefGraphProps.endState)
      lastState = endState+1
      // console.log(lastState);
      graphsProps.push({
        initialState: initialState,
        endState: endState,
        leftSide: regexDef.leftSide
      })
    });
    console.log(graphsProps);
    let aIni,aEnd,bIni,bEnd
    for (let index = 0; index < graphsProps.length; index++) {
      const regexGraph = graphsProps[index];
      if(index==0){
        aIni = bIni = regexGraph.initialState
        aEnd = bEnd = regexGraph.endState
      }else{
        bIni = regexGraph.initialState
        bEnd = regexGraph.endState
        const joinReturn = thompson5WithoutEnd(aIni,aEnd,bIni,bEnd)
        aIni = joinReturn[0]
        aEnd = joinReturn[1][1]
      }
      if(!this.graph.findNode(bEnd)) this.graph.pushNode(bEnd)
      // console.log(this.graph.nodes);
      
    }
    // console.log(aIni,aEnd,bIni,bEnd);
    const afd = toAfd(aIni,3)
    initialState = afd.initialState
    finalDtranDestados = {Dtran:afd.Dtran, Destados:afd.Destados}
    regexDefList = graphsProps
    
    DtranToGraph({
      initialState: afd.initialState,
      endState: afd.endState,
      Dtran: afd.Dtran,
      keys: afd.Destados
    })
    // console.log(this.graph.nodes);
    
  }

  const toAfdMinimized = (initialState, endState) => {
    const afd = toAfd(initialState,endState);
    const minAfd = minimize(afd);
    // console.log(minAfd);
    [initialState, endState] = DtranToGraph(minAfd);
    return {initialState, endState}
  }

  const thompson5WithoutEnd = (p1Ini, p1End, p2Ini, p2End) => {
    let resIni
    if(p1Ini==undefined){
      resIni = p2Ini
    }else if(p2End == undefined){
      resIni = p1Ini
    }else{
      
      const initialNode = this.graph.getFreeNodeName();
      this.graph.pushNode(initialNode);
      // const endNode = this.graph.getFreeNodeName();
      // this.graph.pushNode(endNode);

      this.graph.link(initialNode,p1Ini,epsilon)
      this.graph.link(initialNode,p2Ini,epsilon)

      // this.graph.link(p1End, endNode,epsilon)
      // this.graph.link(p2End, endNode,epsilon)


      resIni = initialNode
    }
    return [resIni, [p1End,p2End]]
  };

  const thompson5 = (p1Ini, p1End,p2Ini, p2End) => {
    let resIni, resEnd
    if(p1Ini==undefined){
      resIni = p2Ini
      resEnd = p2End
    }else if(p2End == undefined){
      resIni = p1Ini
      resEnd = p1End
    }else{
      
      const initialNode = this.graph.getFreeNodeName();
      this.graph.pushNode(initialNode);
      const endNode = this.graph.getFreeNodeName();
      this.graph.pushNode(endNode);

      this.graph.link(initialNode,p1Ini,epsilon)
      this.graph.link(initialNode,p2Ini,epsilon)

      this.graph.link(p1End, endNode,epsilon)
      this.graph.link(p2End, endNode,epsilon)


      resIni = initialNode
      resEnd = endNode
    }
    return ['3',resIni, resEnd]
  };

  const thompson4 = (prevIniNode, prevEndNode) => {
    const initialNode = this.graph.getFreeNodeName();
    this.graph.pushNode(initialNode);
    const endNode = this.graph.getFreeNodeName();
    this.graph.pushNode(endNode);

    this.graph.link(initialNode, prevIniNode, epsilon);
    this.graph.link(prevEndNode, prevIniNode, epsilon);
    this.graph.link(initialNode, endNode, epsilon);
    this.graph.link(prevEndNode, endNode, epsilon);
    return ['3',initialNode, endNode]
  };

  const thompson3 = (p1Ini, p1End,p2Ini, p2End) => {
    let resIni, resEnd
    if(p1Ini==undefined){
      resIni = p2Ini
      resEnd = p2End
    }else if(p2End == undefined){
      resIni = p1Ini
      resEnd = p1End
    }else{
      resIni = p1Ini
      resEnd = p2End
      this.graph.RemoveWithCopy(p1End, p2Ini);
      // debugger
    }
    return ['3',resIni,resEnd]
  };

  const thompson2 = (input) => {
    let iniKey = this.graph.getFreeNodeName();
    this.graph.pushNode(iniKey);
    let endKey = this.graph.getFreeNodeName();
    this.graph.pushNode(endKey);

    this.graph.link(iniKey, endKey, input);
    return ['3',iniKey, endKey];
  };

  const joinGraphs = (type, aIni, aEnd, rIni, rEnd) => {
    if(type == '4'){
      const [_,tIni, tEnd] = thompson4(aIni, aEnd)
      const a = thompson3(tIni, tEnd, rIni, rEnd)
      return a
    }else if(type =='5'){
      return thompson5(aIni, aEnd, rIni, rEnd)
    }else if(type == '3'){
      return thompson3(aIni, aEnd, rIni,rEnd)
    }else{
      return [type, aIni, aEnd, rIni, rEnd]
    }

  }

  const regexToThompson = ( regex ) => {
    let index = 0;
    let input = regex[index]


    const match = (t) => {
      // console.log(regex[index]);
      if (input == t) {
        index++;
        input = regex[index];
      } else {
        throw new Error(`error: recibi ${input} tendria que ser ${t}.`);
      }
    };

    const r = () => {
      if (input == "*") {
        // thompson4()
        match("*");
        const [_,rIni, rEnd] = r();
        return ['4',rIni, rEnd];

      } else if (input == "|") {
        match("|");
        const [_,sIni, sEnd] = s();
        return ['5',sIni, sEnd]

      } else if (alfabeto.includes(input)) {
        const [type1,sIni, sEnd] = s();
        let [type2,rIni, rEnd] = r();

        if(type2 == undefined)
          type2 = type1
        return joinGraphs(type2,sIni,sEnd,rIni,rEnd)
        
        // if (sEnd == undefined) return [tIni, tEnd];
        // thompson3(tIni,tEnd,sIni,sEnd)
        // return [sIni, rEnd];
      }else{
        // console.log(input);
        if(input==undefined || input=='(' || input==')')
          return [undefined, undefined, undefined]
        match('input')
      }
    };

    const a = () => {
      const [type,tIni,tEnd] = thompson2(input)
      match(input)
      return ['3', tIni,tEnd]
    }

    const s = () => {
      if (alfabeto.includes(input)) {
        
        const [type1,aIni, aEnd] = a();
        let [type2,rIni, rEnd] = u();
        if(type2 == undefined)
          type2 = type1
        return joinGraphs(type2,aIni,aEnd,rIni,rEnd)

        // const preInput = input;
        // const [ini, end] = thompson2(preInput);
        // if (rEnd == undefined) return [ini, end];
        // else return [ini, rEnd];

      } else {
        match("");
      }
    };

    const u = () => {
      if(input == '('){
        match('(')
        const [type0,p1Ini, p1End] = p()
        match(')')
        let [type1, p2Ini, p2End] = p()

        if(type1 == undefined)
          type1 = type0
        const [type2,res1Ini, res1End] = joinGraphs(type1,p1Ini,p1End,p2Ini,p2End)
       
        let [type3, uIni, uEnd] = u()

        if(type3 == undefined)
          type3 = type2
        return joinGraphs(type3,res1Ini,res1End,uIni,uEnd)
      }else{
        return r()
      }
    }
    const p = () => {
      if(alfabeto.includes(input) ){
        const [type1,sIni, sEnd] = s();
        let [type2, uIni, uEnd] = u();

        if(type2 == undefined)
          type2 = type1
        return joinGraphs(type2,sIni,sEnd,uIni,uEnd);
      }else{
        return u()
      }
    };

    const pReturn = p()
    // console.log(this.graph.nodes);  
    return {initialState:pReturn[1], endState:pReturn[2]}
  };

  this.run = (input) => {
    const {Dtran,Destados} = finalDtranDestados
    // console.log(finalDtranDestados);
    // console.log(regexDefList);

    const move = (state, input ) => {
      const inputIndex = alfabeto.findIndex(x=>x==input)
      const row = Destados.findIndex(x=>x.value.includes(state)) 
      // console.log(row,inputIndex,Dtran[row][inputIndex]);      
      return Dtran[row][inputIndex]
    }

    
    let s = initialState;
    // console.log(Dtran,Destados);
    // console.log(s);
    // console.log( move([s],input));
    let c = 0;
    while(c != input.length){
      // console.log(input[c]);
      s = move(s,input[c])
      c++
    }
    // console.log(s, regexDefList);
    let returnValue = undefined
    if(s){
      let endState;
      s.forEach(y=>{
        if(!endState)
          endState = regexDefList.find(x=>x.endState==y) 
  
      })
      // console.log(endState);
      if(endState){
        returnValue = endState.leftSide
        // console.log(endState.leftSide);
      }else{
        returnValue = undefined
        console.log('no');
      }
    }
    return returnValue
  }

  this.getDestados=()=>{
    return Destados
  }

  const DtranToGraph = (props) => {
    // console.log(props);
    const {keys,Dtran} = toFriendlyDtran(props.Dtran,props.keys)
    const initialState = props.initialState
    const endState = props.endState
    // console.log(initialState,endState,Dtran,keys);
    const afdGraph = this.graph;

    let [[startKey], restKey] = splitStates(keys, initialState);
    // console.log(startKey);

    let endKey;
    [[endKey], restKey] = splitStates(restKey, endState);

    const [newIniState,_] = afdGraph.pushStateFromKey(lastState,keys, Dtran, alfabeto, startKey);
    // console.log(newIniState);
    let newEndState
    restKey.forEach((state) => {
      const temp = afdGraph.pushStateFromKey(lastState,keys, Dtran, alfabeto, state);
      if (temp[1]) newEndState = temp[1]
    });

    // TODO: SUMIDERO PARA EL FINAL
    const temp = afdGraph.pushStateFromKey(lastState,keys, Dtran, alfabeto, endKey);
    if (temp) newEndState = temp
    // console.log(temp);
    // console.log(newIniState, newEndState);
    // console.log(afdGraph);
    // console.log(endKey);
    newEndState = keys.findIndex(x=>x.key==endKey.key)

    return [newIniState+lastState, newEndState+lastState];
  };

  const splitStates = (keys, state) => {
    // console.log(state, keys.filter((x) => JSON.parse(x.value).some((y) => y == state)));
    return [
      keys.filter((x) => JSON.parse(x.value).some((y) => y == state)),
      keys.filter((x) => {
        if (!JSON.parse(x.value).some((y) => y == state)) return true;
      }),
    ];
  };

  const split = (string, splitValue) => {
    // console.log('string',string);
    // console.log('splitValue',splitValue);
    const rString = string.replaceAll(splitValue,'')
    return [splitValue, rString]
  }

  const minimize = (graphProps) => {
    const initialState  = graphProps.initialState
    const endState  = graphProps.endState
    const {Dtran, keys}  = toFriendlyDtran(graphProps.Dtran, graphProps.Destados)
    // console.log( initialState, endState, Dtran, keys);

    let pi = []
    // console.log(endState);
    let [endStateKey, _] = splitStates(keys, endState);
    // console.log( splitStates(keys, endState));
    
    const onlyKeysValueEndState = endStateKey.map(x=>x.key).reduce((pre,curr)=>pre+curr,"")
    const onlyKeysValue = keys.map(x=>x.key).reduce((pre,curr)=>pre+curr,"")
    
    // console.log(onlyKeysValueEndState);
    const [startKey, restKey] = split(onlyKeysValue,onlyKeysValueEndState)
    
    
    // let [startKey, restKey] = splitStates(keys, endState);
    pi.push(startKey, restKey)

    // console.log(keys, Dtran,endState);
    // console.log(pi,keys,Dtran);
    let isUpdated = true
    while(isUpdated){
      isUpdated = false
      pi.forEach(conjunt => {
        if (conjunt.length != 1 ){
          alfabeto.forEach((link,dtranIndex) => {
            if(!isUpdated){
              const goTos = []
              for (let eleIndex = 0; eleIndex < conjunt.length; eleIndex++) {
                const actualElement=conjunt[eleIndex]
                const actualElementIndex = actualElement.charCodeAt()-65
                const goTo = Dtran[actualElementIndex][dtranIndex];
                // console.log(goTo);
                // if()
                goTos.push([ pi.find(x=>x.includes(goTo)),actualElement])
              }
  
              let prev = goTos[0]
              // console.log(goTos,'e', goTos.filter(x=>x[0]==prev[0]), goTos.filter(x=>x[0]!=prev[0]));
              const A = goTos.filter(x=>x[0]==prev[0])
              const B = goTos.filter(x=>x[0]!=prev[0])
              if(A.length !=0 && B.length != 0){

                if(A.length < B.length){
                  prev = A[0]
                }else
                  prev = B[0]
                // console.log(prev);
                const actualElement = prev[1]
                // console.log(conjunt,actualElement);
                const newsConjunts = split(conjunt,actualElement)
                // console.log(newsConjunts);
                pi=pi.filter(x=>x!=conjunt)
                pi.push(...newsConjunts)
                isUpdated = true
                // console.log('pi',pi);
              }
            }
          });
          
        }
      });
    }
    const newDtran = []
    const newKeys = []
    pi = pi.sort((a,b)=>a.charCodeAt(0)-b.charCodeAt(0))
    // console.log(pi);

    pi.forEach((element,index) => {
      const key = keys.findIndex(x=>x.key==element.split('')[0])
      newKeys.push({
        key: element,
        value: keys[key].value ,
      })
    });

    // console.log(Dtran);
    pi.forEach(element => {
      const key = keys.findIndex(x=>x.key==element.split('')[0])
      const row = []
      Dtran[key].forEach(element => {
        const columnName = newKeys.find(x=>x.key.includes(element))
        // console.log(columnName);
        if(columnName)
          row.push(JSON.parse(columnName.value))
        else
          row.push(undefined)
      });
      newDtran.push(row)
    });
    
    // console.log(pi,Dtran,keys,);
    // console.log(pi,newDtran,newKeys,);
    return {
      initialState:initialState,
      endState: endState, 
      Dtran: newDtran, 
      keys:newKeys
    } 
  }
}

export default Automata;
