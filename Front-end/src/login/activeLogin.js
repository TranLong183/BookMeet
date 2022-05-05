import {useContext, useEffect, useRef, useState} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import {toast} from 'react-toastify'
import UseCookie from '../context/auth/UseCookie'
import {validateEmail, validatePass} from '../utils/validate'
import {Error} from '../utils/variable'
import {LoadingContext} from './../context/loading/LoadingContext'
import {postDataApi} from './../services/fetchDataApi'
import './Login.css'

const Active = () => {
  const {loadingDispatch} = useContext(LoadingContext)
  const {setCookie} = UseCookie()
  const navigate = useNavigate()
  const emailRef = useRef()

  const [email, setEmail] = useState('')
  const [pass, setPass] = useState('')
  const [invalidEmail, setInvalidEmail] = useState('')
  const [invalidPass, setInvalidPass] = useState('')
  const [errMsg, setErrMsg] = useState('')

  const [showPassword, setShowPassword] = useState(false)
  const [showHeading, setShowHeading] = useState(false)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    setTimeout(() => {
      setShowHeading(true)
    }, 1000)
    setTimeout(() => {
      setShowForm(true)
    }, 2000)

    setTimeout(() => {
      emailRef.current.focus()
    }, 2000)

    return () => {
      clearTimeout()
    }
  }, [])

  const handleShowPassword = () => {
    setShowPassword(!showPassword)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setInvalidEmail(validateEmail(email))
    setInvalidPass(validatePass(pass))
    setErrMsg('')

    if (email && pass) {
      try {
        loadingDispatch({
          type: 'LOADING',
          payload: true,
        })
        const res = await postDataApi('user/loginnew/', {
          email,
          password: pass,
        })
        const data = await res.json()
        if (res.status >= 200 && res.status <= 299) {
          loadingDispatch({
            type: 'LOADING',
            payload: false,
          })
          toast.success('Please change your password to active account!')

          const cookie = {
            access_token: data?.data?.access_token,
            access_expires: data?.data?.access_expires,
            isAdmin: data?.data?.is_admin,
          }
          setCookie('auth', cookie, {
            path: '/',
            maxAge: data?.data?.access_expires,
          })
          navigate('/changepass')
        } else if (res.status >= 500 && res.status <= 511) {
          loadingDispatch({
            type: 'LOADING',
            payload: false,
          })
          toast.error(Error.serverError)
          navigate('/login')
        } else {
          loadingDispatch({
            type: 'LOADING',
            payload: false,
          })
          setErrMsg(data?.error.message)
          toast.error(data?.error.message)
          navigate('/login')
        }
        const toChangePass = await navigate('/changepass')
      } catch (err) {
        toast.error(err.message)
        loadingDispatch({
          type: 'LOADING',
          payload: false,
        })
      }
    } else {
      toast.error(Error.loginFailed)
      loadingDispatch({
        type: 'LOADING',
        payload: false,
      })
    }
  }
  return (
    <form
      className='m-auto max-w-lg min-h-[120px] w-full border-[#202637] rounded-lg 
      bg-[#0c162d] p-5 flex flex-col select-none'
      onSubmit={handleSubmit}
    >
      <div className='h-[15%] flex flex-col w-full mb-3'>
        <h3 className='heading m-auto text-6xl whitespace-nowrap'>
          <span className='text-[#f47121]'>Omi</span>
          <span className='text-[#2a69ac]'>next</span>
        </h3>

        <div className='flex justify-center'>
          {showHeading && (
            <p className='slogan text-[#2a69ac] font-semibold whitespace-nowrap'>
              We Create The Next Values
            </p>
          )}
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
      </div>
      {showForm && (
        <div className='w-full flex-1'>
          {/*Email  */}
          <div className='mb-2'>
            <div className='flex items-center'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-6 w-6 text-[#2a69ac] mr-3'
                viewBox='0 0 20 20'
                fill='currentColor'
              >
                <path
                  fillRule='evenodd'
                  d='M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z'
                  clipRule='evenodd'
                />
              </svg>
              <input
                type='text'
                ref={emailRef}
                placeholder='Email...'
                className='w-full py-2 border-b-[1px] border-[#2a69ac] 
                outline-none bg-transparent text-[#e7e9ea] text-[17px]'
                value={email.replace(/\s+/g, '')}
                onChange={(e) => {
                  setEmail(e.target.value)
                  setInvalidEmail('')
                  setErrMsg('')
                }}
                onFocus={() => {
                  setInvalidEmail('')
                  setErrMsg('')
                }}
                autoComplete='off'
              />
            </div>
            {invalidEmail && (
              <p className='w-full rounded-md bg-white text-red-600 mt-2 text-sm font-medium p-2'>
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
                  <span>{invalidEmail}</span>
                </span>
              </p>
            )}
          </div>

          {/* Password */}
          <div className='mb-2'>
            <div className='flex items-center'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-6 w-6 text-[#2a69ac] mr-3'
                viewBox='0 0 20 20'
                fill='currentColor'
              >
                <path
                  fillRule='evenodd'
                  d='M18 8a6 6 0 01-7.743 5.743L10 14l-1 1-1 1H6v2H2v-4l4.257-4.257A6 6 0 1118 8zm-6-4a1 1 0 100 2 2 2 0 012 2 1 1 0 102 0 4 4 0 00-4-4z'
                  clipRule='evenodd'
                />
              </svg>
              <input
                type={`${showPassword ? 'text' : 'password'}`}
                placeholder='Password...'
                className='w-full py-2 border-b-[1px] border-[#2a69ac] 
                outline-none bg-transparent text-[#e7e9ea] text-[17px]'
                value={pass.replace(/\s+/g, '')}
                onChange={(e) => {
                  setPass(e.target.value)
                  setInvalidPass('')
                  setErrMsg('')
                }}
                onFocus={() => {
                  setInvalidPass('')
                  setErrMsg('')
                }}
                autoComplete='off'
              />
              {!showPassword ? (
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-6 w-6 cursor-pointer text-gray-400 mr-3'
                  viewBox='0 0 20 20'
                  fill='currentColor'
                  onClick={handleShowPassword}
                >
                  <path
                    fillRule='evenodd'
                    d='M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z'
                    clipRule='evenodd'
                  />
                  <path d='M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z' />
                </svg>
              ) : (
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-6 w-6 cursor-pointer text-gray-400 mr-3'
                  viewBox='0 0 20 20'
                  fill='currentColor'
                  onClick={handleShowPassword}
                >
                  <path d='M10 12a2 2 0 100-4 2 2 0 000 4z' />
                  <path
                    fillRule='evenodd'
                    d='M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z'
                    clipRule='evenodd'
                  />
                </svg>
              )}
            </div>
            {invalidPass && (
              <p className='w-full rounded-md bg-white text-red-600 mt-2 text-sm font-medium p-2'>
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
                  <span>{invalidPass}</span>
                </span>
              </p>
            )}
          </div>

          <div className='flex items-center justify-between mt-6 mb-4'>
            <button
              type='submit'
              className='bg-[#f47121] text-white w-full p-2 text-lg rounded-full'
            >
              Login
            </button>
          </div>
          <Link
            to='/forget'
            className='bg-[#f44121] text-white w-full p-2 text-lg rounded-full flex'
          >
            <span className='m-auto'>Forget Password?</span>
          </Link>
        </div>
      )}
    </form>
  )
}

export default Active
