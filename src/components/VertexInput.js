import React, { useState, useRef } from "react";

/**
 * Represent UI Layer -- user's input
 * @param {function} setVerticesInput
 * @returns {JSX} form UI
 */

export default function VertexInput({ setVerticesInput }) {
  const [vertex, setVertex] = useState("");
  const [incomming, setIncomming] = useState("");
  const [outgoing, setOutgoing] = useState("");
  const ref_vertex = useRef(null);

  const submitHandler = (e) => {
    e.preventDefault();
    if (!vertex) {
      alert(`${ref_vertex.current.name} must not be empty`);
    }
    setVerticesInput({
      vertex: vertex,
      incomming: incomming,
      outgoing: outgoing,
    });
    setVertex("");
    setIncomming("");
    setOutgoing("");
  };

  return (
    <React.Fragment>
      <div className="vertex-input">
        <form onSubmit={submitHandler}>
          <label>Incomming Vertex</label>
          <input
            name="incomming"
            placeholder="Ex: a, b, c ..."
            value={incomming}
            onChange={(e) => {
              setIncomming(e.target.value);
            }}
          />

          <label>Vertex Name</label>
          <input
            name="vertex"
            value={vertex}
            onChange={(e) => {
              setVertex(e.target.value);
            }}
            ref={ref_vertex}
          />

          <label>Outgoing Vertex</label>
          <input
            name="outgoing"
            value={outgoing}
            placeholder="Ex: d, e ,f..."
            onChange={(e) => {
              setOutgoing(e.target.value);
            }}
          />

          <button>Create !</button>
        </form>
      </div>
    </React.Fragment>
  );
}
