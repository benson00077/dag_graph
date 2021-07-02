import { useState, useEffect, useCallback } from 'react'

/// 1, state 改成物件，看效能
/// 2, useEffect 回收 window event listener 的方式改變，看還會不會瞬移


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

    const [isDragging, setIsDragging] = useState(false)
    
    /**
     *  Variables help to access translation 
     *  mouseX 初始 點選時 的滑鼠絕對位置
     *  dx 滑鼠本身 跟上一次滑鼠位置的 距離
     *  offsetX 滑鼠放開後，要有容器儲存這個偏移量，以供下次使用
     */
    
    const [mouseX, setMouseX] = useState (0)
    const [mouseY, setMouseY] = useState (0)
    const [offsetX, setOffsetX] = useState (0)
    const [offsetY, setOffsetY] = useState (0)
    const [dx, setDx] = useState(0)
    const [dy, setDy] = useState(0)

    const handleMouseDown = useCallback(e => {
        setIsDragging(true)
        onPointerDown(e)

        setMouseX(e.pageX)    // >>>>>>>>>>>> 感覺 錯誤是出在這裡？ <<<<<<<<<<< 
        setMouseY(e.pageY)
        //console.log(e.pageX) // 260 會慢一clicke ，例如第一次按就從0開始．．．
        //console.log(mouseX)
    })

    const handleMouseUp = useCallback(e => {
        
        console.log("upup")
        if (isDragging) {
            //console.log(e.pageX)
            //console.log(mouseX)
            setOffsetX(e.pageX - mouseX)
            setOffsetY(e.pageY - mouseY) 
            //console.log(offsetX)
        }
        //console.log(offsetX) // 301
        
        setIsDragging(false);
        onPointerUp(e);
    })

    const handleMouseMove = useCallback(e => {
        onPointerMove(e);

        console.log("moving")
        if (isDragging) {
            //console.log(e.pageX)
            //console.log(mouseX)
            setDx(e.pageX - mouseX)
            setDy(e.pageY - mouseY)
        }
        // const dx = e.pageX - mouseX
        // const dy = e.pageY - mouseY
        //console.log(dx)                  // >>>>>>>>>>>> 感覺 錯誤是出在這裡？ <<<<<<<<<<< 
        //console.log(offsetX)
        

        if (isDragging) { onDrag(offsetX + dx, offsetY + dy) }
    })

    useEffect(() => {
        const element = ref.current
        console.log(`>>>usdDrag useEffect on ${ref.current.nodeName} -- ${ref.current.id}`)
        if (element) {
          element.addEventListener("mousedown", handleMouseDown)
          if (isDragging) {
              document.addEventListener("mousemove", handleMouseMove)
              document.addEventListener("mouseup", handleMouseUp)
          }
    
          // >>>>>>>>>> HOW is this working ?? not know <<<<<<<<<<<<<
          return () => {
            element.removeEventListener("mousedown", handleMouseDown)
            document.removeEventListener("mousemove", handleMouseMove)
            document.removeEventListener("mouseup", handleMouseUp)
          }
        }
      }, [...deps, isDragging])
    
    


    return (
        { isDragging }
    )
}

export default useDrag
