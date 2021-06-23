import React from 'react'
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