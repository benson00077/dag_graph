const Graph = require('./graphClass')

const graph = new Graph()
const testCaseMap = {
    1: () => {
            graph.addEdges('b', null, 'c', 'a')
            graph.giveRank()
            console.log("hihi")
        },
    2: () => {
        graph.addEdge('Benson', 'Alice')
        graph.addEdge('Alice', 'Catherine')
        graph.addEdges('Benson', null, 'Catherine', 'Ben')
        graph.addEdges('Benson', null, 'David', 'Eva')
        graph.addEdges('Catherine', null, ["David", "George"], ["Alice", "Flora"])
        graph.giveRank()
        },
    3: () => {
        graph.addEdges('d', null, ["a", "b", "c"], ["e", "f", "g"]) // incomming 出現三個以上就會噴錯
        graph.giveRank()
        },
    4: () => {
            graph.addEdges('b', null, 'c', 'a')
            graph.giveRank()
            graph.addEdges('b', null, 'e', 'd')
            graph.giveRank()
        },
    5: () => {
            graph.addEdges('b', null, 'c', 'a')
            graph.addEdges('c', null, '', 'f')
            graph.giveRank()
        },
    6: () => {
        graph.addEdges('Catherine', null, ["David", "George"], ["Alice", "Flora"])
        graph.addEdges('Benson', null, 'David', 'Eva')
        graph.addEdges('Benson', null, 'Catherine', 'Ben')
        graph.addEdge('Alice', 'Catherine')
        graph.addEdge('Benson', 'Alice')
        graph.giveRank()
        },
}



let testCase = (caseNum, note) => {
    /**
     * 創建實例在裡面，反而找不到 graph instance, but why?
     */
    //const graph = new Graph() 
    
    let fn = testCaseMap[caseNum]
    fn()
    console.log(graph.rank)
    console.log(graph.topSorted)
    console.log(`Testing Case Number is: ${caseNum}`)

    if (note) {
        console.log(`NOTE: ${note}`)
    }
}

testCase(2)
testCase(6)