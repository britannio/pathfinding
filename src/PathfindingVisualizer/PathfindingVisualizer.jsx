import React, { Component } from "react";
import Node from "./Node/Node";

export default class PathfindingVisualizer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nodes: []
    };
  }

  // Invoked immediately after a component is mounted.
  // Initialization that requires DOM nodes go here.
  componentDidMount() {
    // 2D array containing the properties of all nodes on the grid.
    const nodes = [];

    // Populates the 2D nodes array with node objects containing node properties
    for (let row = 0; row < 19; row++) {
      const currentRow = [];
      for (let col = 0; col < 32; col++) {
        const currentNode = {
          col,
          row,
          isStart: row === 9 && col === 8,
          isFinish: row === 9 && col === 24
        };
        currentRow.push(currentNode);
      }
      nodes.push(currentRow);
    }

    // Updates the app state with the new array
    this.setState({ nodes });
  }

  render() {
    const { nodes } = this.state;
    console.log(nodes);

    // Iterates through the nodes array and renders each node w/ its given
    // properties
    return (
      <div className="grid">
        {nodes.map((row, rowIdx) => {
          return (
            <div key={rowIdx}>
              {row.map((node, nodeIdx) => {
                const { isStart, isFinish } = node;
                return (
                  <Node
                    key={nodeIdx}
                    isStart={isStart}
                    isFinish={isFinish}
                  ></Node>
                );
              })}
            </div>
          );
        })}
      </div>
    );
  }
}
