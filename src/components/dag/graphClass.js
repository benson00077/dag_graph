/*
    export instance graph & his method 
*/

/*
graph 實例內的prop：

graph =  {
  names: [ 'benson', 'ben ],
  vertices: {
    benson: {
      name: 'benson',
      incoming: {},
      incomingNames: [],
      hasOutgoing: false,
      value: null
    },
    ben: {...}
  }
  rank: {benson:0, ben:1}
  topSorted: []
  
}
*/

const Dag = require('./dagClass.js')

class Graph extends Dag {
    constructor() {
        super()
        this.rank = {}
        this.topSorted = []
    }
    
    topologySortCaller() {
        let result = []
        this.topsort((vertex, path) => {
            result.push(vertex.name) 
            // 參數 path 為當前迭代之路徑Array
        })
        this.topSorted = result
        return result
    }

    giveRank() { // if not anonymous, this would not bind
        if (this.topSorted.length !== this.names.length) {
            this.topologySortCaller()
        }
        this["rank"] = {}; // if not reset to empty, second time calling visit_giveRank wouod cause unexpected result
        this.visit_giveRank()
    }

    visit_giveRank() {
        let leafToRootArr = [...this.topSorted].reverse()
        let rankNumber = 0
        leafToRootArr.forEach((name, i) => {
            let incomingNames = [...this.vertices[name].incomingNames]
            let nextName = leafToRootArr[i+1] // nextName = the vertex on left side in topsort
            // if nextName is same rank
            if (!incomingNames.includes(nextName)) {
                this.rank[name] = rankNumber
                return 
            }
            // else if nextName is higher rank
            if (incomingNames.includes(nextName)) {
                this.rank[name] = rankNumber
                rankNumber += 1
                return
            }             
        })
    }
}




// let graph = new Graph();

// module.exports = {
//     graph
// }

module.exports = Graph