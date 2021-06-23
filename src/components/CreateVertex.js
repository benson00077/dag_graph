import React, { Fragment } from 'react'
import DrawGraph from './DrawGraph';

// graph instance creation layer
// -----------------------> how to prevent this child comp's first-render??
export default function CreateVertex({verticesInput, graph}) {
    let {incomming, vertex, outgoing} = verticesInput
    
    // str "a,b" to [a,b] || str "a" to maintain as "a"
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
    console.log('>>>TBD<<<: Hoisting CreateVertex & VertexInput -- to a parent component')

    return (
        <Fragment>
            <DrawGraph graph={graph}/>
        </Fragment>
    )
}