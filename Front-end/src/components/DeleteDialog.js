import React, {useState, useContext, useEffect} from 'react'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import Checkbox from '@mui/material/Checkbox'
import DialogTitle from '@mui/material/DialogTitle'
import {AppointmentsContext} from '../context/appointments/appointmentsContext'
import FormControlLabel from '@mui/material/FormControlLabel'
import {Box} from '@mui/system'
import {TextField} from '@mui/material'
import LocalizationProvider from '@mui/lab/LocalizationProvider'
import TimePicker from '@mui/lab/TimePicker'
import AdapterDateFns from '@mui/lab/AdapterDateFns'
import DatePicker from '@mui/lab/DatePicker'
import ruLocale from 'date-fns/locale/ru'
import {ResourcesContext} from '../context/resources/resourcesContext'
import {deleteManyEvent} from '../services/fetchDataApi'
import UseCookie from '../context/auth/UseCookie'
import {toast} from 'react-toastify'
import {dayConvert} from '../utils/schedulerFunctions'
const localeMap = {
  ru: ruLocale,
}

export default function DeleteDialog({
  open,
  setOpen,
  handleDeleteEvent,
  appointmentData,
  fetchEventData,
  ...restProps
}) {
  const {data} = useContext(AppointmentsContext)
  const {cookies} = UseCookie()
  const [isDisable, setIsDisable] = useState(true)
  const [timeFrom, setTimeFrom] = useState(new Date())
  const [timeTo, setTimeTo] = useState(new Date(new Date().setDate(timeFrom.getDate() + 7)))
  const {resources, resourcesDispatch} = useContext(ResourcesContext)
  const [group, setGroup] = useState('')
  const [groups, setGroups] = useState([])
  const [byDay, setByDay] = useState({
    MO: '',
    TU: '',
    WE: '',
    TH: '',
    FR: '',
  })

  function checkAll() {
    const {MO, TU, WE, TH, FR} = byDay
    return MO && TU && WE && TH && FR
  }

  const handleClose = () => {
    setOpen(false)
    setIsDisable(true)
  }

  const result = resources[0].instances.find(
    (resources) => resources.id === appointmentData.location,
  )

  function byDaySet(prop) {
    return (e) => {
      setByDay({
        ...byDay,
        [prop]: e.target.checked ? e.target.value : '',
      })
    }
  }

  useEffect(() => {
    const {group_id, title, location, startDate, endDate, email, group} = appointmentData

    const initialGroup =
      groups.length !== 0 && group ? groups?.find((item) => item.value === group)?.label : ''

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
      setTimeTo(endDate)
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
  }, [appointmentData, open, data, groups])

  const handleDelete = async () => {
    const newByDay = Object.entries(byDay)
      .filter((item) => item[1])
      .map((item) => item[1])
      .join('')

    const event = {
      weekly: newByDay,
      from_date: timeFrom.toISOString().slice(0, 10),
      to_date: timeTo.toISOString().slice(0, 10),
      event_id: appointmentData.group_id,
    }

    const res = await deleteManyEvent(event, cookies?.auth?.access_token)
    const message = await res.json()

    if (res.status === 200) {
      toast.success('Delete success!')
      fetchEventData()
      handleClose()
      restProps.onHide()
    } else {
      toast.error(message?.message)
      handleClose()
      restProps.onHide()
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
        <DialogTitle id='alert-dialog-title'>{'Delete booking'}</DialogTitle>
        <DialogContent>
          <Box
            component='form'
            sx={{
              '& .MuiTextField-root': {margin: '.5rem 0 0 0'},
            }}
            noValidate
            autoComplete='off'
          >
            <TextField
              label='Summary'
              fullWidth
              size='small'
              value={appointmentData.title}
              readOnly={true}
            />
            <TextField label='Room' fullWidth size='small' value={result.text} readOnly={true} />
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
                  readOnly={true}
                  value={appointmentData.startDate}
                  renderInput={(params) => (
                    <TextField size='small' sx={{width: '100%'}} {...params} />
                  )}
                />
              </LocalizationProvider>
              <LocalizationProvider dateAdapter={AdapterDateFns} locale={localeMap['ru']}>
                <TimePicker
                  label='Start time'
                  readOnly={true}
                  value={appointmentData.startDate}
                  renderInput={(params) => (
                    <TextField size='small' required sx={{width: '100%'}} {...params} />
                  )}
                />
                <TimePicker
                  label='End time'
                  readOnly={true}
                  value={appointmentData.endDate}
                  renderInput={(params) => (
                    <TextField size='small' required sx={{width: '100%'}} {...params} />
                  )}
                />
              </LocalizationProvider>
            </Box>
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
                    setTimeFrom(newValue)
                  }}
                  readOnly={true}
                  disabled={isDisable}
                  renderInput={(params) => (
                    <TextField size='small' sx={{width: '100%'}} {...params} readOnly={true} />
                  )}
                />
                <DatePicker
                  label='Date'
                  value={timeTo}
                  onChange={(newValue) => {
                    setTimeTo(newValue)
                  }}
                  disabled={isDisable}
                  renderInput={(params) => (
                    <TextField size='small' sx={{width: '100%'}} {...params} disabled={isDisable} />
                  )}
                />
              </LocalizationProvider>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDelete}>DELETE</Button>
          <Button onClick={handleClose}>CLOSE</Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}
