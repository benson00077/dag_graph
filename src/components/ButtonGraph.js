import React, { useState, useEffect, useContext } from "react";
import { PositionContext } from "./common/PositionContext";

export default function ButtonGraph({ graphState, setGraphState }) {
  let [positionMap, setPositionMap] = useContext(PositionContext);
  const { isDefaultGraph, isInitGraph, isDraggedGraph } = graphState;

  const graphStateSwitcher = () => {
    const gphState = {
      isDraggedGraph: false,
      isDefaultGraph: false,
      isInitGraph: false,
      isDraggedGraph_byDrag: false,
    };
    if (isDefaultGraph) gphState.isDraggedGraph = true;
    if (!isDefaultGraph) gphState.isDefaultGraph = true;
    setGraphState((prev) => ({ ...prev, ...gphState }));
  };

  return (
    <div>
      <button onClick={graphStateSwitcher}>
        {isDefaultGraph ? "Back to Dragged Place" : "Back to Default Place"}
      </button>
    </div>
  );
}
