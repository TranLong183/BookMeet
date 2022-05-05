import {gridColumnsTotalWidthSelector} from '@mui/x-data-grid'
import {Navigate, Route, Routes, Outlet} from 'react-router'
import RequireAuth from './components/RequireAuth'
import UseCookie from './context/auth/UseCookie'
import Active from './login/activeLogin'
import Login from './login/Login'
import ChangePass from './pages/changepass/ChangePass'
import Dashboard from './pages/dashboard/Dashboard'
import DashboardDefaultContent from './pages/dashboard/dashboard-default-content'
import SettingsAndPrivacy from './pages/dashboard/settings-and-privacy'
import Confirm from './pages/forget/Confirm'
import Forget from './pages/forget/Forget'
import ManageGroupsPage from './pages/manageGroups/ManageGroupsPage'
import ManageRoomsPage from './pages/manageRooms/ManageRoomsPage'
import ManageUserPage from './pages/manageUsers/ManageUserPage'
import NotFound from './pages/NotFound'
import Register from './pages/register/Register'
/*Routes is used to be Switch*/
const Router = () => {
  /* nesting routes*/
  const {cookies} = UseCookie()

  return (
    <Routes>
      <Route
        path='/'
        element={cookies?.auth?.access_token ? <Navigate to='/dashboard' /> : <Login />}
      />
      <Route
        path='/login'
        element={!cookies?.auth?.access_token ? <Login /> : <Navigate to='/dashboard' />}
      />
      <Route path='/active' element={<Active />} />
      <Route path='/forget' element={<Forget />} />

      <Route element={<RequireAuth />}>
        <Route path='/changepass' element={<ChangePass />} />
        <Route path='/register' element={<Register />} />
      </Route>

      <Route
        path='/confirm/:token'
        element={cookies?.auth?.access_token ? <Navigate to='/dashboard' /> : <Confirm />}
      />

      <Route element={<RequireAuth />}>
        <Route
          path='/dashboard'
          element={
            cookies?.auth?.status_user === '1' ? <Dashboard /> : <Navigate to='/changepass' />
          }
        >
          <Route path='/dashboard/' element={<DashboardDefaultContent />} />
          <Route path='/dashboard/manage/rooms' element={<ManageRoomsPage />} />
          <Route path='/dashboard/manage/groups' element={<ManageGroupsPage />} />
          <Route path='/dashboard/manage/users' element={<ManageUserPage />} />
          <Route path='/dashboard/settings-and-privacy' element={<SettingsAndPrivacy />} />
          <Route path='*' element={<NotFound />} />
        </Route>
      </Route>

      <Route path='*' element={<NotFound />} />
    </Routes>
  )
}
export default Router
