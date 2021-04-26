// check if current cell has a mine
const hasMine = ({ x, y }, grid, gameOptions) => {
  const { height, width } = gameOptions;

  // ignore if cell doesn't exist on the board
  if (x >= width || y >= height || x < 0 || y < 0) return 0;

  const cell = grid[y][x];
  return cell && cell.mine ? 1 : 0;
};

// return neibouring cell coordinates
const getNeighbours = ({ x, y }) => {
  return [
    { x: x - 1, y: y - 1 }, // top left
    { x: x, y: y - 1 }, // top
    { x: x + 1, y: y - 1 }, // top right
    { x: x - 1, y: y }, // left
    { x: x + 1, y: y }, // right
    { x: x - 1, y: y + 1 }, // bottom left
    { x: x, y: y + 1 }, // bottom
    { x: x + 1, y: y + 1 }, // bottom right
  ];
};

// calculate number of surrounding mines
export const calculateMines = (cell, grid, gameOptions) => {
  const neighbours = getNeighbours(cell);
  return neighbours.reduce((count, row) => {
    return count + hasMine(row, grid, gameOptions);
  }, 0);
};

// reveal all nearby empty cells
export const revealNeighbours = (cell, grid, gameOptions) => {
  const { height, width } = gameOptions;
  const neighboursToReveal = [cell];

  while (neighboursToReveal.length > 0) {
    let { x, y } = neighboursToReveal[0];
    const neighbours = getNeighbours({ x, y });

    // loop through all neighbouring cells
    neighbours.forEach((row) => {
      const { x, y } = row;

      // ignore if cell is not on the board or if it's already revealed
      if (
        x >= width ||
        y >= height ||
        x < 0 ||
        y < 0 ||
        grid[y][x].revealed === true
      )
        return;

      // set cell to revealed and calculate surrounding mines
      grid[y][x].revealed = true;
      grid[y][x].neighbours = calculateMines(row, grid, gameOptions);

      // if there are no surrounding mines for this neighbour, repeat the same steps for this cell
      if (grid[y][x].neighbours === 0) {
        neighboursToReveal.push(row);
      }
    });

    // remove cell from the while loop
    neighboursToReveal.shift();
  }

  return grid;
};

// check if game has been won
// if the sum of all the revealed cells and correctly flagged cells are equal to the size of the grid
export const checkSuccess = (grid, gameOptions) => {
  const { height, width, mines } = gameOptions;
  let revealed = 0;
  let correct = 0;
  grid.forEach((row) => {
    row.forEach((cell) => {
      if (cell.revealed) revealed++;
      if (cell.flagged && cell.mine) correct++;
    });
  });
  if (revealed === height * width - mines && correct === mines) {
    return true;
  }
};
