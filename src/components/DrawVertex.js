import React, { useState, useEffect, useContext } from 'react'
import useDrag from './useDrag'
import useDrawConnector from './useDrawConnector'
import { PositionContext } from './common/PositionContext'

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
export default function DrawVertex({ name, column, row, forwardedRef, forwardedArrowsRefs, isDefaultGraph, isDragged, setIsDragged }) {

  let topPosition = 150 + 150 * row
  let leftPosition = 200 * column
  let topStyle = topPosition + 'px'
  let leftStyle = leftPosition + 'px'

  const [isDisplaced, setIsDisplaced] = useState(false)
  const [isMouseUp, setIsMouseUp] = useState(false)
  let [positionMap, setPositionMap] = useContext(PositionContext)
  const [translate, setTranslate] = useState({ x: 0, y: 0 })
  const { drawConnectorDynamic } = useDrawConnector()

  const handleDrag = (newX, newY) => {
    console.log({
      x: newX,
      y: newY
    })
    setTranslate({
      x: newX,
      y: newY
    })
    setIsDragged(true)
    let relatedArrows = relatedArrowsDetector(forwardedArrowsRefs, name)
    drawConnectorDynamic(relatedArrows, name, forwardedRef.current, translate) // but translate not new one? 
  }

  const { isDragging } = useDrag(forwardedRef, [translate], {
    onDrag: handleDrag,
    onPointerUp: () => setIsMouseUp(!isMouseUp),
    onPointerDown: () => {
      setIsDisplaced(true)
    }
  })

  let style =
    isDefaultGraph
      ? {
        position: `absolute`, top: `${topStyle}`, left: `${leftStyle}`,
        transform: `translateX(${translate.x}px) translateY(${translate.y}px)`
      }
      : {
        position: `absolute`, top: `${topStyle}`, left: `${leftStyle}`,
        transform: `translateX(${translate.x}px) translateY(${translate.y}px)`
      }

  useEffect(() => {
    // 更新 div 剛創建、以及拖曳後 的位置狀態到 PositoinContext
    // Dependency: 拖曳時，以及按了按鈕使切換預設/拖曳位置時⋯⋯兩個情況都會更新 context 

    // 點擊後會恢復成原點
    if (isDefaultGraph && !isDragged) {
      // if (isDefaultGraph && (!topStyle || !leftStyle)) {
      setTranslate({
        x: 0,
        y: 0
      })
    }
    setPositionMap(prevState => ({
      ...prevState,
      [name]: {
        isDisplaced: isDisplaced,
        positionOrigin: [topPosition, leftPosition],
        positionNew: isDefaultGraph ? [topPosition, leftPosition] : [topPosition + translate.x, leftPosition + translate.y],
        translate: isDefaultGraph && !isDragged ? { x: 0, y: 0 } : translate
      }
    }))

    console.group("Child -- DrawVertex")
    console.log(positionMap)
    console.groupEnd()
  }, [isDefaultGraph, isMouseUp])

  return (
    <div
      ref={forwardedRef}
      style={style}
      className="vertex"
      id={name} >
      {isDragging ? `${name} is now 🚀` : name}
    </div>
  )

}

// 不能 Hoist，因為要等 arrow 畫出來才有辦法存取到  arrows refs
const relatedArrowsDetector = (forwardedArrowsRefs, vertexName) => {
  let relatedArrows = forwardedArrowsRefs.filter((arrow) => {
    arrow = arrow.current
    return arrow && (arrow.getAttribute("vertex_from") === vertexName || arrow.getAttribute("vertex_to") === vertexName)
  })
  return relatedArrows
}
