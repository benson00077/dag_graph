import { useState, useEffect } from 'react'

/**
 * Represent Dragging functionality implementation hooks -- for vertex's div
 * @param {object} ref as DOM of div
 * @param {object} deps e.g. state translate {x: 0, y: 0} -- for css transform attribute
 * @param {object} options as cb functions to invoke in event listener. e.g. setTranslate
 * @returns {bool} isDragging
 */
const useDrag = (ref, deps = [], options) => {
   
    // init for cb functions
    const {
        onPointerDown = () => {},
        onPointerUp = () => {}, 
        onPointerMove = () => {},
        onDrag = () => {}
    } = options

    const [isDragging, setIsDragging] = useState(false)

    /**
     *  mouseX 初始 點選時 的滑鼠絕對位置
     *  dx 滑鼠本身 跟上一次滑鼠位置的 距離
     *  offsetX 滑鼠放開後，要有容器儲存這個偏移量，以供下次使用
     */

    // init for divs
    let mouseX = 0
    let mouseY = 0
    let offsetX = 0
    let offsetY = 0
    let isDown = false

    
    const move = e => {
        if (isDown) {
            const dx = e.pageX - mouseX
            const dy = e.pageY - mouseY
            onDrag(offsetX + dx, offsetY + dy)
        }
    }
    
    const handleMouseDown = e => {
        setIsDragging(true)
        isDown = true
        mouseX = e.pageX
        mouseY = e.pageY
        document.addEventListener('mousemove', move)
        
        console.log(e.pageX) // 260 會慢一clicke ，例如第一次按就從0開始．．．
        console.log(mouseX)
    }

    const handleMouseUp = e => {
        setIsDragging(false);
        onPointerUp(e);

        if (isDown) {
            offsetX += e.pageX - mouseX
            offsetY += e.pageY - mouseY
        }
        document.removeEventListener('mousemove',move)
        isDown = false 
    }

    const handleMouseMove = e => {
        onPointerMove(e);
    }

    useEffect(() => {
        const element = ref.current
        console.log("useEffect")
        if (element) {
          element.addEventListener("mousedown", handleMouseDown)
          element.addEventListener("mousemove", handleMouseMove)
          if (isDown) {
              document.addEventListener("mouseup", handleMouseUp)
          }
    
          // >>>>>>>>>> HOW is this working ?? not know <<<<<<<<<<<<<
          return () => {
            element.removeEventListener("mousedown", handleMouseDown)
            element.removeEventListener("mousemove", handleMouseMove)
            document.removeEventListener("mouseup", handleMouseUp)
          }
        }
      }, [...deps, isDown])
    
    


    return (
        { isDragging }
    )
}

export default useDrag
