import React, { Fragment } from 'react'
import DrawGraph from './DrawGraph';


/**
 * Represent graph instance creation layer
 * @param {object} verticesInput {vertex: '', incomming: '', outgoing: '} 
 * @param {object} graph instance
 * @returns {Component} DrawGraph -- Layout for vertex's div and direction arrow svg
 */

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
        }

        // Create vertex
        graph.addEdges(vertex, null, outgoing, incomming)
    }

    if (vertex) {
        createVertex()
        graph.giveRank()
        //console.table(graph)
    }

    return (
        <Fragment>
            <DrawGraph graph={graph} topSorted={graph["topSorted"]}/>
        </Fragment>
    )
}