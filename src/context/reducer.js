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
  scores: [],
  name: null,
  seconds: 0,
};

export const ACTIONS = {
  GAME_OVER: "game-over",
  UPDATE_SUCCESS: "update-success",
  UPDATE_FLAGS: "update-flags",
  UPDATE_GRID: "update-grid",
  UPDATE_IS_ACTIVE: "update-is-active",
  RESET: "reset",
  UPDATE_NAME: "update-name",
  UPDATE_SECONDS: "update-seconds",
  FETCH_SCORES: "fetch-scores",
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
      return { ...initialState, scores: state.scores };
    case ACTIONS.UPDATE_NAME:
      return { ...state, name: action.payload.name };
    case ACTIONS.UPDATE_SECONDS:
      return { ...state, seconds: action.payload.seconds };
    case ACTIONS.FETCH_SCORES:
      return { ...state, scores: action.payload.scores };
    default:
      return state;
  }
}
