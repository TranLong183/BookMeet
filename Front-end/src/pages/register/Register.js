import {useContext, useEffect, useRef, useState} from 'react'
import {useNavigate} from 'react-router-dom'
import {toast} from 'react-toastify'
import UseCookie from '../../context/auth/UseCookie'
import {LoadingContext} from '../../context/loading/LoadingContext'
import useTimeOut from '../../context/useTimeOut'
import {postDataApi} from '../../services/fetchDataApi'
import {validateEmail, validateFullname} from '../../utils/validate'
import {Error} from '../../utils/variable'

const fullName_regex =
  /^[A-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễếệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ ' ']{8,255}$/
const email_regex =
  /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+(?:[A-Z]{2}|com|org|net|gov|mil|biz|info|mobi|name|aero|jobs|museum)\b$/

function Register() {
  const {loadingDispatch} = useContext(LoadingContext)
  const {cookies, removeCookie} = UseCookie()
  const timeout = useTimeOut()

  const navigate = useNavigate()

  const fullNameRef = useRef()
  const errRef = useRef()

  const [fullName, setFullName] = useState('')
  const [validFullName, setValidFullName] = useState(false)
  const [fullNameFocus, setFullNameFocus] = useState(false)

  const [email, setEmail] = useState('')
  const [validEmail, setValidEmail] = useState(false)
  const [emailFocus, setEmailFocus] = useState(false)

  const [invalidFullname, setInvalidFullname] = useState('')
  const [invalidEmail, setInvalidEmail] = useState('')

  const [errMsg, setErrMsg] = useState('')

  useEffect(() => {
    fullNameRef.current.focus()
  }, [])

  const handleSubmit = async (e, token) => {
    e.preventDefault()
    setInvalidFullname(validateFullname(fullName))
    setInvalidEmail(validateEmail(email))
    setErrMsg('')
    if (timeout) {
      await toast.error(Error.timeOut)
      navigate('/dashboard/')
      return
    } else {
      if (fullName && email && validFullName && validEmail) {
        try {
          loadingDispatch({
            type: 'LOADING',
            payload: true,
          })

          const res = await postDataApi(
            'user/register/',
            {
              fullname: fullName,
              email,
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
            navigate('/dashboard/')
          } else if (res.status === 401) {
            loadingDispatch({
              type: 'LOADING',
              payload: false,
            })
            toast.error(data?.messages[0].message)
          } else if (res.status === 500) {
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
            errRef.current.focus()
            setErrMsg(data?.error?.message)
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
      className='m-auto mt-[10%] max-w-lg min-h-[350px] w-full border border-[#202637] rounded-lg bg-[#0c162d] p-5 flex flex-col select-none'
      onSubmit={handleSubmit}
    >
      <div className='h-[15%] flex flex-col w-full mb-3'>
        <h3 className='m-auto text-6xl '>
          <span className='text-[#f47121]'>Omi</span>
          <span className='text-[#2a69ac]'>next</span>
        </h3>
        <p className='text-[#2a69ac] font-semibold text-sm flex justify-center ml-12'>
          We Create The Next Values
        </p>
      </div>

      {/* Fullname */}
      <div className='w-full pb-2 mb-2'>
        <div className='w-full'>
          <label className='flex flex-col cursor-pointer'>
            <p className='flex items-center'>
              <span className='font-medium text-[#f47121] mr-1'>Full Name</span>
              {fullNameFocus && validFullName && (
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-5 w-5 text-green-600'
                  viewBox='0 0 20 20'
                  fill='currentColor'
                >
                  <path
                    fillRule='evenodd'
                    d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                    clipRule='evenodd'
                  />
                </svg>
              )}
              {fullName && fullNameFocus && !validFullName && (
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-5 w-5 text-red-600'
                  viewBox='0 0 20 20'
                  fill='currentColor'
                >
                  <path
                    fillRule='evenodd'
                    d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
                    clipRule='evenodd'
                  />
                </svg>
              )}
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
                  className='px-3 pb-1 flex-1 border-b-[1px] border-[#2a69ac] outline-none bg-transparent text-white text-[17px]'
                  ref={fullNameRef}
                  value={fullName.replace(/\s+/g, ' ')}
                  onChange={(e) => {
                    setFullName(e.target.value)
                    setInvalidFullname('')
                  }}
                  autoComplete='off'
                  onFocus={() => {
                    setFullNameFocus(false)
                    setInvalidFullname('')
                  }}
                  onBlur={(e) => {
                    setFullNameFocus(true)
                    setFullName(e.target.value.trim())
                    const result = fullName_regex.test(fullName)
                    setValidFullName(result)
                  }}
                  maxLength={255}
                />
              </div>

              {fullNameFocus && fullName && !validFullName && (
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
                    <span>{Error.invalidFullname.leng}</span>
                  </span>
                  {Error.invalidFullname.notContainDigits}
                </p>
              )}
            </div>
          </label>
          {invalidFullname && (
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
                <span>{invalidFullname}</span>
              </span>
            </p>
          )}
        </div>
      </div>

      {/* Email */}
      <div className='w-full pb-2'>
        <div className='w-full'>
          <label className='flex flex-col cursor-pointer'>
            <p className='flex items-center'>
              <span className='font-medium text-[#f47121] mr-1'>Email</span>
              {emailFocus && validEmail && (
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-5 w-5 text-green-600'
                  viewBox='0 0 20 20'
                  fill='currentColor'
                >
                  <path
                    fillRule='evenodd'
                    d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                    clipRule='evenodd'
                  />
                </svg>
              )}
              {email && emailFocus && !validEmail && (
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-5 w-5 text-red-600'
                  viewBox='0 0 20 20'
                  fill='currentColor'
                >
                  <path
                    fillRule='evenodd'
                    d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
                    clipRule='evenodd'
                  />
                </svg>
              )}
              {errMsg && (
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-5 w-5 text-red-600'
                  viewBox='0 0 20 20'
                  fill='currentColor'
                >
                  <path
                    fillRule='evenodd'
                    d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
                    clipRule='evenodd'
                  />
                </svg>
              )}
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
                  ref={errRef}
                  className='px-3 pb-1 flex-1 border-b-[1px] border-[#2a69ac] outline-none bg-transparent text-white text-[17px]'
                  value={email.replace(/\s+/g, '')}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    setErrMsg('')
                    setInvalidEmail('')
                  }}
                  autoComplete='off'
                  onFocus={() => {
                    setEmailFocus(false)
                    setInvalidEmail('')
                  }}
                  onBlur={(e) => {
                    setEmailFocus(true)
                    setEmail(e.target.value.trim())
                    const result = email_regex.test(email)
                    setValidEmail(result)
                    setErrMsg('')
                  }}
                  maxLength={128}
                />
              </div>
              {emailFocus && email && !validEmail && (
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
                    <span>{Error.invalidEmail}</span>
                  </span>
                </p>
              )}
              {errMsg && (
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
                    <span>{errMsg}</span>
                  </span>
                </p>
              )}
            </div>
          </label>
          {invalidEmail && (
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
                <span>{invalidEmail}</span>
              </span>
            </p>
          )}
        </div>
      </div>

      <button type='submit' className='bg-[#2a69ac] text-white py-2 text-lg rounded-full mt-5'>
        Register
      </button>
    </form>
  )
}

export default Register
