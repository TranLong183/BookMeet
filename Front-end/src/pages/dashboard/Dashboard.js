import Box from '@mui/material/Box'
import { Outlet } from 'react-router'
import DashboardSidebarNavigation from './dashboard-sidebar-navigation'
import AlertDialog from '../../components/Dialog'
const Dashboard = () => {
	return (
		<Box sx={{ display: 'flex' }}>
			<AlertDialog />
			<DashboardSidebarNavigation />
			{/* <DashboardDefaultContent /> */}
			<Outlet />
		</Box>
	)
}

export default Dashboard
