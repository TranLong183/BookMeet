const baseURL = 'http://10.99.63.125/api/v1/'
export const postDataApi = async (url, data, token) => {
	return token
		? await fetch(`${baseURL}${url}`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify(data),
		  })
		: await fetch(`${baseURL}${url}`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(data),
		  })
}
export const getDataApi = async (url, token) => {
	return token
		? await fetch(`${baseURL}${url}`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`,
				},
		  })
		: await fetch(`${baseURL}${url}`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
				},
		  })
}

export const getBookingDataApi = async (time, token) => {
	return await fetch(`http://10.99.63.125/api/v1/booking/in_time/`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify(time),
	})
}

export const getListRoomApi = async (token) => {
	return await fetch(`http://10.99.63.125/api/v1/room/`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`,
		},
	})
}

export const getListGroupApi = async (token) => {
	return await fetch(`http://10.99.63.125/api/v1/groups/listgroup/`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`,
		},
	})
}

export const addEvent = async (data, token) => {
	return await fetch(`http://10.99.63.125/api/v1/add-event/`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify(data),
	})
}

export const editRepeatFalseEvent = async (token, data, id) => {
	return await fetch(`http://10.99.63.125/api/v1/booking/update-booking/${id}`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify(data),
	})
}

export const editRepeatTrueEvent = async (token, data, group_id) => {
	return await fetch(`http://10.99.63.125/api/v1/events/update-event/${group_id}`, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify(data),
	})
}

export const searchEvent = async (data, token) => {
	return await fetch(`http://10.99.63.125/api/v1/events/Searchevent/`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify(data),
	})
}

export const searchEmptyRoom = async (data, token) => {
	return await fetch(`http://10.99.63.125/api/v1/booking/empty_room/`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify(data),
	})
}

export const searchRoom = async (data, token) => {
	return await fetch(`http://10.99.63.125/api/v1/room/search_event_room`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify(data),
	})
}

export const deleteEvent = async (data, token) => {
	return await fetch(`http://10.99.63.125/api/v1/booking/delete_booking/`, {
		method: 'DELETE',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify(data),
	})
}

export async function deleteEventAPI(token, id) {
	return await fetch(`http://10.99.63.125/api/v1/events/delete/${id}`, {
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`,
		},
	})
}

export const putDataApi = async (url, data, token) => {
	return await fetch(`${baseURL}${url}`, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify(data),
	})
}

export async function postRoomApi(url, token, data) {
	return await fetch(`http://10.99.63.125/api/v1/room/${url}/`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify(data),
	})
}

export async function putRoomApi(id, token, data) {
	return await fetch(`http://10.99.63.125/api/v1/room/edit_room/${id}`, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify(data),
	})
}

export const deleteManyEvent = async (data, token) => {
	return await fetch(`http://10.99.63.125/api/v1/booking/delete_many_booking/`, {
		method: 'DELETE',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify(data),
	})
}
