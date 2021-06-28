import React, { Fragment } from 'react'
import DrawGraph from './DrawGraph';

// graph instance creation layer
// -----------------------> how to prevent this child comp's first-render??
export default function CreateVertex({verticesInput, graph}) {
    let {incomming, vertex, outgoing} = verticesInput
    
    const createVertex = () => {

        if (incomming) {
            incomming = incomming.split(',')
            // str "a" → "a" || arr [a , b,c] → arr[a,b]
            switch (incomming.length === 1) {
                case true: 
                    incomming = incomming[0]
                    break
                case false: 
                    incomming.forEach((e,i) => {
                        incomming[i] = e.trim()
                    })
                    break
            }
            // if(incomming.length === 1) {incomming = incomming[0]}
            // if(Array.isArray(incomming) && incomming.length > 1) {
            //     incomming.forEach((e,i) => {
            //         incomming[i] = e.trim()
            //     })
            // }
        }
        if (outgoing) {
            // str "a" → "a" || arr [a , b,c] → arr[a,b]
            outgoing = outgoing.split(',')
            switch (outgoing.length === 1) {
                case true: 
                    outgoing = outgoing[0]
                    break
                case false: 
                    outgoing.forEach((e,i) => {
                        outgoing[i] = e.trim()
                    })
                    break
            }
            // if(outgoing.length === 1) {outgoing = outgoing[0]}
            // if(Array.isArray(outgoing) && outgoing.length > 1) {
            //     outgoing.forEach((e,i) => {
            //         outgoing[i] = e.trim()
            //     })
            // }
        }

        // Create vertex
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