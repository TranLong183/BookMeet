import {
	Box,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Divider,
	InputBase,
	Paper,
} from '@mui/material'

const AddDialog = ({
	groupName,
	handleAddGroupChange,
	handleAddGroupSubmit,
	open,
	handleOpenDialog,
	handleCloseDialog,
}) => {
	return (
		<div>
			<Button onClick={handleOpenDialog} variant="contained" color="warning">
				Add Group
			</Button>
			<Dialog open={open} onClose={handleCloseDialog}>
				<DialogTitle>Add new Group</DialogTitle>
				<Divider />
				<DialogContent>
					<Box
						component="form"
						sx={{
							'& .MuiTextField-root': { m: 1 },
						}}
						noValidate
						autoComplete="off"
						onSubmit={handleAddGroupSubmit}
					>
						<Paper
							sx={{
								p: '10px',
								width: 500,
							}}
						>
							<InputBase
								type="text"
								name="fullName"
								required
								placeholder="Enter a group name..."
								value={groupName}
								onChange={handleAddGroupChange}
								style={{ width: '100%', fontSize: 18 }}
							/>
						</Paper>
						<DialogActions style={{ marginTop: 20 }}>
							<Button onClick={handleCloseDialog} variant="contained" color="error">
								Cancel
							</Button>
							<Button type="submit" variant="contained" color="warning">
								Add
							</Button>
						</DialogActions>
					</Box>
				</DialogContent>
			</Dialog>
		</div>
	)
}

export default AddDialog
