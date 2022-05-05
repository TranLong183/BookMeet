import {useContext, useState} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import {toast} from 'react-toastify'
import {LoadingContext} from '../../context/loading/LoadingContext'
import {postDataApi} from '../../services/fetchDataApi'
import {validateEmail} from '../../utils/validate'
import {Error} from '../../utils/variable'

const email_regex =
  /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+(?:[A-Z]{2}|com|org|net|gov|mil|biz|info|mobi|name|aero|jobs|museum)\b$/

const Forget = () => {
  const [email, setEmail] = useState('')
  const [invalid, setInvalid] = useState('')
  const [success, setSuccess] = useState(false)

  const [validEmail, setValidEmail] = useState(false)
  const [emailFocus, setEmailFocus] = useState(false)

  const {loadingDispatch} = useContext(LoadingContext)

  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setInvalid(validateEmail(email))

    if (!invalid) {
      loadingDispatch({
        type: 'LOADING',
        payload: true,
      })
      try {
        const res = await postDataApi('user/sendmail/', {
          email,
        })
        const data = await res.json()

        if (data.status) {
          loadingDispatch({
            type: 'LOADING',
            payload: false,
          })
          toast.success('Email sent successfully!')
          setSuccess(true)
        } else {
          loadingDispatch({
            type: 'LOADING',
            payload: false,
          })
          toast.error(data?.error?.message)
        }
      } catch (error) {
        loadingDispatch({
          type: 'LOADING',
          payload: false,
        })
        toast.error(Error.networkError)
      }
    }
  }
  if (success)
    return (
      <div
        className='m-auto max-w-lg min-h-[120px] w-full border-[#202637] rounded-lg 
      bg-[#0c162d] p-4 flex flex-col select-none'
      >
        <div className='h-[15%] flex flex-col w-full mb-3'>
          <h3 className='m-auto text-6xl whitespace-nowrap'>
            <span className='text-[#f47121]'>Omi</span>
            <span className='text-[#2a69ac]'>next</span>
          </h3>
          <div className='flex justify-center'>
            <p className='text-[#2a69ac] font-semibold whitespace-nowrap'>
              We Create The Next Values
            </p>
          </div>
        </div>
        <div className='w-full flex-1 bg-[#fff] p-3 rounded-md'>
          <h3 className='text-2xl font-medium text-[#0c162d]'>Email sent successfully!</h3>
          <p className='font-medium text-[#0c162d] mb-5'>
            Check your email to reclaim your account.
          </p>
          <div className='flex items-center justify-between mt-5 mb-3 '>
            <button
              className={'bg-[#2a69ac] text-white w-full p-2 text-lg rounded-full flex'}
              onClick={() => navigate('/login')}
            >
              <span className='m-auto'>Back</span>
            </button>
          </div>
        </div>
      </div>
    )
  return (
    <form
      className='m-auto max-w-lg min-h-[120px] w-full border-[#202637] rounded-lg 
      bg-[#0c162d] p-4 flex flex-col select-none'
      onSubmit={handleSubmit}
    >
      <div className='h-[15%] flex flex-col w-full mb-3'>
        <h3 className='m-auto text-6xl whitespace-nowrap'>
          <span className='text-[#f47121]'>Omi</span>
          <span className='text-[#2a69ac]'>next</span>
        </h3>
        <div className='flex justify-center'>
          <p className='text-[#2a69ac] font-semibold whitespace-nowrap'>
            We Create The Next Values
          </p>
        </div>
      </div>
      <div className='w-full flex-1 bg-[#fff] p-3 rounded-md'>
        <h3 className='text-2xl font-medium text-[#0c162d]'>Forgot Password</h3>
        <p className='font-medium text-[#0c162d] mb-5'>
          Enter your e-mail address below to reset your password.
        </p>
        <div>
          <input
            type='text'
            placeholder='Email'
            className='w-full px-4 py-1.5 border-2 outline-none border-[#0c162d] 
            rounded-full text-[#0c162d] text-lg'
            name='email'
            value={email.replace(/\s+/g, '')}
            onChange={(e) => {
              setEmail(e.target.value)
            }}
            autoComplete='off'
            onFocus={() => setEmailFocus(false)}
            onBlur={(e) => {
              setEmailFocus(true)
              setEmail(e.target.value.trim())
              const result = email_regex.test(email)
              setValidEmail(result)
            }}
          />

          {invalid && (
            <p className='bg-[#f2dedf] w-full text-[#b4787e] font-medium p-1 mt-3'>{invalid}</p>
          )}
        </div>
        {emailFocus && email && !validEmail && (
          <p className='w-full rounded-md bg-red-600 text-white mt-1 text-sm font-medium p-1.5'>
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
        <div className='flex items-center justify-between mb-3 mt-5'>
          <Link
            to='/login'
            type='button'
            className='bg-[#f44121] text-white w-full p-2 text-lg rounded-full flex mr-7'
          >
            <span className='m-auto'>Back</span>
          </Link>
          <button
            type='submit'
            className={`${
              !validEmail
                ? 'bg-[#4f92da] opacity-50 text-white w-full p-2 text-lg rounded-full flex'
                : 'bg-[#2a69ac] text-white w-full p-2 text-lg rounded-full flex'
            }`}
            disabled={!validEmail ? true : false}
          >
            {' '}
            <span className='m-auto'>Submit</span>
          </button>
        </div>
      </div>
    </form>
  )
}

export default Forget
