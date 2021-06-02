import { splitStates, toFriendlyDtran } from "./utils.js";

const split = (string, splitValue) => {
  const rString = string.replaceAll(splitValue, "");
  return [splitValue, rString];
};

/* Funcion encargada de minimizar el Grafo que ha sido generado al
convertir AFD, en el objeto Grafo se tiene ademas la tabla Dtran y los Destados
Se devuelve el estado inicial y el estado final, ademas de la tabla Dtran y las
llaves

*/
const minimize = (props, graphProps) => {
  const initialState = graphProps.initialState;
  const endState = graphProps.endState;
  const { Dtran, keys } = toFriendlyDtran(
    graphProps.Dtran,
    graphProps.Destados
  );
  const alfabeto = props.alfabeto
//Particion inicial de PI. Se utiliza el algoritmo de particio, de estados finales e iniciales
  let pi = [];
  let [endStateKey, _] = splitStates(keys, endState);

  const onlyKeysValueEndState = endStateKey
    .map((x) => x.key)
    .reduce((pre, curr) => pre + curr, "");
  const onlyKeysValue = keys
    .map((x) => x.key)
    .reduce((pre, curr) => pre + curr, "");

  //estado inicial con la llave
  const [startKey, restKey] = split(onlyKeysValue, onlyKeysValueEndState);

  //se agrega a pi
  pi.push(startKey, restKey);

  let isUpdated = true;
  //mientras haya actualizacions en pi
  while (isUpdated) {
    isUpdated = false;
    //se recorre la pi actual como en el algoritmo para ver si se puede dividir
    pi.forEach((conjunt) => {
      if (conjunt.length != 1) {
        alfabeto.forEach((link, dtranIndex) => {
          if (!isUpdated) {
            const goTos = [];
            for (let eleIndex = 0; eleIndex < conjunt.length; eleIndex++) {
              const actualElement = conjunt[eleIndex];
              const actualElementIndex = actualElement.charCodeAt() - 65;
              const goTo = Dtran[actualElementIndex][dtranIndex];
              goTos.push([pi.find((x) => x.includes(goTo)), actualElement]);
            }

            let prev = goTos[0];
            const A = goTos.filter((x) => x[0] == prev[0]);
            const B = goTos.filter((x) => x[0] != prev[0]);
            if (A.length != 0 && B.length != 0) {
              if (A.length < B.length) {
                prev = A[0];
              } else prev = B[0];
              const actualElement = prev[1];
              const newsConjunts = split(conjunt, actualElement);
              pi = pi.filter((x) => x != conjunt);
              pi.push(...newsConjunts);
              isUpdated = true;
            }
          }
        });
      }
    });
  }
  const newDtran = [];
  const newKeys = [];

  // console.log(pi);
  // console.log(keys);
  pi = pi.sort((a, b) => a.charCodeAt(0) - b.charCodeAt(0));
  //Se crea la nueva dtrans con los pi y el dran minimizado
  pi.forEach((element, index) => {
    const key = keys.findIndex((x) => x.key == element.split("")[0]);
    if(key != -1){
      newKeys.push({
        key: element,
        value: keys[key].value,
      });
    }
  });

  pi.forEach((element) => {
    const key = keys.findIndex((x) => x.key == element.split("")[0]);
    const row = [];
    if(key != -1){

      Dtran[key].forEach((element) => {
        const columnName = newKeys.find((x) => x.key.includes(element));
        if (columnName) row.push(JSON.parse(columnName.value));
        else row.push(undefined);
      });
      newDtran.push(row);
    }
  });

  //el retorno del inicio, el fin, el dtran y las llaves
  return {
    initialState: initialState,
    endState: endState,
    Dtran: newDtran,
    keys: newKeys,
  };
};

export default minimize;
