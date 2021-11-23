# Table of Content

代號標註：❓ 思考中 ⏰ TBD 🆘 問題移駕 Issue

- [Table of Content](#table-of-content)
- [Init](#init)
- [Usage](#usage)
- [Features to build](#features-to-build)
- [（參考） DAG 物件實例 graph](#參考-dag-物件實例-graph)

# Init

Bootstraped with `npx create-react-app` <br/>
App run with `npm start` <br/>
SCSS setting with `npm install scss-loader node-scss --save-dev` <br/>
DAG datastructure inspired by [here](https://github.com/emberjs/ember.js/blob/62e52938f48278a6cb838016108f3e35c18c8b3f/packages/ember-application/lib/system/dag.js)

# Usage

see demo [here](https://benson00077.github.io/dag_graph/)

Give vertex name and it's incomming/outgoing vertices' name, to get the graph (DAG, or Directedd Acyclic Graph) that show the direction flow <br/>

# Features to build

| Features                                   | Problems                                                          | note                                                                                                                                                                                                               |
| ------------------------------------------ | ----------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| To support many times of vertices creation | state lost after re-input form                                    | done -- by hoisting state                                                                                                                                                                                          |
| SVG direction arrow render                 | not in right place                                                | fixxed -- by CSS `position absolute` and parent's node's `position relative`                                                                                                                                       |
| drag-and-drop on vertex and svg arrow      | 1.svg arrow not drag-and-drop with divs                           | 1. DrawGraph.js useRef <br/>→ forward down to DrawArrow.js, which render JSX <br/>→ forward that arrows ref to DrawVertex.js <br/>→ access arrows ref DOMin DrawVertex.js <br/>                                    |
| ㄴ                                         | 2.vertex move randomly when dragging                              | See [Issue2](https://github.com/benson00077/dag_graph/issues/2)<br/>REMEMBER: setState works like asynchronous function [SeeMore](https://medium.com/@brianwu291/learn-basic-react-setstate-function-2aec5018a38a) |
| ㄴ                                         | 3.add vertex and the dragged ones go back to default place        | See [Issue4](https://github.com/benson00077/dag_graph/issues/4)'s 問題一 & 問題三 <br/> 零件更新時序問題                                                                                                           |
| ㄴ                                         | 4.Back 2 default graph btn and then drag -- leads to misplacement | TBD: isDefaultGraph to be contextAPI, passed to useDrag. So that dragging on defaultGraph would re-init previous dragged position state                                                                            |
| Throw ERROR when cycle DAG                 |                                                                   |

# （參考） DAG 物件實例 graph

    Directedd Acyclic Graph

- 舉例，按照以下順序創建 vertex ，箭頭 → 表示彼此流向關係:
  | Incomming | → Vertex → | Outgoing
  | ------ | ------ | ------ |
  | | Benson | Alice |
  | | Alice | Catherine|
  | Ben | Benson | Catherine|
  | Eva | Benson | David |
  |[ Ben, Flora ] | Catherine | [ David, George ]|

- V.1 See example below
  ![image](https://github.com/benson00077/dag_graph/blob/main/public/demo/demo2.png)

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
