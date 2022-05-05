import React, {useState, useEffect, useContext} from 'react'
import {Box, Button, Dialog, DialogActions, DialogContent, DialogTitle} from '@mui/material'
import ruLocale from 'date-fns/locale/ru'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import LocalizationProvider from '@mui/lab/LocalizationProvider'
import TimePicker from '@mui/lab/TimePicker'
import AdapterDateFns from '@mui/lab/AdapterDateFns'
import DatePicker from '@mui/lab/DatePicker'
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
import UseCookie from '../context/auth/UseCookie'
import {ResourcesContext} from '../context/resources/resourcesContext'

import {addEvent} from '../services/fetchDataApi'
import {toast} from 'react-toastify'
import isEmpty from 'validator/lib/isEmpty'

const localeMap = {
  ru: ruLocale,
}

const weekData = [
  {name: 'Mon', index: '2'},
  {name: 'Tue', index: '3'},
  {name: 'Wed', index: '4'},
  {name: 'Thu', index: '5'},
  {name: 'Fri', index: '6'},
]
function AddEvent({open, setOpen, fetchEventData}) {
  const [locale, setLocale] = useState('ru')
  const [title, setTitle] = useState('')
  const [group, setGroup] = useState('')
  const [room, setRoom] = useState('')
  const [date, setDate] = useState(new Date())
  const [startTime, setStartTime] = useState(new Date())
  const [endTime, setEndTime] = useState(
    new Date(new Date().setMinutes(startTime.getMinutes() + 15)),
  )
  const [timeFrom, setTimeFrom] = useState(new Date())
  const [timeTo, setTimeTo] = useState(new Date())
  const {cookies} = UseCookie()
  const [isDisable, setIsDisable] = useState(true)
  const [validationMsg, setValidationMsg] = useState({})
  const [week, setWeek] = useState(weekData)
  const [email, setEmail] = useState('')
  const {resources, resourcesDispatch} = useContext(ResourcesContext)
  const [byDay, setByDay] = useState({
    MO: '',
    TU: '',
    WE: '',
    TH: '',
    FR: '',
  })

  const validateAll = () => {
    const msg = {}
    const mailFormat = /(?=^.{1,50}$)(^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})$)/
    if (isEmpty(title)) {
      msg.title = 'Please input your Sammary!'
    } else if (title.length >= 50) {
      msg.title = 'Summary must be less than 50 characters'
    }
    if (email !== '') {
      if (mailFormat.test(email) === false) {
        msg.email = 'You have entered an invalid email address!'
      }
    }

    if (isEmpty(room)) {
      msg.room = 'Please select your Room!'
    }

    if (startTime.getHours() < 7) {
      msg.endTime = 'Event must be start after 7am!'
    }
    if (endTime.getHours() >= 23) {
      if (endTime.getMinutes() >= 0) {
        msg.endTime = 'Event must be end before 23pm!'
      }
    }
    if (startTime >= endTime) {
      msg.endTime = 'Start time must be less than end time!'
    } else if (endTime.getTime() - startTime.getTime() < 900000) {
      msg.endTime = 'End time must be more than start time at least 15 minutes '
    }
    if (!date) {
      msg.date = 'Empty your date!'
    }
    const x = new Date(timeFrom).getTime()
    const y = new Date(timeTo).getTime()
    if (isDisable === false && x >= y) {
      msg.edate = 'From date must be less than to date!'
    }
    setValidationMsg(msg)
    if (Object.keys(msg).length > 0) return false
    return true
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

  const handleClose = () => {
    setOpen(false)
    setTitle('')
    setRoom('')
    setGroup('')
    setIsDisable(true)
    setEndTime(new Date(new Date().setMinutes(startTime.getMinutes() + 15)))
    setStartTime(new Date())
    setTimeFrom(new Date())
    setTimeTo(new Date())
    setEmail('')
    setByDay({
      MO: '',
      TU: '',
      WE: '',
      TH: '',
      FR: '',
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const isValid = validateAll()
    if (!isValid) {
      return
    } else {
      const dateFormat = new Date(date)
      const eventDate = dateFormat.toISOString().slice(0, 10)
      const start_time = startTime.toISOString().slice(11, 19)
      const end_time = endTime.toISOString().slice(11, 19)
      const time_from = timeFrom.toISOString().slice(0, 10)
      const time_to = timeTo.toISOString().slice(0, 10)
      const newByDay = Object.entries(byDay)
        .filter((item) => item[1])
        .map((item) => item[1])
        .join('')
      let addEventForm = {}

      if (isDisable) {
        addEventForm = {
          title: title,
          ...(email ? {email: email} : null),
          ...(group ? {group: group} : null),
          room: room,
          start_time: start_time,
          end_time: end_time,
          date: eventDate,
          repeat: 'False',
        }
      } else {
        addEventForm = {
          title: title,
          ...(email ? {email: email} : null),
          ...(group ? {group: group} : null),
          room: room,
          start_time: start_time,
          end_time: end_time,
          date: eventDate,
          repeat: 'True',
          weekly: newByDay,
          from_date: time_from,
          to_date: time_to,
        }
      }

      try {
        const res = await addEvent(addEventForm, cookies?.auth?.access_token)
        const message = await res.json()

        if (res.status >= 200 && res.status <= 299) {
          toast.success('Success!')
          handleClose()
          fetchEventData()
        } else if (res.status === 401) {
          toast.error('Un authorize user')
          handleClose()
        } else {
          toast.error(message?.error?.message)
          handleClose()
        }
        handleClose()
      } catch (err) {
        toast.error(err)
      }
    }
  }

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
        fullWidth={true}
        maxWidth={'md'}
      >
        <DialogTitle id='alert-dialog-title'>{'Add Event'}</DialogTitle>
        <DialogContent>
          <Box
            component='form'
            sx={{
              '& .MuiTextField-root': {margin: '.5rem 0 0 0'},
            }}
            noValidate
            autoComplete='off'
            onSubmit={handleSubmit}
          >
            <TextField
              required
              label='Summary'
              fullWidth
              size='small'
              value={title}
              onChange={(e) => {
                setTitle(e.target.value)
              }}
            />
            <p style={{color: 'red', fontSize: '12px', marginLeft: '40px'}}>
              {validationMsg.title}
            </p>
            <TextField
              label='Email'
              fullWidth
              size='small'
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
              }}
            />
            <p style={{color: 'red', fontSize: '12px', marginLeft: '40px'}}>
              {validationMsg.email}
            </p>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
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
                {resources[1].instances.map((option) => (
                  <MenuItem key={option.id} value={option.text}>
                    {option.text}
                  </MenuItem>
                ))}
              </TextField>

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
                {resources[0].instances.map((option) => (
                  <MenuItem key={option.id} value={option.text}>
                    {option.text != 'complete' ? option.text : null}
                  </MenuItem>
                ))}
              </TextField>
            </Box>
            <p
              style={{
                color: 'red',
                fontSize: '12px',
                textAlign: 'end',
                paddingRight: '1rem',
              }}
            >
              {validationMsg.room}
            </p>

            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: '100%',
                gap: '1rem',
              }}
            >
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label='Date'
                  value={date}
                  disabled={!isDisable}
                  onChange={(newValue) => {
                    if (newValue instanceof Date && !isNaN(newValue)) {
                      setDate(newValue.setHours(new Date().getHours()))
                    }
                  }}
                  renderInput={(params) => (
                    <TextField
                      size='small'
                      sx={{width: '100%'}}
                      {...params}
                      disabled={!isDisable}
                    />
                  )}
                />
              </LocalizationProvider>
              <LocalizationProvider dateAdapter={AdapterDateFns} locale={localeMap[locale]}>
                <TimePicker
                  value={startTime}
                  label='Start time'
                  onChange={(newValue) => {
                    if (newValue instanceof Date && !isNaN(newValue)) {
                      setStartTime(newValue)
                    }
                  }}
                  renderInput={(params) => (
                    <TextField
                      size='small'
                      required
                      sx={{width: '100%'}}
                      {...params}
                      readOnly={true}
                    />
                  )}
                />
                <TimePicker
                  value={endTime}
                  label='End time'
                  onChange={(newValue) => {
                    if (newValue instanceof Date && !isNaN(newValue)) {
                      setEndTime(newValue)
                    }
                  }}
                  renderInput={(params) => (
                    <TextField
                      size='small'
                      required
                      sx={{width: '100%'}}
                      {...params}
                      readOnly={true}
                    />
                  )}
                />
              </LocalizationProvider>
            </Box>

            <span style={{color: 'red', fontSize: '12px', marginLeft: '40px'}}>
              {validationMsg.endTime}
            </span>
            <span style={{color: 'red', fontSize: '12px', marginLeft: '40px'}}>
              {validationMsg.date}
            </span>
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
                    onChange={(e) => {
                      if (e.target.checked === true) {
                        setIsDisable(false)
                      } else {
                        setIsDisable(true)
                      }
                    }}
                  />
                }
                labelPlacement='start'
                label='Repeat'
              />
            </Box>
            <Box>
              <FormControlLabel
                control={
                  <Checkbox
                    disabled={isDisable}
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
                control={
                  <Checkbox
                    disabled={isDisable}
                    value='2'
                    checked={byDay.MO}
                    onChange={byDaySet('MO')}
                  />
                }
                labelPlacement='start'
                label='Mon'
              />
              <FormControlLabel
                control={
                  <Checkbox
                    disabled={isDisable}
                    value='3'
                    checked={byDay.TU}
                    onChange={byDaySet('TU')}
                  />
                }
                labelPlacement='start'
                label='Tue'
              />
              <FormControlLabel
                control={
                  <Checkbox
                    disabled={isDisable}
                    value='4'
                    checked={byDay.WE}
                    onChange={byDaySet('WE')}
                  />
                }
                labelPlacement='start'
                label='Wed'
              />
              <FormControlLabel
                control={
                  <Checkbox
                    disabled={isDisable}
                    value='5'
                    checked={byDay.TH}
                    onChange={byDaySet('TH')}
                  />
                }
                labelPlacement='start'
                label='Thu'
              />
              <FormControlLabel
                control={
                  <Checkbox
                    disabled={isDisable}
                    value='6'
                    checked={byDay.FR}
                    onChange={byDaySet('FR')}
                  />
                }
                labelPlacement='start'
                label='Fri'
              />
            </Box>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: '100%',
                gap: '1rem',
              }}
            >
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label='Date'
                  value={timeFrom}
                  onChange={(newValue) => {
                    if (newValue instanceof Date && !isNaN(newValue)) {
                      setTimeFrom(newValue)
                    }
                  }}
                  disabled={isDisable}
                  renderInput={(params) => (
                    <TextField
                      size='small'
                      sx={{width: '100%'}}
                      {...params}
                      disabled={isDisable}
                      readOnly={true}
                    />
                  )}
                />
                <DatePicker
                  label='Date'
                  value={timeTo}
                  onChange={(newValue) => {
                    if (newValue instanceof Date && !isNaN(newValue)) {
                      setTimeTo(newValue)
                    }
                  }}
                  disabled={isDisable}
                  renderInput={(params) => (
                    <TextField
                      size='small'
                      sx={{width: '100%'}}
                      {...params}
                      disabled={isDisable}
                      readOnly={true}
                    />
                  )}
                />
              </LocalizationProvider>
            </Box>
            <span style={{color: 'red', fontSize: '12px', marginLeft: '40px'}}>
              {validationMsg.edate}
            </span>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSubmit}>ADD</Button>
          <Button onClick={handleClose}>CLOSE</Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default AddEvent
