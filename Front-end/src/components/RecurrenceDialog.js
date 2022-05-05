import * as React from 'react'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormControl from '@mui/material/FormControl'

export default function RecurrenceDialog({
	isRecurrence,
	setIsRecurrence,
	editAll,
	setEditAll,
	handleRecurrenceChangeSubmit,
}) {
	return (
		<div className={{ position: 'fixed', zIndex: 1000 }}>
			<Dialog
				open={isRecurrence}
				onClose={() => setIsRecurrence(false)}
				aria-labelledby='alert-dialog-title'
				aria-describedby='alert-dialog-description'
			>
				<DialogTitle id='alert-dialog-title'>{'Edit recurring appointment'}</DialogTitle>
				<DialogContent>
					<FormControl>
						<RadioGroup
							aria-labelledby='demo-controlled-radio-buttons-group'
							name='controlled-radio-buttons-group'
							value={editAll}
							onChange={(e) => setEditAll(e.target.value)}
						>
							<FormControlLabel value={'false'} control={<Radio />} label='This appointment' />
							<FormControlLabel value={'true'} control={<Radio />} label='All appointments' />
						</RadioGroup>
					</FormControl>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setIsRecurrence(false)}>CANCEL</Button>
					<Button onClick={handleRecurrenceChangeSubmit}>APPLY</Button>
				</DialogActions>
			</Dialog>
		</div>
	)
}
