import {createStyles, makeStyles} from '@material-ui/core/styles'
import {Button} from '@material-ui/core'
import TextField from '@mui/material/TextField'
import UseCookie from '../context/auth/UseCookie'
import DateTimePicker from '@mui/lab/DateTimePicker'
import DateAdapter from '@mui/lab/AdapterDateFns'
import LocalizationProvider from '@mui/lab/LocalizationProvider'
import {Box} from '@mui/system'
import {useState, useContext} from 'react'
import {searchEmptyRoom} from '../services/fetchDataApi'
import {DialogContext} from '../context/dialog/dialogContext'

export default function FormDate({data, locations, setDate}) {
  const {cookies} = UseCookie()
  const [searchStart, setSearchStart] = useState(new Date())
  const [searchEnd, setSearchEnd] = useState(
    new Date(new Date().setHours(new Date().getHours() + 1)),
  )

  const formatTime = (time) =>
    time.toLocaleTimeString('en-GB', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
    })

  const classes = useStyles()

  const {popupDispatch} = useContext(DialogContext)

  function handleStartChange(newValue) {
    if (newValue instanceof Date && !isNaN(newValue)) {
      setSearchStart(newValue)
    }
  }
  function handleEndChange(newValue) {
    if (newValue instanceof Date && !isNaN(newValue)) {
      setSearchEnd(newValue)
    }
  }

  async function submitSearchDateHandle(e) {
    e.preventDefault()
    const a = new Date(searchStart).getTime()
    const b = new Date(searchEnd).getTime()

    if (a > b) {
      popupDispatch({
        type: 'OPEN',
        data: {
          bool: true,
          text: 'Invalid date!',
        },
      })
      return
    }

    const searchTime = {
      time_from: searchStart.toISOString(),
      time_to: searchEnd.toISOString(),
    }

    const res = await searchEmptyRoom(searchTime, cookies?.auth?.access_token)
    const data = await res.json()

    const mapData = await data.data.map((data) => data.name)

    setDate(new Date(searchStart))
    if (mapData.length === 0) {
      popupDispatch({
        type: 'OPEN',
        data: {
          bool: true,
          text: 'No empty room left during this period!',
        },
      })
    } else {
      popupDispatch({
        type: 'OPEN',
        data: {
          bool: true,
          text: `${mapData.join(', ')} is available`,
        },
      })
    }
  }

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexShrink: '0',
        }}
      >
        <LocalizationProvider dateAdapter={DateAdapter}>
          <DateTimePicker
            value={searchStart}
            onChange={handleStartChange}
            renderInput={(params) => (
              <TextField
                sx={{width: '13rem', marginRight: '1rem'}}
                size={'small'}
                {...params}
                inputProps={{readOnly: true}}
                value={`${searchStart.toLocaleDateString('en-US')} ${formatTime(searchStart)}`}
              />
            )}
            label='MM/DD/YYYY'
          />
          <DateTimePicker
            value={searchEnd}
            onChange={handleEndChange}
            renderInput={(params) => (
              <TextField
                sx={{width: '13rem', marginRight: '1rem'}}
                size={'small'}
                {...params}
                inputProps={{readOnly: true}}
                value={`${searchEnd.toLocaleDateString('en-US')} ${formatTime(searchEnd)}`}
              />
            )}
            label='MM/DD/YYYY'
          />
        </LocalizationProvider>
        <Button className={classes.button} variant='contained' onClick={submitSearchDateHandle}>
          Search Room
        </Button>
      </Box>
    </>
  )
}

const useStyles = makeStyles((theme) =>
  createStyles({
    button: {
      color: '#fff',
      backgroundColor: '#1976d2',
    },
  }),
)
