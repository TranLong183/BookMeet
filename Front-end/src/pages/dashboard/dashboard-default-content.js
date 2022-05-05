import {EditingState, ViewState} from '@devexpress/dx-react-scheduler'
import * as React from 'react'
import {
  Scheduler,
  WeekView,
  MonthView,
  Appointments,
  Toolbar,
  ViewSwitcher,
  EditRecurrenceMenu,
  DayView,
  DateNavigator,
  TodayButton,
  Resources,
  AppointmentForm,
  AppointmentTooltip,
  DragDropProvider,
} from '@devexpress/dx-react-scheduler-material-ui'
import {Button, Divider, Paper} from '@material-ui/core'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import DoubleArrowIcon from '@mui/icons-material/DoubleArrow'
import FormDate from '../../components/FormDate'
import FormSearch from '../../components/FormSearch'
import {AppointmentsContext} from '../../context/appointments/appointmentsContext'
import {ResourcesContext} from '../../context/resources/resourcesContext'
import {useContext, useState, useEffect} from 'react'
import {createStyles, makeStyles, styled} from '@material-ui/core/styles'
import {
  getBookingDataApi,
  deleteEventAPI,
  deleteEvent,
  editRepeatFalseEvent,
} from '../../services/fetchDataApi'
import UseCookie from '../../context/auth/UseCookie'
import {toast} from 'react-toastify'
import AddEvent from '../../components/AddEvent'
import IconButton from '@mui/material/IconButton'
import EditEvent from '../../components/EditEvent'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import DeleteDialog from '../../components/DeleteDialog'
import RemoveDoneIcon from '@mui/icons-material/RemoveDone'
import {formatDate} from '../../utils/schedulerFunctions'
const PREFIX = 'Demo'
const classes = {
  addButton: `${PREFIX}-addButton`,
}

const StyledIconButton = styled(IconButton)(() => ({
  [`&.${classes.commandButton}`]: {
    backgroundColor: 'rgba(255,255,255,0.65)',
  },
}))

function showMonthData(date) {
  const firstDateOfMonth = date.setDate(1)
  const firstDate = new Date(firstDateOfMonth).setHours(0, 0, 0, 0)
  const realDate = new Date(firstDate).getDay() === 0 ? 7 : new Date(firstDate).getDay()
  const time_from = new Date(firstDate - (realDate - 1) * 24 * 60 * 60 * 1000)
  const time_to = new Date(time_from.getTime() + 42 * 24 * 60 * 60 * 1000).toISOString()
  return {
    time_from: time_from.toISOString(),
    time_to,
  }
}

