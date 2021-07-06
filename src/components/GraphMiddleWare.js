import React, { useState } from 'react'
import VertexInput from './VertexInput';
import CreateVertex from './CreateVertex'

const Graph = require('../dag/graphClass')

const graph = new Graph();

/**
 * Represent Graph obj's storage layer
 * @param {*}  
 * @returns {Component} CreateVertex -- access graph's method to create vertex
 * @returns {Component} VertexInput -- access users's vertex input
 */

function GraphMiddleWare() {

    const [verticesInput, setVerticesInput] = useState({
        vertex: '',
        incomming: '',
        outgoing: '',
    })

    return (
        <div>
            <CreateVertex verticesInput={verticesInput} graph={graph}/>
            <VertexInput setVerticesInput={setVerticesInput}/>
        </div>
    )
}

export default GraphMiddleWare
