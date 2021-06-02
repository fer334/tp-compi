const toFriendlyDtran = (Dtran, keys) => {
  const friendlyDtran = [];

  Dtran.forEach((row) => {
    const newrow = row.map((column) => {
      return keys.find((x) => x.value == JSON.stringify(column))?.key;
    });
    friendlyDtran.push(newrow);
  });
  return { keys: keys, Dtran: friendlyDtran };
};

const toPrettyDtran = (Dtran, keys) => {
  // console.log(Dtran,keys)
  const fooState = keys.findIndex((x) => x.value == '[]')
  const newDtran = Dtran.filter((x,i)=>i!=fooState)
  let i = 0;
  const newKeys = keys
    .filter((_,i)=>i!=fooState)
    .map((x)=> {return {
      key : String.fromCharCode(65+(i++)),
      value : x.value
    }})

  const fTables = toFriendlyDtran(newDtran,newKeys)
  
  return {keys:newKeys, Dtran:fTables.Dtran}

};

const splitStates = (keys, state) => {
  return [
    keys.filter((x) => JSON.parse(x.value).some((y) => y == state)),
    keys.filter((x) => {
      if (!JSON.parse(x.value).some((y) => y == state)) return true;
    }),
  ];
};

/*Funcion encargada de tranformar la tabla Dtrans 
generada a un Grafo
Tabla dtran se envia la funcion friendly dtran con las propiedades del afd
y devuelve un dtran apropidado para el usar la logica con el grafo
*/ 
const DtranToGraph = (props, Afdprops) => {
  const { keys, Dtran } = toFriendlyDtran(Afdprops.Dtran, Afdprops.keys);
  const initialState = Afdprops.initialState;
  const endState = Afdprops.endState;
  const afdGraph = props.graph;
  const alfabeto = props.alfabeto;
  const lastState = props.lastState;

  let [[startKey], restKey] = splitStates(keys, initialState);

  let endKey;
  [[endKey], restKey] = splitStates(restKey, endState);

  const [newIniState, _] = afdGraph.pushStateFromKey(
    lastState,
    keys,
    Dtran,
    alfabeto,
    startKey
  );
  let newEndState;
  restKey.forEach((state) => {
    const temp = afdGraph.pushStateFromKey(
      lastState,
      keys,
      Dtran,
      alfabeto,
      state
    );
    if (temp[1]) newEndState = temp[1];
  });

  const temp = afdGraph.pushStateFromKey(
    lastState,
    keys,
    Dtran,
    alfabeto,
    endKey
  );
  if (temp) newEndState = temp;
  newEndState = endKey ? keys.findIndex((x) => x.key == endKey.key): 0;

  return [newIniState + lastState, newEndState + lastState];
};


const thompson5WithoutEnd = (props,p1Ini, p1End, p2Ini, p2End) => {
  let resIni;
  if (p1Ini == undefined) {
    resIni = p2Ini;
  } else if (p2End == undefined) {
    resIni = p1Ini;
  } else {
    const initialNode = props.graph.getFreeNodeName();
    props.graph.pushNode(initialNode);

    props.graph.link(initialNode, p1Ini, props.epsilon);
    props.graph.link(initialNode, p2Ini, props.epsilon);


    resIni = initialNode;
  }
  return [resIni, [p1End, p2End]];
};

export { toFriendlyDtran, splitStates, DtranToGraph, thompson5WithoutEnd, toPrettyDtran };
