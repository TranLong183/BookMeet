export function getRRuleValue(value, keyword) {
	const trueValue = value.slice(6).split(';')
	const finalData = trueValue.filter((item) => item.includes(keyword)).join()
	return finalData.slice(finalData.indexOf('=') + 1)
}

export function changedRRule(rRule, newValue, str) {
	return 'RRULE:' + 
	  rRule
	  .slice(6)
	  .split(';')
	  .map(item => item.includes(str) ? `${str}=${newValue}` : item)
	  .join(';')
}

export function convertUTCDateToLocalDate(date) {
	return new Date(date - date.getTimezoneOffset() * 1000 * 60)
}

export function dayConvert(item) {
	 	switch (item) {
			case '2':
				return 'MO'
			case '3':
				return 'TU'
			case '4':
				return 'WE'
			case '5':
				return 'TH'
			case '6':
				return 'FR'
			default: 
				return ''
	}
}

export function formatDay(arr) {
	return arr
		.map((item) => {
			switch (item) {
				case 'MO':
					return 'Monday'
				case 'TU':
					return 'Tuesday'
				case 'WE':
					return 'Wesnesday'
				case 'TH':
					return 'Thirsday'
				case 'FR':
					return 'Friday'
				case 'SA':
					return 'Saturday'
				case 'SU':
					return 'Sunday'
				default:
					return ''
			}
		})
		.join(', ')
}

export function dayValue(arr) {
	return arr.map((item) => {
		switch (item) {
			case 'MO':
				return 1
			case 'TU':
				return 2
			case 'WE':
				return 3
			case 'TH':
				return 4
			case 'FR':
				return 5
			case 'SA':
				return 6
			case 'SU':
				return 0
			default:
				return new Error('not a date value o_O!')
		}
	})
}

export function formatDate(number) {
	return number < 10 ? '0' + number : number
}

export function convertLocalDateToUTCDateStr(date) {
	const monthUTC = formatDate(parseInt(date.getUTCMonth()) + 1) 
	const dateUTC = formatDate(date.getUTCDate())
	const hourUTC = formatDate(date.getUTCHours())
	const minuteUTC = formatDate(date.getUTCMinutes())
	const secondUTC = formatDate(date.getUTCSeconds())
	return `${date.getUTCFullYear()}${monthUTC}${dateUTC}T${hourUTC}${minuteUTC}${secondUTC}Z`
  }

export function formatAMPM(date) {
	const hour = date.getHours()
	const minutes = date.getMinutes()
	const hourAMPM = hour >= 12 ? hour - 12 : hour
	const aMorPM = hour >= 12 ? 'PM' : 'AM'
	return `${formatDate(hourAMPM)}:${formatDate(minutes)} ${aMorPM}`
}

export function convertStringDate(str) {
	return new Date(
		str.slice(0, 4),
		parseInt(str.slice(4, 6)) - 1,
		str.slice(6, 8),
		str.slice(9, 11),
		str.slice(11, 13),
	)
}

export function parseToDate(str) {
	return new Date(Date.parse(str))
}

export function convertIdToLocation(locations, findId) {
	return locations.find(({ id }) => id === findId).text
}

export function listShowing(searchedList, locations) {
	return searchedList.map((l) => {
		const startHourAMPM = formatAMPM(l.startDate)
		const startDate = formatDate(l.startDate.getDate())
		const startMonth = formatDate(l.startDate.getMonth() + 1)
		const startYear = l.startDate.getFullYear()

		const endHourAMPM = formatAMPM(l.endDate)
		const endDate = formatDate(l.endDate.getDate())
		const endMonth = formatDate(l.endDate.getMonth() + 1)
		const endYear = l.endDate.getFullYear()

		if (!l.hasOwnProperty('rRule')) {
			return `- ${
				l.title
			}: from ${startDate}/${startMonth}/${startYear} ${startHourAMPM}  to ${endDate}/${endMonth}/${endYear} ${endHourAMPM} in ${convertIdToLocation(
				locations,
				l.location,
			)} room`
		} else {
			const untilStr = getRRuleValue(l.rRule, 'UNTIL')
			const activeDays = getRRuleValue(l.rRule, 'BYDAY').split(',')
			const endDateUTC = convertStringDate(untilStr)
			const localEndDate = convertUTCDateToLocalDate(endDateUTC)

			const untilYear = formatDate(localEndDate.getFullYear())
			const untilMonth = formatDate(localEndDate.getMonth() + 1)
			const untilDate = formatDate(localEndDate.getDate())

			const formatDays = formatDay(activeDays)

			return `- ${
				l.title
			}: (weekly on ${formatDays} until ${untilDate}/${untilMonth}/${untilYear}) from ${startDate}/${startMonth}/${startYear} ${startHourAMPM}  to ${endDate}/${endMonth}/${endYear} ${endHourAMPM} in ${convertIdToLocation(
				locations,
				l.location,
			)} room`
		}
	})
}
