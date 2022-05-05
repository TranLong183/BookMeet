import {createContext, useReducer} from 'react'
import LoadingReducer from './LoadingReducer'

export const LoadingContext = createContext()

const initialState = false

const LoadingProvider = ({children}) => {
  const [loading, loadingDispatch] = useReducer(LoadingReducer, initialState)
  const data = {
    loading,
    loadingDispatch,
  }
  return (
    <LoadingContext.Provider value={data}>{children}</LoadingContext.Provider>
  )
}

export default LoadingProvider
