const hasMine = ({ x, y }, grid, gameOptions) => {
  const { height, width } = gameOptions;
  if (x >= width || y >= height || x < 0 || y < 0) return 0;

  const cell = grid[y][x];
  return cell && cell.mine ? 1 : 0;
};

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

export const calculateMines = (cell, grid, gameOptions) => {
  const neighbours = getNeighbours(cell);
  return neighbours.reduce((count, row) => {
    return count + hasMine(row, grid, gameOptions);
  }, 0);
};

export const revealNeighbours = (cell, grid, gameOptions) => {
  const { height, width } = gameOptions;
  const neighboursToReveal = [cell];

  while (neighboursToReveal.length > 0) {
    let { x, y } = neighboursToReveal[0];
    const neighbours = getNeighbours({ x, y });

    neighbours.forEach((row) => {
      const { x, y } = row;
      if (
        x >= width ||
        y >= height ||
        x < 0 ||
        y < 0 ||
        grid[y][x].revealed === true
      )
        return;

      grid[y][x].revealed = true;
      grid[y][x].neighbours = calculateMines(row, grid, gameOptions);

      if (grid[y][x].neighbours === 0) {
        neighboursToReveal.push(row);
      }
    });
    neighboursToReveal.shift();
  }

  return grid;
};

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
