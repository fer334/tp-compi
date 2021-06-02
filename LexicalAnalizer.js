import Graph from "./Graph.js";
import minimize from "./minimize.js";
import regexToThompson from "./regexToThompson.js";
import toAfd from "./toAfd.js";
import { DtranToGraph, thompson5WithoutEnd } from "./utils.js";

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

const setAlfabeto = (props, alfabeto) => {
  props.alfabeto = alfabeto;
  return props;
};

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
