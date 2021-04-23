export const initialState = {
  gameOptions: {
    height: 16,
    width: 16,
    mines: 40,
  },
  gameOver: false,
  success: false,
  isActive: false,
  flags: 0,
  grid: [],
};

export const ACTIONS = {
  GAME_OVER: "game-over",
  UPDATE_SUCCESS: "update-success",
  UPDATE_FLAGS: "update-flags",
  UPDATE_GRID: "update-grid",
  UPDATE_IS_ACTIVE: "update-is-active",
  RESET: "reset",
};

export default function reducer(state, action) {
  switch (action.type) {
    case ACTIONS.GAME_OVER:
      return { ...state, gameOver: true };
    case ACTIONS.UPDATE_SUCCESS:
      return { ...state, success: action.payload.success };
    case ACTIONS.UPDATE_FLAGS:
      return { ...state, flags: action.payload.flags };
    case ACTIONS.UPDATE_GRID:
      return { ...state, grid: action.payload.grid };
    case ACTIONS.UPDATE_IS_ACTIVE:
      return { ...state, isActive: action.payload.isActive };
    case ACTIONS.RESET:
      return { ...initialState };
    default:
      return state;
  }
}
