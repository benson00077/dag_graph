/*
    export instance graph & his method 
*/

/*
graph 實例：

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

    
    giveRank = () => { // if not anonymous, this would not bind
        if (this.topSorted.length === 0) {
            this.topologySortCaller()
        }
        let rankNumber = 0;
        this.visit_giveRank( rankNumber, this.topSorted )
    }

    // recursive and visit vertices
    visit_giveRank( rankNumber, [...topSorted] ) {
        
        let len = topSorted.length
        let name = topSorted[len-1]     // last vertex name in topSorted
        let vertex = this.vertices[name]
        let incomingNames = [...vertex.incomingNames]
    
        /*
            ------- Base case  -------
        */
        if (this["rank"].hasOwnProperty(name)) {return}
    
        /*
            ------- corner case --------
        */
        // actual leaf, assigned as rank 0
        if (!vertex.hasOutgoing) {
            this["rank"][name] = rankNumber
            topSorted.pop(name)     // exclude one leaf
            this.visit_giveRank(rankNumber, topSorted)
            return
        }
        
        // name is root but could be INSIDE or LEFT SIDE of topsorted order  
        if (incomingNames.length === 0) {           
            this["rank"][name] = rankNumber 
            this.visit_giveRank(rankNumber, topSorted)
            // return -> whould break loop when find INSIDE root
        }
        
        /*
            -------- recursive case --------
        */
        rankNumber += 1                 // since all leaves excluded, it's next rank 
        let nextName = topSorted[len-2] // In topology order, nextName is one left place beside name, and name is topSorted[len-1]
        topSorted.pop()                 // exclude one leaf, which is variable: name

        if (!nextName) {return}
        
        // nextName & name are root and must be LEFT SIDE of topsorted order
        if (topSorted.length === 1) {  // when topSorted's len is 1, that 1 vertex = nextname = root vertex
            this["rank"][name] = rankNumber   //  overwrite the one assinged in if (incomingNames.length === 0){...}
            if (!incomingNames.includes(nextName)) {  // if name <- nextName
                this["rank"][nextName] = rankNumber
                return
            }
            this["rank"][nextName] = rankNumber+1   // if nextName no outgoing to name
            return
        } 
        
        // In topology order, Neither is nextName outgo2 name OR nextName parallel with name 
        if (incomingNames.includes(nextName)) {     // nextName outgo2 name, then nextName must be next rank
            this["rank"][name] = rankNumber
            this.visit_giveRank(rankNumber, topSorted)
        } else if (!incomingNames.includes(nextName)) {    // nextName parallel with name 
            this["rank"][name] = rankNumber
            this["rank"][nextName] = rankNumber 
            topSorted.pop()                         // exclude one leaf more, which is variable:  name's nextName
            this.visit_giveRank(rankNumber, topSorted) 
        }
        
        return
    }
}




// let graph = new Graph();

// module.exports = {
//     graph
// }

module.exports = Graph