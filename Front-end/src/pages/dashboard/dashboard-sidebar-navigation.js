import CssBaseline from '@material-ui/core/CssBaseline'
import Drawer from '@material-ui/core/Drawer'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import {createStyles, makeStyles} from '@material-ui/core/styles'
import {Autorenew, ExpandLess, ExpandMore} from '@material-ui/icons'
import AssignmentIndRoundedIcon from '@mui/icons-material/AssignmentIndRounded'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded'
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts'
import MeetingRoomRoundedIcon from '@mui/icons-material/MeetingRoomRounded'
import {Collapse} from '@mui/material'
import Avatar from '@mui/material/Avatar'
import Divider from '@mui/material/Divider'
import clsx from 'clsx'
import {useEffect, useState} from 'react'
import {Link, useLocation, useNavigate} from 'react-router-dom'
import {toast} from 'react-toastify'
import UseCookie from '../../context/auth/UseCookie'
import useTimeOut from '../../context/useTimeOut'
import {getDataApi} from '../../services/fetchDataApi'
import {Error} from '../../utils/variable'

const DashboardSidebarNavigation = () => {
  const classes = useStyles()
  const {pathname} = useLocation()
  const navigate = useNavigate()

  const {cookies, removeCookie} = UseCookie()
  const timeout = useTimeOut()
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [newEvents, setNewEvents] = useState([])

  const [spin, setSpin] = useState(false)

  const refreshCanvas = () => {
    setSpin(true)
    setTimeout(() => {
      setSpin(false)
    }, 1000)
  }

  const handleClose = () => {
    setOpen(!open)
  }

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await getDataApi(
          'user/user_id/',
          cookies?.auth?.access_token
        )
        const data = await res.json()

        if (res.status === 200) {
          setName(data?.data?.fullname)
        }
      } catch (error) {
        toast.error(error.message)
      }
    }
    if (!timeout) {
      getUser()
    }
  }, [cookies?.auth?.access_token, timeout])

  const refreshNewEvents = async () => {
    if (!timeout) {
      try {
        const res = await getDataApi('events/', cookies?.auth?.access_token)
        const data = await res.json()
        if (res.status === 200) {
          setNewEvents(data?.data)
        }
        if (res.status === 401) {
          toast.error(data?.error.message)
          return
        }
      } catch (error) {
        toast.error(error.message)
      }
    }
  }

  const checkTimeOut = async (value) => {
    if (timeout) {
      await toast.error(Error.timeOut)
      await removeCookie('auth', {
        path: '/',
      })
      navigate('/login')
      return
    } else {
      switch (value) {
        case 'manageRooms':
          return navigate('/dashboard/manage/rooms')
        case 'manageGroups':
          return navigate('/dashboard/manage/groups')
        case 'manageUsers':
          return navigate('/dashboard/manage/users')
        default:
          refreshCanvas()
          refreshNewEvents()
          break
      }
    }
  }

  useEffect(() => {
    const getNewEvents = async () => {
      try {
        const res = await getDataApi('events/', cookies?.auth?.access_token)
        const data = await res.json()
        if (res.status === 200) {
          setNewEvents(data?.data)
        }
        if (res.status === 401) {
          toast.error(data?.error.message)
          return
        }
      } catch (error) {
        toast.error(error.message)
      }
    }
    if (!timeout) {
      getNewEvents()
    }
  }, [cookies?.auth?.access_token, timeout])

  return (
    <>
      <div className={classes.root}>
        <CssBaseline />
        <Drawer
          className={classes.drawer}
          variant='permanent'
          classes={{
            paper: classes.drawerPaper,
          }}
          anchor='left'
        >
          <div className='text-center select-none'>
            <div className='py-2'>
              <h3 className='m-auto text-3xl whitespace-nowrap font-semibold flex justify-center'>
                <span className='text-[#f47121]'>Omi</span>
                <span className='text-[#2a69ac]'>next</span>
              </h3>
              <p className='text-[#2a69ac] text-[12px] whitespace-nowrap font-semibold'>
                We Create The Next Values
              </p>
            </div>
            <Divider />
            <div className='flex items-center py-3 px-5'>
              <Avatar sx={{width: 40, height: 40}}></Avatar>
              <div className='ml-3 text-left'>
                <p className='text-[22px] text-gray-500'>Welcome</p>
                <p className='font-bold text-gray-500'>
                  {cookies?.auth?.isAdmin ? `${name} (Admin)` : `${name}`}
                </p>
              </div>
            </div>
            <Divider />
          </div>

          <div className={classes.drawerContainer}>
            {cookies?.auth?.isAdmin && (
              <List className={classes.override}>
                <List>
                  <ListItem button onClick={handleClose}>
                    <ListItemIcon>
                      <ManageAccountsIcon />
                    </ListItemIcon>
                    <ListItemText primary={'Manage'} />
                    {open ? <ExpandLess /> : <ExpandMore />}
                  </ListItem>
                </List>
                <Collapse in={open} timeout='auto' unmountOnExit>
                  <List component='div' disablePadding>
                    <ListItem
                      sx={{pl: 4}}
                      button
                      selected={pathname === '/dashboard/manage/rooms'}
                      onClick={() => checkTimeOut('manageRooms')}
                    >
                      <ListItemIcon>
                        <MeetingRoomRoundedIcon />
                      </ListItemIcon>
                      <ListItemText primary='Rooms' />
                    </ListItem>

                    <ListItem
                      sx={{pl: 4}}
                      button
                      selected={pathname === '/dashboard/manage/groups'}
                      onClick={() => checkTimeOut('manageGroups')}
                    >
                      <ListItemIcon>
                        <GroupsRoundedIcon />
                      </ListItemIcon>
                      <ListItemText primary='Groups' />
                    </ListItem>

                    <ListItem
                      sx={{pl: 4}}
                      button
                      selected={pathname === '/dashboard/manage/users'}
                      onClick={() => checkTimeOut('manageUsers')}
                    >
                      <ListItemIcon>
                        <AssignmentIndRoundedIcon />
                      </ListItemIcon>
                      <ListItemText primary='Users' />
                    </ListItem>
                  </List>
                </Collapse>
              </List>
            )}
            <List>
              <Link
                className={classes.link}
                to={'/dashboard/'}
                onClick={() => setOpen(false)}
              >
                <ListItem button>
                  <ListItemIcon>
                    <CalendarTodayIcon />
                  </ListItemIcon>
                  <ListItemText primary={'Schedule'} />
                </ListItem>
              </Link>
            </List>
            <div
              className='px-5 pb-5 mt-5 text-gray-500 text-[17px] font-medium 
              select-none flex items-center justify-between'
            >
              <p>New Events</p>
              <Autorenew
                className={clsx({
                  [classes.refresh]: true,
                  spin: spin,
                })}
                onClick={() => checkTimeOut('refreshNewEvents')}
                spin={360}
              />
            </div>
            <div className='select-none'>
              {newEvents &&
                newEvents.length > 0 &&
                newEvents.map((event, i) => (
                  <div
                    className='flex px-5 mb-3 pb-3 border-b items-center'
                    key={i}
                  >
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      className='h-6 w-6 mr-3 text-white bg-[#f47121] p-1 rounded-full'
                      viewBox='0 0 20 20'
                      fill='currentColor'
                    >
                      <path
                        fillRule='evenodd'
                        d='M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z'
                        clipRule='evenodd'
                      />
                    </svg>
                    <div className='text-gray-500'>
                      <p className='text-gray-500 font-semibold'>
                        {event?.title}
                      </p>
                      <p className='mt-1 text-[13px] flex items-center'>
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          className='h-4 w-4 text-[#2a69ac] mr-1'
                          viewBox='0 0 20 20'
                          fill='currentColor'
                        >
                          <path
                            fillRule='evenodd'
                            d='M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z'
                            clipRule='evenodd'
                          />
                        </svg>
                        <span>Booker:</span>
                        <span className='font-semibold text-[#2a69ac] pl-1 rounded'>
                          {event?.created_by?.fullname}
                        </span>
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </Drawer>
      </div>
    </>
  )
}

export default DashboardSidebarNavigation

const drawerWidth = 240

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      display: 'flex',
    },
    appBar: {
      zIndex: theme.zIndex.drawer + 1,
    },
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
    },
    drawerPaper: {
      width: drawerWidth,
    },
    drawerContainer: {
      overflow: 'auto',
    },
    // necessary for content to be below app bar
    toolbar: theme.mixins.toolbar,
    content: {
      flexGrow: 1,
      padding: theme.spacing(3),
    },
    link: {textDecoration: 'none', color: 'inherit'},
    override: {
      '&.MuiList-padding': {
        paddingBottom: 0,
        paddingTop: 0,
      },
    },
    refresh: {
      cursor: 'pointer',
      '&.spin': {
        animation: '$spin 1s 1',
        pointerEvents: 'none',
      },
    },
    '@keyframes spin': {
      '0%': {
        transform: 'rotate(0deg)',
      },
      '100%': {
        transform: 'rotate(360deg)',
      },
    },
  })
)