export default function DashboardDefaultContent() {
  const classes = useStyles()
  const [roomType, setRoomType] = useState(0)
  const [currentViewName, setCurrentViewName] = useState('work-week')
  const [date, setDate] = useState(new Date())
  const {cookies} = UseCookie()
  const [addedAppointment, setAddedAppointment] = useState({})
  const [appointmentChanges, setAppointmentChanges] = useState({})
  const [editingAppointment, setEditingAppointment] = useState(undefined)
  const [open, setOpen] = useState(false)
  const [openEvent, setOpenEvent] = useState(false)
  const [openDelete, setOpenDelete] = useState(false)
  const {resources} = useContext(ResourcesContext)
  const {data, dataDispatch} = useContext(AppointmentsContext)
  const [weekTime, setWeekTime] = useState(showMonthData(new Date()))
  const [appoint, setAppoint] = useState({})
  const [result, setResult] = useState()
  //set data receive from api
  const [addedEvent, setAddedEvent] = useState({
    title: '',
    room: '',
    group: '',
    start_time: '',
    end_time: '',
    date: '',
    repeat: '',
    weekly: '',
    from_date: '',
    to_date: '',
  })
  // room booking info, showing on console when adding a room

  const realData = roomType === 0 ? data : data.filter((d) => d.location.includes(roomType))

  const handleDeleteEvent = async (appointment) => {
    const data = {
      event_id: appointment.group_id,
      booking_id: appointment.id,
    }
    try {
      const res = await deleteEvent(data, cookies?.auth?.access_token)
      const message = await res.json()

      if (res.status === 200) {
        toast.success('Delete success!')
        fetchEventData()
      } else {
        toast.error(message?.message)
      }
    } catch (err) {
      toast.error(err)
    }
  }

  const Header = ({appointmentData, showCloseButton, ...restProps}) => {
    const {startDate} = appointmentData
    return (
      <AppointmentTooltip.Header {...restProps} showCloseButton appointmentData={appointmentData}>
        <DeleteDialog
          open={openDelete}
          setOpen={setOpenDelete}
          handleDeleteEvent={handleDeleteEvent}
          appointmentData={appointmentData}
          fetchEventData={fetchEventData}
          {...restProps}
        />
        {startDate.getTime() >= Date.now() && (
          <StyledIconButton
            onClick={() => {
              setAppoint(appointmentData)
              restProps.onHide()
              setOpen(true)
            }}
            size='large'
          >
            <EditIcon />
          </StyledIconButton>
        )}
        {startDate.getTime() >= Date.now() && (
          <StyledIconButton
            onClick={() => {
              restProps.onHide()
              handleDeleteEvent(appointmentData)
            }}
            size='large'
          >
            <DeleteIcon />
          </StyledIconButton>
        )}
        {startDate.getTime() >= Date.now() && (
          <StyledIconButton
            onClick={() => {
              setOpenDelete(true)
            }}
            size='large'
          >
            <RemoveDoneIcon />
          </StyledIconButton>
        )}
      </AppointmentTooltip.Header>
    )
  }

  const TimeTableCell = React.useCallback(
    React.memo(({onDoubleClick, ...restProps}) => (
      <WeekView.TimeTableCell {...restProps} onDoubleClick={undefined} />
    )),
    [],
  )

  function chooseRoom(number) {
    setRoomType(number)
  }

  function changeAddedAppointment(addedAppointment) {
    setAddedAppointment(addedAppointment)
  }

  function changeAppointmentChanges(appointmentChanges) {
    setAppointmentChanges(appointmentChanges)
  }

  function changeEditingAppointment(editingAppointment) {
    setEditingAppointment(editingAppointment)
  }

  function currentViewNameChange(currentViewName) {
    setCurrentViewName(currentViewName)
  }

  function currentDateChange(currentDate) {
    setDate(currentDate)
    setWeekTime(showMonthData(new Date(currentDate)))
  }

  async function commitChanges({added, changed, deleted}) {
    if (added) {
      dataDispatch({
        type: 'ADDED',
        added,
      })
    }
    if (changed) {
      const id = Object.keys(changed)
      const startDate =
        changed[id].startDate.getTime() < changed[id].endDate.getTime()
          ? changed[id].startDate
          : changed[id].endDate
      const endDate =
        changed[id].endDate.getTime() > changed[id].startDate.getTime()
          ? changed[id].endDate
          : changed[id].startDate

      const booking = data.find((item) => item.id === id[0])
      const timeFrom = booking.startDate
      const timeTo = booking.endDate
      const realDate = endDate.getHours() < 7 ? new Date(endDate.getTime() - 86400000) : endDate
      const startDateNow = new Date(
        startDate.setHours(timeFrom.getHours(), timeFrom.getMinutes(), timeFrom.getSeconds()),
      )
      const isWeekend = startDateNow.getDay()

      if (startDateNow.getTime() < Date.now()) {
        toast.error('Cant mark as completed')
        return
      }
      if (timeFrom.getTime() < Date.now()) {
        toast.error('Cant edit completed event')
        return
      }
      if (isWeekend === 0 || isWeekend === 6) {
        toast.error('Cant change to weekend')
        return
      }
      if (
        endDate.getTime() - startDate.getTime() < 15 * 60 * 1000 &&
        endDate.getTime() - startDate.getTime() >= 0
      ) {
        toast.error('End time must be more than start time at least 15 minutes')
        return
      }
      if (
        endDate.getTime() < startDate.getTime() &&
        startDate.getTime() - endDate.getTime() < 15 * 60 * 1000
      ) {
        toast.error('End time must be more than start time at least 15 minutes')
        return
      }

      const event = {
        room: booking.location,
      }
      if (currentViewName !== 'Month') {
        event.date = `${realDate.getFullYear()}-${formatDate(realDate.getMonth() + 1)}-${formatDate(
          realDate.getDate(),
        )}`
        event.time_to = `${
          endDate.getTime() > startDate.getTime()
            ? endDate?.toISOString()?.slice(11, 19)
            : startDate?.toISOString()?.slice(11, 19)
        }`
        event.time_from = `${
          endDate.getTime() > startDate.getTime()
            ? startDate?.toISOString()?.slice(11, 19)
            : endDate?.toISOString()?.slice(11, 19)
        }`
      } else {
        const realDate =
          timeTo.getHours() < 7 ? new Date(startDate.getTime() - 86400000) : startDate
        event.date = `${realDate.getFullYear()}-${formatDate(realDate.getMonth() + 1)}-${formatDate(
          realDate.getDate(),
        )}`
        event.time_to = `${timeTo?.toISOString()?.slice(11, 19)}`
        event.time_from = `${timeFrom?.toISOString()?.slice(11, 19)}`
      }

      try {
        const res = await editRepeatFalseEvent(cookies?.auth?.access_token, event, id[0])
        if (res.status >= 200 && res.status <= 299) {
          dataDispatch({
            type: 'CHANGED',
            changed,
          })
          fetchEventData()
        } else if (res.status === 400) {
          const event = await res.json()
          toast.error(event?.error?.message)
        } else if (res.status === 500) {
          toast.error('Internal server error')
        }
      } catch {
        toast.error('Network error')
      }
    }
    if (deleted !== undefined) {
      try {
        const res = await deleteEventAPI(deleted, cookies?.auth?.access_token)
        const event = await res.json()

        if (event.success) {
          dataDispatch({
            type: 'DELETED',
            deleted,
          })
        }
      } catch {
        toast.error('Internal server error')
      }
    }
  }

  const fetchEventData = async () => {
    try {
      const res = await getBookingDataApi(weekTime, cookies?.auth?.access_token)
      const event = await res.json()

      const mapData = await event.data.map((event) => ({
        title: event.event.title,
        startDate: new Date(event.time_from),
        endDate: new Date(event.time_to),
        location: event.status === '1' ? 'complete' : event.room.id,
        room: event.room.name,
        id: event.id,
        group_id: event.event.id,
        group: event.event.group,
      }))

      if (mapData !== data && res.status === 200) {
        dataDispatch({
          type: 'INIT',
          data: mapData,
        })
      }
    } catch (err) {
      toast.error(data?.messages[0].message)
    }
  }

  useEffect(() => {
    if (resources[0].instances.length !== 0) {
      fetchEventData()
    }
  }, [weekTime, resources])

  return (
    <Paper style={{display: 'flex', marginTop: '1rem', padding: '1rem'}}>
      <div className={classes.root}>
        <Box
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '0 1rem 1rem 0',
            width: '100%',
          }}
        >
          <EditEvent
            open={open}
            setOpen={setOpen}
            appointment={appoint}
            locations={resources[0].instances}
            fetchEventData={fetchEventData}
          />

          <FormDate data={data} locations={resources[0].instances} setDate={setDate} />
          <FormSearch data={data} setDate={setDate} setCurrentViewName={setCurrentViewName} />
        </Box>
        <Divider />
        <Box style={{display: 'flex'}}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              margin: '.9rem 1rem 0 0 ',
            }}
          >
            <Button
              variant='contained'
              onClick={() => setOpenEvent(true)}
              style={{
                background: 'rgb(25 118 210)',
                color: '#fff',
                marginBottom: '4.5rem',
              }}
            >
              Add
            </Button>
            <AddEvent open={openEvent} setOpen={setOpenEvent} fetchEventData={fetchEventData} />
            <Button
              startIcon={<DoubleArrowIcon />}
              size='small'
              variant='contained'
              onClick={() => chooseRoom(0)}
              style={{width: '100%', marginBottom: '1rem'}}
            >
              All
            </Button>
            <Stack spacing={1} className={classes.stack}>
              {resources[0].instances.map((item) => (
                <Button
                  key={item.id}
                  size='small'
                  variant='contained'
                  style={{
                    display: item.text === 'complete' ? 'none' : '',
                    background: item.color,
                    color: '#fff',
                    opacity: roomType === item.id ? '0.6' : '',
                  }}
                  onClick={() => {
                    const result = data.find((data) => data.location === item.id)
                    if (result) {
                      toast.success(`Matched event in ${result.startDate.toLocaleString()}`)
                      setDate(result.startDate)
                      chooseRoom(item.id)
                    } else {
                      toast.error('No event found')
                    }
                  }}
                >
                  {item.text}
                </Button>
              ))}
            </Stack>
          </div>
          <Scheduler data={realData} height={500}>
            <ViewState
              currentDate={date}
              currentViewName={currentViewName}
              onCurrentDateChange={currentDateChange}
              onCurrentViewNameChange={currentViewNameChange}
            />
            <EditingState
              onCommitChanges={commitChanges}
              addedAppointment={addedAppointment}
              onAddedAppointmentChange={changeAddedAppointment}
              appointmentChanges={appointmentChanges}
              onAppointmentChangesChange={changeAppointmentChanges}
              editingAppointment={editingAppointment}
              onEditingAppointmentChange={changeEditingAppointment}
            />

            <WeekView startDayHour={7} endDayHour={23} timeTableCellComponent={TimeTableCell} />
            <WeekView
              name='work-week'
              displayName='Work Week'
              excludedDays={[0, 6]}
              startDayHour={7}
              endDayHour={23}
              timeTableCellComponent={TimeTableCell}
            />
            <MonthView />
            <DayView timeTableCellComponent={TimeTableCell} />

            <EditRecurrenceMenu />
            <Toolbar />
            <DateNavigator />
            <TodayButton />
            <ViewSwitcher />
            <Appointments />
            {/* this plugin below (not important plugin) is the cause of warning */}
            <AppointmentTooltip headerComponent={Header} showCloseButton />
            <DragDropProvider />
            <Resources data={resources} mainResourceName={'location'} />
          </Scheduler>
        </Box>
      </div>
    </Paper>
  )
}
const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      '& .MainLayout-container ': {
        maxHeight: '370px',
      },
    },
    stack: {
      overflowY: 'scroll',
      maxHeight: '40vh',
      '&::-webkit-scrollbar': {display: 'none'},
    },
  }),
)
