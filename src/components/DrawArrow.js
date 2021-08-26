import React, {useRef, useEffect, createContext} from 'react'
import useDrawConnector from './useDrawConnector'

/**
 * Represent arrows svg container html tag (not drawwing on UI)
 * @param {string} incommingName
 * @param {name} name 
 * @param {obejct} forwardedRef
 * @returns 
 */
export default function DrawArrow({ incommingName, name, forwardedRef }) {

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