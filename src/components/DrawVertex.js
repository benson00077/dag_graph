import React, { useState, useEffect, useContext } from "react";
import useDrag from "./useDrag";
import useDrawConnector from "./useDrawConnector";
import { PositionContext } from "./common/PositionContext";

/**
 * Represent vertex div's UI
 * Represent drag logic on div and arrows by useDrag
 * @param {string} name
 * @param {int} column
 * @param {int} row
 * @param {object} forwardedRef {current: dom} -- dom for vertex div
 * @param {Array} forwardedArrowsRefs [..., {current: dom} ] -- dom for all arrows svg
 * @returns {JSX} div UI for one vertex
 */
export default function DrawVertex({
  name,
  column,
  row,
  forwardedRef,
  forwardedArrowsRefs,
  isDefaultGraph,
  setIsDefaultGraph,
}) {
  let topPosition = 150 + 150 * row;
  let leftPosition = 150 * column;
  let topStyle = topPosition + "px";
  let leftStyle = leftPosition + "px";

  const [isDisplaced, setIsDisplaced] = useState(false);
  const [isMouseUp, setIsMouseUp] = useState(false);
  let [positionMap, setPositionMap] = useContext(PositionContext);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const { drawConnectorDynamic } = useDrawConnector();

  const drawArrowonDrag = (newX, newY) => {
    let newTrans = { x: newX, y: newY };
    let relatedArrows = relatedArrowsDetector(forwardedArrowsRefs, name);
    setTranslate(newTrans);
    drawConnectorDynamic(relatedArrows, name, forwardedRef.current, newTrans);
  };

  const ctxUpdateonMouseUp = () => {
    setPositionMap((prevState) => ({
      ...prevState,
      [name]: {
        isDisplaced: isDisplaced,
        positionOrigin: [topPosition, leftPosition],
        positionNew: [topPosition + translate.x, leftPosition + translate.y],
        translate: translate,
      },
    }));
  };

  const { isDragging, translateX, translateY } = useDrag(
    forwardedRef,
    [translate, isDefaultGraph, name],
    {
      onDrag: drawArrowonDrag,
      onPointerUp: () => {
        ctxUpdateonMouseUp();
        setIsMouseUp(!isMouseUp);
        setIsDefaultGraph(false);
      },
      onPointerDown: () => {
        setIsDisplaced(true);
      },
    }
  );

  let style = {
    position: `absolute`,
    top: `${topStyle}`,
    left: `${leftStyle}`,
    transform: `translateX(${translate.x}px) translateY(${translate.y}px)`,
  };

  useEffect(() => {
    setPositionMap((prevState) => ({
      ...prevState,
      [name]: {
        isDisplaced: isDisplaced,
        positionOrigin: [topPosition, leftPosition],
        positionNew: [topPosition + translate.x, leftPosition + translate.y],
        translate: translate,
      },
    }));
  }, []);

  useEffect(() => {
    if (isDefaultGraph) {
      setTranslate({ x: 0, y: 0 });
    } else {
      setTranslate(positionMap[name].translate); ///
    }
  }, [isDefaultGraph]);

  return (
    <div ref={forwardedRef} style={style} className="vertex" id={name}>
      {isDragging ? `${name} is now 🚀` : name}
      <p>{"X :" + translateX}</p>
      <p>{"Y :" + translateY}</p>
    </div>
  );
}

// 不能 Hoist，因為要等 arrow 畫出來才有辦法存取到  arrows refs
const relatedArrowsDetector = (forwardedArrowsRefs, vertexName) => {
  let relatedArrows = forwardedArrowsRefs.filter((arrow) => {
    arrow = arrow.current;
    return (
      arrow &&
      (arrow.getAttribute("vertex_from") === vertexName ||
        arrow.getAttribute("vertex_to") === vertexName)
    );
  });
  return relatedArrows;
};
