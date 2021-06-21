import React, {useRef, useEffect} from 'react'
import draggable from './draggable'


// >>>>>>>>>>>>>> 有沒有更好寫法？<<<<<<<<<<<<<<<<<<
function ArrowDrawer({graph, topSorted}) {
    let topSortedRev = topSorted.reverse() // add arrow svg from leaf vertex to the root vertex
    const didMountRef = useRef(false)
    console.log("hihhihihi")
    
    // Draw direciton arrow, by DOM manipulation on svg > g > path & adding attribue
    useEffect(() => {
        if (didMountRef.current) { // if not initial render
            console.log("test for not initial render ")
            console.log(topSorted)
            for (let i = topSorted.length-1; i >= 0; i--) {
                // add arrow svg from leaf vertex to the root vertex
                let currentName = topSorted[i]
                
                // add arrow svg in the order of the leaf's incomming vertex
                graph["vertices"][currentName]["incomingNames"].forEach((incommingName)=> {
                    let divTo = document.querySelector(`#${currentName}`)
                    let divFrom = document.querySelector(`#${incommingName}`)
                    let arrowLeft = document.querySelector(`#arrowLeft_${currentName}_${incommingName}`)
                    drawConnector(divFrom, divTo, arrowLeft)
                })
                
            }
            // >>>>>>>>>>>>>>  Draggable <<<<<<<<<<<<<<
            for (let i = topSorted.length-1; i >= 0; i--) {
                let divA = document.querySelector(`#${topSorted[i]}`);
                let arrowFromPoints = document.querySelectorAll(`[vertex_from="${topSorted[i]}"]`)
                let arrowToPoints = document.querySelectorAll(`[vertex_to="${topSorted[i]}"]`)
                // if (arrowFromPoints[0]) {
                //     console.log(arrowFromPoints[0])
                //     console.log(arrowFromPoints[0].getAttribute(`${topSorted[i]}`)) //>>>>>>>>>>>>第一次抓不到，腳本新增東西重新整理後才抓得到<<<<<<
                // }
                draggable(divA, arrowFromPoints, arrowToPoints)
            }
            
        }
        return () => {
            didMountRef.current = true
        }
    }, [topSorted])
   
    
    return (
        <React.Fragment>
            {topSortedRev 
            ? topSortedRev.map((currentName,i) => {
                // add arrow svg in the order of the leaf's incomming vertex
                return (
                graph["vertices"][currentName]["incomingNames"].map((incommingName) => {
                    return (
                        <g  fill="none" stroke="black" strokeWidth="2" markerEnd="url(#arrowhead)" 
                            // style={{position:`absolute`}}
                            key={i}>  
                        <path 
                            id={`arrowLeft_${currentName}_${incommingName}`}
                            vertex_from={incommingName}
                            vertex_to={currentName}
                            />
                        </g>)
                })
                )
            })
            : <g></g>}
        </React.Fragment>
    )
}


let drawConnector = function(divFrom, divTo, arrowLeft) {
    let fromPosnLeft = {
      x: divFrom.offsetLeft - 8,
      y: divFrom.offsetTop  + divFrom.offsetHeight / 2 + 10
    };
    let toPosnLeft = {
      x: divTo.offsetLeft - 8,
      y: divTo.offsetTop  + divTo.offsetHeight / 2 - 10
    };
    let dStrLeft =
        "M" +
        (fromPosnLeft.x      ) + "," + (fromPosnLeft.y) + " " +
        "C" +
        (fromPosnLeft.x - 100) + "," + (fromPosnLeft.y) + " " +
        (toPosnLeft.x - 100) + "," + (toPosnLeft.y) + " " +
        (toPosnLeft.x      ) + "," + (toPosnLeft.y);
    arrowLeft.setAttribute("d", dStrLeft);
    // console.log(`>>>Draw arrow from ${divFrom.id} to ${divTo.id}`)
    // console.log(arrowLeft)
  };




export default ArrowDrawer
