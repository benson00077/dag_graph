import { useState, useEffect } from 'react'

const useDrag = (ref, deps = [], options) => {
   
    // init for cb functions
    const {
        onPointerDown = () => {},
        onPointerUp = () => {}, 
        onPointerMove = () => {},
        onDrag = () => {}
    } = options

    /**
     *  mouseX 初始 點選時 的滑鼠絕對位置
     *  dx 滑鼠本身 跟上一次滑鼠位置的 距離
     *  offsetX 滑鼠放開後，要有容器儲存這個偏移量，以供下次使用
     */

    // init for divs
    //let mouseX = 0
    
    const [isDragging, setIsDragging] = useState(false)
    const [mouseX, setMouseX] = useState (0)
    const [mouseY, setMouseY] = useState (0)
    const [offsetX, setOffsetX] = useState (0)
    const [offsetY, setOffsetY] = useState (0)
    const [dx, setDx] = useState(0)
    const [dy, setDy] = useState(0)

    const handleMouseDown = e => {
        setIsDragging(true)
        onPointerDown(e)

        setMouseX(e.pageX)    // >>>>>>>>>>>> 感覺 錯誤是出在這裡？ <<<<<<<<<<< 
        setMouseY(e.pageY)
        console.log(e.pageX) // 260 會慢一clicke ，例如第一次按就從0開始．．．
        console.log(mouseX)
    }

    const handleMouseUp = e => {
        
        console.log("upup")
        if (isDragging) {
            console.log(e.pageX)
            console.log(mouseX)
            setOffsetX(e.pageX - mouseX)
            setOffsetY(e.pageY - mouseY) 
            console.log(offsetX)
        }
        //console.log(offsetX) // 301
        
        setIsDragging(false);
        onPointerUp(e);
    }

    const handleMouseMove = e => {
        onPointerMove(e);

        console.log("moving")
        if (isDragging) {
            console.log(e.pageX)
            console.log(mouseX)
            setDx(e.pageX - mouseX)
            setDy(e.pageY - mouseY)
        }
        // const dx = e.pageX - mouseX
        // const dy = e.pageY - mouseY
        console.log(dx)                  // >>>>>>>>>>>> 感覺 錯誤是出在這裡？ <<<<<<<<<<< 
        console.log(offsetX)
        

        if (isDragging) { onDrag(offsetX + dx, offsetY + dy) }
    }

    useEffect(() => {
        const element = ref.current
        console.log("useEffect")
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
