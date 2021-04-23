import React, { createContext, useContext, useReducer } from "react";
import { setup } from "../helpers/setup";

export const StateContext = createContext();

export const StateProvider = ({ children, reducer, initialState }) => {
  const [state, dispatch] = useReducer(reducer, initialState, setup);

  return (
    <StateContext.Provider value={[state, dispatch]}>
      {children}
    </StateContext.Provider>
  );
};

export const useStateValue = () => useContext(StateContext);
