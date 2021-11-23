// visit from leaf to root
/*
DAG 實例：

DAG {
  names: [ 'benson' ],
  vertices: {
    benson: {
      name: 'benson',
      incoming: {},
      incomingNames: [],
      hasOutgoing: false,
      value: null
    }
  }
}
*/
export default class Dag {
  constructor() {
    this.names = [];
    this.vertices = {};
  }

  add(name) {
    // 取得參照：節點本身。或排錯
    if (!name) {
      return;
    }
    if (this.vertices.hasOwnProperty(name)) {
      return this.vertices[name];
    }

    // 建構：節點
    let vertex = {
      name: name,
      incoming: {},
      incomingNames: [],
      hasOutgoing: false,
      value: null,
    };
    this.vertices[name] = vertex;
    this.names.push(name);
    return vertex;
  }

  map(name, value) {
    this.add(name).value = value;
  }

  // visit all one vertex's incomming vertcies
  visit(vertex, fn, visited, path) {
    let name = vertex.name;
    let vertices = vertex.incoming;
    let names = vertex.incomingNames;
    let len = names.length;

    if (!visited) {
      visited = {};
    } // visited 紀錄已訪節點，若自己為已訪問狀態，就結束 Recursive fn
    if (!path) {
      path = [];
    } // path 用於登記訪問每個 incoming 的順序

    if (visited.hasOwnProperty(name)) {
      return;
    } // visited 紀錄已訪節點，若自己為已訪問狀態，就結束 Recursive fn

    path.push(name); // 用來當作 要遞迴的fn函數 的參數 ->> visit()之後可再針對 路徑做動作，動作定義外包出去

    visited[name] = true; // 物件形式，登記為已訪問

    // Recursive fn
    for (let i = 0; i < len; i++) {
      this.visit(vertices[names[i]], fn, visited, path);
    }
    fn(vertex, path); // 遞迴執行fn 例如 checkCycle() or topsort的callback
    path.pop();
  }

  addEdge(fromName, toName) {
    if (!fromName || !toName || fromName === toName) {
      return;
    }
    let from = this.add(fromName);
    let to = this.add(toName);
    if (to.incoming.hasOwnProperty(fromName)) {
      return;
    }

    function checkCycle(vertex, path) {
      if (vertex.name === toName) {
        throw new Error(
          "cycle detected: " + toName + " <- " + path.join(" <- ")
        );
      }
    }

    this.visit(from, checkCycle);
    from.hasOutgoing = true;
    to.incoming[fromName] = from;
    to.incomingNames.push(fromName);
  }

  addEdges(name, value, before, after) {
    this.map(name, value);
    if (before) {
      // if before is string
      if (Object.prototype.toString.call(before) === "[object String]") {
        this.addEdge(name, before);
      }

      // if before is Array
      if (Array.isArray(before)) {
        before.forEach((vertex) => {
          this.addEdge(name, vertex);
        });
      }
    }
    if (after) {
      // if after is string
      if (Object.prototype.toString.call(after) === "[object String]") {
        this.addEdge(after, name);
      }

      // if after is Array
      if (Array.isArray(after)) {
        after.forEach((vertex) => {
          this.addEdge(vertex, name);
        });
      }
    }
  }

  // topological sort
  // visit path start from leaf
  topsort(fn) {
    let visited = {};
    let vertices = this.vertices;
    let names = this.names;
    let len = names.length;

    // 迭代每個 vertex 節點，若為最尾端的，則使遞迴(扣掉他後對剩餘的再遞迴找)
    for (let i = 0; i < len; i++) {
      let vertex = vertices[names[i]];
      if (!vertex.hasOutgoing) {
        this.visit(vertex, fn, visited);
      }
    }
  }
}
