export default function resourcesReducer(state, action) {
	switch (action.type) {
		case 'INIT_LOCATION': {
			const newArr = [...state]
			newArr[0].instances = action.data
			return newArr
		}
		case 'DELETE_LOCATION': {
			const newArr = [...state]
			const filtered = newArr[0].instances.filter((item) => action.id !== item.id)
			newArr[0].instances = filtered
			return newArr
		}
		case 'ADD_LOCATION': {
			const newArr = [...state]
			newArr[0].instances.push(action.newLocation)
			return newArr
		}
		case 'EDIT_LOCATION': {
			const newArr = [...state]
			const edited = newArr[0].instances.map((item) => (item.id === action.id ? action.data : item))
			newArr[0].instances = edited
			return newArr
		}
		case 'INIT_GROUP': {
			const newArr = [...state]
			newArr[1].instances = action.data
			return newArr
		}
		case 'DELETE_GROUP': {
			const newArr = [...state]
			const filtered = newArr[1].instances.filter((item) => action.id !== item.id)
			newArr[1].instances = filtered
			return newArr
		}
		case 'ADD_GROUP': {
			const newArr = [...state]
			newArr[1].instances.push(action.newLocation)
			return newArr
		}
		default:
			return state
	}
}
