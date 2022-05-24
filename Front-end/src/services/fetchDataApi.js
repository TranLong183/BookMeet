const baseURL = 'http://13.57.33.191/api/v1/'
export const postDataApi = async (url, data, token) => {
	return token
		? await fetch(`${url}`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify(data),
		  })
		: await fetch(`${url}`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(data),
		  })
}
export const getDataApi = async (url, token) => {
	return token
		? await fetch(`${url}`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`,
				},
		  })
		: await fetch(`${url}`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
				},
		  })
}

export const getBookingDataApi = async (time, token) => {
	return await fetch(`/booking/in_time/`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify(time),
	})
}

export const getListRoomApi = async (token) => {
	return await fetch(`/room/`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`,
		},
	})
}

export const getListGroupApi = async (token) => {
	return await fetch(`/groups/listgroup/`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`,
		},
	})
}

export const addEvent = async (data, token) => {
	return await fetch(`/add-event/`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify(data),
	})
}

export const editRepeatFalseEvent = async (token, data, id) => {
	return await fetch(`/booking/update-booking/${id}`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify(data),
	})
}

export const editRepeatTrueEvent = async (token, data, group_id) => {
	return await fetch(`/events/update-event/${group_id}`, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify(data),
	})
}

export const searchEvent = async (data, token) => {
	return await fetch(`/events/Searchevent/`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify(data),
	})
}

export const searchEmptyRoom = async (data, token) => {
	return await fetch(`/booking/empty_room/`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify(data),
	})
}

export const searchRoom = async (data, token) => {
	return await fetch(`/room/search_event_room`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify(data),
	})
}

export const deleteEvent = async (data, token) => {
	return await fetch(`/booking/delete_booking/`, {
		method: 'DELETE',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify(data),
	})
}

export async function deleteEventAPI(token, id) {
	return await fetch(`/events/delete/${id}`, {
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`,
		},
	})
}

export const putDataApi = async (url, data, token) => {
	return await fetch(`${url}`, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify(data),
	})
}

export async function postRoomApi(url, token, data) {
	return await fetch(`/room/${url}/`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify(data),
	})
}

export async function putRoomApi(id, token, data) {
	return await fetch(`/room/edit_room/${id}`, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify(data),
	})
}

export const deleteManyEvent = async (data, token) => {
	return await fetch(`/booking/delete_many_booking/`, {
		method: 'DELETE',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify(data),
	})
}
