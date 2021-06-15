const Graph = require('./graphClass')

const graph = new Graph()

/** TEST CASE 1 */
// graph.addEdges('b', null, 'c', 'a')
// graph.giveRank()
// console.log(graph.rank)


/** TEST CASE 2 */
graph.addEdge('Benson', 'Alice');
graph.addEdge('Alice', 'Catherine')
graph.addEdges('Benson', null, 'Catherine', 'Ben')
graph.addEdges('Benson', null, 'David', 'Eva')
graph.addEdges('Catherine', null, ["David", "George"], ["Alice", "Flora"])

graph.giveRank()
console.log(graph.rank)
console.log(graph.topSorted)


/** TEST CASE 2 */
// graph.addEdges('d', null, ["a", "b", "c"], ["e", "f", "g"]) // incomming 出現三個以上就會噴錯
// graph.giveRank()
// console.log(graph.rank)