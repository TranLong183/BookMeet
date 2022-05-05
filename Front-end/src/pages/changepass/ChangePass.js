import {useContext, useEffect, useRef, useState} from 'react'
import {useNavigate} from 'react-router-dom'
import {toast} from 'react-toastify'
import UseCookie from '../../context/auth/UseCookie'
import {LoadingContext} from '../../context/loading/LoadingContext'
import useTimeOut from '../../context/useTimeOut'
import {postDataApi} from '../../services/fetchDataApi'
import {Error} from '../../utils/variable'

const pass_regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,255}$/

function ChangePass() {
  const {cookies, removeCookie} = UseCookie()
  const timeout = useTimeOut()

  const {loadingDispatch} = useContext(LoadingContext)
  const navigate = useNavigate()

  const currentPassRef = useRef()

  const [currentPass, setCurrentPass] = useState('')
  const [newPass, setNewPass] = useState('')
  const [validNewPass, setValidNewPass] = useState(false)
  const [newPassFocus, setNewPassFocus] = useState(false)

  const [cfPass, setCfPass] = useState('')
  const [validCfPass, setValidCfPass] = useState(false)
  const [cfPassFocus, setCfPassFocus] = useState(false)

  const [errMsg, setErrMsg] = useState('')

  useEffect(() => {
    currentPassRef.current.focus()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrMsg('')
    if (timeout) {
      await toast.error(Error.timeOut)
      await removeCookie('auth', {
        path: '/',
      })
      navigate('/login')
      return
    } else {
      if (newPass === currentPass) {
        toast.error(Error.samePass)
      } else {
        try {
          loadingDispatch({
            type: 'LOADING',
            payload: true,
          })

          const res = await postDataApi(
            'user/change-password/',
            {
              old_password: currentPass,
              new_password: newPass,
            },
            cookies?.auth?.access_token,
          )
          const data = await res.json()

          if (res.status >= 200 && res.status <= 299) {
            loadingDispatch({
              type: 'LOADING',
              payload: false,
            })
            toast.success('Success!')
            removeCookie('auth', {path: '/'})
            navigate('/login')
          } else if (res.status >= 500 && res.status <= 511) {
            loadingDispatch({
              type: 'LOADING',
              payload: false,
            })
            toast.error(Error.serverError)
          } else {
            loadingDispatch({
              type: 'LOADING',
              payload: false,
            })
            toast.error(data?.error?.message)
            setErrMsg(data?.error?.message)
            navigate('/changepass')
          }
        } catch (error) {
          loadingDispatch({
            type: 'LOADING',
            payload: false,
          })
          toast.error(error.message)
        }
      }
    }
  }

  return (
    <form
      className='m-auto mt-[5%] max-w-md min-h-[400px] w-full border border-[#202637] rounded-lg bg-[#0c162d] p-5 flex flex-col select-none'
      onSubmit={handleSubmit}
    >
      <div className='h-[15%] flex flex-col w-full mb-2'>
        <h3 className='m-auto text-6xl '>
          <span className='text-[#f47121]'>Omi</span>
          <span className='text-[#2a69ac]'>next</span>
        </h3>
        <p className='text-[#2a69ac] font-semibold text-sm flex justify-center ml-12'>
          We Create The Next Values
        </p>
      </div>
      {errMsg && (
        <p className='w-[60%] m-auto rounded-md text-white bg-red-600 font-medium mt-2 p-1.5'>
          <span className='flex items-center justify-center'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-6 w-6 mr-1'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
              strokeWidth={2}
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z'
              />
            </svg>
            <span>{errMsg}</span>
          </span>
        </p>
      )}

      {/*Current Password */}
      <div className='w-full pb-1.5 mt-3'>
        <div className='w-full'>
          <label className='flex flex-col cursor-pointer'>
            <p className='flex items-center'>
              <span className='font-medium text-[#f47121] mr-1'>Current Password</span>
            </p>
            <div className='flex flex-col w-full'>
              <div className='flex items-center'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-5 w-5 text-[#2a69ac]'
                  viewBox='0 0 20 20'
                  fill='currentColor'
                >
                  <path
                    fillRule='evenodd'
                    d='M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z'
                    clipRule='evenodd'
                  />
                </svg>
                <input
                  ref={currentPassRef}
                  type={'text'}
                  required
                  className='px-3 pb-1 flex-1 border-b-[1px] border-[#2a69ac] outline-none bg-transparent text-white text-[17px]'
                  value={currentPass.replace(/\s+/g, '')}
                  onChange={(e) => {
                    setCurrentPass(e.target.value)
                    setErrMsg('')
                  }}
                  autoComplete='off'
                  onFocus={() => setErrMsg('')}
                  maxLength={255}
                />
              </div>
            </div>
          </label>
        </div>
      </div>

      {/*New Password */}
      <div className='w-full pb-1.5'>
        <div className='w-full'>
          <label className='flex flex-col cursor-pointer'>
            <p className='flex items-center'>
              <span className='font-medium text-[#f47121] mr-1'>New Password</span>
            </p>
            <div className='flex flex-col w-full'>
              <div className='flex items-center'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-5 w-5 text-[#2a69ac]'
                  viewBox='0 0 20 20'
                  fill='currentColor'
                >
                  <path
                    fillRule='evenodd'
                    d='M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z'
                    clipRule='evenodd'
                  />
                </svg>
                <input
                  type='text'
                  required
                  className='px-3 pb-1 flex-1 border-b-[1px] border-[#2a69ac] outline-none bg-transparent text-white text-[17px]'
                  value={newPass.replace(/\s+/g, '')}
                  onChange={(e) => {
                    setNewPass(e.target.value)
                  }}
                  autoComplete='off'
                  onFocus={() => setNewPassFocus(false)}
                  onBlur={() => {
                    setNewPassFocus(true)
                    const result = pass_regex.test(newPass)
                    setValidNewPass(result)
                    const match = newPass === cfPass
                    setValidCfPass(match)
                  }}
                  maxLength={255}
                />
              </div>
              {newPassFocus && newPass && !validNewPass && (
                <p className='w-full rounded-md bg-red-600 text-white mt-2 text-sm font-medium p-1.5'>
                  <span className='flex items-center'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      className='h-5 w-5 mr-1'
                      viewBox='0 0 20 20'
                      fill='currentColor'
                    >
                      <path
                        fillRule='evenodd'
                        d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z'
                        clipRule='evenodd'
                      />
                    </svg>
                    <span>{Error.invalidPass.leng}</span>
                  </span>
                  {Error.invalidPass.include}
                  <br />
                  {Error.invalidPass.specialCharacters}
                </p>
              )}
            </div>
          </label>
        </div>
      </div>

      {/* Confirm Password */}
      <div className='w-full pb-1.5'>
        <div className='w-full'>
          <label className='flex flex-col cursor-pointer'>
            <p className='flex items-center'>
              <span className='font-medium text-[#f47121] mr-1'>Confirm Password</span>
            </p>
            <div className='flex flex-col w-full'>
              <div className='flex items-center'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-5 w-5 text-[#2a69ac]'
                  viewBox='0 0 20 20'
                  fill='currentColor'
                >
                  <path
                    fillRule='evenodd'
                    d='M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z'
                    clipRule='evenodd'
                  />
                </svg>
                <input
                  type='text'
                  required
                  className='px-3 pb-1 flex-1 border-b-[1px] border-[#2a69ac] outline-none bg-transparent text-white text-[17px]'
                  value={cfPass.replace(/\s+/g, '')}
                  onChange={(e) => setCfPass(e.target.value)}
                  autoComplete='off'
                  onFocus={() => setCfPassFocus(false)}
                  onBlur={() => {
                    setCfPassFocus(true)
                    setNewPassFocus(true)
                    const result = pass_regex.test(newPass)
                    setValidNewPass(result)
                    const match = newPass === cfPass
                    setValidCfPass(match)
                  }}
                  maxLength={255}
                />
              </div>
              {cfPassFocus && cfPass && !validCfPass && (
                <p className='w-full rounded-md bg-red-600 text-white mt-2 text-sm font-medium p-1.5'>
                  <span className='flex items-center'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      className='h-5 w-5 mr-1'
                      viewBox='0 0 20 20'
                      fill='currentColor'
                    >
                      <path
                        fillRule='evenodd'
                        d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z'
                        clipRule='evenodd'
                      />
                    </svg>
                    <span>{Error.invalidPass.match}</span>
                  </span>
                </p>
              )}
            </div>
          </label>
        </div>
      </div>

      <button
        type='submit'
        className={`${
          !validNewPass || !validCfPass
            ? 'bg-[#4f92da] opacity-50 text-white py-2 text-lg rounded-full cursor-not-allowed mt-5'
            : 'bg-[#2a69ac] text-white py-2 text-lg rounded-full mt-5'
        }`}
        disabled={!validNewPass || !validCfPass ? true : false}
      >
        Change Password
      </button>
    </form>
  )
}

export default ChangePass
