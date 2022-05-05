import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material'
import DialogContentText from '@mui/material/DialogContentText'
import {GithubPicker} from 'react-color'
import Checkbox from '@mui/material/Checkbox'
import InputLabel from '@mui/material/InputLabel'
import FormControlLabel from '@mui/material/FormControlLabel'

const AddDialog = ({
  handleAddFormChange,
  handleAddFormSubmit,
  color,
  setColor,
  handleChangeComplete,
  addFormData,
  open,
  setOpen,
  sizeValidate,
  setSizeValidate,
  nameValidate,
  setNameValidate,
  colorValidate,
  handleClose,
  setAddFormData,
  setEditRoomId,
}) => {
  const handleClickOpen = () => {
    setSizeValidate(true)
    setOpen(true)
    setColor('')
    setEditRoomId(null)
  }

  return (
    <div>
      <Button variant='contained' color='warning' onClick={handleClickOpen}>
        Add Room
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add new room</DialogTitle>
        <DialogContent>
          <DialogContentText>Enter the information to add new room</DialogContentText>
          <Box
            component='form'
            sx={{
              '& .MuiTextField-root': {mb: 1, mt: 1},
            }}
            noValidate
            autoComplete='off'
            onSubmit={handleAddFormSubmit}
          >
            <Box sx={{display: 'flex', flexDirection: 'column'}}>
              <div style={{display: 'inline-block', width: '100%'}}>
                <TextField
                  fullWidth
                  autoFocus
                  label='Room name'
                  type='text'
                  name='name'
                  value={addFormData.name}
                  required='required'
                  placeholder='Enter room name...'
                  onChange={handleAddFormChange}
                  onFocus={() => setNameValidate(true)}
                  onBlur={(e) =>
                    setAddFormData({
                      ...addFormData,
                      name: e.target.value.trim(),
                    })
                  }
                />
                {!nameValidate && (
                  <div style={{display: 'flex'}}>
                    <p style={{color: 'red', flexGrow: 1, width: 0, marginBottom: '0.5rem'}}>
                      Must be alphabet character in range from 2 to 20
                    </p>
                  </div>
                )}
              </div>
              <div>
                <TextField
                  label='Room size'
                  type='number'
                  name='size'
                  required='required'
                  placeholder='Enter room size...'
                  value={addFormData.size}
                  onChange={handleAddFormChange}
                  onFocus={() => setSizeValidate(true)}
                />
                {!sizeValidate && (
                  <p style={{color: 'red', marginBottom: '0.5rem'}}>
                    Must be number from 1 to 1000
                  </p>
                )}
              </div>
            </Box>
            {/* <TextField
							label="Peripheral"
							type="checkbox"
							name="peripheral"
							placeholder="Please check..."
							onChange={handleAddFormChange}
						/> */}

            <FormControlLabel
              control={
                <Checkbox
                  label='Peripheral'
                  type='checkbox'
                  name='peripheral'
                  labelPlacement='start'
                  onChange={handleAddFormChange}
                  sx={{'& .MuiSvgIcon-root': {fontSize: 40}}}
                />
              }
              label='Peripheral'
              labelPlacement='start'
              sx={{marginRight: '4rem'}}
            />

            {/* <TextField
							checked={(e) => e.target.checked}
							label="Room vip"
							type="checkbox"
							name="roomVip"
							placeholder="Please check..."
							onChange={handleAddFormChange}
						/> */}
            <FormControlLabel
              control={
                <Checkbox
                  label='Room vip'
                  type='checkbox'
                  name='roomVip'
                  labelPlacement='start'
                  onChange={handleAddFormChange}
                  sx={{'& .MuiSvgIcon-root': {fontSize: 40}}}
                />
              }
              label='Room vip'
              labelPlacement='start'
            />

            <InputLabel>Room color</InputLabel>
            <Box sx={{marginRight: '1rem', padding: '.5rem'}}>
              <Box
                sx={{
                  name: 'color',
                  backgroundColor: `${color}`,
                  padding: '10px',
                  border: '1px solid black',
                  width: '1rem',
                  aspectRatio: '1',
                }}
              />
              <GithubPicker color={color} onChangeComplete={handleChangeComplete} />
              {!colorValidate && <p style={{color: 'red'}}>Please select the color </p>}
            </Box>
            <DialogActions>
              <Button onClick={handleClose}>Cancel</Button>
              <Button type='submit'>Add</Button>
            </DialogActions>
          </Box>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default AddDialog
