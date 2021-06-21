function draggable(div, arrowFromPoints, arrowToPoints) {
    
    console.log("Activating draggable------")

    // init for divs
    let mouseX = 0
    let mouseY = 0
    let offsetX = 0
    let offsetY = 0
    let isDown = false
    // var div = document.querySelector(".mydiv");


    div.addEventListener('mousedown', function(e) {
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
            div.style.transform = `translate(${offsetX + dx}px,${offsetY + dy}px)`;
            arrowsTranslate(arrowFromPoints, arrowToPoints, dx, dy)
        }
    }
}

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


