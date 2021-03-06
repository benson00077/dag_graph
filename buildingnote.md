- [Building Log & Note](#building-log--note)
  - [Tree & Component](#tree--component)
  - [Front end -- React Thinking](#front-end----react-thinking)
    - [ð With useEffect, how can I skip applying an effect upon the initial render?](#-with-useeffect-how-can-i-skip-applying-an-effect-upon-the-initial-render)
    - [ð çµ¦å® int n ï¼å¦ä½ map åº n å JSX nodes?](#-çµ¦å®-int-n-å¦ä½-map-åº-n-å-jsx-nodes)
    - [ð è½ä¸è½å¨ return å§ç¨ setState()? ä¾å¦æç¨å¨è¨æ¸å¨ï¼è¨ç® return å§ map() å·è¡äºå¹¾æ¬¡ï¼](#-è½ä¸è½å¨-return-å§ç¨-setstate-ä¾å¦æç¨å¨è¨æ¸å¨è¨ç®-return-å§-map-å·è¡äºå¹¾æ¬¡)
    - [ð How to use multiple refs for an array of elements with hooks?](#-how-to-use-multiple-refs-for-an-array-of-elements-with-hooks)
  - [Front end -- CSS Thinking](#front-end----css-thinking)
    - [ð height: 100% è¨­å®å¨ svg ææ¯ divï¼ä½å¯¦éæ¸²æ hegight ææ¯ 0pxã](#-height-100-è¨­å®å¨-svg-ææ¯-divä½å¯¦éæ¸²æ-hegight-ææ¯-0px)
    - [ð div çä½ç½®ç§»åï¼æ¹è® postition å¥½ï¼ ç¨ trnasform: translate å¥½ï¼](#-div-çä½ç½®ç§»åæ¹è®-postition-å¥½-ç¨-trnasform-translate-å¥½)
  - [Front end -- DAG Drawing Thinking -- draw by rank](#front-end----dag-drawing-thinking----draw-by-rank)
  - [Back end](#back-end)

# Building Log & Note

ä»£èæ¨è¨»ï¼â æèä¸­ â° TBD ð åé¡ç§»é§ Issue

## Tree & Component

- Tree in src directory

```zsh
.
âââ App.js
âââ assets
âÂ Â  âââ SCSS
âÂ Â      âââ _draw-graph.scss
âÂ Â      âââ _variables.scss
âÂ Â      âââ base.scss
âââ components
âÂ Â  âââ GraphMiddleWare.js # Represent Graph obj's storage layer && call positionContext.js provider
âÂ Â  âââ VertexInput.js     ## Represent UI Layer -- user's input
âÂ Â  âââ CreateVertex.js    ## Represent graph instance creation layer
âÂ Â  âââ DrawGraph.js       ### Represent layout for vertex's div and direction arrows svg && Init Drawing on svg arrows
âÂ Â  âââ DrawArrow.js       ### Represent arrows svg container html tag (not drawwing on UI)
âÂ Â  âââ DrawVertex.js      ### Represent vertex div's UI && drag logic on div and arrows by useDrag
âÂ Â  âââ useDrag.js         ### Represent Dragging functionality implementation hooks -- for vertex's div
âÂ Â  âââ ArrowDrawer.js     #### Deprecated - Render direction arrow || Implement drag-n-drop logic
âÂ Â  âââ draggable.js       #### Deprecated - Helper function for ArrowDrawer
âââ dag
âÂ Â   âââ dagClass.js   # parent class
âÂ Â   âââ graphClass.js # sibling class
âÂ Â   âââ dag_tester.js
âââ index.js
```

## Front end -- React Thinking

### ð With useEffect, how can I skip applying an effect upon the initial render?

- è§£ï¼[see here](https://stackoverflow.com/questions/53179075/with-useeffect-how-can-i-skip-applying-an-effect-upon-the-initial-render)

### ð çµ¦å® int n ï¼å¦ä½ map åº n å JSX nodes?

- è§£ï¼æ³¨æä¸è½ç¨ `Array(n).map()`ã [See here](https://stackoverflow.com/questions/34189370/how-to-repeat-an-element-n-times-using-jsx)
  ```JSX
  [...Array(n)].map((e, i) => <span className="busterCards" key={i}>â¦</span>)
  ```
  ```JavaScript
  // in browser
  Array(4)        // [empty x 4]
  [...Array(4)]   // [undefined, undefined ....]
  ```

### ð è½ä¸è½å¨ return å§ç¨ setState()? ä¾å¦æç¨å¨è¨æ¸å¨ï¼è¨ç® return å§ map() å·è¡äºå¹¾æ¬¡ï¼

- è§£ï¼ä¸å»ºè­°
  - è§£éå¯ä»¥åè[éè£¡](https://stackoverflow.com/questions/55373878/what-are-the-differences-when-re-rendering-after-state-was-set-with-hooks-compar)ã
  - ä½çº render å§è¿­ä»£(å¦ map())çè¨æ¸å¨ï¼æç¨äºå¤é¨å¯¦å­ç©ä»¶ï¼å¦[rowProcessedTimes](./src/components/DrawGraph.js)

### ð How to use multiple refs for an array of elements with hooks?

- è§£ï¼`useRef`æåµé `{current: ...}`ç©ä»¶ï¼ä¸è©²ç©ä»¶æ´æ°ä¸¦ä¸æé æé¶ä»¶ re-renderï¼å©ç¨éç¹æ§ã[See Here](https://stackoverflow.com/a/56063129/16124226)
  ```JavaScript
    const divsRefs = useRef([])
    divsRefs.current = [...new Array(length)].map(() => React.createRef())
  ```

## Front end -- CSS Thinking

### ð height: 100% è¨­å®å¨ svg ææ¯ divï¼ä½å¯¦éæ¸²æ hegight ææ¯ 0pxã

- è§£ï¼`100%` means 100% of the `parent container`'s height

### ð div çä½ç½®ç§»åï¼æ¹è® postition å¥½ï¼ ç¨ trnasform: translate å¥½ï¼

- è§£ï¼æ ¹æå¥ä»¶ react-draggable è§£éï¼Draggable items are moved using CSS Transforms. This allows items to be dragged regardless of their current positioning (relative, absolute, or static). Elements can also be moved between drags without incident.
- ç®åæ div ä¹ç¨ CSS Transforms
- ä½è¥æ¯ svg å°±è¦ç´æ¥ä¿®æ¹ä½ç½®æ¸å¼ï¼æç¨å° offsetLeft ç­ï¼æä»¥ potisitoning è¦çº fixxed or absolute ç­ã

## Front end -- DAG Drawing Thinking -- draw by rank

1. graph å¯¦ä¾æåå¾å¾ç¨ç©ä»¶æ¹æ³åå¾ graph.rankï¼è¡¨ç¤ºå vertex éå±¤ï¼è¦åå§æ¸²æå¨ç¬¬å¹¾è¡ï¼
2. å©ç¨ topsort() æå¢£æåºå¾çé£åä»¥ map() + JSX è¿­ä»£å vertex ç div
3. è¿­ä»£æè¦å¤å¥è©²ï¼
   - è©² vertex æä½æ¼åªä¸è¡ï¼
     - `å¤é¨è®æ¸` currentRowï¼ä»£è¡¨ç¾å¨ç¬¬å¹¾è¡
   - è©² vertex æ¯è©²è¡çç¬¬ä¸å div åï¼
     - `å¤é¨è®æ¸` rowProcessedTimes = {}
     - rowProcessedTimes[currentRow] += 1 ä¾ç´éå¤æ·æ¯å¦çºè©²è¡ç¬¬ä¸å div
   - ç¶å¾åèªçµ¦äº css position
4. â° Draw SVG arrows
   - w/ div `node.offsetLeft`
   - w/ SVG `node.setAttribute(d, "M...C..")` -- on `svg > g > path`
   - Idea from [here](https://stackoverflow.com/questions/39553105/drawing-curved-svg-arrow-lines-from-div-to-div)
5. â° Drag-and-Drop
   - w/ React [See here](https://engineering.datorama.com/mastering-drag-drop-using-reactjs-hooks-fb58dc1f816f), [and here](https://engineering.datorama.com/mastering-drag-drop-with-reactjs-part-01-39bed3d40a03)
   - âCallback Ref ?
   - â é»é¸ div æçºä½æå remove event handler å add event handler?
   - â å»ºç« vertex å¾çåå§ç®­é ­æ¸²æï¼è·ææ³ vertex çç®­é ­æ¸²æï¼å©èéè¼¯å¦ä½åä½µï¼éè¼¯åéå°è´å»ºç«æ° vertex æææç®­é ­éæ°åå°åä½ï¼è·ææ³å¾ç vertex åå®¶äºãèæ®ç¨ content API é¿æéåé·...

## Back end

- class Dag, sub class graph inplementation
- Refactoring on `give_rank()`: no use of Recurssive! Access by topsorted array instead.
- ââ° In [dag_tester](./src/components/dag/dag_tester.js): éè¤åµå»ºå¯¦ä¾å¨ entry function è£¡é¢ï¼åè æä¸å° graph instanceï¼why? æ¯ä¸æ¯ç©ä»¶å§ this çåé¡ï¼
- âð æèï¼`this.giveRank()` æ¯ååªçµ¦ç©ä»¶å§é¨åç¨çæ¹æ³ï¼èä¸æ¯è¦çµ¦å¯¦ä¾ä½¿ç¨çå½æ¸ï¼ææ²ææ´å¥½çå¯«æ³ä¾ä¿è­·ï¼ä¾å¦`static`ééµå­ï¼[Issue1](https://github.com/benson00077/dag_graph/issues/1)
- â åé¡ï¼å¨ node è£¡ï¼çºä½ æå¨ B æªæ¡ require A æªæ¡çå§å®¹é²ä¾å¾æ run A æªæ¡çå§å®¹ï¼ä¾å¦ A æªæ¡æ console.logï¼å¨ terminal run B æªæ¡çæåï¼ä¹æåºç¾åºç¾å¨ terminalãæä»¥çº module.exports åªæ¯å³ç©ä»¶çåç§ï¼
