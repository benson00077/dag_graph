# Table of Content

- [Table of Content](#table-of-content)
- [Init](#init)
- [Usage](#usage)
- [Features to build](#features-to-build)
- [Building Log](#building-log)
  - [Tree & Component](#tree--component)
  - [Front end -- React Thinking](#front-end----react-thinking)
  - [Front end -- CSS Thinking](#front-end----css-thinking)
  - [Front end -- 把 DAG 畫出來的思考 -- 分階層後畫出來](#front-end----把-dag-畫出來的思考----分階層後畫出來)
  - [Back end](#back-end)
- [[參考] DAG 物件實例 graph](#參考-dag-物件實例-graph)


# Init
Bootstraped with `npx create-react-app` <br/>
App run with `npm start` <br/>
SCSS setting with `npm install scss-loader node-scss --save-dev` <br/>


# Usage
Give vertex name and it's incomming/outgoing vertices' name, to get the graph (DAG, or Directedd Acyclic Graph) that show the direction flow


# Features to build 
| Features | Problems | note
| ------ | ------ | ------ |
| To support many times of vertices creation | state lost after rerender | done -- by hoisting state |
| SVG direction arrow render  |  not in rightplace | fixxed -- by CSS position absolute and parent's node's position relative |
| Vertex div drag-and-drop | svg arrow not drag-and-drop with divs | ❓TBD


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
│   ├── CreateVertex.js   # Create Vertex and graph
│   ├── DrawGraph.js      # Render vertex's div and direction arrow
│   ├── VertexInput.js    # Access user's vertex input
│   └── dag               
│       ├── dagClass.js
│       ├── dag_tester.js
│       └── graphClass.js # sibling class of dag class
└── index.js
```

## Front end -- React Thinking
- 問：With useEffect, how can I skip applying an effect upon the initial render?
- 解：[see here](https://stackoverflow.com/questions/53179075/with-useeffect-how-can-i-skip-applying-an-effect-upon-the-initial-render)
- 問：給定 int n ，如何 map 出 n 個 JSX nodes?
- 解：注意不能用 `Array(n).map()`。 [See here](https://stackoverflow.com/questions/34189370/how-to-repeat-an-element-n-times-using-jsx)
  ```JSX
  [...Array(n)].map((e, i) => <span className="busterCards" key={i}>♦</span>)
  ```
  ```JavaScript
  // in browser
  Array(4)        // [empty x 4]
  [...Array(4)]   // [undefined, undefined ....]
  ```
- 問：噴錯 `Warning: Maximum update depth exceeded.`
- 解：不要在 `uesEffect` 內呼叫 `setState`，想想 Component Lifecycle
- 問：能不能在 `render` 內用 `setState()`? 例如應用在計數器，計算 render 內 map() 執行了幾次？ 
- 解：不建議
  - 解釋可以參考[這裡](https://stackoverflow.com/questions/55373878/what-are-the-differences-when-re-rendering-after-state-was-set-with-hooks-compar)。
  - 作為render內迭代(如map())的計數器，我用了外部實字物件，如[rowProcessedTimes](./src/components/DrawGraph.js)。


## Front end -- CSS Thinking
- 問：`height: 100%`設定在 svg 或是 div (內有{position: absolute})的時候，實際渲染 hegight會是 0px。
- 解：`100%` means 100% of the `parent container`'s height


## Front end -- 把 DAG 畫出來的思考 -- 分階層後畫出來
1. 取得各 vertex 的階層 `graph.rank`，並利用 topsort() 拓墣排序後的陣列迭代各 vertex 的 incomming vertieces。
2. 迭代時要判別該：
  - 該 vertex 應位於哪一行？
    - 外部變數 currentRow 代表現在第幾行
  - 該 vertex 是該行的第一個 div 嗎？
    - 外部變數 rowProcessedTimes = {} 
    - rowProcessedTimes[currentRow] += 1 來紀錄判斷是否為該行第一個 div
  - 判別後給予起始值不同的 css position 
3. [TBD] Draw SVG direction arrow,  w/ JS `ele.offsetLeft` and SVG's `DOM.setAttribute()`
   - Idea from [here](https://stackoverflow.com/questions/39553105/drawing-curved-svg-arrow-lines-from-div-to-div)
4. [TBD] Vanilla JS Drag-and-Drop [refer here](https://codepen.io/Shikkediel/pen/VLZKor?editors=0110)
   - ❓問題：第一次渲染箭頭沒問題，想要拖曳移動div位置後箭頭也有跟著移動。但每次重新點選div要拖曳時，arrow又重新渲染，跑回起始位置 → What causes the re-render ? [這裡會有相關嗎？](https://stackoverflow.com/questions/56599583/useeffect-hook-example-what-causes-the-re-render)

## Back end
- [TBD] class Dag, class graph 
- Refactoring on `give_rank()`: no use of Recurssive! Access by topsorted array instead. 
- ❓[TBD] In [dag_tester](./src/components/dag/dag_tester.js): 重複創建實例在 entry function 裡面，反而 抓不到 graph instance，why?
- ❓思考：`this.giveRank()` 是個只給物件內部取用的方法，而不是要給實例使用的函數，有沒有更好的寫法來保護？例如`static`關鍵字？
- ❓問題：在node裡，為何 我在 B檔案 require A檔案的內容進來後會 run A檔案的內容？例如 A檔案有 console.log，在 terminal run B檔案的時候，也會出現出現在 terminal。我以為 module.exports 只是傳物件的參照？


# [參考] DAG 物件實例 graph
    Directedd Acyclic Graph
- 舉例，按照以下順序創建 vertex:
  1. Benson -> Alice
  2. Alice -> Catherine
  3. Ben -> Benson -> Catherine
  4. Eva -> Benson -> David
  5. [Ben, Flora] -> Catherine -> [David, George]
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

