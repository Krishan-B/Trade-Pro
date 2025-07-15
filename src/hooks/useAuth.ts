import { useContext } from 'react';
import { AppContext } from '../contexts/AppContext';

export const useAuth = () => {
  const { state, dispatch } = useContext(AppContext);

  const login = (user: any) => {
    dispatch({ type: 'LOGIN_SUCCESS', payload: { user } });
  };

  const logout = () => {
    dispatch({ type: 'LOGOUT' });
  };

  return {
    ...state.auth,
    login,
    logout,
  };
};