const baseURL = 'http://127.0.0.1:8000/'
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
	return await fetch(`${baseURL}booking/in_time/`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify(time),
	})
}

export const getListRoomApi = async (token) => {
	return await fetch(`${baseURL}room/`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`,
		},
	})
}

export const getListGroupApi = async (token) => {
	return await fetch(`${baseURL}groups/listgroup/`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`,
		},
	})
}

export const addEvent = async (data, token) => {
	return await fetch(`${baseURL}add-event/`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify(data),
	})
}

export const editRepeatFalseEvent = async (token, data, id) => {
	return await fetch(`${baseURL}booking/update-booking/${id}`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify(data),
	})
}

export const editRepeatTrueEvent = async (token, data, group_id) => {
	return await fetch(`${baseURL}events/update-event/${group_id}`, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify(data),
	})
}

export const searchEvent = async (data, token) => {
	return await fetch(`${baseURL}events/Searchevent/`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify(data),
	})
}

export const searchEmptyRoom = async (data, token) => {
	return await fetch(`${baseURL}booking/empty_room/`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify(data),
	})
}

export const searchRoom = async (data, token) => {
	return await fetch(`${baseURL}room/search_event_room`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify(data),
	})
}

export const deleteEvent = async (data, token) => {
	return await fetch(`${baseURL}booking/delete_booking/`, {
		method: 'DELETE',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify(data),
	})
}

export async function deleteEventAPI(token, id) {
	return await fetch(`${baseURL}events/delete/${id}`, {
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
	return await fetch(`${baseURL}room/${url}/`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify(data),
	})
}

export async function putRoomApi(id, token, data) {
	return await fetch(`${baseURL}room/edit_room/${id}`, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify(data),
	})
}

export const deleteManyEvent = async (data, token) => {
	return await fetch(`${baseURL}booking/delete_many_booking/`, {
		method: 'DELETE',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify(data),
	})
}
