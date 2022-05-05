import UseCookie from './auth/UseCookie'

function useTimeOut() {
  const {cookies} = UseCookie()

  const timeout =
    Date.now() - cookies?.auth?.access_expires * 1000 >
    cookies?.auth?.time_login

  return timeout
}

export default useTimeOut
