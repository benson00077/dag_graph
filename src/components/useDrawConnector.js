
export default function useDrawConnector() {

    /** 呼叫時，有很多個 div
     * Represent initial svg arrow drawer
     * @param {DOM} divFrom 
     * @param {DOM} divTo 
     * @param {DOM} arrowRef 
     * @param {Object} translate a map of both div's translate offset
     */
    const drawConnectorInitial = (divFrom, divTo, arrowRef, translate = { divfrom:{x:0, y:0}, divTo:{x:0, y:0} }) => {
      drawConnector(divFrom, divTo, arrowRef, translate) 
    }

    /** 呼叫時，只有一個 div (from端 or to端)
     * Represent updator of svg arrow drawer after darg-n-drop, BASED on the initail svg arrow para
     * Represent the distributer: decide change either from-side's or to-side's svg arrow
     * @param {Array} arrowsRefArr [..., {current: DOM}]
     * @param {String} vertexName 
     * @param {DOM} draggingDiv 
     * @param {Object} translate {x: 0, y: 0} a map of one div's translate offset
     */
    const drawConnectorDynamic = (arrowsRefArr, vertexName, draggingDiv, translate) => {
        arrowsRefArr.forEach((arrowsRef) => {
            let arrowRef = arrowsRef.current
            if (arrowRef.getAttribute("vertex_from") === vertexName) {
              drawConnector(draggingDiv, null, arrowRef, translate)
              return 
            }
            if (arrowRef.getAttribute("vertex_to") === vertexName) {
              drawConnector(null, draggingDiv, arrowRef, translate)
              return
            }
        })
    }
    
    return ({
        drawConnectorInitial,
        drawConnectorDynamic
    })
}



/**
 * Set svg dom tag's attibue, represent svg drawer for arrows which is linked to vertex divs
 * @param {DOM} divFrom represent vertex div
 * @param {DOM} divTo represent vertex div
 * @param {DOM} arrowsRef represent arrow svg html tag: <g> -> <path>
 * @param {Object} translate represent offset of tranfrom:translate -- initial {x:0,y:0}
 */
 const drawConnector = function(divFrom, divTo, arrowRef, translate) {
    
    /* for drawConnectorInitial */
    if (divFrom && divTo) { 
      let [fromPosnLeft, toPosnLeft] = posnEndpoints(divFrom, divTo, translate)
      let dStrLeft =
        "M" +
        (fromPosnLeft.x      ) + "," + (fromPosnLeft.y) + " " +
        "C" +
        (fromPosnLeft.x - 100) + "," + (fromPosnLeft.y) + " " +
        (toPosnLeft.x - 100) + "," + (toPosnLeft.y) + " " +
        (toPosnLeft.x      ) + "," + (toPosnLeft.y);
      arrowRef.setAttribute("d", dStrLeft);
     }


    /* for drawConnectorDynamic */
    let dStr = arrowRef.getAttribute("d")
    let dArr = dStr.split(" ") // ["M142,180", "C42,180", "192,310", "292,310"]
    // change divTo's side only
    if (divFrom === null) {
      let toPosnLeft = {
              x: divTo.offsetLeft - 8 + translate.x,
              y: divTo.offsetTop  + divTo.offsetHeight / 2 - 10 + translate.y
          };
      let dStrLeft =
          dArr[0] + " " +
          dArr[1] + " " +
          (toPosnLeft.x - 100) + "," + (toPosnLeft.y) + " " +
          (toPosnLeft.x      ) + "," + (toPosnLeft.y);
      arrowRef.setAttribute("d", dStrLeft);
    }
    
    // change divTo's side only
    if (divTo === null) {
        let fromPosnLeft = {
                x: divFrom.offsetLeft - 8 + translate.x,
                y: divFrom.offsetTop  + divFrom.offsetHeight / 2 + 10 + translate.y
            };
        let dStrLeft =
            "M" +
            (fromPosnLeft.x      ) + "," + (fromPosnLeft.y) + " " +
            "C" +
            (fromPosnLeft.x - 100) + "," + (fromPosnLeft.y) + " " +
            dArr[2] + " " +
            dArr[3];
        //console.log(dStrLeft)
        //console.log(fromPosnLeft)
        arrowRef.setAttribute("d", dStrLeft);
    }
  };

const posnEndpoints = (divFrom, divTo, translate) => {

  
  // base arrow point
  let fromPosnLeft = {
    x: divFrom.offsetLeft - 8,
    y: divFrom.offsetTop  + divFrom.offsetHeight / 2 + 10
  };
  let toPosnLeft = {
      x: divTo.offsetLeft - 8,
      y: divTo.offsetTop  + divTo.offsetHeight / 2 - 10
  };
  
  // base arrow point + transform translate offset of div
  fromPosnLeft.x += translate.divFrom.x;
  fromPosnLeft.y += translate.divFrom.y;
  toPosnLeft.x += translate.divTo.x;
  toPosnLeft.y += translate.divTo.y;
  return [fromPosnLeft, toPosnLeft]
}
