import Graph from "./Graph.js"

function Automata() {
  const Dtran = [];
  this.graph = new Graph();
  let alfabeto = null;
  const Destados = [];

  this.setGraph = (g) => {
    this.graph = new Graph();
    this.graph.setGraph(g.nodes);
  };
  
  this.setGraphFromNodes= (g) => {
    this.graph = new Graph();
    this.graph.setGraph(g);
  };

  this.setAlfabeto = (a) => {
    alfabeto = a;
  };

  this.toAfd = () => {
    this.graph.unmarkStates()
    newDestado(cerradura([0]));
    
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

    console.log("Destados", Destados);
    console.log("Dtran", Dtran);
    console.log("fDtran", toFriendlyDtran());
    const afdGraph = DtranToGraph(toFriendlyDtran(),alfabeto)
    console.log(afdGraph.nodes);
    const afd = new Automata()
    afd.setGraph(afdGraph)
    return afd

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
    this.graph.unmarkStates()
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
    
    this.graph.unmarkStates()
    return e_c(this.graph, conjunt).sort((a, b) => a - b);
  };

  const e_c = (otherGraph, element) => {
    let conjunt = [];
    for (let i = 0; i < element.length; i++) {
      const node = otherGraph.findNode(element[i]);
      if (!node.isVisited) {
        node.isVisited = true;
        conjunt.push(node.name);
        const links = getEpsilonLinks(node);
        const childrenConj = e_c(otherGraph, links);

        includeIfnoExists(conjunt, childrenConj);
      }
    }
    return conjunt;
  };

  const epsilon = "\0";

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
    return {keys:keys,Dtran:friendlyDtran};
  };

  const DtranToGraph =({keys,Dtran},alfabeto) => {
    const afdGraph = new Graph()
    let [[startKey],restKey] = splitStates(keys,0)
    const max = getMaxOfKeys(keys)
    let maxKey
    [[maxKey],restKey] = splitStates(restKey,max)
    
    afdGraph.pushStateFromKey(Dtran, alfabeto, startKey)

    restKey.forEach(state => {
      afdGraph.pushStateFromKey(Dtran, alfabeto, state)
    });    

    // TODO SUMIDERO PARA EL FINAL
    afdGraph.pushStateFromKey(Dtran, alfabeto, maxKey)

    return afdGraph
    
  }

  const getMaxOfKeys = (keys) => {
    let max = 0
    keys.forEach(element => {
      const array = JSON.parse(element.value)
      const maxArray = Math.max(...array)
      if(maxArray>max)
        max=maxArray
    });
    return max
  }
  
  const splitStates = (keys,state) => {
    return [
      keys.filter(x=>JSON.parse(x.value).some(y=>y == state)),
      keys.filter( (x)=>{
        if(!JSON.parse(x.value).some(y=>y ==state))
          return true
      })
    ]
  } 
}

export default Automata
