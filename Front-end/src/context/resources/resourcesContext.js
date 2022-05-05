import {createContext, useReducer, useEffect} from 'react'
import resourcesReducer from './resourcesReducer'
import UseCookie from '../auth/UseCookie'
import {getListRoomApi, getDataApi} from '../../services/fetchDataApi'
export const ResourcesContext = createContext()

const init = [
  //setting room color, text, kiểu dữ liệu để fetch
  {
    fieldName: 'location',
    title: 'Location',
    instances: [],
  },
  {
    fieldName: 'groups',
    title: 'Groups',
    instances: [],
  },
]

export default function ResourcesProvider({children}) {
  const {cookies} = UseCookie()

  const [resources, resourcesDispatch] = useReducer(resourcesReducer, init)

  useEffect(() => {
    async function fetchData() {
      const res = await getListRoomApi(cookies?.auth?.access_token)
      const data = await res.json()

      const resGroup = await getDataApi('groups/listgroup/', cookies?.auth?.access_token)
      const dataGroup = await resGroup.json()

      if (data.success && dataGroup.success) {
        const rooms = data.data.map((item) => ({
          id: item.id,
          text: item.name,
          color: item.color,
          size: item.size,
          peripheral: item.is_peripheral,
          roomVip: item.is_vip,
        }))
        const groups = dataGroup.data.map((item) => ({
          id: item.id,
          text: item.name,
        }))

        resourcesDispatch({
          type: 'INIT_LOCATION',
          data: [...rooms, {id: 'complete', text: 'complete', color: 'rgba(211,211,211,0.7)'}],
        })
        resourcesDispatch({
          type: 'INIT_GROUP',
          data: [...groups],
        })
      }
    }
    fetchData()
  }, [cookies?.auth?.access_token])
  const data = {resources, resourcesDispatch}
  return <ResourcesContext.Provider value={data}>{children}</ResourcesContext.Provider>
}
