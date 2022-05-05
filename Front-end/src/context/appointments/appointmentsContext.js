import { createContext, useReducer } from 'react'
import { appointments } from '../../demo-data/month-appointments'
import appointmentsReducer from './appointmentsReducer'
export const AppointmentsContext = createContext()

export default function AppointmentsProvider({ children }) {
	const [data, dataDispatch] = useReducer(appointmentsReducer, appointments)
	return (
		<AppointmentsContext.Provider value={{ data, dataDispatch }}>
			{children}
		</AppointmentsContext.Provider>
	)
}
