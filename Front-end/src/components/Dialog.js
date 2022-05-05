import * as React from 'react'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import Typography from '@mui/material/Typography'
import {DialogContext} from '../context/dialog/dialogContext'
import {useContext} from 'react'

export default function AlertDialog() {
  const {popup, popupDispatch} = useContext(DialogContext)
  const {bool, text} = popup

  const handleClose = () => {
    popupDispatch({
      type: 'CLOSE',
      data: {
        bool: false,
        text,
      },
    })
  }

  function handle() {
    return (
      <>
        <Typography gutterBottom sx={{fontWeight: 'bold'}}>
          {text.length} room(s) matched the search pattern :
        </Typography>
        {text.map((item) => (
          <Typography gutterBottom key={item}>
            {item}
          </Typography>
        ))}
      </>
    )
  }

  return (
    <div className={{position: 'fixed', zIndex: 1000}}>
      <Dialog
        open={bool}
        onClose={handleClose}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle id='alert-dialog-title'>{'Result'}</DialogTitle>
        <DialogContent sx={{display: 'flex', flexDirection: 'column'}}>
          {typeof text === 'string' ? <DialogContentText>{text}</DialogContentText> : handle()}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>CLOSE</Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}
