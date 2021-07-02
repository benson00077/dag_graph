import React, { useState, useEffect } from 'react'
//import useDrag from './useDrag'
//import useDrag from './useDrag2'
//import useDrag from './useDrag3'
import useDrag from './useDrag4'

/**
 * Represent vertex div's UI
 * @param {string} name
 * @param {int} column
 * @param {int} row
 * @param {object} forwardedRef {current: dom}
 * @param {Array} forwardedArrowsRefs [..., {current: dom} ]
 * @returns {JSX} div UI for one vertex
 */
export default function DrawVertex({name, column, row, forwardedRef, forwardedArrowsRefs}) {
    console.log(forwardedArrowsRefs)
    let topStyle = `${150 + 150 * row}px`
    let leftStyle = `${150 * column}px`

    // TEST BLOCK
    //const divRef = useRef()
    const [translate, setTranslate] = useState({ x: 0, y: 0 })

    const handleDrag = (newX, newY) => {
        setTranslate({
            x: newX,
            y: newY
        })
        let relatedArrows = relatedArrowsDetector(forwardedArrowsRefs, name)
        ArrowRenderorDynamic(relatedArrows, name, forwardedRef.current, translate)
    }

    const { isDragging } = useDrag(forwardedRef, [translate], {
        onDrag: handleDrag
    })
    // TEST BLOCK END


    return (
        <div 
            ref = {forwardedRef}
            style={{
                position:`absolute`, top: `${topStyle}`, left: `${leftStyle}`,
                transform: `translateX(${translate.x}px) translateY(${translate.y}px)`
            }} 
            className="vertex"
            id={name}>
                {isDragging ? `🚀🚀🚀🚀🚀` : name}
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

/**
 * Represent the distrubuter: change from side or to side's svg arrow
 * @param {*} arrowsRefArr 
 * @param {*} vertexName 
 * @param {*} draggingDiv 
 * @param {*} translate 
 */
const ArrowRenderorDynamic = (arrowsRefArr, vertexName, draggingDiv, translate) => {
    arrowsRefArr.forEach((arrowsRef) => {
        arrowsRef = arrowsRef.current
        let dStr = arrowsRef.getAttribute("d")
        let dArr = dStr.split(" ") // ["M142,180", "C42,180", "192,310", "292,310"]
        
        if (arrowsRef.getAttribute("vertex_from") === vertexName) {
            drawConnector(draggingDiv, null, arrowsRef, dArr, translate)
        }
        if (arrowsRef.getAttribute("vertex_to") === vertexName) {
            drawConnector(null, draggingDiv, arrowsRef, dArr, translate)
        }
    })
}




///// 跟 drawGraph 的統合一下，不然兩邊渲染會打架 但目前是拖曳才觸發渲染，跟造好 vertex時立即渲染不一樣⋯⋯怎解？




/**
 * Set svg dom tag's attibue, represent svg drawer for arrows
 * @param {DOM} divFrom represent vertex div
 * @param {DOM} divTo represent vertex div
 * @param {DOM} arrowLeft represent arrow svg html tag: <g> -> <path>
 */
 const drawConnector = function(divFrom, divTo, arrowLeft, dArr, translate) {
    // e.g. dArr = ["M142,180", "C42,180", "192,310", "292,310"]
    if (divFrom === null) {
        let toPosnLeft = {
                x: divTo.offsetLeft - 8 + translate.x,
                y: divTo.offsetTop  + divTo.offsetHeight / 2 - 10 + translate.y
            };
        let dStrLeft =
            dArr[0] + " " +
            dArr[1] + " " +
            (toPosnLeft.x - 100) + "," + (toPosnLeft.y) + " " +
            (toPosnLeft.x      ) + "," + (toPosnLeft.y);
        arrowLeft.setAttribute("d", dStrLeft);
        return
    }

    if (divTo === null) {
        let fromPosnLeft = {
                x: divFrom.offsetLeft - 8 + translate.x,
                y: divFrom.offsetTop  + divFrom.offsetHeight / 2 + 10 + translate.y
            };
        let dStrLeft =
            "M" +
            (fromPosnLeft.x      ) + "," + (fromPosnLeft.y) + " " +
            "C" +
            (fromPosnLeft.x - 100) + "," + (fromPosnLeft.y) + " " +
            dArr[2] + " " +
            dArr[3];
        //console.log(dStrLeft)
        //console.log(fromPosnLeft)
        arrowLeft.setAttribute("d", dStrLeft);
        return
    }
  };
