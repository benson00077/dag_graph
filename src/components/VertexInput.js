import React, {useState, useRef, useEffect} from 'react'
import CreateVertex from './CreateVertex'

// data layer -- access user's input vertex
export default function VertexInput() {

    const [verticesInput, setVerticesInput] = useState({
        vertex: '',
        incomming: '',
        outgoing: '',
    })

    const [vertex, setVertex] = useState('')
    const [incomming, setIncomming] = useState('')
    const [outgoing, setOutgoing] = useState('')
    const ref_vertex = useRef(null)


    const submitHandler = e => {
        e.preventDefault()
        if(!vertex) {alert(`${ref_vertex.current.name} must not be empty`)} 
        setVerticesInput({
            vertex: vertex,
            incomming: incomming,
            outgoing: outgoing
        })
        setVertex('')
        setIncomming('')
        setOutgoing('')
    }
    
    return (
        <div>
            <CreateVertex verticesInput={verticesInput}/>
            <div class="vertex-input">
              <form onSubmit={submitHandler}>
                <label>Incomming Vertex</label>
                <input name="incomming" placeholder="Ex: a, b, c ..." value={incomming} onChange={e => { setIncomming(e.target.value) }} />
                
                <label>Vertex Name</label>
                <input name="vertex" value={vertex} onChange={e => { setVertex(e.target.value) }} ref={ref_vertex}/>
                
                <label>Outgoing Vertex</label>
                <input name="outgoing" value={outgoing} placeholder="Ex: d, e ,f..." onChange={e => { setOutgoing(e.target.value) }} />

                <button>Create !</button>
              </form>
            </div>
        </div>
    )
}
