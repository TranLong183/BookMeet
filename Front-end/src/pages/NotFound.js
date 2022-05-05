import {useNavigate} from 'react-router-dom'
const NotFound = () => {
  const navigate = useNavigate()

  return (
    <div className='m-auto select-none mt-[12%] flex flex-col items-center'>
      <div className='flex items-center'>
        <p
          className='flex justify-center items-center 
        w-36 h-36 rounded-full text-white text-[120px] bg-red-500 font-semibold'
        >
          4
        </p>
        <p
          className='flex justify-center items-center mx-5
        w-36 h-36 rounded-full text-white text-[120px] bg-red-500 font-semibold'
        >
          0
        </p>
        <p
          className='flex justify-center items-center 
        w-36 h-36 rounded-full text-white text-[120px] bg-red-500 font-semibold'
        >
          4
        </p>
      </div>
      <div className='mt-5 flex justify-center'>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          className='h-12 w-12 text-red-600 mr-2'
          viewBox='0 0 20 20'
          fill='currentColor'
        >
          <path
            fillRule='evenodd'
            d='M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z'
            clipRule='evenodd'
          />
        </svg>
        <p className='font-semibold text-red-600 text-2xl'>
          Sorry, The Page Not Found !
        </p>
      </div>
      <p
        className='flex items-center bg-[#2a69ac] py-2 px-5 
        cursor-pointer rounded-lg text-lg hover:bg-[#164577]'
        onClick={() => navigate(-1)}
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          className='h-5 w-5 text-white mr-2'
          viewBox='0 0 20 20'
          fill='currentColor'
        >
          <path
            fillRule='evenodd'
            d='M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z'
            clipRule='evenodd'
          />
        </svg>
        <span className='text-white'>Go back</span>
      </p>
    </div>
  )
}

export default NotFound
