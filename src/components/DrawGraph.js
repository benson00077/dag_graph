import React, { useRef, useEffect} from 'react'


// graph.vertices interator   >>>> TBD: siblig comp to focus on UI / css and svg renderer
// // 針對每個 graph vertex mpa 下面的 div 零件，還有svg圖
// --------------------->>>> 第一次 render 都會抓不到 a,b useRef 這要怎麼解決？
// 可參考這 https://stackoverflow.com/questions/53179075/with-useeffect-how-can-i-skip-applying-an-effect-upon-the-initial-render
// 或參考這 https://www.thearmchaircritic.org/tech-journal/prevent-useeffects-callback-firing-during-initial-render
export default function DrawGraph({graph, verticesInput}) {
    let {incomming, vertex, outgoing} = verticesInput
    let topSorted = [...graph["topSorted"]]
    let rank = {...graph["rank"]}
    
    let graphHeight = rank[`${topSorted[0]}`]
    let rowProcessedTimes = {}


    // DOM manipulate and add attribue to draw direction arrow
    const didMountRef = useRef(false)
    useEffect(() => {
        if (didMountRef.current) {
            console.log("-----DrawGraph AFTER initail render-----")

            for (let i = topSorted.length-1; i >= 0; i--) {
                let currentName = topSorted[i]
                let arrowLeft = document.querySelector(`#arrowLeft_${currentName}`)
                console.log(arrowLeft)
                
                // 目前若 一對多 會overwrite
                graph["vertices"][currentName]["incomingNames"].forEach((incommingName)=> {
                    let divTo = document.querySelector(`#${currentName}`)
                    let divFrom = document.querySelector(`#${incommingName}`)
                    console.log("to")
                    console.log(divTo)
                    console.log("divTo's offsetParent")
                    console.log(divTo.offsetParent)
                    console.log("offsetLeft")
                    console.log(divTo.offsetLeft)
                    console.log("offsetHeight")
                    console.log(divTo.offsetHeight)
                    console.log("offsetTop")
                    console.log(divTo.offsetTop)
                    drawConnector(divFrom, divTo, arrowLeft)
                })
            }
            //console.log(divA.getAttributeNames)

            //drawConnector(divA, divB, arrowLeft, arrowRight)


        }
        return () => {
            didMountRef.current = true
        }
        console.log("useEffet in DrawGraph.js")
    }, [vertex, topSorted])
    
    // if (a) {
    //     console.log(a.current.offsetLeft) //100
    //     console.log(a.current.offsetTop)  //20
    //     console.log(a.current.offsetHeight) //40
    // }

    // if (b) {
    //     console.log(b.current.offsetLeft) //100
    //     console.log(b.current.offsetTop)  //150
    //     console.log(b.current.offsetHeight) //40
    // }

    return (
        <div className="graph-container">
            <div className="graph-wrapper">
                <p id="instructions">Click and drag either div to see automatic arrow adjustments.</p>
                <svg position="absolute" className="arrowArea" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
                    <defs>
                        <marker id="arrowhead" viewBox="0 0 10 10" refX="3" refY="5"
                            markerWidth="6" markerHeight="6" orient="auto">
                        <path d="M 0 0 L 10 5 L 0 10 z" />
                        </marker>
                    </defs>
                    {topSorted.map((name, index) => (
                        <g fill="none" stroke="black" strokeWidth="2" markerEnd="url(#arrowhead)" key={index}>
                            <path id={`arrowLeft_${name}`} />
                        </g>
                    ))}
                    {/* <g fill="none" stroke="black" strokeWidth="2" markerEnd="url(#arrowhead)">
                        <path id="arrowLeft" />
                    </g>
                    <g fill="none" stroke="black" strokeWidth="2" markerEnd="url(#arrowhead)">
                        <path id="arrowRight" />
                    </g> */}
                </svg>
            
                {topSorted.map((name, index) => {
                    console.log("----- Rendring vertex divs -----")
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
    let posnALeft = {
      x: divFrom.offsetLeft - 8,
      y: divFrom.offsetTop  + divFrom.offsetHeight / 2
    };
    let posnBLeft = {
      x: divTo.offsetLeft - 8,
      y: divTo.offsetTop  + divTo.offsetHeight / 2
    };
    let dStrLeft =
        "M" +
        (posnALeft.x      ) + "," + (posnALeft.y) + " " +
        "C" +
        (posnALeft.x - 100) + "," + (posnALeft.y) + " " +
        (posnBLeft.x - 100) + "," + (posnBLeft.y) + " " +
        (posnBLeft.x      ) + "," + (posnBLeft.y);
    arrowLeft.setAttribute("d", dStrLeft);
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

