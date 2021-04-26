import { render, screen, fireEvent } from "@testing-library/react";
import App from "./App";
import { StateProvider } from "./context/StateProvider";
import reducer, { initialState } from "./context/reducer";

const gameOptions = {
  height: 2,
  width: 2,
  mines: 1,
};

test("cell is revealed when clicked", () => {
  render(
    <StateProvider
      reducer={reducer}
      initialState={{ ...initialState, gameOptions }}
    >
      <App />
    </StateProvider>
  );

  const cell = screen.getAllByTestId("cell")[0];

  fireEvent.click(cell);
  expect(cell).toHaveClass("revealed");
});

test("cell is flagged when right clicked, and unflagged on second click", () => {
  render(
    <StateProvider
      reducer={reducer}
      initialState={{ ...initialState, gameOptions }}
    >
      <App />
    </StateProvider>
  );

  const cell = screen.getAllByTestId("cell")[0];
  fireEvent.contextMenu(cell);
  expect(cell).toHaveClass("flagged");

  fireEvent.contextMenu(cell);
  expect(cell).not.toHaveClass("flagged");
});

test("game over when mine is clicked", () => {
  render(
    <StateProvider
      reducer={reducer}
      initialState={{ ...initialState, gameOptions }}
    >
      <App />
    </StateProvider>
  );

  const app = screen.getByTestId("app");
  const mine = screen.getAllByTestId("mine")[0];
  fireEvent.click(mine);
  expect(app).toHaveClass("game-over");
});

test("game is won when user flags all mines and reveals all cells", () => {
  render(
    <StateProvider
      reducer={reducer}
      initialState={{ ...initialState, gameOptions }}
    >
      <App />
    </StateProvider>
  );

  const app = screen.getByTestId("app");
  const mines = screen.getAllByTestId("mine");
  const cells = screen.getAllByTestId("cell");
  mines.forEach((mine) => {
    fireEvent.contextMenu(mine);
  });
  cells.forEach((cell) => {
    fireEvent.click(cell);
  });
  expect(app).toHaveClass("success");
});

test("reset board after game over", () => {
  render(
    <StateProvider
      reducer={reducer}
      initialState={{ ...initialState, gameOptions }}
    >
      <App />
    </StateProvider>
  );

  const app = screen.getByTestId("app");
  const mine = screen.getAllByTestId("mine")[0];
  fireEvent.click(mine);
  expect(mine).toHaveClass("revealed");
  expect(app).toHaveClass("game-over");

  const restart = screen.getByRole("button", { name: "Restart" });
  fireEvent.click(restart);
  expect(app).not.toHaveClass("game-over");
  const mines = screen.getAllByTestId("mine");
  mines.forEach((mine) => {
    expect(mine).not.toHaveClass("revealed");
  });
});
