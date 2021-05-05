
class Graph {
  constructor() {
    this.nodes = [];

    //   const node1 = new Node()
    //   .setName(0)
    //   .pushLink(1,"a")
    //   .setName(0)
    //   .pushLink(0,"b")
    //   const node2 = new Node()
    //   .setName(1)
    //   .pushLink(1,"a")
    //   .setName(1)
    //   .pushLink(1,"b")
    //   this.nodes.push(node1)
    //   this.nodes.push(node2)
  }

  static toDraw = (GraphNodes) => {
    // console.log(GraphNodes);
    const nodesDraw = {};
    GraphNodes.forEach((node,index) => {
      // console.log(index,node.id);
      nodesDraw[node.id]= { name: node.id };
    });
    // console.log(nodesDraw);

    const links = [];
    GraphNodes.forEach((node) => {
      for (let index = 0; index < node.links.length; index++) {
        const link = node.links[index];
        links.push({
          source: node.id,
          target: link.to,
          label: link.value,
        });
      }
    });
    return [nodesDraw, links];
  };

  pushNode = (name) => {
    const node = new Node()
    node.id = name
    this.nodes.push(node);
  };

  setGraph = (graph) => {
    if (typeof graph === Array(Node)) this.nodes = graph;
    else {
      this.nodes = toGraph(graph).nodes;
    }
  };

  findNode = (toFound) => {
    return this.nodes.find((x) => x.id == toFound);
  };

  copyGraph = () => {
    return toGraph(this.nodes);
  };

  unmarkStates = () => {
    this.nodes.map((x) => (x.isVisited = false));
  };

  pushStateFromKey = (offset,keys, Dtran, alfabeto, key) => {
    // console.log(Dtran,key,keys);
    const getNrState = (key) => {
      return keys.findIndex((x)=>x.key==key)
    };
    const isVacio =(char) => {
      // console.log(keys,keys.find(x=>x.value=='[]'), char);
      return char === keys.find(x=>x.value=='[]')?.key
    }
    const state = getNrState(key.key);

    if(Dtran[state].some(x=>!isVacio(x))){
      let lastLink

      // console.log(key);
      const node = new Node();
      node.setName(state+offset);
      alfabeto.forEach((letra, i) => {
        // console.log(state,letra,i,Dtran[state][i],isVacio(Dtran[state][i]));
        if(!isVacio(Dtran[state][i])){
          const stateNr = getNrState(Dtran[state][i]);
          node.pushLink(stateNr+offset, letra);
          lastLink = stateNr
        }
      });
      this.nodes.push(node);
      // console.log(state,lastLink);
      return [state,lastLink]
    }else{
      return [undefined,undefined]
      // console.log(key.key);
      Error('No deberia ser un nodo ni final ni inicial')
    }
  };

  link = (from, to , value) => {
    if (value == undefined)
      throw Error('error')
    // console.log(from,to,value, this.nodes);
    const iniNode = this.nodes.find(x=>x.id == from)
    iniNode.pushLink(to,value)
  }

  getFreeNodeName = () => {
    let newNodeKey = 0
    // console.log(this.nodes);
    let temp = this.nodes.find(x=>x.id == newNodeKey)
    while(temp !== undefined) {
      newNodeKey++
      temp = this.nodes.find(x=>x.id == newNodeKey)
    }
    return newNodeKey
  }
  RemoveWithCopy = (a, b) => {
    const aNode = this.nodes.find(x=>x.id == a)
    const bNode = this.nodes.find(x=>x.id == b)
    // console.log(aNode, bNode);
    // console.log(this.nodes);
    
    aNode.links = bNode.links
    this.nodes = this.nodes.filter(x=>x.id != b)
    // console.log(this.nodes); 
  }

}

function Node() {
  this.id = "";
  this.links = [];
  this.isVisited = false;

  this.setIsVisited = (bool) => {
    this.isVisited = bool;
  };

  this.setName = (n) => {
    this.id = n;
    return this;
  };

  this.getName = () => {
    return this.id;
  };

  this.pushLink = (to, value) => {
    const newLink = new Link();
    newLink.setTo(to).setValue(value);
    this.links.push(newLink);
    return this;
  };
}

function Link() {
  this.to = -1;
  this.value = "";

  this.setTo = (t) => {
    this.to = t;
    return this;
  };

  this.setValue = (v) => {
    this.value = v;
    return this;
  };
}

export default Graph;

const toGraph=(obj)=>{
  const newGraph = new Graph()
  for (let i = 0; i < obj.length; i++) {
      const node = obj[i];
      const newNode = new Node()
      newNode.setName(node.id)
      newNode.setIsVisited(false)
      node.links?.forEach(link => {
          newNode.pushLink(link.to,link.value)
      });
      newGraph.nodes.push(newNode)
  }
  return newGraph
} 