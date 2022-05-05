import {useContext} from 'react'
import {AlertContext} from './../context/alert/AlertContext'
import Toast from './Toast'

function Alert() {
  const {alert, alertDispatch} = useContext(AlertContext)

  const close = () => {
    alertDispatch({
      type: 'ALERT',
      payload: {},
    })
  }
  return (
    <div className='absolute'>
      {alert.error && (
        <Toast
          msg={{title: 'Error', body: alert.error}}
          bgColor='bg-red-500'
          handleShow={close}
        />
      )}
      {alert.success && (
        <Toast
          msg={{title: 'Success', body: alert.success}}
          bgColor='bg-green-600'
          handleShow={close}
        />
      )}
    </div>
  )
}

export default Alert
