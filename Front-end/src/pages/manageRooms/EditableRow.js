import React, {useState} from 'react'
import TableCell from '@mui/material/TableCell'
import TableRow from '@mui/material/TableRow'
import IconButton from '@mui/material/IconButton'
import SaveAltIcon from '@mui/icons-material/SaveAlt'
import CancelIcon from '@mui/icons-material/Cancel'
import TextField from '@mui/material/TextField'
import {Button} from '@mui/material'
import {GithubPicker} from 'react-color'
import Box from '@mui/material/Box'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogActions from '@mui/material/DialogActions'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import CheckIcon from '@mui/icons-material/Check'
import CloseIcon from '@mui/icons-material/Close'

const EditableRow = ({
  editFormData,
  handleEditFormChange,
  handleCancelClick,
  color,
  handleChangeComplete,
  handleEditSelectFormChange,
  setNameValidate,
  setEditFormData,
  nameValidate,
  setSizeValidate,
  sizeValidate,
  index,
}) => {
  const [open, setOpen] = useState(false)

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <TableRow>
      <TableCell>{index + 1}</TableCell>
      <TableCell sx={{position: 'relative'}}>
        <TextField
          type='text'
          required='required'
          placeholder='Enter room name...'
          name='name'
          value={editFormData.name}
          onFocus={() => setNameValidate(true)}
          onBlur={(e) =>
            setEditFormData({
              ...editFormData,
              name: e.target.value.trim(),
            })
          }
          onChange={handleEditFormChange}
        ></TextField>

        {!nameValidate && (
          <div style={{display: 'flex', position: 'absolute', bottom: '-10px', width: '100%'}}>
            <p
              style={{
                color: 'red',
                flexGrow: 1,
                width: 0,
                marginBottom: '0.5rem',
                fontSize: '12px',
              }}
            >
              Must be alphabet character in range from 2 to 20
            </p>
          </div>
        )}
      </TableCell>
      <TableCell sx={{position: 'relative'}}>
        <TextField
          type='number'
          required='required'
          placeholder='Enter room size...'
          name='size'
          value={editFormData.size}
          onChange={handleEditFormChange}
          onFocus={() => setSizeValidate(true)}
        ></TextField>
        {!sizeValidate && (
          <div style={{display: 'flex', position: 'absolute', bottom: '-10px', width: '100%'}}>
            <p
              style={{
                color: 'red',
                flexGrow: 1,
                width: 0,
                marginBottom: '0.5rem',
                fontSize: '12px',
              }}
            >
              Must be number in range from 1 to 1000
            </p>
          </div>
        )}
      </TableCell>
      <TableCell>
        <Box
          type='text'
          required='required'
          placeholder='Choose color...'
          name='color'
          // value={editFormData.color}
          onChange={handleEditFormChange}
        >
          <Box
            sx={{
              backgroundColor: `${color}`,
              padding: '10px',
              border: '1px solid black',
              width: '1rem',
              aspectRatio: '1',
            }}
            onClick={handleClickOpen}
          />
          <Dialog open={open} onClose={handleClose}>
            <DialogContent>
              <DialogContentText>Choose color</DialogContentText>
              <Box>
                <GithubPicker color={editFormData.color} onChangeComplete={handleChangeComplete} />
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>OK</Button>
            </DialogActions>
          </Dialog>
        </Box>
      </TableCell>
      <TableCell>
        <FormControl>
          <Select
            labelId='demo-simple-select-label'
            id='peripheral'
            value={editFormData.peripheral}
            onChange={(e) => handleEditSelectFormChange(e, 'peripheral')}
          >
            <MenuItem value={true}>
              <CheckIcon />
            </MenuItem>
            <MenuItem value={false}>
              <CloseIcon />
            </MenuItem>
          </Select>
        </FormControl>
      </TableCell>
      <TableCell>
        <FormControl>
          <Select
            labelId='demo-simple-select-label'
            value={editFormData.roomVip}
            onChange={(e) => handleEditSelectFormChange(e, 'roomVip')}
          >
            <MenuItem value={true}>
              <CheckIcon />
            </MenuItem>
            <MenuItem value={false}>
              <CloseIcon />
            </MenuItem>
          </Select>
        </FormControl>
      </TableCell>
      <TableCell>
        <Button type='submit'>
          <SaveAltIcon />
        </Button>
        <IconButton
          color='primary'
          aria-label='cancel'
          component='span'
          type='button'
          onClick={handleCancelClick}
        >
          <CancelIcon />
        </IconButton>

        {/* <button type="button" onClick={handleCancelClick}>
					Cancel
				</button> */}
      </TableCell>
    </TableRow>
  )
}

export default EditableRow
