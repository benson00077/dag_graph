import React, { Fragment } from "react";
import DrawGraph from "./DrawGraph";

/**
 * Represent graph instance creation layer
 * @param {object} verticesInput {vertex: '', incomming: '', outgoing: '}
 * @param {object} graph instance
 * @returns {Component} DrawGraph -- Layout for vertex's div and direction arrow svg
 */

export default function CreateVertex({ verticesInput, graph }) {
  let { incomming, vertex, outgoing } = verticesInput;
  let positionDefault = {};

  const createVertex = () => {
    if (incomming) {
      incomming = incomming.split(",");
      // str "a" → "a" || arr [a , b,c] → arr[a,b]
      switch (incomming.length === 1) {
        case true:
          incomming = incomming[0];
          break;
        case false:
          incomming.forEach((e, i) => {
            incomming[i] = e.trim();
          });
          break;
      }
    }
    if (outgoing) {
      // str "a" → "a" || arr [a , b,c] → arr[a,b]
      outgoing = outgoing.split(",");
      switch (outgoing.length === 1) {
        case true:
          outgoing = outgoing[0];
          break;
        case false:
          outgoing.forEach((e, i) => {
            outgoing[i] = e.trim();
          });
          break;
      }
    }

    // Create vertex
    graph.addEdges(vertex, null, outgoing, incomming);
  };

  if (vertex) {
    createVertex();
    graph.giveRank();
    //console.table(graph)
  }

  function test() {
    // 按照拓墣排序迭代每個 vertex，同時紀錄他們所在階層 currentRow
    let rank = graph["rank"];
    let topSorted = graph.topSorted;
    let graphHeight = rank[`${topSorted[0]}`];
    let rowProcessedTimes = {};
    let posnMap = {};
    topSorted.map((name, i) => {
      let row = graphHeight - rank[name]; // 代表該 vertex name 在第幾行
      rowProcessedTimes[row] = rowProcessedTimes[row] + 1 || 1; // Record to kwow current vertex is in n'th column
      let column = rowProcessedTimes[row];
      //console.log(`name: ${name}, row: ${row}, column: ${column}`)
      posnMap[name] = { row, column };
    });
    console.log(posnMap);
  }

  return (
    <Fragment>
      <DrawGraph graph={graph} topSorted={graph["topSorted"]} />
    </Fragment>
  );
}
