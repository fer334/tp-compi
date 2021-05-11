const toAfd = (props, initialState,endState) => {

    let Destados = [];
    const Dtran = [];
    const alfabeto = props.alfabeto

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
      props.graph.unmarkStates();
      return _move(props.graph, T, a);
    };

    const _move = (newGraph, element, toMatch = props.epsilon) => {
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
      props.graph.unmarkStates();
      return e_c(props.graph, conjunt).sort((a, b) => a - b);
    };

    const e_c = (otherGraph, conjunt) => {
      let newConjunt = [];
      for (let i = 0; i < conjunt.length; i++) {
        // console.log(props.graph.nodes);
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
        links = matchesLinks(node, props.epsilon);
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
      props.graph.nodes = props.graph.nodes.filter(x=>!allNodes.includes(x.id))
      // console.log(props.graph.nodes);
    }

    // console.log(initialState,endState)
    // console.log(props.graph);
    props.graph.unmarkStates();
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

    // console.log(Dtran);
    return graphProps;
  };

  export default toAfd