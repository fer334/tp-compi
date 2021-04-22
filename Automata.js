import Graph from "./Graph.js";

function Automata() {
  const Dtran = [];
  this.graph = new Graph();
  let alfabeto = null;
  const Destados = [];
  let initialState = 0;
  let endState = 0;

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

  this.toAfd = () => {
    console.log(initialState, endState);
    this.graph.unmarkStates();
    newDestado(cerradura([initialState]));

    while (destadosContainsStateUnmarked()) {
      const T = getUnmarkedState();
      markUnmarkedState(T);
      const temp = [];

      alfabeto.forEach((aEntry) => {
        // console.log (aEntry, T);
        let U = cerradura(move(T.valor, aEntry));

        if (!DestadosContains(U)) {
          newDestado(U);
        }
        temp.push(U);
      });
      Dtran.push(temp);
    }

    console.log("Destados", Destados);
    console.log("Dtran", Dtran);
    console.log("fDtran", toFriendlyDtran());

    const afdGraph = DtranToGraph(toFriendlyDtran(), alfabeto);
    // console.log(afdGraph.nodes);
    const afd = new Automata();
    afd.setGraph(afdGraph);
    return afd;
  };
  
  this.setIniEndStates = (ini,end) => {
    initialState = ini
    endState = end
  }

  this.regexToThompson = (entrada) => {
    let index = 0;
    let input = entrada.charAt(index);

    const thompson5 = (p1Ini, p1End,p2Ini, p2End) => {
      // console.log(p1Ini, p1End,p2Ini, p2End);
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
      // console.log(prevIniNode, prevEndNode);
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
      // console.log(p1Ini, p1End,p2Ini, p2End);
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
        // console.log(p2Ini,p1End );
        // console.log('3',resIni,resEnd,this.graph.nodes);
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
      // console.log(iniKey, endKey);
      return ['3',iniKey, endKey];
    };

    const joinGraphs = (type, aIni, aEnd, rIni, rEnd) => {
      // console.log(type, aIni, aEnd, rIni, rEnd);
      if(type == '4'){
        const [_,tIni, tEnd] = thompson4(aIni, aEnd)
        // console.log(tIni, tEnd);
        // console.log( aIni, aEnd, rIni, rEnd);
        const a = thompson3(tIni, tEnd, rIni, rEnd)
        // console.log(a);
        return a
      }else if(type =='5'){
        return thompson5(aIni, aEnd, rIni, rEnd)
      }else if(type == '3'){
        return thompson3(aIni, aEnd, rIni,rEnd)
      }else{
        return [type, aIni, aEnd, rIni, rEnd]
      }

    }

    const match = (t) => {
      // console.log(t);
      if (input == t) {
        index++;
        input = entrada.charAt(index);
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
        
        // console.log('r rs',sIni, sEnd, rIni, rEnd);
        // if (sEnd == undefined) return [tIni, tEnd];
        // thompson3(tIni,tEnd,sIni,sEnd)
        // return [sIni, rEnd];
      }else{
        return [undefined, undefined, undefined]
      }
    };

    const a = () => {
      const [type,tIni,tEnd] = thompson2(input)
      match(input)
      return ['3', tIni,tEnd]
    }

    const s = () => {
      // if (alfabeto.includes(input)) {
        
        const [type1,aIni, aEnd] = a();
        let [type2,rIni, rEnd] = u();
        if(type2 == undefined)
          type2 = type1
        return joinGraphs(type2,aIni,aEnd,rIni,rEnd)

        // const preInput = input;
        // const [ini, end] = thompson2(preInput);
        // console.log('s ar',ini, end, rIni, rEnd);
        // console.log(rEnd == undefined)
        // if (rEnd == undefined) return [ini, end];
        // else return [ini, rEnd];

      // } else {
      //   match("");
      //   const [rIni, rEnd] = r()
      //   return [rIni, rEnd];
      // }
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
    let foo;
    [foo,initialState,endState] = p()
  };

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
      // console.log(element[i]);
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
    // console.log(conjunt,links);
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
      // console.log(conjunt[i]);
      const node = otherGraph.findNode(conjunt[i]);
      // console.log(node);
      if (!node.isVisited) {
        node.isVisited = true;
        newConjunt.push(node.id);
        const links = getEpsilonLinks(node);
        // console.log(links);
        const childrenConj = e_c(otherGraph, links);

        includeIfnoExists(newConjunt, childrenConj);
      }
    }
    return newConjunt;
  };

  const epsilon = "\0";

  const getEpsilonLinks = (node) => {
    let links = [];
    if (node.links) {
      links = matchesLinks(node, epsilon);
    }
    // console.log(node,links);
    return links;
  };

  const DestadosContains = (state) => {
    return JSON.stringify(Destados).includes(JSON.stringify(state));
  };

  const toFriendlyDtran = () => {
    const friendlyDtran = [];
    const keys = Destados.map((state, index) => {
      return {
        key: String.fromCharCode(65 + index),
        value: JSON.stringify(state.valor),
      };
    });
    Dtran.forEach((row) => {
      const newrow = row.map((column) => {
        return keys.find((x) => x.value == JSON.stringify(column))?.key;
      });
      friendlyDtran.push(newrow);
    });
    return { keys: keys, Dtran: friendlyDtran };
  };

  const DtranToGraph = ({ keys, Dtran }, alfabeto) => {

    const afdGraph = new Graph();

    let [[startKey], restKey] = splitStates(keys, initialState);

    let endKey;
    [[endKey], restKey] = splitStates(restKey, endState);

    afdGraph.pushStateFromKey(Dtran, alfabeto, startKey);

    restKey.forEach((state) => {
      afdGraph.pushStateFromKey(Dtran, alfabeto, state);
    });

    // TODO: SUMIDERO PARA EL FINAL
    afdGraph.pushStateFromKey(Dtran, alfabeto, endKey);

    console.log(initialState, endState);
    return afdGraph;
  };

  const splitStates = (keys, state) => {
    return [
      keys.filter((x) => JSON.parse(x.value).some((y) => y == state)),
      keys.filter((x) => {
        if (!JSON.parse(x.value).some((y) => y == state)) return true;
      }),
    ];
  };
}

export default Automata;
