import { useState, useEffect, useCallback } from 'react'

/**
 * Represent Dragging functionality implementation hooks -- for vertex's div
 * @param {object} ref as DOM of div
 * @param {object} deps e.g. state translate {x: 0, y: 0} -- for css transform attribute
 * @param {object} options as cb functions to be invoked in event listener. e.g. setTranslate
 * @returns {bool} isDragging
 */
const useDrag = (ref, deps = [], options) => {

    //try {console.log(`>>>useDrag Rendering on ${ref.current.nodeName} -- ${ref.current.id}`)} catch {console.log(">>>useDrag")}

    // init for cb functions
    const {
        onPointerDown = () => {},
        onPointerUp = () => {}, 
        onPointerMove = () => {},
        onDrag = () => {}
    } = options
    
    const [state, setState] = useState({
        isDragging: false,
        originX: 0,
        originY: 0,
        translateX: 0,
        translateY: 0,
        lastTranslateX: 0,
        lastTranslateY: 0
    })

    const handleMouseDown = useCallback(e => {
        //console.log(`MouseDown`)
        setState(state => ({
            ...state,
            isDragging: true,
            originX: e.pageX,
            originY: e.pageY
        }))
        onPointerDown(e)
    })

    const handleMouseUp = useCallback(e => {
        //console.log("upup")

        setState(state => ({
            ...state,
            isDragging: false,
            originX: 0,
            originY: 0,
            lastTranslateX: state.translateX,
            lastTranslateY: state.translateY
        })) 

        onPointerUp(e)
    })

    const handleMouseMove = useCallback(e => {
        //console.log("moving")
        const translateX = e.pageX - state.originX + state.lastTranslateX
        const translateY = e.pageY - state.originY + state.lastTranslateY

        setState(state => ({
            ...state,
            translateX,
            translateY
        }))

        onDrag(translateX, translateY)
        onPointerMove(e);
    })

    useEffect(() => {
        const element = ref.current
        //console.log(`>>>usdDrag useEffect on ${ref.current.nodeName} -- ${ref.current.id}`)
        
        element.addEventListener("mousedown", handleMouseDown)

        if (state.isDragging) {
            //console.log(`add event listenr on document`)
            document.addEventListener("mousemove", handleMouseMove)
            document.addEventListener("mouseup", handleMouseUp)
        }

        // >>>>>>>>>> HOW is this working ?? not know <<<<<<<<<<<<<
        return () => {
            //console.log(`remove event listenr on document`)
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
