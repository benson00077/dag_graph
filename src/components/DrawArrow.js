import React, {useRef, useEffect, createContext} from 'react'

/**
 * Represent arrows svg container html tag (not drawwing on UI)
 * @param {string} incommingName
 * @param {name} name 
 * @param {obejct} forwardedRef
 * @returns 
 */
export default function DrawArrow({incommingName, name, forwardedRef}) {
    
    //const divRef = useRef()
    
    // useEffect(() => {
    //     let toDiv = forwardedDivRef.current
    //     console.log(toDiv)
    // })

    console.log('DrawArrow')

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