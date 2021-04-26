export const setup = (initialState) => {
  const { height, width, mines } = initialState.gameOptions;

  const grid = [...Array(height).keys()].map((y) =>
    [...Array(width).keys()].map((x) => {
      return {
        id: `cell-${x}-${y}`,
        x,
        y,
        flagged: false,
        mine: false,
        revealed: false,
        neighbours: 0,
      };
    })
  );
  let minesPlaced = 0;

  while (minesPlaced < mines) {
    const randomRow = Math.floor(Math.random() * height);
    const randomCol = Math.floor(Math.random() * width);

    if (grid[randomRow][randomCol].mine === false) {
      grid[randomRow][randomCol].mine = true;
      minesPlaced++;
    }
  }

  return { ...initialState, grid };
};
