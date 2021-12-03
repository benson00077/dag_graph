import React, { useState, useEffect, useContext } from "react";
import useDrag from "./useDrag";
import useDrawConnector from "./useDrawConnector";
//import useDrawConnector from "./useDrawConnector_origin";
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
  graphState,
  setGraphState,
}) {
  let topPosition = 150 + 150 * row;
  let leftPosition = 150 * column;
  let topStyle = topPosition + "px";
  let leftStyle = leftPosition + "px";

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
        positionOrigin: [topPosition, leftPosition],
        positionNew: [topPosition + translate.x, leftPosition + translate.y],
        translate: translate,
      },
    }));
  };

  const { isDragging, translateX, translateY } = useDrag(
    forwardedRef,
    [graphState, name],
    {
      onDrag: drawArrowonDrag,
      onPointerUp: (e) => {
        ctxUpdateonMouseUp();
        setIsMouseUp(!isMouseUp);
      },
      onPointerDown: (e) => {
        //console.log(e.currentTarget.id);
        setGraphState((prev) => ({
          ...prev,
          isDefaultGraph: false,
          isInitGraph: false,
          isDraggedGraph: false,
          isDraggedGraph_byDrag: true,
          currentDragTarget: e.currentTarget.id,
        }));
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
        positionOrigin: [topPosition, leftPosition],
        positionNew: [topPosition + translate.x, leftPosition + translate.y],
        translate: translate,
      },
    }));
  }, []);

  useEffect(() => {
    const {
      isInitGraph,
      isDefaultGraph,
      isDraggedGraph,
      isDraggedGraph_byDrag,
      currentDragTarget,
    } = graphState;

    let trans = {};
    if (isInitGraph) return;
    if (isDefaultGraph) trans = { x: 0, y: 0 };
    if (isDraggedGraph) {
      trans = positionMap[name] ? positionMap[name].translate : { x: 0, y: 0 }; ///creating new vertex when not isDefaultGraph
    }
    if (isDraggedGraph_byDrag) {
      trans = positionMap[name] ? positionMap[name].translate : { x: 0, y: 0 }; ///creating new vertex when not isDefaultGraph
    }
    if (isDraggedGraph_byDrag && currentDragTarget !== name) {
      // to be optimized
      trans = { x: 0, y: 0 };
      let relatedArrows = relatedArrowsDetector(forwardedArrowsRefs, name);
      drawConnectorDynamic(relatedArrows, name, forwardedRef.current, trans);
    }

    setTranslate(trans);
  }, [graphState.isDefaultGraph]);

  return (
    <div ref={forwardedRef} style={style} className="vertex" id={name}>
      {isDragging ? `${name} is now 🚀` : name}
      <p>{`useDrag:  (${translateX},${translateY})`}</p>
      <p>{`vertex:  (${translate.x},${translate.y})`}</p>
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
