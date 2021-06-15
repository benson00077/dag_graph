# Table of Content

- [Table of Content](#table-of-content)
- [Init](#init)
- [Usage](#usage)
- [[TBD] Feature to be build](#tbd-feature-to-be-build)
- [Building Log](#building-log)
  - [Tree & Component](#tree--component)
  - [React 框架相關思考](#react-框架相關思考)
  - [把 DAG 畫出來的思考](#把-dag-畫出來的思考)
  - [Back end](#back-end)
- [[參考] DAG 物件實例 graph](#參考-dag-物件實例-graph)


# Init
Bootstraped with `npx create-react-app` <br/>
App run with `npm start` <br/>
SCSS setting with `npm install scss-loader node-scss --save-dev` <br/>


# Usage
Give vertex name and it's incomming/outgoing vertex, to get the graph that show the direction flow (DAG, or Directedd Acyclic Graph)

# [TBD] Feature to be build 
- To support many times of vertices creation (cuurent only once)
- SVG direction arrow not currectly rendered
- Vertex div drag-and-drop


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


## React 框架相關思考
- 問：With useEffect, how can I skip applying an effect upon the initial render?
- 解：[see here](https://stackoverflow.com/questions/53179075/with-useeffect-how-can-i-skip-applying-an-effect-upon-the-initial-render)
- [TBD]問：重複 Render 問題


## 把 DAG 畫出來的思考
1. 取得各 vertex 的階層 `graph.rank`，利用 topsort() 拓墣排序後的陣列迭代。
2. Render div by graph.rank object & graph.vertices.incomingNames
3. [TBD] Draw SVG direction arrow,  w/ JS `ele.offsetLeft` and SVG's `DOM.setAttribute()`
   - Idea from [here](https://stackoverflow.com/questions/39553105/drawing-curved-svg-arrow-lines-from-div-to-div)
4. [TBD] Vanilla JS Drag-and-Drop [refer here](https://codepen.io/Shikkediel/pen/VLZKor?editors=0110)

## Back end
- [TBD] class Dag, class graph 


# [參考] DAG 物件實例 graph
    Directedd Acyclic Graph
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

