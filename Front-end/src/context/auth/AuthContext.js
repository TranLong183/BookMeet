import {createContext, useReducer} from 'react'
import AuthReducer from './AuthReducer'

export const AuthContext = createContext()

const initialState = {
  user: {},
  token: '',
  loading: false,
}

const AuthProvider = ({children}) => {
  const [auth, authDispatch] = useReducer(AuthReducer, initialState)
  const data = {
    auth,
    authDispatch,
  }
  return <AuthContext.Provider value={data}>{children}</AuthContext.Provider>
}

export default AuthProvider
