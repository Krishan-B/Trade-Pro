import React, { createContext, useReducer, Dispatch, ReactNode } from 'react';

// Define the shape of the global application state
export interface AppState {
  auth: {
    isAuthenticated: boolean;
    user: any | null;
  };
  theme: 'light' | 'dark';
  dashboard: {
    notifications: any[];
  };
  markets: {
    watchlist: any[];
  };
  portfolio: {
    positions: any[];
    performance: any;
    allocation: any;
  };
}

// Define the initial state
const initialState: AppState = {
  auth: {
    isAuthenticated: false,
    user: null,
  },
  theme: 'light',
  dashboard: {
    notifications: [],
  },
  markets: {
    watchlist: [],
  },
  portfolio: {
    positions: [],
    performance: null,
    allocation: null,
  },
};

// Define the actions that can be dispatched
type Action =
  | { type: 'LOGIN_SUCCESS'; payload: { user: any } }
  | { type: 'LOGOUT' }
  | { type: 'TOGGLE_THEME' }
  | { type: 'SET_NOTIFICATIONS'; payload: { notifications: any[] } }
  | { type: 'SET_WATCHLIST'; payload: { watchlist: any[] } }
  | {
      type: 'SET_PORTFOLIO_DATA';
      payload: { positions: any[]; performance: any; allocation: any };
    };

// Create the reducer function
const appReducer = (state: AppState, action: Action): AppState => {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        auth: { isAuthenticated: true, user: action.payload.user },
      };
    case 'LOGOUT':
      return { ...state, auth: { isAuthenticated: false, user: null } };
    case 'TOGGLE_THEME':
      return { ...state, theme: state.theme === 'light' ? 'dark' : 'light' };
    case 'SET_NOTIFICATIONS':
      return {
        ...state,
        dashboard: {
          ...state.dashboard,
          notifications: action.payload.notifications,
        },
      };
    case 'SET_WATCHLIST':
      return {
        ...state,
        markets: {
          ...state.markets,
          watchlist: action.payload.watchlist,
        },
      };
    case 'SET_PORTFOLIO_DATA':
      return {
        ...state,
        portfolio: {
          ...state.portfolio,
          positions: action.payload.positions,
          performance: action.payload.performance,
          allocation: action.payload.allocation,
        },
      };
    default:
      return state;
  }
};

// Create the context
export const AppContext = createContext<{
  state: AppState;
  dispatch: Dispatch<Action>;
}>({
  state: initialState,
  dispatch: () => null,
});

// Create the provider component
export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};