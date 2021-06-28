import React, { useState, useRef, useEffect } from 'react'
//import ArrowDrawer from './ArrowDrawer'
import DrawVertex from './DrawVertex'
import DrawArrow from './DrawArrow'

// graph.vertices interator   >>>> TBD: siblig comp to focus on UI / css and svg renderer
// // 針對每個 graph vertex mpa 下面的 div 零件，還有svg圖
// --------------------->>>> 第一次 render 都會抓不到 a,b useRef 這要怎麼解決？
// 可參考這 https://stackoverflow.com/questions/53179075/with-useeffect-how-can-i-skip-applying-an-effect-upon-the-initial-render
// 或參考這 https://www.thearmchaircritic.org/tech-journal/prevent-useeffects-callback-firing-during-initial-render
export default function DrawGraph({graph}) {
    
    let topSorted = [...graph["topSorted"]]
    let length = topSorted.length

    // Arrows init
    let [arrowsRecord, arrowsNumber] = arrowsInfoGetter(graph)
    console.table(arrowsRecord)


    // Vertex ref for DOM (drag-n-drop & arrow connetor)
    const divsRefs = useRef([])
    divsRefs.current = [...new Array(length)].map(() => React.createRef())
    
    // Arrows ref for DOM (drag-n-drop & arrow connetor)
    const arrowsRefs = useRef([])
    arrowsRefs.current = [...new Array(arrowsNumber)].map(() => React.createRef())


    /// >>>>>>>>>>>>>>>>>    這邊 操作 virtual DOM ～～    <<<<<<<<<<<<<<<<<<<<<
    useEffect(() => {
        console.log(divsRefs.current)
        console.log(arrowsRefs.current)
        // let [arrowsRecord, counter] = arrowsInfoGetter(graph)
        // console.table(arrowsRecord)
    })

    const arrowRenderer = (arrowsRecord, arrowsNumber) => {
        console.log(arrowsRecord);
        return (
            [...Array(arrowsNumber)].map((e, i) => (
                <DrawArrow 
                    incommingName={arrowsRecord[i].incommingName} name={arrowsRecord[i].name}
                    forwardedRef={arrowsRefs.current[i]} />
            ))
        )
    }
    
    const vertexRenderer = () => {
        console.log("iji")
        let rank = {...graph["rank"]}
        let graphHeight = rank[`${topSorted[0]}`]
        let rowProcessedTimes = {} // 作為每一行div是否render過的計數器
                                   // NOT using useState because setState always case a re-render

        return (
            // 按照拓墣排序迭代每個 vertex，同時紀錄他們所在階層 currentRow
            topSorted.map((name, i) => {
                
                let row = graphHeight - rank[name] // 代表該 vertex name 在第幾行

                rowProcessedTimes[row] // Rocored to kwno current vertex is in n'th column
                    ? rowProcessedTimes[row] += 1
                    : rowProcessedTimes[row] = 1
                let column = rowProcessedTimes[row]


                return (
                <DrawVertex 
                    name={name} key={i} 
                    column = {column}
                    row = {row}
                    rowProcessedTimes = {rowProcessedTimes}
                    forwardedRef={divsRefs.current[i]} />
                )
              })
        )
    }

    return (
        <div className="graph-container">
            <p id="instructions">Click and drag either div to see automatic arrow adjustments.</p>
            <div className="graph-wrapper">
                <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
                    <defs>
                        <marker id="arrowhead" viewBox="0 0 10 10" refX="3" refY="5"
                            markerWidth="6" markerHeight="6" orient="auto">
                        <path d="M 0 0 L 10 5 L 0 10 z" />
                        </marker>
                    </defs>
                    {arrowRenderer(arrowsRecord, arrowsNumber)}
                    {/* <ArrowDrawer graph={graph} topSorted={topSorted}/> */}

                </svg>
                
                {vertexRenderer()}                
            </div>
        </div>
    )
}


const arrowsInfoGetter = (graph) => {

    let topSorted = [...graph["topSorted"]]
    let arrowsRecord = {};
    let counter = 0;

    [...topSorted].reverse().map((name,i) => {
        let incommingNames = graph["vertices"][name]["incomingNames"]
        incommingNames.map((incommingName, j) => {
            
            arrowsRecord[ counter ] = {
                name : name,
                incommingName: incommingName
            }
            counter += 1
        })
    })
    
    return [arrowsRecord, counter]
    /**
     *  arrowsRecord = {
     *    0 : {
     *       name: "c",
     *       incommingName: "b"
     *      },
     *    
     *    1 : {
     *       name: "b",
     *       incommingName: "a"
     *     }
     *  }
     */
}