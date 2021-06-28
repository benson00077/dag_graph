import React, { useState } from 'react'
import useDrag from './useDrag'
// import useDrag from './useDrag2'

export default function DrawVertex({name, column, row, forwardedRef}) {

    
    let topStyle = `${150 + 150 * row}px`
    let leftStyle = `${150 * column}px`


    // TEST BLOCK
    //const divRef = useRef()
    const [translate, setTranslate] = useState({ x: 0, y: 0 })

    const handleDrag = (newX, newY) => {
        //console.log(newX)
        setTranslate({
            // x: translate.x + e.movementX,
            // y: translate.y + e.movementY
            x: newX,
            y: newY
        })
    }

    const drag = useDrag(forwardedRef, [translate], {
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
                {name}
        </div>
    )
    
}
