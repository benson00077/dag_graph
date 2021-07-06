import React, { useState, useEffect } from 'react'
import useDrag from './useDrag'
import useDrawConnector from './useDrawConnector'

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
export default function DrawVertex({name, column, row, forwardedRef, forwardedArrowsRefs}) {
    
    let topStyle = `${150 + 150 * row}px`
    let leftStyle = `${150 * column}px`

    
    const [translate, setTranslate] = useState({ x: 0, y: 0 })
    const { drawConnectorDynamic } = useDrawConnector()

    const handleDrag = (newX, newY) => {
        setTranslate({
            x: newX,
            y: newY
        })
        let relatedArrows = relatedArrowsDetector(forwardedArrowsRefs, name)
        drawConnectorDynamic(relatedArrows, name, forwardedRef.current, translate)
    }

    const { isDragging } = useDrag(forwardedRef, [translate], {
        onDrag: handleDrag
    })


    return (
        <div 
            ref = {forwardedRef}
            style={{
                position:`absolute`, top: `${topStyle}`, left: `${leftStyle}`,
                transform: `translateX(${translate.x}px) translateY(${translate.y}px)`
            }} 
            className="vertex"
            id={name}>
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
