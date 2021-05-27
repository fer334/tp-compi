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

const toPrettyDtran = (Dtran, keys) => {
  console.log(Dtran,keys)
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

  // return { keys: keys, Dtran: friendlyDtran };
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

const DtranToGraph = (props, Afdprops) => {
  // console.log(Afdprops);
  const { keys, Dtran } = toFriendlyDtran(Afdprops.Dtran, Afdprops.keys);
  const initialState = Afdprops.initialState;
  const endState = Afdprops.endState;
  // console.log(initialState,endState,Dtran,keys);
  const afdGraph = props.graph;
  const alfabeto = props.alfabeto;
  const lastState = props.lastState;

  let [[startKey], restKey] = splitStates(keys, initialState);
  // console.log(startKey);

  let endKey;
  [[endKey], restKey] = splitStates(restKey, endState);

  const [newIniState, _] = afdGraph.pushStateFromKey(
    lastState,
    keys,
    Dtran,
    alfabeto,
    startKey
  );
  // console.log(newIniState);
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
  // console.log(temp);
  // console.log(newIniState, newEndState);
  // console.log(afdGraph);
  // console.log(endKey);
  newEndState = keys.findIndex((x) => x.key == endKey.key);

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
    // const endNode = props.graph.getFreeNodeName();
    // props.graph.pushNode(endNode);

    props.graph.link(initialNode, p1Ini, props.epsilon);
    props.graph.link(initialNode, p2Ini, props.epsilon);

    // props.graph.link(p1End, endNode,props.epsilon)
    // props.graph.link(p2End, endNode,props.epsilon)

    resIni = initialNode;
  }
  return [resIni, [p1End, p2End]];
};

export { toFriendlyDtran, splitStates, DtranToGraph, thompson5WithoutEnd, toPrettyDtran };
