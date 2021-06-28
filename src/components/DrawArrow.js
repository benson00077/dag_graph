import React, {useRef, useEffect} from 'react'

export default function DrawArrow({incommingName, name, forwardedRef}) {
    
    //const divRef = useRef()
    
    // useEffect(() => {
    //     let toDiv = forwardedDivRef.current
    //     console.log(toDiv)
    // })


    //// >>>>>> not showing??????????????????????????????
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
