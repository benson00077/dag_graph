import { useState, useEffect, useContext } from "react";
import { PositionContext } from "./common/PositionContext";

/**
 * Represent Dragging functionality implementation hooks -- for vertex's div
 * @param {object} ref as DOM of div
 * @param {object} deps e.g. state translate {x: 0, y: 0} -- for css transform attribute
 * @param {object} options as cb functions to be invoked in event listener. e.g. setTranslate
 * @returns {bool} isDragging
 */
const useDrag = (ref, deps = [], options) => {
  //try {console.log(`>>>useDrag Rendering on ${ref.current.nodeName} -- ${ref.current.id}`)} catch {console.log(">>>useDrag")}
  const [graphState, name] = [...deps];

  // init for cb functions
  const {
    onPointerDown = () => {},
    onPointerUp = () => {},
    onPointerMove = () => {},
    onDrag = () => {},
  } = options;

  const [state, setState] = useState({
    isDragging: false,
    originX: 0,
    originY: 0,
    translateX: 0,
    translateY: 0,
    lastTranslateX: 0,
    lastTranslateY: 0,
  });
  let [positionMap, setPositionMap] = useContext(PositionContext);

  const handleMouseDown = (e) => {
    setState((state) => ({
      ...state,
      isDragging: true,
      originX: e.pageX,
      originY: e.pageY,
    }));
    onPointerDown(e);
  };

  const handleMouseUp = (e) => {
    setState((state) => ({
      ...state,
      isDragging: false,
      originX: 0,
      originY: 0,
      lastTranslateX: state.translateX,
      lastTranslateY: state.translateY,
    }));
    //const translateX = e.pageX - state.originX + state.lastTranslateX;
    //const translateY = e.pageY - state.originY + state.lastTranslateY;
    onPointerUp();
  };

  const handleMouseMove = (e) => {
    const translateX = e.pageX - state.originX + state.lastTranslateX;
    const translateY = e.pageY - state.originY + state.lastTranslateY;

    setState((state) => ({
      ...state,
      translateX,
      translateY,
    }));

    onDrag(translateX, translateY);
    onPointerMove(e);
  };

  useEffect(() => {
    const element = ref.current;
    element.addEventListener("mousedown", handleMouseDown);

    if (state.isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    // >>>>>>>>>> HOW is this working ?? not know <<<<<<<<<<<<<
    return () => {
      element.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [[...deps], state.isDragging]);

  useEffect(() => {
    const { isInitGraph, isDefaultGraph, isDraggedGraph, currentDragTarget } =
      graphState;

    if (isInitGraph) return;
    if (isDraggedGraph && positionMap[name]) {
      const { x, y } = positionMap[name].translate;
      setState((state) => ({
        ...state,
        translateX: x,
        translateY: y,
        lastTranslateX: x,
        lastTranslateY: y,
      }));
    }
    if (isDefaultGraph) {
      setState((state) => ({
        ...state,
        translateX: 0,
        translateY: 0,
        lastTranslateX: 0,
        lastTranslateY: 0,
      }));
    }
  }, [graphState]);

  return {
    isDragging: state.isDragging,
    translateX: state.translateX,
    translateY: state.translateY,
  };
};

export default useDrag;
