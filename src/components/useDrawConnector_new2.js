export default function useDrawConnector() {
  const drawConnectorInitial = (divFrom, divTo, arrowRef, translate) => {
    const path = new CurvedArrowLeftSide({divFrom, divTo})
    if (translate) path.updatePathEndPoint(translate)
    path.mount(arrowRef)
  }

  const drawConnectorDynamic = (arrowsRefArr, vertexName, draggingDiv, translate) => {
    arrowsRefArr.forEach((arrowsRef) => {
      let arrowRef = arrowsRef.current
      let indicator = ""
      if (arrowRef.getAttribute("vertex_from") === vertexName) {
        indicator = "FROM"
      } else if (arrowRef.getAttribute("vertex_to") === vertexName) {
        indicator = "TO"
      }

      const path = new CurvedArrowLeftSide_onDrag(draggingDiv, indicator)
      path.mount(arrowRef, translate)
    })
  }

  return ({
    drawConnectorInitial,
    drawConnectorDynamic
  })
}



class CurvedArrowLeftSide {
  constructor(divs) {
    const {divFrom, divTo} = divs
    this.from = {
      x: divFrom.offsetLeft - 8,
      y: divFrom.offsetTop + divFrom.offsetHeight / 2 + 10
    }
    this.to = {
      x: divTo.offsetLeft - 8,
      y: divTo.offsetTop  + divTo.offsetHeight / 2 - 10
    }
  }

  mount(svgPathEle) {
    if (!svgPathEle instanceof SVGPathElement) throw new Error("para should be SVGPathElement")
    let pathPara = this._getPathPara()
    svgPathEle.setAttribute("d", pathPara)
  }

  updatePathEndPoint(translate) { // DrawArrow.js // 當 dragged 後，又 create new vertex 時
    if (!translate.divFrom || !translate.divTo) throw new Error("Wrong translate format input")
    let { divFrom, divTo } = translate
    this.from.x += divFrom.x;
    this.from.y += divFrom.y;
    this.to.x += divTo.x;
    this.to.y += divTo.y;
  }

  _getPathPara() {
    return (
      `M${this.from.x},${this.from.y} ` + 
      `C${this.from.x-100},${this.from.y} ${this.to.x -100},${this.to.y} ${this.to.x},${this.to.y}`
    )
  }
}


class CurvedArrowLeftSide_onDrag {
  constructor(div, indicator) {
    if (indicator !== "FROM" && indicator !== "TO") throw new Error("Wrong indicator format")
    this.indicator = indicator
    this.from = null
    this.to = null

    if (indicator === "FROM") {
      this.from = {
        x: div.offsetLeft - 8,
        y: div.offsetTop + div.offsetHeight / 2 + 10
      }
    }
    if (indicator === "TO") {
      this.to = {
        x: div.offsetLeft - 8,
        y: div.offsetTop + div.offsetHeight / 2 - 10
      }
    }
  }

  _getCurrentPathPara(svgPathEle) {
    const dStr = svgPathEle.getAttribute("d") // "M142,180 C42,180 192,310 292,310"
    const dArr = dStr.split(" ")              // ["M142,180", "C42,180", "192,310", "292,310"]
    return dArr
  }
      
  _updatePathEndPoint(translate) {
    if (this.indicator === "FROM") {
      this.from.x += translate.x
      this.from.y += translate.y
    }
    if (this.indicator === "TO") {
      this.to.x += translate.x
      this.to.y += translate.y
    }
  }

  _getPathPara(svgPathEle, translate) {
    this._updatePathEndPoint(translate)
    let dArr = this._getCurrentPathPara(svgPathEle)
    let pathPara = ""
    if (this.indicator === "FROM") {
      pathPara = 
        `M${this.from.x},${this.from.y} ` + 
        `C${this.from.x-100},${this.from.y} ${dArr[2]} ${dArr[3]}`    
    }
    if (this.indicator === "TO") {
      pathPara = 
        `${dArr[0]} ` + 
        `${dArr[1]} ${this.to.x -100},${this.to.y} ${this.to.x},${this.to.y}`    
    }
    return pathPara
  }


  mount(svgPathEle, translate) {
    if (!svgPathEle instanceof SVGPathElement) throw new Error("para should be SVGPathElement")
    let pathPara = this._getPathPara(svgPathEle, translate)
    svgPathEle.setAttribute("d", pathPara)
  }
}