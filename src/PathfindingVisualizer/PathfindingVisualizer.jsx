import React, { Component } from "react";
import Node from "./Node/Node";
import { dijkstra, getNodesInShortestPathOrder } from "../algorithms/dijkstra";

// Start and finish node constants
const START_NODE_ROW = 9;
const START_NODE_COL = 8;
const FINISH_NODE_ROW = 9;
const FINISH_NODE_COL = 24;

export default class PathfindingVisualizer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      grid: [],
      mouseIsPressed: false
    };
  }

  // Invoked immediately after a component is mounted.
  // Initialization that requires DOM nodes go here.
  componentDidMount() {
    const grid = getInitialGrid();

    // Updates the app state with the initial grid
    this.setState({ grid });
  }

  // Starts dijkstra process and starts the animation
  visualizeDijkstra() {
    const { grid } = this.state;
    const startNode = grid[START_NODE_ROW][START_NODE_COL];
    const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
    const visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
    this.animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
    console.log(visitedNodesInOrder);
  }

  // Incrementally shows a larger and larger portion of the visited 
  animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder) {
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          this.animateShortestPath(nodesInShortestPathOrder);
        }, 10 * i);
        return;
      }
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          "node node-visited";
      }, 10 * i);
    }
  }

  // Animation for the tiles forming the shortest path
  animateShortestPath(nodesInShortestPathOrder) {
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          "node node-shortest-path";
      }, 50 * i);
    }
  }

  // Updates the grid to reflect a tile being selected
  handleMouseDown(row, col) {
    const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
    this.setState({ grid: newGrid, mouseIsPressed: true });
  }

  // Disable wall creation mode
  handleMouseUp() {
    this.setState({ mouseIsPressed: false });
  }

  // Converts a node to/from a wall if the mouse is pressed
  handleMouseEnter(row, col) {
    console.log('(' + row + ',' + col + ')')
    if (!this.state.mouseIsPressed) return;
    const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
    this.setState({ grid: newGrid });
  }

  render() {
    const { grid, mouseIsPressed } = this.state;

    // Iterates through the nodes array and renders each node w/ its given
    // properties
    return (
      <>
        <button onClick={() => this.visualizeDijkstra()}>
          Visualize Dijkstra's Algorithm
        </button>

        <div className="grid">
          {grid.map((row, rowIdx) => {
            return (
              <div key={rowIdx}>
                {row.map((node, nodeIdx) => {

                  const { row, col, isStart, isFinish, isWall } = node;
                  return (
                    <Node
                      key={nodeIdx}
                      row={row}
                      col={col}
                      isStart={isStart}
                      isFinish={isFinish}
                      isWall={isWall}
                      mouseIsPressed={mouseIsPressed}
                      // Implementation of the callback functions
                      onMouseDown={(row, col) => this.handleMouseDown(row, col)}
                      onMouseEnter={(row, col) =>
                        this.handleMouseEnter(row, col)
                      }
                      onMouseUp={() => this.handleMouseUp()}
                    ></Node>
                  );
                })}
              </div>
            );
          })}
        </div>
      </>
    );
  }
}

const getInitialGrid = () => {
  const grid = [];

  // Populates the 2D grid array with node objects containing node properties
  for (let row = 0; row < 19; row++) {
    const currentRow = [];
    for (let col = 0; col < 32; col++) {
      currentRow.push(createNode(col, row));
    }
    grid.push(currentRow);
  }
  return grid;
};

const createNode = (col, row) => {
  return {
    col,
    row,
    isStart: row === START_NODE_ROW && col === START_NODE_COL,
    isFinish: row === FINISH_NODE_ROW && col === FINISH_NODE_COL,
    distance: Infinity,
    isVisited: false,
    isWall: false,
    previousNode: null
  };
};

// Creates a copy of the existing grid with a node's isWall property altered
const getNewGridWithWallToggled = (grid, row, col) => {
  const newGrid = grid.slice();
  // The old node from the grid
  const node = newGrid[row][col];

  // Creates a duplicate of the old node but with isWall toggled
  const newNode = {
    ...node,
    isWall: !node.isWall
  };
  // Inserts the new node back into the grid
  newGrid[row][col] = newNode;
  return newGrid;
};
