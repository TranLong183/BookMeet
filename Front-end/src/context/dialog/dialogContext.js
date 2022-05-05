import {createContext, useReducer} from 'react'
import dialogReducer from './dialogReducer'

export const DialogContext = createContext()

const init = {
    bool: false,
    text: ''
}
function DialogProvider({children}) {
  const [popup, popupDispatch] = useReducer(dialogReducer, init)
  const data = {
    popup,
    popupDispatch
  }
  return (
    <DialogContext.Provider value={data}>
    {children}
    </DialogContext.Provider>
  )
}

export default DialogProvider