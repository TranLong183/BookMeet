import {useState, useContext} from 'react'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import SearchDialog from './searchDialog'
import UseCookie from '../context/auth/UseCookie'
import {nonAccentVietnamese} from '../utils/nonAccent'
import {searchEvent} from '../services/fetchDataApi'

import {DialogContext} from '../context/dialog/dialogContext'

export default function FormSearch({data, setDate, setCurrentViewName}) {
  const [search, setSearch] = useState('')
  const [open, setOpen] = useState(false)
  const [text, setText] = useState('')
  const [result, setResult] = useState([])
  const {cookies} = UseCookie()
  const {popupDispatch} = useContext(DialogContext)
  const handleSearch = (e) => {
    e.preventDefault()
    const result = data.filter((data) =>
      nonAccentVietnamese(data.title).includes(nonAccentVietnamese(search)),
    )

    const mapData = result.map((data) => ({
      id: data.id,
      title: data.title,
      startTime: data.startDate,
      location: data.room,
    }))

    if (result !== 0) {
      setResult(mapData)
      setOpen(true)
    } else {
      setOpen(true)
      setText('No room matched the search pattern!')
    }
  }

  //   const handleSubmit = async (e) => {
  //     e.preventDefault()

  //     const res = await searchEvent({title: search}, cookies?.auth?.access_token)
  //     const result = await res.json()

  //     const mapData = await result.data.map((data) => ({
  //       id: data.id,
  //       title: data.event.title,
  //       startTime: new Date(data.time_from),
  //       location: data.room.name,
  //     }))

  //     if (result.success === true) {
  //       setResult(mapData)
  //       setOpen(true)
  //     } else {
  //       setOpen(true)
  //       setText('No room matched the search pattern!')
  //     }
  //   }

  return (
    <>
      <SearchDialog
        text={text}
        setOpen={setOpen}
        open={open}
        result={result}
        setSearch={setSearch}
        data={data}
        setDate={setDate}
        setCurrentViewName={setCurrentViewName}
      />
      <form onSubmit={handleSearch}>
        <Stack spacing={1} direction='row'>
          <TextField
            placeholder='Search event...'
            variant='outlined'
            value={search}
            size='small'
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button size='small' variant='contained' type='submit'>
            search
          </Button>
        </Stack>
      </form>
    </>
  )
}
