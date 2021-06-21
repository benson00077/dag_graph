import React, { useState, useRef, useEffect, createContext} from 'react'
import draggable from './draggable'
import ArrowDrawer from './ArrowDrawer'

// graph.vertices interator   >>>> TBD: siblig comp to focus on UI / css and svg renderer
// // 針對每個 graph vertex mpa 下面的 div 零件，還有svg圖
// --------------------->>>> 第一次 render 都會抓不到 a,b useRef 這要怎麼解決？
// 可參考這 https://stackoverflow.com/questions/53179075/with-useeffect-how-can-i-skip-applying-an-effect-upon-the-initial-render
// 或參考這 https://www.thearmchaircritic.org/tech-journal/prevent-useeffects-callback-firing-during-initial-render
export default function DrawGraph({graph}) {
    let topSorted = [...graph["topSorted"]]
    let rank = {...graph["rank"]}
    
    let graphHeight = rank[`${topSorted[0]}`]
    let rowProcessedTimes = {} // 作為每一行div是否render過的計數器
                               // NOT using useState because setState always case a re-render

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
                    <ArrowDrawer graph={graph} topSorted={topSorted}/>
                </svg>
            
                {topSorted.map((name, index) => {
                    // 按照拓墣排序迭代每個 vertex，同時紀錄他們所在階層 currentRow
                    let currentRow = graphHeight - rank[name] // 代表該 vertex name 在第幾行
                    if (!rowProcessedTimes[currentRow]) {rowProcessedTimes[currentRow] = 1}
                    let topStyle = `${150 + 150 * currentRow}px`
                    let leftStyle = `${150 * rowProcessedTimes[currentRow]}px`
                    
                    
                    // if not first vertex in a row
                    if (rowProcessedTimes[currentRow]) {
                        rowProcessedTimes[currentRow] += 1
                        return (
                        <div 
                            style={{position:`absolute`, top: `${topStyle}`, left: `${leftStyle}`}} 
                            className="vertex"
                            key={index} 
                            id={name}>
                                {name}
                        </div>)
                    }
                    // if first vertex in a row
                    rowProcessedTimes[currentRow] += 1
                    return (
                    <div 
                        style={{position:`absolute`, top: `${topStyle}`, left: `${leftStyle}`}} 
                        className="vertex"
                        key={index} 
                        id={name}>
                            {name}
                    </div>)

                })}
                
            </div>
        </div>
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






let drawConnector_proto = function(divA, divB, arrowLeft, arrowRight) {
    let posnALeft = {
      x: divA.offsetLeft - 8,
      y: divA.offsetTop  + divA.offsetHeight / 2
    };
    let posnARight = {
      x: divA.offsetLeft + divA.offsetWidth + 8,
      y: divA.offsetTop  + divA.offsetHeight / 2    
    };
    let posnBLeft = {
      x: divB.offsetLeft - 8,
      y: divB.offsetTop  + divB.offsetHeight / 2
    };
    let posnBRight = {
      x: divB.offsetLeft + divB.offsetWidth + 8,
      y: divB.offsetTop  + divB.offsetHeight / 2
    };
    let dStrLeft =
        "M" +
        (posnALeft.x      ) + "," + (posnALeft.y) + " " +
        "C" +
        (posnALeft.x - 100) + "," + (posnALeft.y) + " " +
        (posnBLeft.x - 100) + "," + (posnBLeft.y) + " " +
        (posnBLeft.x      ) + "," + (posnBLeft.y);
    arrowLeft.setAttribute("d", dStrLeft);
    let dStrRight =
        "M" +
        (posnBRight.x      ) + "," + (posnBRight.y) + " " +
        "C" +
        (posnBRight.x + 100) + "," + (posnBRight.y) + " " +
        (posnARight.x + 100) + "," + (posnARight.y) + " " +
        (posnARight.x      ) + "," + (posnARight.y);
    arrowRight.setAttribute("d", dStrRight);
  };