import React, {useState, useEffect, useContext} from 'react'
import {Box, Button, Dialog, DialogActions, DialogContent, DialogTitle} from '@mui/material'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import LocalizationProvider from '@mui/lab/LocalizationProvider'
import TimePicker from '@mui/lab/TimePicker'
import AdapterDateFns from '@mui/lab/AdapterDateFns'
import DatePicker from '@mui/lab/DatePicker'
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
import {AppointmentsContext} from '../context/appointments/appointmentsContext'
import {editRepeatFalseEvent, editRepeatTrueEvent, getDataApi} from '../services/fetchDataApi'
import Collapse from '@mui/material/Collapse'
import UseCookie from '../context/auth/UseCookie'
import {formatDate, dayConvert} from '../utils/schedulerFunctions'
import {toast} from 'react-toastify'
import {ResourcesContext} from '../context/resources/resourcesContext'

export default function EditEvent({open, setOpen, appointment, locations, fetchEventData}) {
  const {data} = useContext(AppointmentsContext)

  const {resources} = useContext(ResourcesContext)
  const [title, setTitle] = useState('')
  const [room, setRoom] = useState('')
  const [group, setGroup] = useState('')
  const [date, setDate] = useState(new Date())
  const [startTime, setStartTime] = useState(new Date())
  const [endTime, setEndTime] = useState(new Date())
  const [timeFrom, setTimeFrom] = useState(new Date())
  const [timeTo, setTimeTo] = useState(new Date())
  const [isDisable, setIsDisable] = useState(false)
  const [validateMsg, setValidateMsg] = useState({})
  const {cookies} = UseCookie()
  const [byDay, setByDay] = useState({
    MO: '',
    TU: '',
    WE: '',
    TH: '',
    FR: '',
  })

  const groups = resources[1].instances
  useEffect(() => {
    const {group_id, title, location, startDate, endDate, group} = appointment
    setTitle(title)
    setRoom(location)
    setDate(startDate)
    setStartTime(startDate)
    setEndTime(endDate)
    setValidateMsg({})
    const initialGroup =
      groups.length !== 0 && group ? groups?.find((item) => item.id === group)?.text : ''

    setGroup(initialGroup)

    const repeatEvent = data.filter((item) => item.group_id === group_id)
    if (repeatEvent.length > 1) {
      setIsDisable(true)
      const daysRepeat = repeatEvent.map((item) => new Date(item.startDate).getDay() + 1)
      const uniqueDaysRepeat = new Set()
      daysRepeat.forEach((item) => {
        if (!uniqueDaysRepeat.has(item)) {
          uniqueDaysRepeat.add(item)
        }
      })
      const uniqueArray = Array.from(uniqueDaysRepeat)
      uniqueArray.forEach((item) => {
        setByDay((state) => {
          return {
            ...state,
            [dayConvert(item.toString())]: item.toString(),
          }
        })
      })
      const dateWeekly = repeatEvent.reduce(
        (obj, current) => {
          const result = {
            end: obj.end,
            start: obj.start,
          }
          if (new Date(current.startDate) > new Date(obj.end)) {
            result.end = current.startDate
          }
          if (new Date(current.startDate) < new Date(obj.start)) {
            result.start = current.startDate
          }
          return result
        },
        {
          end: '0',
          start: startDate,
        },
      )
      setTimeTo(new Date(dateWeekly.end))
      setTimeFrom(new Date(dateWeekly.start))
    } else {
      setIsDisable(false)
      setTimeTo(startDate)
      setTimeFrom(startDate)
    }
    if (open === false) {
      setByDay({
        MO: '',
        TU: '',
        WE: '',
        TH: '',
        FR: '',
      })
      setGroup('')
    }
  }, [appointment, open, data, groups])

  const handleClose = () => {
    setOpen(false)
  }

  const validateAll = () => {
    const {MO, TU, WE, TH, FR} = byDay
    const errorMsg = {}
    if (!MO && !TU && !WE && !TH && !FR && isDisable) {
      errorMsg.byDay = 'Please select at least a day'
    }
    if (startTime.getHours() < 7) {
      errorMsg.duration = 'Event must be start after 7h!'
    }
    if (endTime.getHours() >= 23) {
      if (endTime.getMinutes() >= 0) {
        errorMsg.duration = 'Event must be end before 23h!'
      }
    }
    if ((date.getDay() === 6 || date.getDay() === 0) && !isDisable) {
      errorMsg.duration = 'Cant change to weekend '
    }
    const endHours = new Date(
      startTime.getFullYear(),
      startTime.getMonth(),
      startTime.getDate(),
      endTime.getHours(),
      endTime.getMinutes(),
      endTime.getSeconds(),
    )
    if (endHours.getTime() - startTime.getTime() < 15 * 60 * 1000) {
      errorMsg.duration = 'End time must be more than start time at least 15 minutes'
    }
    const timeFromSetHours = new Date(
      timeFrom.getFullYear(),
      timeFrom.getMonth(),
      timeFrom.getDate(),
      0,
      0,
      0,
    )
    const timeToSetHours = new Date(
      timeTo.getFullYear(),
      timeTo.getMonth(),
      timeTo.getDate(),
      0,
      0,
      0,
    )

    if (timeToSetHours.getTime() - timeFromSetHours.getTime() < 24 * 60 * 1000 && isDisable) {
      errorMsg.weeklyDuration = 'End time must be more than start time'
    }
    setValidateMsg(errorMsg)
    if (Object.keys(errorMsg).length > 0) {
      return false
    }
    return true
  }
  async function handleChangeSubmit(e) {
    e.preventDefault()
    const bool = validateAll()
    if (!bool) return
    const limited = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      startTime.getHours(),
      startTime.getMinutes(),
    )
    const timeFromNow = new Date(
      timeFrom.getFullYear(),
      timeFrom.getMonth(),
      timeFrom.getDate(),
      startTime.getHours(),
      startTime.getMinutes(),
    )

    if (limited.getTime() < Date.now() || (isDisable && timeFromNow.getTime() < Date.now())) {
      toast.error('Event must be in future time')
      return
    }
    const {id, group_id} = appointment
    const newByDay = Object.entries(byDay)
      .filter((item) => item[1])
      .map((item) => item[1])
      .join('')
    const realDate = endTime.getHours() < 7 ? new Date(date.getTime() - 86400000) : date
    const data = {
      date: `${realDate.getFullYear()}-${formatDate(realDate.getMonth() + 1)}-${formatDate(
        realDate.getDate(),
      )}`,
      room,
      time_to: `${endTime?.toISOString()?.slice(11, 19)}`,
      time_from: `${startTime?.toISOString()?.slice(11, 19)}`,
    }
    if (group) {
      data.group = group
    }
    const location = locations?.find((location) => location.id === room)?.text
    if (!isDisable) {
      try {
        const res = await editRepeatFalseEvent(cookies?.auth?.access_token, data, id)
        const event = await res.json()
        if (res.status >= 200 && res.status <= 299) {
          fetchEventData()
          toast.success('Edit successfully')
          setOpen(false)
        } else {
          toast.error(event?.error?.message)
        }
      } catch {
        toast.error('Network error')
      }
    } else {
      const data = {
        title,
        room: location,
        start_time: `${startTime?.toISOString()?.slice(11, 16)}`,
        end_time: `${endTime?.toISOString()?.slice(11, 16)}`,
        date: `${realDate.getFullYear()}-${formatDate(realDate.getMonth() + 1)}-${formatDate(
          realDate.getDate(),
        )}`,
        repeat: isDisable.toString(),
        weekly: newByDay,
        from_date: `${timeFrom.getFullYear()}-${formatDate(timeFrom.getMonth() + 1)}-${formatDate(
          timeFrom.getDate(),
        )}`,
        to_date: `${timeTo.getFullYear()}-${formatDate(timeTo.getMonth() + 1)}-${formatDate(
          timeTo.getDate(),
        )}`,
      }
      if (group) {
        data.group = group
      }

      try {
        const res = await editRepeatTrueEvent(cookies?.auth?.access_token, data, group_id)
        const event = await res.json()
        if (res.status >= 200 && res.status <= 299) {
          fetchEventData()
          toast.success('edit successfully')
          setOpen(false)
        } else {
          toast.error(event?.error?.message)
        }
      } catch {
        toast.error('Network error')
      }
    }
  }

  function checkAll() {
    const {MO, TU, WE, TH, FR} = byDay
    return MO && TU && WE && TH && FR
  }

  function byDaySet(prop) {
    return (e) => {
      setByDay({
        ...byDay,
        [prop]: e.target.checked ? e.target.value : '',
      })
    }
  }
  function errorFocus(prop) {
    return () => {
      setValidateMsg({
        ...validateMsg,
        [prop]: '',
      })
    }
  }
  function ok() {
    return (
      <>
        <Box onFocus={errorFocus('byDay')}>
          <FormControlLabel
            control={
              <Checkbox
                checked={checkAll()}
                onChange={(e) => {
                  const checked = e.target.checked
                  setByDay({
                    MO: checked ? '2' : '',
                    TU: checked ? '3' : '',
                    WE: checked ? '4' : '',
                    TH: checked ? '5' : '',
                    FR: checked ? '6' : '',
                  })
                }}
              />
            }
            labelPlacement='start'
            label='All'
          />
          <FormControlLabel
            control={<Checkbox value='2' checked={byDay.MO} onChange={byDaySet('MO')} />}
            labelPlacement='start'
            label='Mon'
          />
          <FormControlLabel
            control={<Checkbox value='3' checked={byDay.TU} onChange={byDaySet('TU')} />}
            labelPlacement='start'
            label='Tue'
          />
          <FormControlLabel
            control={<Checkbox value='4' checked={byDay.WE} onChange={byDaySet('WE')} />}
            labelPlacement='start'
            label='Wed'
          />
          <FormControlLabel
            control={<Checkbox value='5' checked={byDay.TH} onChange={byDaySet('TH')} />}
            labelPlacement='start'
            label='Thu'
          />
          <FormControlLabel
            control={<Checkbox value='6' checked={byDay.FR} onChange={byDaySet('FR')} />}
            labelPlacement='start'
            label='Fri'
          />
          <p style={{color: 'red'}}>{validateMsg.byDay}</p>
        </Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
            gap: '1rem',
          }}
          onClick={errorFocus('weeklyDuration')}
        >
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label='Date'
              value={timeFrom}
              onChange={(newValue) => {
                setTimeFrom(newValue)
              }}
              renderInput={(params) => <TextField size='small' sx={{width: '100%'}} {...params} />}
            />
            <DatePicker
              label='Date'
              value={timeTo}
              onChange={(newValue) => {
                setTimeTo(newValue)
              }}
              renderInput={(params) => <TextField size='small' sx={{width: '100%'}} {...params} />}
            />
          </LocalizationProvider>
        </Box>
        <p style={{color: 'red'}}>{validateMsg.weeklyDuration}</p>
      </>
    )
  }
  return (
    <div>
      {/* <RecurrenceDialog 
				isRecurrence={isRecurrence}
				setIsRecurrence={setIsRecurrence}
				editAll={editAll}
				setEditAll={setEditAll}
				handleRecurrenceChangeSubmit={handleRecurrenceChangeSubmit(appointment, title, room, date, startTime, endTime, email)}
				/> */}
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
        fullWidth={true}
        maxWidth={'md'}
      >
        <DialogTitle id='alert-dialog-title'>{'Edit Event'}</DialogTitle>
        <DialogContent>
          <Box
            component='form'
            sx={{
              '& .MuiTextField-root': {margin: '.5rem 0 .5rem 0'},
            }}
            noValidate
            autoComplete='off'
            onSubmit={handleChangeSubmit}
          >
            <div>
              <TextField
                required
                label='Summary'
                fullWidth
                size='small'
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value)
                }}
                disabled
                onFocus={() =>
                  setValidateMsg({
                    ...validateMsg,
                    title: '',
                  })
                }
              />
              {<p style={{color: 'red'}}>{validateMsg.title}</p>}
            </div>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                width: '100%',
                gap: '1rem',
              }}
            >
              <TextField
                select
                value={group}
                onChange={(e) => {
                  setGroup(e.target.value)
                }}
                label='Group'
                size='small'
                sx={{width: '100%'}}
              >
                {groups.map((option) => (
                  <MenuItem key={option?.id} value={option?.text}>
                    {option?.text}
                  </MenuItem>
                ))}
              </TextField>
              <div style={{width: '100%'}}>
                <TextField
                  select
                  value={room}
                  onChange={(e) => {
                    setRoom(e.target.value)
                  }}
                  label='Room'
                  size='small'
                  sx={{width: '100%'}}
                  required
                >
                  {locations
                    .filter((item) => item.id !== 'complete')
                    .map((option) => (
                      <MenuItem key={option.id} value={option.id}>
                        {option.text}
                      </MenuItem>
                    ))}
                </TextField>
              </div>
            </Box>
            {<p style={{color: 'red'}}>{validateMsg.room}</p>}
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <Box sx={{marginBottom: '2rem'}} onClick={errorFocus('duration')}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    width: '100%',
                    gap: '1rem',
                  }}
                >
                  <DatePicker
                    label='Date'
                    value={date}
                    onChange={(newValue) => {
                      setDate(newValue)
                    }}
                    renderInput={(params) => (
                      <TextField size='small' sx={{width: '100%'}} {...params} />
                    )}
                  />

                  <TimePicker
                    ampm={false}
                    value={startTime}
                    label='Start time'
                    openTo='hours'
                    views={['hours', 'minutes']}
                    inputFormat='HH:mm'
                    onChange={(newValue) => {
                      setStartTime(newValue)
                    }}
                    renderInput={(params) => (
                      <TextField size='small' required sx={{width: '100%'}} {...params} />
                    )}
                  />
                  <TimePicker
                    ampm={false}
                    openTo='hours'
                    views={['hours', 'minutes']}
                    inputFormat='HH:mm'
                    value={endTime}
                    label='End time'
                    onChange={(newValue) => setEndTime(newValue)}
                    renderInput={(params) => (
                      <TextField size='small' required sx={{width: '100%'}} {...params} />
                    )}
                  />
                </Box>
                <p style={{color: 'red'}}>{validateMsg.duration}</p>
              </Box>
            </LocalizationProvider>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'flex-start',
                width: '40vw',
                flexShrink: '0',
              }}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    checked={isDisable}
                    onChange={(e) => setIsDisable(e.target.checked)}
                    onClick={() =>
                      setValidateMsg({
                        ...validateMsg,
                        weeklyDuration: '',
                        byDay: '',
                      })
                    }
                  />
                }
                labelPlacement='start'
                label='Repeat'
              />
            </Box>
            <Collapse in={isDisable}>{ok()}</Collapse>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleChangeSubmit}>EDIT</Button>
          <Button onClick={handleClose}>CLOSE</Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}
