import React, { Fragment } from 'react'
import DrawGraph from './DrawGraph';
const Graph = require('./dag/graphClass')

const graph = new Graph();

// graph instance creation layer
// -----------------------> how to prevent this child comp's first-render??
export default function CreateVertex({verticesInput}) {
    let {incomming, vertex, outgoing} = verticesInput
    
    const createVertex = () => {
        if (incomming) {
            incomming = incomming.split(',')
            if(incomming.length === 1) {incomming = incomming[0]}
        }
        if (outgoing) {
            outgoing = outgoing.split(',')
            if(outgoing.length === 1) {outgoing = outgoing[0]}
        }
        
        graph.addEdges(vertex, null, outgoing, incomming)
    }

    if (vertex) {
        createVertex()
        graph.giveRank()
        console.log("----- graph created succesfully-----")
        console.table(graph)
    }
    console.log('why is this showing so many times')

    return (
        <Fragment>
            <DrawGraph verticesInput={verticesInput} graph={graph}/>
        {/* <div>
            <p>Before Sorted</p>
            <ul>
                {graph.names.map( (vertex, index) => (
                    <li key={index}> {vertex} </li>
                ))}
            </ul>
        </div>

        <div>
            <p>After Sorted</p>
            <ul>
                {graph.topSorted.map( (vertex, index) => (
                    <li key={index}> {vertex} </li>
                ))}
            </ul>
        </div> */}

        </Fragment>
    )
}


/* ----- create graph vertices ----- */
/* 
=== addEdge 1: Benson -> Alice ===
=== addEdge 2: Alice -> Catherine ===
=== addEdges 3: Ben -> Benson -> Catherine ===
=== addEdges 4: Eva -> Benson -> David ===
=== addEdges 5: [Ben, Flora] -> Catherine -> [David, George] ===
*/ 

// graph.addEdge('Benson', 'Alice');
// graph.addEdge('Alice', 'Catherine')
// graph.addEdges('Benson', null, 'Catherine', 'Ben')
// graph.addEdges('Benson', null, 'David', 'Eva')
// graph.addEdges('Catherine', null, ["David", "George"], ["Alice", "Flora"])


// console.log("graph has been created --- graph.vertices looks like below")
// console.table(graph.vertices)

// graph.giveRank()

// console.log("graph.names has been ranked --- graph.rank looks like below")
// console.table(graph.rank)
