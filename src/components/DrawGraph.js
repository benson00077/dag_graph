import React, { useState, useRef, useEffect, useContext } from 'react'
//import ArrowDrawer from './ArrowDrawer'
import DrawVertex from './DrawVertex'
import DrawArrow from './DrawArrow'
import useDrawConnector from './useDrawConnector'
import { PositionContext } from './common/PositionContext'

/**
 * Represent middleware for drawwing arrows svg Initially
 * Represent dynmaic render logic for multiple vertex's divs and arrows svg
 * Represent layout for vertex's div and direction arrows svg container
 * @param {object} graph instance of Graph
 * @returns {Component} DrawArrow
 * @returns {Component} DrawVertex
 */
export default function DrawGraph({graph}) {
    
    let topSorted = [...graph["topSorted"]]
    let length = topSorted.length
    let [arrowsRecord, arrowsNumber] = arrowsInfoGetter(graph)    

    // for btn restting vertex position back to default place 
    let [isDefaultGraph, setIsDefaultGraph] = useState(null)

    // Vertex ref & Arrows ref for DOM (drag-n-drop & arrow connetor)
    const divsRefs = useRef([])
    divsRefs.current = [...new Array(length)].map(() => React.createRef())
    const arrowsRefs = useRef([])
    arrowsRefs.current = [...new Array(arrowsNumber)].map(() => React.createRef())

    
    /**
     *  Initial Drawing of arrows svg
     */
    const [positionMap, setPositionMap] = useContext(PositionContext) 
    const didMountRef = useRef(false)
    const { drawConnectorInitial } = useDrawConnector()
    useEffect(() => {
      // Skip effect upon the initial render (when user not yet create any vertex)
      if (didMountRef.current) {
            arrowsRefs.current.forEach((arrow, i) => {
                arrow = arrow.current
                let from = arrow.getAttribute("vertex_from")
                let to = arrow.getAttribute("vertex_to")
                let divFrom = null 
                let divTo = null
                
                divsRefs.current.forEach((div, i) => {
                  div = div.current
                  if (div.id === from) {
                    divFrom = div
                    return 
                  }
                  if (div.id === to) {
                    divTo = div
                    return 
                  }
                })
                

                // //if (isDefaultGraph) { translateMap = { divFrom: {x:0,y:0}, divTo: {x:0,y:0}} }  
                // let translateMap = {
                //   divFrom: { x:0, y:0 },
                //   divTo: { x:0, y:0 }
                // } // 做為 drawConnectorInitial 的第四個參數，代表已經拖曳過的既有vertex的 偏移量，在該函數內會計算、抵銷偏移量使回到預設原位

                // if (positionMap[from]) {
                //   if (positionMap[from].isDisplaced) {
                //     translateMap.divFrom = {...positionMap[from].translate}
                //   }
                // }
                // if (positionMap[to]){
                //   if (positionMap[to].isDisplaced) {
                //     translateMap.divTo = {...positionMap[from].translate}
                //   }
                // }

                // 與上面代換後效果類似
                let translateMap = {
                  divFrom: positionMap[from] ? positionMap[from].translate : {x:0,y:0},
                  divTo: positionMap[to] ? positionMap[to].translate : {x:0,y:0}
                }
                
                console.group("Father")
                console.log(positionMap) // 跟 Child 更新的 PositionContext 的不同步！
                console.log(translateMap)
                console.groupEnd()
                drawConnectorInitial(divFrom, divTo, arrow, translateMap)
            })
        }
        return(() => {
            didMountRef.current = true
        })
    }, [length, isDefaultGraph]) 

    const arrowRenderer = (arrowsRecord, arrowsNumber) => {
      return (
        [...Array(arrowsNumber)].map((e, i) => (
          <DrawArrow 
            incommingName={arrowsRecord[i].incommingName} name={arrowsRecord[i].name} key={i}
            forwardedRef={arrowsRefs.current[i]} />
        ))
      )
    }
    
    const vertexRenderer = () => {
      let rank = {...graph["rank"]}
      let graphHeight = rank[`${topSorted[0]}`]
      let rowProcessedTimes = {} // 作為每一行div是否render過的計數器
                                  // NOT using useState because setState cause a re-render
      return (
        // 按照拓墣排序迭代每個 vertex，同時紀錄他們所在階層 currentRow
        topSorted.map((name, i) => {
          
          let row = graphHeight - rank[name] // 代表該 vertex name 在第幾行

          rowProcessedTimes[row] // Record to kwow current vertex is in n'th column
              ? rowProcessedTimes[row] += 1
              : rowProcessedTimes[row] = 1
          let column = rowProcessedTimes[row]

          return (
          <DrawVertex 
              name={name} key={i} 
              column={column}
              row={row}
              rowProcessedTimes={rowProcessedTimes}
              forwardedRef={divsRefs.current[i]} 
              forwardedArrowsRefs={arrowsRefs.current} 
              isDefaultGraph={isDefaultGraph} />
          )
        })
      )
    }

    return (
        <div className="graph-container">
            <p id="instructions">Click and drag either div to see automatic arrow adjustments.</p>
            <div className="graph-wrapper">
                <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
                    <defs>
                        <marker id="arrowhead" viewBox="0 0 10 10" refX="3" refY="5"
                            markerWidth="6" markerHeight="6" orient="auto">
                        <path d="M 0 0 L 10 5 L 0 10 z" />
                        </marker>
                    </defs>
                    {arrowRenderer(arrowsRecord, arrowsNumber)}
                    {/* <ArrowDrawer graph={graph} topSorted={topSorted}/> */}
                </svg>
                {vertexRenderer()}                
            </div>
            <div>
              <button onClick={() => { setIsDefaultGraph(!isDefaultGraph) }}>
                {isDefaultGraph ? "Back to Dragged Place" : "Back to Default Place"}
              </button>
            </div>
        </div>
    )
}


/**
 * 
 * @param {object} graph instance of Graph
 * @returns {int} arrowsNumber
 * @returns {Object} arrowsRecord {name: verttx-name, incommingName: next-vertex-name}
 */
const arrowsInfoGetter = (graph) => {

    let topSorted = [...graph["topSorted"]]
    let arrowsRecord = {};
    let counter = 0;

    [...topSorted].reverse().map((name,i) => {
        let incommingNames = graph["vertices"][name]["incomingNames"]
        incommingNames.map((incommingName, j) => {
          
          arrowsRecord[counter] = {
              name : name,
              incommingName: incommingName
          }
          counter += 1
        })
    })

    return [arrowsRecord, counter]
}
/**
 * arrowsRecord = {
 *    0 : {
 *       name: "c",
 *       incommingName: "b"
 *      },
 *    
 *    1 : {
 *       name: "b",
 *       incommingName: "a"
 *     }
 *  }
 */


// Not using
// from DOM's Str style 'transform: translateX(132px) translateY(61px)
// to obj : { x: 132, y: 61}
const translateTracker = (e) => {
    let transform = e.style.transform.split(" ")
    let translateX = transform[0].replace(/[^\d.]/g, '')
    let translateY = transform[1].replace(/[^\d.]/g, '')
    return ({
      x: parseInt(translateX),
      y: parseInt(translateY)
    })
}