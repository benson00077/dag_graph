export default function useDrawConnector() {
  const drawConnectorInitial = (divFrom, divTo, arrowRef, translateMap) => {
    const divs = { divFrom, divTo }
    const path = new CurvedArrowLeftSide(divs, arrowRef)
    path.mount(translateMap)
  }

  const drawConnectorDynamic = (arrowsRefArr, vertexName, draggingDiv, translate) => {
    arrowsRefArr.forEach((arrowsRef) => {
      let arrowRef = arrowsRef.current
      let indicator = ""
      const divs = {divFrom: null, divTo: null}
      if (arrowRef.getAttribute("vertex_from") === vertexName) {
        indicator = "FROM"
        divs.divFrom = draggingDiv
      } else if (arrowRef.getAttribute("vertex_to") === vertexName) {
        indicator = "TO"
        divs.divTo = draggingDiv

      }

      const path = new CurvedArrowLeftSide_onDrag(divs, arrowRef, indicator)
      path.mount(translate)
    })
  }

  return ({
    drawConnectorInitial,
    drawConnectorDynamic
  })
}



/// 感覺資料不適合存在 contructor 裏面，因為 divFrom, divTo 的位置會被拖曳～ 可是 new 的時候都會記住 init / default place

class SvgPath {
  constructor(svgPathEle) {
    if (!svgPathEle instanceof SVGPathElement) throw new Error("para should be SVGPathElement")
    this.svgPath = svgPathEle
  }

  getPathParaArr = () => {
    const dStr = this.svgPath.getAttribute("d") // "M142,180 C42,180 192,310 292,310"
    const dArr = dStr.split(" ")                // ["M142,180", "C42,180", "192,310", "292,310"]
    return dArr
  }

  mount(pathPara) {
    this.svgPath.setAttribute("d", pathPara)
  }
}

class SvgPathPoints {
  constructor({ divFrom, divTo }) {
    this.divFrom = divFrom
    this.divTo = divTo
  }

  getPosn() {
    const from = this.divFrom 
        ? {
            x: this.divFrom.offsetLeft - 8,
            y: this.divFrom.offsetTop + this.divFrom.offsetHeight / 2 + 10
          }
        : null
    const to = this.divTo
      ? {
          x: this.divTo.offsetLeft - 8,
          y: this.divTo.offsetTop  + this.divTo.offsetHeight / 2 - 10
        }
      : null
    return [from, to]
  }

  getPosn_translated(translateMap= {divFrom: {x:0, y:0}, divTo: {x:0, y:0}}) {
    console.log(translateMap)
    if (!translateMap.divFrom || !translateMap.divTo) throw new Error("Wrong translateMap format input")
    const { divFrom, divTo } = translateMap
    let [ from, to ] = this.getPosn()
    from.x += divFrom.x;
    from.y += divFrom.y;
    to.x += divTo.x;
    to.y += divTo.y;
    return [from, to]
  }
}


class CurvedArrowLeftSide {
  constructor(divs, svgPathEle) {
    this.svgPathPoints = new SvgPathPoints(divs)
    this.svgPath = new SvgPath(svgPathEle)
  }

  mount(translate) {
    this.svgPath.mount(this._getPathPara(translate))
  }

  _getPathPara(translate) {
    const [ from, to ] = this.svgPathPoints.getPosn_translated(translate)
    return (
      `M${from.x},${from.y} ` + 
      `C${from.x-100},${from.y} ${to.x -100},${to.y} ${to.x},${to.y}`
    )
  }
}


class CurvedArrowLeftSide_onDrag {
  constructor(divs, svgPathEle, indicator) {
    if (indicator !== "FROM" && indicator !== "TO") throw new Error("Wrong indicator format")
    this.svgPathPoints = new SvgPathPoints(divs)
    this.svgPath = new SvgPath(svgPathEle)
    this.indicator = indicator  
  }

  mount(translate) {
    this.svgPath.mount(this._getPathPara(translate))
  }

  _getPathPara(translate = {x:0, y:0}) {
    let dArr = this.svgPath.getPathParaArr()
    let [ from, to ] = this.svgPathPoints.getPosn()

    let pathPara = ""
    if (this.indicator === "FROM") {
      from = {
        x: from.x + translate.x,
        y: from.y + translate.y 
      }
      pathPara = 
        `M${from.x},${from.y} ` + 
        `C${from.x-100},${from.y} ${dArr[2]} ${dArr[3]}`    
    }
    if (this.indicator === "TO") {
      to = {
        x: to.x + translate.x,
        y: to.y + translate.y 
      }
      pathPara = 
        `${dArr[0]} ` + 
        `${dArr[1]} ${to.x -100},${to.y} ${to.x},${to.y}`    
    }
    return pathPara
  }
}