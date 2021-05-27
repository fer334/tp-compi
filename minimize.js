import { splitStates, toFriendlyDtran } from "./utils.js";

const split = (string, splitValue) => {
  // console.log('string',string);
  // console.log('splitValue',splitValue);
  const rString = string.replaceAll(splitValue, "");
  return [splitValue, rString];
};

const minimize = (props, graphProps) => {
  const initialState = graphProps.initialState;
  const endState = graphProps.endState;
  const { Dtran, keys } = toFriendlyDtran(
    graphProps.Dtran,
    graphProps.Destados
  );
  const alfabeto = props.alfabeto
  // console.log( initialState, endState, Dtran, keys);

  let pi = [];
  // console.log(endState);
  let [endStateKey, _] = splitStates(keys, endState);
  // console.log( splitStates(keys, endState));

  const onlyKeysValueEndState = endStateKey
    .map((x) => x.key)
    .reduce((pre, curr) => pre + curr, "");
  const onlyKeysValue = keys
    .map((x) => x.key)
    .reduce((pre, curr) => pre + curr, "");

  // console.log(onlyKeysValueEndState);
  const [startKey, restKey] = split(onlyKeysValue, onlyKeysValueEndState);

  // let [startKey, restKey] = splitStates(keys, endState);
  pi.push(startKey, restKey);

  // console.log(keys, Dtran,endState);
  // console.log(pi,keys,Dtran);
  let isUpdated = true;
  while (isUpdated) {
    isUpdated = false;
    pi.forEach((conjunt) => {
      if (conjunt.length != 1) {
        alfabeto.forEach((link, dtranIndex) => {
          if (!isUpdated) {
            const goTos = [];
            for (let eleIndex = 0; eleIndex < conjunt.length; eleIndex++) {
              const actualElement = conjunt[eleIndex];
              const actualElementIndex = actualElement.charCodeAt() - 65;
              const goTo = Dtran[actualElementIndex][dtranIndex];
              // console.log(goTo);
              // if()
              goTos.push([pi.find((x) => x.includes(goTo)), actualElement]);
            }

            let prev = goTos[0];
            // console.log(goTos,'e', goTos.filter(x=>x[0]==prev[0]), goTos.filter(x=>x[0]!=prev[0]));
            const A = goTos.filter((x) => x[0] == prev[0]);
            const B = goTos.filter((x) => x[0] != prev[0]);
            if (A.length != 0 && B.length != 0) {
              if (A.length < B.length) {
                prev = A[0];
              } else prev = B[0];
              // console.log(prev);
              const actualElement = prev[1];
              // console.log(conjunt,actualElement);
              const newsConjunts = split(conjunt, actualElement);
              // console.log(newsConjunts);
              pi = pi.filter((x) => x != conjunt);
              pi.push(...newsConjunts);
              isUpdated = true;
              // console.log('pi',pi);
            }
          }
        });
      }
    });
  }
  const newDtran = [];
  const newKeys = [];
  pi = pi.sort((a, b) => a.charCodeAt(0) - b.charCodeAt(0));
  // console.log(pi);

  pi.forEach((element, index) => {
    const key = keys.findIndex((x) => x.key == element.split("")[0]);
    newKeys.push({
      key: element,
      value: keys[key].value,
    });
  });

  // console.log(Dtran);
  pi.forEach((element) => {
    const key = keys.findIndex((x) => x.key == element.split("")[0]);
    const row = [];
    Dtran[key].forEach((element) => {
      const columnName = newKeys.find((x) => x.key.includes(element));
      // console.log(columnName);
      if (columnName) row.push(JSON.parse(columnName.value));
      else row.push(undefined);
    });
    newDtran.push(row);
  });

  //console.log("DETRANSSSSSS",pi,Dtran,keys,);
  // console.log(pi,newDtran,newKeys,);
  return {
    initialState: initialState,
    endState: endState,
    Dtran: newDtran,
    keys: newKeys,
  };
};

export default minimize;
