import {useState} from 'react'
import {useNavigate, useParams} from 'react-router-dom'
import {toast} from 'react-toastify'
import {postDataApi} from '../../services/fetchDataApi'
import {Error} from '../../utils/variable'
const pass_regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,255}$/

const Confirm = () => {
  const navigate = useNavigate()
  const {token} = useParams()
  const [pass, setPass] = useState('')
  const [validPass, setValidPass] = useState(false)
  const [passFocus, setPassFocus] = useState(false)

  const [cfPass, setCfPass] = useState('')
  const [validCfPass, setValidCfPass] = useState(false)
  const [cfPassFocus, setCfPassFocus] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await postDataApi(`user/change-password/b'${token}'`, {
        new_password: cfPass,
      })

      if (res.status === 500) {
        toast.error(Error.serverError)
        return
      }
      const data = await res.json()

      if (data.status === 200) {
        toast.success('Reset successfully')
        navigate(`/login`)
      } else {
        toast.error(data?.error?.message)
      }
    } catch (error) {
      toast.error(Error.networkError)
    }
  }

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
        <h3 className='text-2xl font-medium text-[#0c162d]'>Reset Password</h3>
        <p className='font-medium text-[#0c162d] mb-5'>Enter your new password below.</p>
        <div className='mt-3'>
          <input
            type='password'
            placeholder='New password'
            className='w-full px-4 py-1.5 border-2 outline-none border-[#0c162d] 
            rounded-full text-[#0c162d] text-lg'
            name='password'
            required
            value={pass.replace(/\s+/g, '')}
            onChange={(e) => setPass(e.target.value)}
            autoComplete='off'
            onFocus={() => setPassFocus(false)}
            onBlur={() => {
              setPassFocus(true)
              const result = pass_regex.test(pass)
              setValidPass(result)
              const match = pass === cfPass
              setValidCfPass(match)
            }}
            maxLength={255}
          />
        </div>
        {passFocus && pass && !validPass && (
          <p className='w-full rounded-md bg-red-600 text-white mt-0.5 text-sm font-medium p-1.5'>
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

        <div className='mt-5 flex'>
          <input
            type='password'
            placeholder='Confirm password'
            className='w-full px-4 py-1.5 border-2 outline-none border-[#0c162d] 
            rounded-full text-[#0c162d] text-lg'
            required
            value={cfPass.replace(/\s+/g, '')}
            onChange={(e) => setCfPass(e.target.value)}
            autoComplete='off'
            onFocus={() => setCfPassFocus(false)}
            onBlur={() => {
              setCfPassFocus(true)
              setPassFocus(true)
              const result = pass_regex.test(pass)
              setValidPass(result)
              const match = pass === cfPass
              setValidCfPass(match)
            }}
            maxLength={255}
          />
        </div>
        {cfPassFocus && cfPass && !validCfPass && (
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
              <span>{Error.invalidPass.match}</span>
            </span>
          </p>
        )}
        <div className='flex items-center justify-between mt-5 mb-3 '>
          <button
            type='submit'
            className={`${
              !validPass || !validCfPass
                ? 'bg-[#4f92da] opacity-50 text-white w-full p-2 text-lg rounded-full flex'
                : 'bg-[#2a69ac] text-white w-full p-2 text-lg rounded-full flex'
            }`}
            disabled={!validPass || !validCfPass ? true : false}
          >
            <span className='m-auto'>Change password</span>
          </button>
        </div>
      </div>
    </form>
  )
}

export default Confirm
