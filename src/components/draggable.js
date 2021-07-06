//** Deprecated */

function draggable(divMove, cb, divStay, arrowLeft, n) {
    
    console.log("Activating draggable------")

    // init for divs
    let mouseX = 0
    let mouseY = 0
    let offsetX = 0
    let offsetY = 0
    let isDown = false
    // var div = document.querySelector(".mydiv");

    divMove.addEventListener('mousedown', function(e) {
    isDown = true
    mouseX = e.pageX
    mouseY = e.pageY
    document.addEventListener('mousemove', move)
    });

    document.addEventListener('mouseup', function(e) {
    if (isDown) {
        offsetX += e.pageX - mouseX
        offsetY += e.pageY - mouseY
    }
    isDown = false
    document.removeEventListener('mousemove',move)
    });


    function move(e) {
        if (isDown) {
            const dx = e.pageX - mouseX
            const dy = e.pageY - mouseY
            divMove.style.transform = `translate(${offsetX + dx}px,${offsetY + dy}px)`;
            console.log(divMove.style.top)
            console.log(divMove.style.transform)

            // 搭配 drawConnector 內的變數作抵銷: 初始offset值 + (拖曳後顯示在 transform:translate 的值)，即(offsetX + dx)
            let divMovePosn = {
                offsetLeft: divMove.offsetLeft + (offsetX + dx),
                offsetTop: divMove.offsetTop + (offsetY + dy),
                offsetHeight: divMove.offsetHeight
            }

            let divStayPosn = {
                offsetLeft: divStay.offsetLeft,
                offsetTop: divStay.offsetTop,
                offsetHeight: divStay.offsetHeight
            }
            

            // >>>>>>>>> 這個不會變動，所以箭頭才沒跟著動 <<<<<<<<,
            // >>>>>>>>> div變動可能要直接改 left, top css 而不是用 transform translate <<<<<<<<,
            // >>>>>>>>> 這樣 div.offsetLeft 才會跟著每次執行函數時都有變動 <<<<<<<<,
            console.log(`Moving div: ${divMove.id}`)
            console.log(divMove.offsetLeft)
            
            if (cb) {
                if (n === 1) {cb(divStayPosn, divMovePosn, arrowLeft)}
                if (n === 2) {cb(divMovePosn, divStayPosn, arrowLeft)}
            }
        }
    }
}


/// TEST BLOCK

function arrowsGetD(arrowFromPoints, arrowToPoints) {

    let arrowsFromXY = [];
    let arrowsToXY = [];


    arrowFromPoints.forEach(e => {
        arrowsFromXY.push(e.getAttribute("d"))
    })

    arrowToPoints.forEach(e => {
        console.log(e)
        arrowsToXY.push(e.getAttribute("d"))
    })

    return [arrowsFromXY, arrowsToXY]
}

function arrowsTranslate(arrowFromPoints, arrowToPoints, dx, dy) {
    // init for aorrws
    let [arrowsFromXY, arrowsToXY] = arrowsGetD(arrowFromPoints, arrowToPoints)
    // console.log(arrowFromPoints.length)

    // console.log(dx)
    // console.log(dy)

    
    if(arrowFromPoints.length !== 0) {   // vertex might have no incomming
        arrowFromPoints.forEach((e) => {
            // d in HTML= "M142,180 C42,180 42,310 142,310"
            // d.split = "M142", "330", "C42", "330", "42", "460", "142", "460 : svg > g > path > d attribute
            let d = e.getAttribute("d").split(/, | /)
            console.log(d)
            d[0] = d[0].split()[0]
            d[1] = dy
            let dStr = d.join(" ")
            console.log(dStr)
            e.setAttribute("transform", `translate(${dx},${dy})`)
            //e.setAttribute("d", dStrLeft_from)
    })
    }

    if(arrowToPoints.length !== 0) {   // vertex might have no incomming
        arrowToPoints.forEach((e) => {
            e.setAttribute("transform", `translate(${dx},${dy})`)
            //e.setAttribute("d", dStrLeft_to)
    })
    }

}



export default draggable


