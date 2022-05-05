export default function appointmentsReducer(state, action) {
	switch (action.type) {
		case 'INIT': 
			return action.data
		case 'ADDED':
			const startingAddedId = state.length > 0 ? state[state.length - 1].id + 1 : 0
			return [...state, { id: startingAddedId, ...action.added }]
		case 'CHANGED':
			return state.map((appointment) =>
				action.changed[appointment.id]
					? { ...appointment, ...action.changed[appointment.id] }
					: appointment,
			)
		case 'DELETED':
			return state.filter((appointment) => appointment.id !== action.deleted)
		default:
			return state
	}
}
