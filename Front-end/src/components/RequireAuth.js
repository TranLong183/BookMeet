import {Navigate, Outlet, useLocation} from 'react-router-dom'
import UseCookie from '../context/auth/UseCookie'

const RequireAuth = () => {
  const {cookies} = UseCookie()
  const location = useLocation()
  return cookies?.auth?.access_token ? (
    <Outlet />
  ) : (
    <Navigate to='/login' state={{from: location}} replace />
  )
}

export default RequireAuth
