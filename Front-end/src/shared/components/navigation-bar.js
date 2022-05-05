import AppBar from '@material-ui/core/AppBar'
import Box from '@material-ui/core/Box'
import {createStyles, makeStyles} from '@material-ui/core/styles'
import Toolbar from '@material-ui/core/Toolbar'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import AssignmentIndRoundedIcon from '@mui/icons-material/AssignmentIndRounded'
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded'
import Logout from '@mui/icons-material/Logout'
import MeetingRoomRoundedIcon from '@mui/icons-material/MeetingRoomRounded'
import PersonIcon from '@mui/icons-material/Person'
import PersonAdd from '@mui/icons-material/PersonAdd'
import Settings from '@mui/icons-material/Settings'
import {Typography} from '@mui/material'
import Avatar from '@mui/material/Avatar'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Tooltip from '@mui/material/Tooltip'
import {Fragment, useEffect, useState} from 'react'
import {useLocation, useNavigate} from 'react-router-dom'
import {toast} from 'react-toastify'
import UseCookie from '../../context/auth/UseCookie'
import useTimeOut from '../../context/useTimeOut'
import {getDataApi} from '../../services/fetchDataApi'
import {Error} from '../../utils/variable'

export default function NavigationBar() {
  const classes = useStyles()
  const {cookies, removeCookie} = UseCookie()
  const timeout = useTimeOut()

  const {pathname} = useLocation()
  const navigate = useNavigate()
  const [name, setName] = useState('')

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await getDataApi(
          'user/user_id/',
          cookies?.auth?.access_token
        )
        const data = await res.json()

        if (data) {
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

  const handleBack = () => {
    navigate('/dashboard')
  }

  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to sign out ?')) {
      removeCookie('auth', {
        path: '/',
      })
      navigate('/login')
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
        case 'changePass':
          return navigate('/changepass')
        case 'createAccount':
          return navigate('/register')
        default:
          return navigate('/settings')
      }
    }
  }
  return (
    <AppBar position='static' className={classes.appBar}>
      {(pathname === '/dashboard/manage/rooms' ||
        pathname === '/dashboard/manage/groups' ||
        pathname === '/dashboard/manage/users') && (
        <div className={classes.title}>
          {pathname === '/dashboard/manage/rooms' && (
            <Fragment>
              <Typography variant='h6' marginRight={1}>
                Manage Rooms
              </Typography>
              <MeetingRoomRoundedIcon />
            </Fragment>
          )}
          {pathname === '/dashboard/manage/groups' && (
            <Fragment>
              <Typography variant='h6' marginRight={1}>
                Manage Groups
              </Typography>
              <GroupsRoundedIcon />
            </Fragment>
          )}
          {pathname === '/dashboard/manage/users' && (
            <Fragment>
              <Typography variant='h6' marginRight={1}>
                Manage Users
              </Typography>
              <AssignmentIndRoundedIcon />
            </Fragment>
          )}
        </div>
      )}
      <Box
        display={'flex'}
        flexDirection={'row-reverse'}
        justifyContent={'end'}
      >
        <Toolbar>
          <Tooltip title='Account settings'>
            <IconButton
              onClick={handleClick}
              size='small'
              sx={{ml: 2}}
              aria-controls={open ? 'account-menu' : undefined}
              aria-haspopup='true'
              aria-expanded={open ? 'true' : undefined}
            >
              <Avatar sx={{width: 32, height: 32}}></Avatar>
              <span className={classes.span}>
                {cookies?.auth?.isAdmin ? `${name} (Admin)` : `${name}`}
              </span>
              <ArrowDropDownIcon style={{color: '#fff'}} />
            </IconButton>
          </Tooltip>
          <Menu
            className={classes.menu}
            anchorEl={anchorEl}
            id='account-menu'
            open={open}
            onClose={handleClose}
            onClick={handleClose}
            PaperProps={{
              elevation: 0,
              sx: {
                overflow: 'visible',
                filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                mt: 1.5,
                '& .MuiAvatar-root': {
                  width: 32,
                  height: 32,
                  ml: -0.5,
                  mr: 1,
                },
                '&:before': {
                  content: '""',
                  display: 'block',
                  position: 'absolute',
                  top: 0,
                  right: 14,
                  width: 10,
                  height: 10,
                  bgcolor: 'background.paper',
                  transform: 'translateY(-50%) rotate(45deg)',
                  zIndex: 0,
                },
              },
            }}
            transformOrigin={{horizontal: 'right', vertical: 'top'}}
            anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
          >
            {pathname !== '/dashboard' && (
              <div>
                <MenuItem onClick={handleBack} className={classes.link}>
                  <ListItemIcon>
                    <ArrowBackIcon fontSize='small' />
                  </ListItemIcon>
                  Back
                </MenuItem>
                <Divider />
              </div>
            )}

            <MenuItem onClick={() => checkTimeOut('changePass')}>
              <ListItemIcon>
                <PersonIcon fontSize='small' />
              </ListItemIcon>
              Change Pass
            </MenuItem>

            {cookies?.auth?.isAdmin && (
              <MenuItem onClick={() => checkTimeOut('createAccount')}>
                <ListItemIcon>
                  <PersonAdd fontSize='small' />
                </ListItemIcon>
                Create account
              </MenuItem>
            )}

            <MenuItem onClick={() => checkTimeOut('settings')}>
              <ListItemIcon>
                <Settings fontSize='small' />
              </ListItemIcon>
              Settings
            </MenuItem>
            <MenuItem button='true' onClick={handleLogout}>
              <ListItemIcon>
                <Logout fontSize='small' />
              </ListItemIcon>
              Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </Box>
    </AppBar>
  )
}

const useStyles = makeStyles((theme) =>
  createStyles({
    span: {
      margin: '.5rem',
      color: '#fff',
    },
    menuLink: {
      textDecoration: 'none',
      color: 'inherit',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    link: {
      color: 'black',
      textDecoration: 'none',
      display: 'flex',
    },
    menu: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    button: {
      background: 'transparent',
      border: 'none',
      color: '#fff',
      display: 'inline-block',
      alignItems: 'center',
      paddingTop: '.5rem',
    },
    appBar: {
      zIndex: theme.zIndex.drawer + 1,
      userSelect: 'none',
    },
    title: {
      marginRight: '2rem',
      position: 'absolute',
      left: '270px',
      transform: 'translateY(50%)',
      display: 'flex',
      alignItems: 'center',
    },
  })
)
