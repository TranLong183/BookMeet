import CancelIcon from '@mui/icons-material/Cancel'
import SaveAltIcon from '@mui/icons-material/SaveAlt'
import {Button} from '@mui/material'
import IconButton from '@mui/material/IconButton'
import TableCell from '@mui/material/TableCell'
import TableRow from '@mui/material/TableRow'
import TextField from '@mui/material/TextField'

const EditableRow = ({
  editGroupName,
  setEditGroupName,
  handleCancelClick,
  index,
  nameValidate,
}) => {
  return (
    <TableRow>
      <TableCell>{index + 1}</TableCell>
      <TableCell>
        <TextField
          type='text'
          required='required'
          placeholder='Enter a name...'
          name='fullName'
          value={editGroupName}
          onChange={(e) => setEditGroupName(e.target.value)}
        ></TextField>
        {nameValidate && (
          <div style={{display: 'flex'}}>
            <p
              style={{
                color: 'red',
                flexGrow: 1,
                width: 0,
                marginBottom: '0.5rem',
              }}
            >
              {nameValidate}
            </p>
          </div>
        )}
      </TableCell>

      <TableCell>
        <Button type='submit'>
          <SaveAltIcon />
        </Button>
        <IconButton
          color='primary'
          aria-label='upload picture'
          component='span'
          type='button'
          onClick={handleCancelClick}
        >
          <CancelIcon />
        </IconButton>
      </TableCell>
    </TableRow>
  )
}

export default EditableRow