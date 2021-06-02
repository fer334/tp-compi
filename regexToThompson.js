// teniendo el inicio y final de dos grafos une ambos para
// tener uno solo, en el formato de la construccion 5
// de thompson, el s|t
const thompson5 = (props, p1Ini, p1End, p2Ini, p2End) => {
  let resIni, resEnd;
  if (p1Ini == undefined) {
    resIni = p2Ini;
    resEnd = p2End;
  } else if (p2End == undefined) {
    resIni = p1Ini;
    resEnd = p1End;
  } else {
    const initialNode = props.graph.getFreeNodeName();
    props.graph.pushNode(initialNode);
    const endNode = props.graph.getFreeNodeName();
    props.graph.pushNode(endNode);

    props.graph.link(initialNode, p1Ini, props.epsilon);
    props.graph.link(initialNode, p2Ini, props.epsilon);

    props.graph.link(p1End, endNode, props.epsilon);
    props.graph.link(p2End, endNode, props.epsilon);

    resIni = initialNode;
    resEnd = endNode;
  }
  return ["3", resIni, resEnd];
};

// teniendo el inicio y final de un grafo genera la construccion
// 4 de thompson, el s*
const thompson4 = (props, prevIniNode, prevEndNode) => {
  const initialNode = props.graph.getFreeNodeName();
  props.graph.pushNode(initialNode);
  const endNode = props.graph.getFreeNodeName();
  props.graph.pushNode(endNode);

  props.graph.link(initialNode, prevIniNode, props.epsilon);
  props.graph.link(prevEndNode, prevIniNode, props.epsilon);
  props.graph.link(initialNode, endNode, props.epsilon);
  props.graph.link(prevEndNode, endNode, props.epsilon);
  return ["3", initialNode, endNode];
};

// teniendo el inicio y final de dos grafos genera la construccion
// 3 de thompson, la concatenacion s t
const thompson3 = (props, p1Ini, p1End, p2Ini, p2End) => {
  let resIni, resEnd;
  if (p1Ini == undefined) {
    resIni = p2Ini;
    resEnd = p2End;
  } else if (p2End == undefined) {
    resIni = p1Ini;
    resEnd = p1End;
  } else {
    resIni = p1Ini;
    resEnd = p2End;
    props.graph.RemoveWithCopy(p1End, p2Ini);
    // debugger
  }
  return ["3", resIni, resEnd];
};

// genera la 2 construccion de thompson, dado un input que se va
// a utilizar como arista
const thompson2 = (props, input) => {
  let iniKey = props.graph.getFreeNodeName();
  props.graph.pushNode(iniKey);
  let endKey = props.graph.getFreeNodeName();
  props.graph.pushNode(endKey);

  props.graph.link(iniKey, endKey, input);
  return ["3", iniKey, endKey];
};

// funcion que maneja las llamadas a generacion de construcciones de
// thompson, dependiendo del tipo genera una u otra construccion
const joinGraphs = (props, type, aIni, aEnd, rIni, rEnd) => {
  if (type == "4") {
    const [_, tIni, tEnd] = thompson4(props, aIni, aEnd);
    const a = thompson3(props, tIni, tEnd, rIni, rEnd);
    return a;
  } else if (type == "5") {
    return thompson5(props, aIni, aEnd, rIni, rEnd);
  } else if (type == "3") {
    return thompson3(props, aIni, aEnd, rIni, rEnd);
  } else {
    return [type, aIni, aEnd, rIni, rEnd];
  }
};

// Funcion que pasa una expresion regular a un afn siguiendo las construcciones
// de thompson
const regexToThompson = (props, regex) => {
  let index = 0;
  let input = regex[index];
  const alfabeto = props.alfabeto;

  // match de toda la vida
  const match = (t) => {
    // console.log(regex[index]);
    if (input == t) {
      index++;
      input = regex[index];
    } else if (input === undefined) {
      throw new Error(`Se esperaba ${t}`);
    } else {
      throw new Error(`Se esperaba una palabra del alfabeto.`);
    }
  };

  // no terminal generada a partir de un conjunto de producciones
  const r = () => {
    if (input == "*") {
      // thompson4()
      match("*");
      const [_, rIni, rEnd] = r();
      return ["4", rIni, rEnd];
    } else if (input == "|") {
      match("|");
      const [_, sIni, sEnd] = s();
      return ["5", sIni, sEnd];
    } else if (alfabeto.includes(input)) {
      const [type1, sIni, sEnd] = s();
      let [type2, rIni, rEnd] = r();

      if (type2 == undefined) type2 = type1;
      return joinGraphs(props, type2, sIni, sEnd, rIni, rEnd);

      // if (sEnd == undefined) return [tIni, tEnd];
      // thompson3(tIni,tEnd,sIni,sEnd)
      // return [sIni, rEnd];
    } else {
      // console.log(input);
      if (input == undefined || input == "(" || input == ")")
        return [undefined, undefined, undefined];
      match("input");
    }
  };

  // no terminal generada a partir de un conjunto de producciones
  const a = () => {
    const [type, tIni, tEnd] = thompson2(props, input);
    match(input);
    return ["3", tIni, tEnd];
  };

  // no terminal generada a partir de un conjunto de producciones
  const s = () => {
    if (alfabeto.includes(input)) {
      const [type1, aIni, aEnd] = a();
      let [type2, rIni, rEnd] = u();
      if (type2 == undefined) type2 = type1;
      return joinGraphs(props, type2, aIni, aEnd, rIni, rEnd);

      // const preInput = input;
      // const [ini, end] = thompson2(preInput);
      // if (rEnd == undefined) return [ini, end];
      // else return [ini, rEnd];
    } else {
      match("");
    }
  };

  // no terminal generada a partir de un conjunto de producciones
  const u = () => {
    if (input == "(") {
      match("(");
      const [type0, p1Ini, p1End] = p();
      match(")");
      let [type1, p2Ini, p2End] = p();

      if (type1 == undefined) type1 = type0;
      const [type2, res1Ini, res1End] = joinGraphs(
        props,
        type1,
        p1Ini,
        p1End,
        p2Ini,
        p2End
      );

      let [type3, uIni, uEnd] = u();

      if (type3 == undefined) type3 = type2;
      return joinGraphs(props, type3, res1Ini, res1End, uIni, uEnd);
    } else {
      return r();
    }
  };

  // no terminal generada a partir de un conjunto de producciones
  const p = () => {
    if (alfabeto.includes(input)) {
      const [type1, sIni, sEnd] = s();
      let [type2, uIni, uEnd] = u();

      if (type2 == undefined) type2 = type1;
      return joinGraphs(props, type2, sIni, sEnd, uIni, uEnd);
    } else {
      return u();
    }
  };

  // console.log(props.graph);
  const pReturn = p();
  // console.log(props.graph.nodes);
  return { initialState: pReturn[1], endState: pReturn[2] };
};

export default regexToThompson;
