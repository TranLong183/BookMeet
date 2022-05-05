import { TableCell } from '@mui/material'
import React from 'react'
import TableRow from '@mui/material/TableRow'
import IconButton from '@mui/material/IconButton'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import CheckIcon from '@mui/icons-material/Check'
import CloseIcon from '@mui/icons-material/Close'
import { Box } from '@mui/system'

const ReadOnlyRow = ({ room, handleEditClick, handleDeleteClick, index}) => {
	return (
		<TableRow>
			<TableCell>{index + 1}</TableCell>
			<TableCell>{room.text}</TableCell>
			<TableCell>{room.size}</TableCell>
			<TableCell>
				<Box
					sx={{
						backgroundColor: `${room.color}`,
						padding: '10px',
						border: '1px solid black',
						width: '1rem',
						aspectRatio: '1',
					}}
				/>
			</TableCell>
			<TableCell>{room.peripheral === true ? <CheckIcon /> : <CloseIcon />}</TableCell>
			<TableCell>{room.roomVip === true ? <CheckIcon /> : <CloseIcon />}</TableCell>
			<TableCell>
				<IconButton
					color='primary'
					aria-label='upload picture'
					component='span'
					onClick={(event) => handleEditClick(event, room)}
				>
					<EditIcon />
				</IconButton>
				<IconButton
					color='primary'
					aria-label='upload picture'
					component='span'
					onClick={() => handleDeleteClick(room.text, room.id)}
				>
					<DeleteIcon />
				</IconButton>
			</TableCell>
		</TableRow>
	)
}

export default ReadOnlyRow
