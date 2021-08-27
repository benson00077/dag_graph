import React, { useEffect, useContext } from 'react'
import useDrawConnector from './useDrawConnector'
import { PositionContext } from './common/PositionContext'


/**
 * Represent arrows svg container html tag (not drawwing on UI)
 * @param {string} incommingName
 * @param {name} name 
 * @param {obejct} forwardedRef
 * @returns 
 */
export default function DrawArrow({ incommingName, name, forwardedRef, forwardedDivsRef }) {
    
    let [ positionMap ] = useContext(PositionContext)
    const { drawConnectorInitial } = useDrawConnector()

    //關注點分離，畫箭頭的功能 從 DrawGraph 拿回到 DrawArrow
    useEffect(() => {
      console.group('Child -- DrawArrow')
      console.log(positionMap)
      console.groupEnd()
      
      let divRelatedRefMap = { from: null, to: null }
      for(let div of forwardedDivsRef) {
        div = div.current
        if (div.id === incommingName) { divRelatedRefMap.from = div }
        if (div.id === name) { divRelatedRefMap.to = div }
      }

      let translateMap = {
        divFrom: positionMap[incommingName] ? positionMap[incommingName].translate : {x:0,y:0},
        divTo: positionMap[name] ? positionMap[name].translate : {x:0,y:0}
      }
      drawConnectorInitial(divRelatedRefMap.from, divRelatedRefMap.to, forwardedRef.current, translateMap)
    }, [ positionMap ])

    return (
        <g  fill="none" stroke="black" strokeWidth="2" markerEnd="url(#arrowhead)" 
            style={{position:`absolute`}} >  
            <path 
                ref={forwardedRef}
                id={`arrowLeft_${name}_${incommingName}`}
                vertex_from={incommingName}
                vertex_to={name}
                />
        </g>
    )
}