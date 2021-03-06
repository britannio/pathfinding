

export function dijkstra(grid, startNode, finishNode) {
    // An array of visited nodes in the order they were visited in. This is 
    // iterated at fixed time intervals to progressively animate the grid
    const visitedNodesInOrder = [];
    startNode.distance = 0;
    const unvisitedNodes = getAllNodes(grid);
    // !!<num> returns false if num is zero otherwise it returns true
    // This is the same as iterating while the length of unvisitedNodes > 0
    while (!!unvisitedNodes.length) {
        
        // Converts the unsorted grid into a list of nodes ordered by distance
        sortNodesByDistance(unvisitedNodes);
        // .shift() removes and returns the first item in an array
        const closestNode = unvisitedNodes.shift();

        // if the closest node is a wall then jump to the next iteration
        // as .shift() has removed the wall from the unvisitedNodes array
        if (closestNode.isWall) continue;
        // Stops the search if we're boxed in and the end node is unreachable
        if (closestNode.distance === Infinity) return visitedNodesInOrder;

        closestNode.isVisited = true;
        // .push() adds an item to the end of an array
        visitedNodesInOrder.push(closestNode);
        if (closestNode === finishNode) return visitedNodesInOrder;
        updateUnvisitedNeighbours(closestNode, grid);

    }
}

// uses the sort() function to order the nodes from shortest to largest distance
function sortNodesByDistance(unvisitedNodes) {
    unvisitedNodes.sort((nodeA, nodeB) => nodeA.distance - nodeB.distance);
}


// Sets the distance of unvisited neighbours to the current distance plus one
function updateUnvisitedNeighbours(node, grid) {
    // Array of unvisited neighbouring nodes to the one provided
    const unvisitedNeighbours = getUnvisitedNeighbours(node, grid);
    
    for (const neighbour of unvisitedNeighbours) {
        neighbour.distance = node.distance + 1;
        neighbour.previousNode = node;
    }
}

// adds the node above, below, to the left and to the right of the provided node
// to an array then removes visited nodes from that array and returns it
function getUnvisitedNeighbours(node, grid) {
    const neighbours = [];
    const { col, row } = node;
    if (row > 0) neighbours.push(grid[row - 1][col]);
    if (row < grid.length - 1) neighbours.push(grid[row + 1][col]);
    if (col > 0) neighbours.push(grid[row][col - 1]);
    if (col < grid[0].length - 1) neighbours.push(grid[row][col + 1]);
    return neighbours.filter(neighbour => !neighbour.isVisited);
}


// Returns a 1D array of nodes from the 2D grid array. Ordered left to right and
// top to bottom
function getAllNodes(grid) {
    const nodes = [];
    for (const row of grid) {
        for (const node of row) {
            nodes.push(node);
        }
    }
    return nodes;
}


// Traverses the shortest path from finish to start, adding each node into an 
// array then returning it
export function getNodesInShortestPathOrder(finishNode) {
    const getNodesInShortestPathOrder = [];
    let currentNode = finishNode;
    while (currentNode !== null) {
        getNodesInShortestPathOrder.unshift(currentNode);
        currentNode = currentNode.previousNode;
    }
    return getNodesInShortestPathOrder;
}