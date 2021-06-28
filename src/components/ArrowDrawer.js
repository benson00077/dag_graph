/**
 *  tmp depricated. see DrawGragp -> DrawArrow
 */

import React, {useRef, useEffect} from 'react'
import draggable from './draggable'

import useDrag from './useDrag'
import {useState} from 'react'

// >>>>>>>>>>>>>> 有沒有更好寫法？<<<<<<<<<<<<<<<<<<
function ArrowDrawer({graph, topSorted}) {
    let topSortedRev = topSorted.reverse() // add arrow svg from leaf vertex to the root vertex
    const didMountRef = useRef(false)
    
    // Draw direciton arrow, by DOM manipulation on svg > g > path & adding attribue
    useEffect(() => {
        console.log(`>>>>>> Init render of ArrowDrawe: ${didMountRef.current}`)
        
        // if not initial render
        if (didMountRef.current) {

            // iterate vertices: from leaf vertex to the root vertex
            topSortedRev.forEach((currentName, i) => {
                let incomingNames = graph["vertices"][currentName]["incomingNames"]

                // iterate the current vertex's incomming vertex
                incomingNames.forEach((incommingName)=> {
                    let divTo = document.querySelector(`#${currentName}`)
                    let divFrom = document.querySelector(`#${incommingName}`)
                    let arrowLeft = document.querySelector(`#arrowLeft_${currentName}_${incommingName}`)
                    
                    // Initially draw svg arrows 
                    drawConnector(divFrom, divTo, arrowLeft)



                    /**
                     *  以下 draggable 兩者要分流管理
                     */
                    // set event listenr to div & svg arrows -- divTo 
                    draggable(divTo, drawConnector, divFrom, arrowLeft, 1)

                    // set event listenr to div & svg arrows -- divFron 
                    draggable(divFrom, drawConnector, divTo, arrowLeft, 2)
                })

            }) 
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
     //console.log(arrowLeft)
     // console.log(divTo.offsetLeft)
  };




export default ArrowDrawer
