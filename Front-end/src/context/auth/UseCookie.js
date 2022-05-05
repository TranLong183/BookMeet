import {useCookies} from 'react-cookie'

const UseCookie = () => {
  const [cookies, setCookie, removeCookie] = useCookies()
  return {cookies, setCookie, removeCookie}
}

export default UseCookie
