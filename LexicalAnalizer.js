import Graph from "./Graph.js";
import minimize from "./minimize.js";
import regexToThompson from "./regexToThompson.js";
import toAfd from "./toAfd.js";
import { DtranToGraph, thompson5WithoutEnd } from "./utils.js";

/*Es el analizador lexico, donde todas las funciones se utilizan
  para poder generar el Dtran final con el Afd de las 
  producciones y el grafo del afd
  el objeto tiene el grafo, el alfabeto, el ultimo estado, el conjunto vacio,
  los estados finales, los estados detran y destados finales, 
  la lista de exp regulares, y el estado inicial
*/
class LexicalAnalizer {
  constructor() {
    this.graph = new Graph();
    this.alfabeto = null;
    this.lastState = 0;
    this.epsilon = "\0";
    this.endStateList = [];
    this.finalDtranDestados = [];
    this.regexDefList = [];
    this.initialState = 0;
  }

  setAlfabeto = (alfabeto) => setAlfabeto(this, alfabeto);
  regexDefToGraph = (defList) => regexDefToGraph(this, defList);
  run = (input) => run(this, input);
}

//donde se setea el alfabeto que va a ser utilizado
const setAlfabeto = (props, alfabeto) => {
  props.alfabeto = alfabeto;
  return props;
};

/*
Encargado de convertir la lista de exp regulares al grafo del afd minimo
para cada definicio regular se crea el afd minimo, 
se pasan a las funciones de thompson, de convertilos a afd, para luego finalmente
minimizarlo.
Luego de ello se unen todas las producciones atraves del conjunto vacio, esto
al convertirse de vuelta en AFN, se vuelve a parsar a AFD
Al final de todo esto se devuelve ya el la matriz dtran con el estado inicial, el final
y las llaves
*/
const regexDefToGraph = (props, defList) => {
  const minAfd = (props, regexDef) => {
    const thompsonG = regexToThompson(props, regexDef.rightSide);
    const afd = toAfd(props, thompsonG.initialState, thompsonG.endState);
    const minAfd = minimize(props, afd);
    const [initialState, endState] = DtranToGraph(props, minAfd);
    return { initialState, endState };
  };

  const graphsProps = [];
  defList.forEach((regexDef) => {
    const { initialState, endState } = minAfd(props, regexDef);
    props.lastState = endState + 1;
    graphsProps.push({
      initialState: initialState,
      endState: endState,
      leftSide: regexDef.leftSide,
    });
  });
  let aIni, aEnd, bIni, bEnd;
  for (let index = 0; index < graphsProps.length; index++) {
    const regexGraph = graphsProps[index];
    if (index == 0) {
      aIni = bIni = regexGraph.initialState;
      aEnd = bEnd = regexGraph.endState;
    } else {
      bIni = regexGraph.initialState;
      bEnd = regexGraph.endState;
      const joinReturn = thompson5WithoutEnd(props, aIni, aEnd, bIni, bEnd);
      aIni = joinReturn[0];
      aEnd = joinReturn[1][1];
    }
    if (!props.graph.findNode(bEnd)) props.graph.pushNode(bEnd);
  }
  const afd = toAfd(props, aIni, bEnd);
  props.initialState = afd.initialState;
  props.finalDtranDestados = { Dtran: afd.Dtran, Destados: afd.Destados };
  props.regexDefList = graphsProps;

  DtranToGraph(props, {
    initialState: afd.initialState,
    endState: afd.endState,
    Dtran: afd.Dtran,
    keys: afd.Destados,
  });
};


/*El que corre para la validacion, se obtiene las entradas ccargadas
y se analiza si esa entrada es valida y cumple con alguna produccion,
lo que se hace es recorrer el grafo de acuerdo al alfabeto en orden a lo que 
se recibio en la entrada. Al final de recorrer se comprueba si se llego a un
estado de aceptacion, y si es asi se ve a que produccion pertenece ese estado
caso contrario se retorno produccion no definida
*/
const run = (props, input) => {
  const finalDtranDestados = props.finalDtranDestados;
  const alfabeto = props.alfabeto;
  const initialState = props.initialState;
  const regexDefList = props.regexDefList;

  const { Dtran, Destados } = finalDtranDestados;

  const move = (state, input) => {
    const inputIndex = alfabeto.findIndex((x) => x == input);
    const row = Destados.findIndex((x) => x.value.includes(state));
    return Dtran[row][inputIndex];
  };

  let s = initialState;
  let c = 0;
  while (c != input.length) {
    s = move(s, input[c]);
    c++;
  }
  let returnValue = undefined;
  if (s) {
    let endState;
    s.forEach((y) => {
      if (!endState) endState = regexDefList.find((x) => x.endState == y);
    });
    if (endState) {
      returnValue = endState.leftSide;
    } else {
      returnValue = undefined;
    }
  }

  return returnValue;
};

export { LexicalAnalizer };
