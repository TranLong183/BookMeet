import * as React from 'react'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import {nonAccentVietnamese} from '../utils/nonAccent'
export default function SearchDialog({
  text,
  open,
  setOpen,
  result,
  setSearch,
  setDate,
  data,
  setCurrentViewName,
}) {
  const handleClose = () => {
    setOpen(false)
  }

  const handleSelect = (e) => {
    const searchResult = result.find(
      (result) => nonAccentVietnamese(result.id) === nonAccentVietnamese(e.target.value),
    )
    if (searchResult !== 0) {
      setCurrentViewName('Day')
      setDate(new Date(searchResult.startTime))
    }

    handleClose()
  }
  return (
    <div className={{position: 'fixed', zIndex: 1000}}>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle id='alert-dialog-title'>
          {result.length !== 0 ? 'Event matched' : 'No event found'}
        </DialogTitle>
        <DialogContent sx={{display: 'flex', flexDirection: 'column'}}>
          {result.map((result) => (
            <Button key={result.id} value={result.id} onClick={handleSelect}>
              {`${result.title} start at ${new Date(result.startTime).toLocaleString()} 
							in ${result.location}`}
            </Button>
          ))}
        </DialogContent>
      </Dialog>
    </div>
  )
}
