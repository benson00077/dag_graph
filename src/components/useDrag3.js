import { useState, useEffect, useCallback } from 'react'

/// 1, state 改成物件，看效能
/// 2, useEffect 回收 window event listener 的方式改變，看還會不會瞬移

const POSITION = {x: 0, y: 0};

/**
 * Represent Dragging functionality implementation hooks -- for vertex's div
 * @param {object} ref as DOM of div
 * @param {object} deps e.g. state translate {x: 0, y: 0} -- for css transform attribute
 * @param {object} options as cb functions to be invoked in event listener. e.g. setTranslate
 * @returns {bool} isDragging
 */
const useDrag = (ref, deps = [], options) => {
   
    try {console.log(`>>>useDrag Rendering on ${ref.current.nodeName} -- ${ref.current.id}`)} catch {console.log(">>>useDrag")}

    // init for cb functions
    const {
        onPointerDown = () => {},
        onPointerUp = () => {}, 
        onPointerMove = () => {},
        onDrag = () => {}
    } = options
    
    const [state, setState] = useState({
        isDragging: false,
        origin: POSITION,
        translation: POSITION
    })

    const handleMouseDown = useCallback(e => {
        console.log(`MouseDown`)
        setState(state => ({
            ...state,
            isDragging: true,
            origin: {x: e.pageX, y: e.pageY}
        }))
        onPointerDown(e)
    })

    const handleMouseUp = useCallback(e => {
        console.log("upup")

        setState(state => ({
            ...state,
            isDragging: false
        })) 

        onPointerUp(e)
    })

    const handleMouseMove = useCallback(e => {
        console.log("moving")
        
        const translation = {x: e.pageX - state.origin.x, y: e.pageY - state.origin.y}

        setState(state => ({
            ...state,
            translation
        }))

        onPointerMove(e);
        onDrag(state.translation.x, state.translation.y)
    })

    useEffect(() => {
        const element = ref.current
        console.log(`>>>usdDrag useEffect on ${ref.current.nodeName} -- ${ref.current.id}`)
        
        element.addEventListener("mousedown", handleMouseDown)

        if (state.isDragging) {
            console.log(`add event listenr on document`)
            document.addEventListener("mousemove", handleMouseMove)
            document.addEventListener("mouseup", handleMouseUp)
        }

        // >>>>>>>>>> HOW is this working ?? not know <<<<<<<<<<<<<
        return () => {
            console.log(`remove event listenr on document`)
        element.removeEventListener("mousedown", handleMouseDown)
        document.removeEventListener("mousemove", handleMouseMove)
        document.removeEventListener("mouseup", handleMouseUp)
        }
      }, [...deps, state.isDragging])
    
    


    return ({
        isDragging: state.isDragging
    })
}

export default useDrag