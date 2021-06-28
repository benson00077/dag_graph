# Table of Content
代號標註：❓思考中 ⏰ TBD 🆘 問題移駕Issue

- [Table of Content](#table-of-content)
- [Init](#init)
- [Usage](#usage)
- [Features to build](#features-to-build)
- [Building Log](#building-log)
  - [Tree & Component](#tree--component)
  - [Front end -- React Thinking](#front-end----react-thinking)
    - [問：With useEffect, how can I skip applying an effect upon the initial render?](#問with-useeffect-how-can-i-skip-applying-an-effect-upon-the-initial-render)
    - [問：給定 int n ，如何 map 出 n 個 JSX nodes?](#問給定-int-n-如何-map-出-n-個-jsx-nodes)
    - [問：噴錯 `Warning: Maximum update depth exceeded.`](#問噴錯-warning-maximum-update-depth-exceeded)
    - [問：能不能在 `render` 內用 `setState()`? 例如應用在計數器，計算 render 內 map() 執行了幾次？](#問能不能在-render-內用-setstate-例如應用在計數器計算-render-內-map-執行了幾次)
  - [Front end -- CSS Thinking](#front-end----css-thinking)
    - [問：`height: 100%` 設定在 svg 或是 div，但實際渲染 hegight會是 0px。](#問height-100-設定在-svg-或是-div但實際渲染-hegight會是-0px)
    - [問：div 的位置移動，改變 postition top / left 好？ 用 trnasform: translate() 好？](#問div-的位置移動改變-postition-top--left-好-用-trnasform-translate-好)
  - [Front end -- DAG Drawing Thinking -- draw by rank](#front-end----dag-drawing-thinking----draw-by-rank)
  - [Back end](#back-end)
- [（參考） DAG 物件實例 graph](#參考-dag-物件實例-graph)


# Init
Bootstraped with `npx create-react-app` <br/>
App run with `npm start` <br/>
SCSS setting with `npm install scss-loader node-scss --save-dev` <br/>


# Usage
Give vertex name and it's incomming/outgoing vertices' name, to get the graph (DAG, or Directedd Acyclic Graph) that show the direction flow <br/>
V.1 See example below <br/>
![image](https://github.com/benson00077/dag_graph/blob/main/public/demo/demo1.png) 

# Features to build 
| Features | Problems | note
| ------ | ------ | ------ |
| To support many times of vertices creation | state lost after rerender | done -- by hoisting state |
| SVG direction arrow render  |  not in rightplace | fixxed -- by CSS `position absolute` and parent's node's `position relative` |
| drag-and-drop on vertex and svg arrow | svg arrow not drag-and-drop with divs  | ❓TBD


# Building Log
## Tree & Component
- Tree in src directory
```zsh
.
├── App.js
├── assets
│   └── SCSS
│       ├── _draw-graph.scss
│       ├── _variables.scss
│       └── base.scss
├── components
│   ├── SOME_parent.js    # TBD
│   ├── VertexInput.js    ## Access user's vertex input
│   ├── CreateVertex.js   ## Create Graph instance having vertex
│   ├── DrawGraph.js      ### Layout for vertex's div and direction arrow || Render vertex's div by map()
│   ├── ArrowDrawer.js    #### Render direction arrow || Implement drag-n-drop logic
│   ├── draggable.js      #### Helper function for ArrowDrawer
│   └── dag               
│       ├── dagClass.js   # parent class
│       ├── graphClass.js # sibling class
│       └── dag_tester.js
└── index.js
```

## Front end -- React Thinking
### 問：With useEffect, how can I skip applying an effect upon the initial render?
- 解：[see here](https://stackoverflow.com/questions/53179075/with-useeffect-how-can-i-skip-applying-an-effect-upon-the-initial-render)
### 問：給定 int n ，如何 map 出 n 個 JSX nodes?
- 解：注意不能用 `Array(n).map()`。 [See here](https://stackoverflow.com/questions/34189370/how-to-repeat-an-element-n-times-using-jsx)
  ```JSX
  [...Array(n)].map((e, i) => <span className="busterCards" key={i}>♦</span>)
  ```
  ```JavaScript
  // in browser
  Array(4)        // [empty x 4]
  [...Array(4)]   // [undefined, undefined ....]
  ```
### 問：噴錯 `Warning: Maximum update depth exceeded.`
- 解：不要在 `uesEffect` 內呼叫 `setState`，想想 Component Lifecycle
### 問：能不能在 `render` 內用 `setState()`? 例如應用在計數器，計算 render 內 map() 執行了幾次？ 
- 解：不建議
  - 解釋可以參考[這裡](https://stackoverflow.com/questions/55373878/what-are-the-differences-when-re-rendering-after-state-was-set-with-hooks-compar)。
  - 作為render內迭代(如map())的計數器，我用了外部實字物件，如[rowProcessedTimes](./src/components/DrawGraph.js)。


## Front end -- CSS Thinking
### 問：`height: 100%` 設定在 svg 或是 div，但實際渲染 hegight會是 0px。
- 解：`100%` means 100% of the `parent container`'s height
### 問：div 的位置移動，改變 postition top / left 好？ 用 trnasform: translate() 好？
- 解：根據套件 react-draggable 解釋：Draggable items are moved using CSS Transforms. This allows items to be dragged regardless of their current positioning (relative, absolute, or static). Elements can also be moved between drags without incident.
- 目前我 div 也用 CSS Transforms
- 但若是 svg 就要直接修改位置數值，會用到 offsetLeft 等，所以 potisitoning 要為 fixxed or absolute 等。


## Front end -- DAG Drawing Thinking -- draw by rank
1. graph 實例時取得後用物件方法取得 graph.rank，表示各 vertex 階層（要初始渲染在第幾行）
2. 利用 topsort() 拓墣排序後的陣列以 map() + JSX 迭代各 vertex 的 div
3. 迭代時要判別該：
  - 該 vertex 應位於哪一行？
    - `外部變數` currentRow：代表現在第幾行
  - 該 vertex 是該行的第一個 div 嗎？
    - `外部變數` rowProcessedTimes = {} 
    - rowProcessedTimes[currentRow] += 1 來紀錄判斷是否為該行第一個 div
  - 然後各自給予 css position 
4. ⏰ Draw SVG arrows
   - w/ 
     - JS `node.offsetLeft`
     - SVG's `node.setAttribute(d, "M...C..")` -- on `svg > g > path`
   - Idea from [here](https://stackoverflow.com/questions/39553105/drawing-curved-svg-arrow-lines-from-div-to-div)
5. ⏰ Vanilla JS Drag-and-Drop [refer here](https://codepen.io/Shikkediel/pen/VLZKor?editors=0110)
   - ❓問題：單獨使 div 拖曳沒問題，但怎麼把渲染箭頭的函數也放進 draggable() 讓他一起監聽、改變並即時渲染箭頭位置？
   - ❓問題：第一次渲染箭頭沒問題，想要拖曳移動div位置後箭頭也有跟著移動。但第二次重新點選div再要拖曳時，arrow又重新渲染，跑回起始位置 
     - 問題釐清：是因為 re-render嗎？What causes the re-render ? [這裡會有相關嗎？](https://stackoverflow.com/questions/56599583/useeffect-hook-example-what-causes-the-re-render)
     - 問題釐清：因為拖曳時給定事件監聽的 div 位置參數都是初始渲染的固定值，才會這樣。要重新設計成動態捕捉。

## Back end
- class Dag, sub class graph inplementation
- Refactoring on `give_rank()`: no use of Recurssive! Access by topsorted array instead. 
- ❓⏰ In [dag_tester](./src/components/dag/dag_tester.js): 重複創建實例在 entry function 裡面，反而 抓不到 graph instance，why?
- ❓🆘 思考：`this.giveRank()` 是個只給物件內部取用的方法，而不是要給實例使用的函數，有沒有更好的寫法來保護？例如`static`關鍵字？
- ❓問題：在node裡，為何 我在 B檔案 require A檔案的內容進來後會 run A檔案的內容？例如 A檔案有 console.log，在 terminal run B檔案的時候，也會出現出現在 terminal。我以為 module.exports 只是傳物件的參照？


# （參考） DAG 物件實例 graph
    Directedd Acyclic Graph
- 舉例，按照以下順序創建 vertex ，箭頭 → 表示彼此流向關係:
  | Incomming | → Vertex → | Outgoing
  | ------ | ------ | ------   |
  |        | Benson | Alice    |
  |        | Alice  | Catherine|
  | Ben    | Benson | Catherine|
  | Eva    | Benson | David    |
  |[Ben, Flora] | Catherine | [David, George]|

- `graph.vertices` Object by `console.table()` :
```zsh
┌───────────┬─────────────┬───────────────────────────────────────────┬────────────────────────────────┬─────────────┬───────┐
│  (index)  │    name     │                 incoming                  │         incomingNames          │ hasOutgoing │ value │
├───────────┼─────────────┼───────────────────────────────────────────┼────────────────────────────────┼─────────────┼───────┤
│  Benson   │  'Benson'   │     { Ben: [Object], Eva: [Object] }      │        [ 'Ben', 'Eva' ]        │    true     │ null  │
│   Alice   │   'Alice'   │           { Benson: [Object] }            │          [ 'Benson' ]          │    true     │ null  │
│ Catherine │ 'Catherine' │                 [Object]                  │ [ 'Alice', 'Benson', 'Flora' ] │    true     │ null  │
│    Ben    │    'Ben'    │                    {}                     │               []               │    true     │ null  │
│   David   │   'David'   │ { Benson: [Object], Catherine: [Object] } │   [ 'Benson', 'Catherine' ]    │    false    │ null  │
│    Eva    │    'Eva'    │                    {}                     │               []               │    true     │ null  │
│  George   │  'George'   │          { Catherine: [Object] }          │        [ 'Catherine' ]         │    false    │ null  │
│   Flora   │   'Flora'   │                    {}                     │               []               │    true     │ null  │
└───────────┴─────────────┴───────────────────────────────────────────┴────────────────────────────────┴─────────────┴───────┘
```
- `graph.rank` Object by `console.table()` :
```zsh
┌───────────┬────────┐
│  (index)  │ Values │
├───────────┼────────┤
│  George   │   0    │
│   David   │   0    │
│ Catherine │   1    │
│   Flora   │   2    │
│   Alice   │   2    │
│  Benson   │   3    │
│    Eva    │   4    │
│    Ben    │   4    │
└───────────┴────────┘
```

