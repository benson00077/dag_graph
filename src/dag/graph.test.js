import Graph from "./dag/graphClass";

describe.skip("test for graphClass", () => {
  const graph = new Graph();
  graph.addEdges("Catherine", null, ["David", "George"], ["Alice", "Flora"]);
  graph.addEdges("Benson", null, "David", "Eva");
  graph.addEdges("Benson", null, "Catherine", "Ben");
  graph.addEdge("Alice", "Catherine");
  graph.addEdge("Benson", "Alice");
  graph.giveRank();

  test("graphClass", () => {
    expect(graph.topSorted[0]).toBe("Eva");
    expect(graph.rank["Eva"]).toBe(4);
  });

  test("throw error when cycle dag", () => {
    expect(() => graph.addEdge("Catherine", "Alice")).toThrow();
  });
});
