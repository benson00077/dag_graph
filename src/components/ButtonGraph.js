import React, { useState, useEffect, useContext } from "react";
import { PositionContext } from "./common/PositionContext";

export default function ButtonGraph({ isDefaultGraph, setIsDefaultGraph }) {
  let [positionMap, setPositionMap] = useContext(PositionContext);

  const translationSwitcher = (obj) => {
    for (const [key, value] of Object.entries(positionMap)) {
      if (!isDefaultGraph) {
        setPositionMap((prevState) => ({
          ...prevState,
          [key]: {
            ...value,
            translate: { x: 0, y: 0 },
          },
        }));
      }
    }
  };

  return (
    <div>
      <button
        onClick={() => {
          //translationSwitcher();
          setIsDefaultGraph(!isDefaultGraph);
        }}
      >
        {isDefaultGraph ? "Back to Dragged Place" : "Back to Default Place"}
      </button>
    </div>
  );
}
