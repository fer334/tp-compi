const Graph = require("./Graph");
// function Destado(){
//     this.marca=false
//     this.valor=[]
// }

function Afn() {
  const Dtran = [];
  let graph = [];
  let alfabeto = null;
  const Destados = [];

  this.setGraph = (g) => {
    graph = new Graph();
    graph.setGraph(g);
  };

  this.setAlfabeto = (a) => {
    alfabeto = a;
  };

  this.toAfd = () => {
    newDestado(cerradura([0]));
    let row = 0;
    while (destadosContainsStateUnmarked()) {
      row++;
      const T = getUnmarkedState();
      markUnmarkedState(T);
      const temp = [];
      alfabeto.forEach((aEntry) => {
        U = cerradura(move(T.valor, aEntry));

        if (!DestadosContains(U)) {
          newDestado(U);
        }
        temp.push(U);
      });
      Dtran.push(temp);
      // if(row==2) break

      // console.log('hola');
    }
    console.log("Destados", Destados);
    console.log("Dtran", Dtran);
    console.log("fDtran", toFriendlyDtran());
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
    const copiedGraph = graph.copyGraph();
    return _move(copiedGraph, T, a);
  };

  const _move = (newGraph, element, toMatch = epsilon) => {
    // console.log('element',element);
    let conjunt = [];
    for (let i = 0; i < element.length; i++) {
      const vertex = newGraph.find((x) => x.name == element[i]);
      // console.log(vertex);
      if (!vertex.isVisited) {
        vertex.isVisited = true;
        const links = getMatchesLinks(vertex, toMatch);
        includeIfnoExists(conjunt, links);
      }
    }
    return conjunt;
  };

  const getMatchesLinks = (vertex, a) => {
    let links = [];
    if (vertex.links) {
      links = matchesLinks(vertex, a);
    }
    return links;
  };

  const matchesLinks = (vertex, toMatch) => {
    const onlyMatchesLink = vertex.links.filter((x) => x.value == toMatch);
    return onlyMatchesLink.map((x) => x.to);
  };

  const includeIfnoExists = (conjunt, links) => {
    links.forEach((link) => {
      if (!isIncluded(link, conjunt)) conjunt.push(link);
    });
  };

  const isIncluded = (element, list) => {
    list.forEach((aElement) => {
      return aElement == element;
    });
  };

  const cerradura = (conjunt) => {
    const duplicadedGraph = graph.copyGraph();
    return e_c(duplicadedGraph, conjunt).sort((a, b) => a - b);
  };

  const e_c = (graph, element) => {
    let conjunt = [];
    for (let i = 0; i < element.length; i++) {
      const vertex = graph.find((x) => x.name == element[i]);
      if (!vertex.isVisited) {
        vertex.isVisited = true;
        conjunt.push(vertex.name);
        const links = getEpsilonLinks(vertex);
        const childrenConj = e_c(graph, links);

        includeIfnoExists(conjunt, childrenConj);
      }
    }
    return conjunt;
  };

  const epsilon = "\0";

  const getEpsilonLinks = (vertex) => {
    let links = [];
    if (vertex.links) {
      links = matchesLinks(vertex, epsilon);
    }
    return links;
  };

  const DestadosContains = (state) => {
    // console.log(state);
    return JSON.stringify(Destados).includes(JSON.stringify(state));
  };

  const toFriendlyDtran = () => {
    const friendlyDtran = [];
    const keys = Destados.map((state, index) => {
      return {
        value: String.fromCharCode(65 + index),
        key: JSON.stringify(state.valor),
      };
    });
    Dtran.forEach((row) => {
      const newrow = row.map((column) => {
        return keys.find((x) => x.key == JSON.stringify(column))?.value;
      });
      friendlyDtran.push(newrow);
    });
    return friendlyDtran;
  };
}

module.exports = Afn;
