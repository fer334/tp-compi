
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
    const nodesDraw = {};
    GraphNodes.forEach((node,index) => {
      nodesDraw[index]= { name: node.name };
    });

    const links = [];
    GraphNodes.forEach((node) => {
      for (let index = 0; index < node.links.length; index++) {
        const link = node.links[index];
        links.push({
          source: node.name,
          target: link.to,
          label: link.value,
        });
      }
    });
    return [nodesDraw, links];
  };

  pushNode = (name) => {
    const node = new Node()
    node.name = name
    this.nodes.push(node);
  };

  setGraph = (graph) => {
    if (typeof graph === Array(Node)) this.nodes = graph;
    else {
      this.nodes = toGraph(graph).nodes;
    }
  };

  findNode = (toFound) => {
    return this.nodes.find((x) => x.name == toFound);
  };

  copyGraph = () => {
    return toGraph(this.nodes);
  };

  unmarkStates = () => {
    this.nodes.map((x) => (x.isVisited = false));
  };

  pushStateFromKey = (Dtran, alfabeto, key) => {
    const getNrState = (key) => {
      return key.charCodeAt(0) - 65;
    };
    const state = getNrState(key.key);
    const node = new Node();
    node.setName(state);
    alfabeto.forEach((letra, i) => {
      const stateNr = getNrState(Dtran[state][i]);
      node.pushLink(stateNr, letra);
    });
    this.nodes.push(node);
    // console.log(this.nodes);
  };

  link = (from, to , value) => {
    console.log(from,to,value, this.nodes);
    const iniNode = this.nodes.find(x=>x.name == from)
    iniNode.pushLink(to,value)
  }

  getFreeNodeName = () => {
    let newNodeKey = 0
    // console.log(this.nodes);
    let temp = this.nodes.find(x=>x.name == newNodeKey)
    while(temp !== undefined) {
      newNodeKey++
      temp = this.nodes.find(x=>x.name == newNodeKey)
    }
    return newNodeKey
  }
  RemoveWithCopy = (a, b) => {
    const aNode = this.nodes.find(x=>x.name == a)
    const bNode = this.nodes.find(x=>x.name == b)
    // console.log(aNode, bNode);
    
    bNode.links = aNode.links
    this.nodes = this.nodes.filter(x=>x.name != a)
  }

}

function Node() {
  this.name = "";
  this.links = [];
  this.isVisited = false;

  this.setIsVisited = (bool) => {
    this.isVisited = bool;
  };

  this.setName = (n) => {
    this.name = n;
    return this;
  };

  this.getName = () => {
    return this.name;
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
      newNode.setName(node.name)
      newNode.setIsVisited(false)
      node.links?.forEach(link => {
          newNode.pushLink(link.to,link.value)
      });
      newGraph.nodes.push(newNode)
  }
  return newGraph
} 