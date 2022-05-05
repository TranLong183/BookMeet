import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import CloseIcon from '@mui/icons-material/Close'
import {IconButton, TableCell} from '@mui/material'
import TableRow from '@mui/material/TableRow'

const ReadOnlyRow = ({user, handleEditClick, handleDelete, index}) => {
  const display = (value) => {
    switch (value) {
      case true:
        return <CheckCircleOutlineIcon color='success' />
      default:
        return <CloseIcon color='error' />
    }
  }
  const formatDate = (value) => {
    let year = value.slice(0, 4)
    let month = value.slice(5, 7)
    let day = value.slice(8, 10)
    let hour = value.slice(11, 13)
    let min = value.slice(14, 16)
    let sec = value.slice(17, 19)
    
    return `${year}-${month}-${day}, ${hour}:${min}:${sec}`
  }

  return (
    <TableRow>
      <TableCell>{index + 1}</TableCell>
      <TableCell>{user?.fullname}</TableCell>
      <TableCell>{user?.email}</TableCell>
      <TableCell>{user?.group === null ? '' : user?.group}</TableCell>
      <TableCell>{formatDate(user?.created_at)}</TableCell>
      <TableCell>{display(user?.is_superuser)}</TableCell>
      <TableCell>
        <IconButton color='primary' onClick={() => handleEditClick(user)}>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='h-5 w-5 cursor-pointer text-blue-500'
            viewBox='0 0 20 20'
            fill='currentColor'
          >
            <path d='M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z' />
            <path
              fillRule='evenodd'
              d='M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z'
              clipRule='evenodd'
            />
          </svg>
        </IconButton>

        <IconButton color='error' onClick={() => handleDelete(user.email)}>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='h-5 w-5 cursor-pointer text-red-500'
            viewBox='0 0 20 20'
            fill='currentColor'
          >
            <path
              fillRule='evenodd'
              d='M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z'
              clipRule='evenodd'
            />
          </svg>
        </IconButton>
      </TableCell>
    </TableRow>
  )
}

export default ReadOnlyRow
