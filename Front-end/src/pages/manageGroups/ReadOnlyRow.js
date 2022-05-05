import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import {TableCell} from '@mui/material'
import IconButton from '@mui/material/IconButton'
import TableRow from '@mui/material/TableRow'

const ReadOnlyRow = ({group, handleEditClick, handleDeleteClick, index}) => {
  return (
    <TableRow>
      <TableCell>{index + 1}</TableCell>
      <TableCell>{group?.name}</TableCell>
      <TableCell>
        <IconButton
          color='primary'
          aria-label='upload picture'
          component='span'
          onClick={(event) => handleEditClick(event, group)}
        >
          <EditIcon />
        </IconButton>
        <IconButton
          color='primary'
          aria-label='upload picture'
          component='span'
          onClick={() => handleDeleteClick(group.name)}
        >
          <DeleteIcon />
        </IconButton>
      </TableCell>
    </TableRow>
  )
}

export default ReadOnlyRow
