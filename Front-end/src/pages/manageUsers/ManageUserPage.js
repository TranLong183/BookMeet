import {makeStyles} from '@material-ui/core'
import SearchIcon from '@mui/icons-material/Search'
import {
  Button,
  InputBase,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  TablePagination,
  Divider,
} from '@mui/material'
import {useEffect, useState} from 'react'
import {toast, ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import UseCookie from './../../context/auth/UseCookie'
import {getDataApi} from './../../services/fetchDataApi'
import {validateEmail, validateFullname} from './../../utils/validate'
import ModalUser from './ModalUser'
import ReadOnlyRow from './ReadOnlyRow'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
import {nonAccentVietnamese} from '../../utils/nonAccent'
import {useTheme} from '@mui/material/styles'
import RefreshIcon from '@mui/icons-material/Refresh'
import IconButton from '@mui/material/IconButton'
import FirstPageIcon from '@mui/icons-material/FirstPage'
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft'
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight'
import LastPageIcon from '@mui/icons-material/LastPage'

const useStyles = makeStyles((theme) => ({
  table: {
    userSelect: 'none',
    '& thead th': {
      fontWeight: '600',
    },
    '& tbody td': {
      fontWeight: '300',
    },
    '& tbody tr:nth-child(even)': {
      backgroundColor: '#f1f1f1',
      color: '#333',
    },
  },
}))

const initialValue = {
  fullname: '',
  email: '',
}
const TablePaginationActions = (props) => {
  const theme = useTheme()
  const {count, page, rowsPerPage, onPageChange} = props

  const handleFirstPageButtonClick = (event) => {
    onPageChange(event, 0)
  }

  const handleBackButtonClick = (event) => {
    onPageChange(event, page - 1)
  }

  const handleNextButtonClick = (event) => {
    onPageChange(event, page + 1)
  }

  const handleLastPageButtonClick = (event) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1))
  }

  return (
    <Box sx={{flexShrink: 0, ml: 2.5, float: 'left'}}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label='first page'
      >
        {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton onClick={handleBackButtonClick} disabled={page === 0} aria-label='previous page'>
        {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label='next page'
      >
        {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label='last page'
      >
        {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  )
}

const ManageUsersPage = () => {
  const classes = useStyles()
  const {cookies} = UseCookie()

  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState('')

  const [openModalUser, setOpenModalUser] = useState(false)

  const [fullname, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [group, setGroup] = useState('')
  const [supperUser, setSupperUser] = useState(false)

  const [page, setPage] = useState(0)
  const pages = [5, 10, 25, {label: 'All', value: -1}]
  const [rowsPerPage, setRowsPerPage] = useState(pages[page])

  const [userEdit, setUserEdit] = useState(initialValue)
  const [editUserId, setEditUserId] = useState(null)

  const [validFullName, setValidFullName] = useState(false)
  const [fullNameFocus, setFullNameFocus] = useState(false)

  const [validEmail, setValidEmail] = useState(false)
  const [emailFocus, setEmailFocus] = useState(false)

  const [invalidFullname, setInvalidFullname] = useState('')
  const [invalidEmail, setInvalidEmail] = useState('')

  const [sortName, setSortName] = useState(false)
  const [realUser, setRealUser] = useState('')
  const [overText, setOverText] = useState(false)
  const [search, setSearch] = useState('')
  const [errMsg, setErrMsg] = useState('')

  const data = {
    fullname,
    setFullName,
    email,
    setEmail,
    group,
    setGroup,
    supperUser,
    setSupperUser,
    validFullName,
    setValidFullName,
    validEmail,
    setValidEmail,
    invalidFullname,
    setInvalidFullname,
    invalidEmail,
    setInvalidEmail,
    fullNameFocus,
    setFullNameFocus,
    emailFocus,
    setEmailFocus,
    errMsg,
    setErrMsg,
  }
  const getUsers = async () => {
    try {
      setLoading('Loading...')
      const res = await getDataApi('user/user_list/', cookies?.auth?.access_token)
      const data = await res.json()
      const users = data?.data
      if (users && res.status >= 200 && res.status <= 299) {
        setLoading('')

        setUsers(users)
      } else {
        setLoading('')
        toast.error(data?.error?.message)
      }
    } catch (error) {
      setLoading('')
      toast.error(error.message)
    }
  }
  useEffect(() => {
    getUsers()
  }, [cookies?.auth?.access_token])

  useEffect(() => {
    if (editUserId) {
      setFullName(userEdit.fullname)
      setEmail(userEdit.email)
      setGroup(userEdit.group === null ? '' : userEdit.group)
      setSupperUser(userEdit.is_superuser)
      setEditUserId(userEdit.email)
      setValidEmail(false)
      setInvalidEmail('')
    } else {
      setFullName('')
      setEmail('')
      setGroup('')
      setSupperUser(false)
    }
  }, [editUserId, userEdit.fullname, userEdit.email, userEdit.group, userEdit.is_superuser])

  const usersPlus = users.map((user, index) => ({...user, index: index + 1}))

  const handleSort = (name) => {
    if (name === 'fullname' && !sortName) {
      return [...usersPlus].sort((a, b) => a[name].localeCompare(b[name]))
    } else if (name === 'fullname' && sortName) {
      return [...usersPlus].sort((a, b) => b[name].localeCompare(a[name]))
    }
  }
  const realData = realUser ? handleSort(realUser) : usersPlus
  const usersSearch = search
    ? usersPlus.filter((item) =>
        nonAccentVietnamese(item.fullname).toLowerCase().includes(nonAccentVietnamese(search)),
      )
    : realData
  const sortSet = {
    fullname: [setSortName, sortName, overText],
  }

  const handleSortValue = (prop) => {
    return () => {
      if (editUserId) return
      Object.keys(sortSet).forEach((item) => {
        if (item !== prop) {
          sortSet[item][0](false)
        } else {
          sortSet[item][0](false)
        }
      })
      setRealUser(prop)
      if (realUser !== prop) {
        sortSet[prop][0](false)
        return
      }
      sortSet[prop][0](!sortSet[prop][1])
    }
  }
  const showHoverArrow = (prop) => {
    if (sortSet[prop][2] && !sortSet[prop][1]) {
      return <ArrowUpwardIcon sx={{position: 'absolute', fontSize: '1rem', right: '-20px'}} />
    } else if (sortSet[prop][2] && sortSet[prop][1]) {
      return <ArrowDownwardIcon sx={{position: 'absolute', fontSize: '1rem', right: '-20px'}} />
    } else {
      return null
    }
  }

  const showArrow = (prop) => {
    if (realUser === prop && !sortSet[prop][1]) {
      return <ArrowUpwardIcon sx={{position: 'absolute', fontSize: '1rem', right: '-20px'}} />
    } else if (realUser === prop && sortSet[prop][1]) {
      return <ArrowDownwardIcon sx={{position: 'absolute', fontSize: '1rem', right: '-20px'}} />
    } else {
      return null
    }
  }

  const handleOpenModalUser = () => {
    setOpenModalUser(true)
  }
  const handleCloseModalUser = () => {
    setOpenModalUser(false)
    setFullName('')
    setEmail('')
    setGroup('')
    setSupperUser(false)
    setErrMsg('')
    setValidFullName(false)
    setValidEmail(false)
    setInvalidFullname('')
    setInvalidEmail('')
  }
  const handleCloseModalEditUser = () => {
    setOpenModalUser(false)
    setEditUserId(null)
    setUserEdit(initialValue)
    setValidEmail(false)
    setInvalidEmail('')
  }
  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }
  const updateUser = (fullname, email, group, supperUser) => {
    let strGroup = group === null ? '' : group
    const newUser = users.map((user) => {
      return user.email === email
        ? {...user, fullname, email, group: strGroup, is_superuser: supperUser}
        : user
    })
    setUsers(newUser)
  }
  const handleFormSubmit = () => {
    setInvalidFullname(validateFullname(fullname))
    setInvalidEmail(validateEmail(email))

    if (!editUserId) {
      const user = {
        id: Math.floor(Math.random() * 9999),
        fullname,
        email,
        group,
        is_superuser: supperUser,
        created_at: new Date().toISOString(),
      }
      if (fullname && validFullName && email && validEmail) {
        setUsers([...users, user])
        handleCloseModalUser()
        toast.success('Successfully added new user !')
      }
    } else {
      if (fullname && validFullName) {
        updateUser(fullname, email, group, supperUser)
        handleCloseModalEditUser()
        toast.success('User update successful !')
      }
    }
  }

  const handleDelete = (email) => {
    let newUsers = [...users]
    newUsers = newUsers.filter((user) => user.email !== email)
    if (window.confirm('Are you sure you want to delete this user?')) {
      setUsers(newUsers)
      toast.success('Delete user successfully !')
    }
  }

  const showException = (str) => (
    <TableBody>
      <TableRow style={{height: '50vh', background: '#fff'}}>
        <TableCell></TableCell>
        <TableCell></TableCell>
        <TableCell></TableCell>
        <TableCell style={{fontSize: 17}}>{str}</TableCell>
        <TableCell></TableCell>
        <TableCell></TableCell>
        <TableCell></TableCell>
      </TableRow>
    </TableBody>
  )

  const handleEditClick = (editUser) => {
    setOpenModalUser(true)
    setEditUserId(editUser.email)
    setUserEdit(editUser)
    setFullName(editUser.fullname)
    setEmail(editUser.email)
    setGroup(editUser.group === null ? '' : editUser.group)
    setSupperUser(editUser.is_superuser)
    setValidEmail(false)
    setInvalidEmail('')
  }

  return (
    <Paper className='app-container' sx={{marginTop: '1rem'}}>
      <ToastContainer
        position='top-right'
        autoClose={2500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Paper
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '1rem',
        }}
      >
        <Button variant='contained' color='primary' onClick={handleOpenModalUser}>
          Add User
        </Button>
        <ModalUser
          open={openModalUser}
          handleCloseModalUser={handleCloseModalUser}
          handleCloseModalEditUser={handleCloseModalEditUser}
          handleFormSubmit={handleFormSubmit}
          editUserId={editUserId}
          data={data}
        />
        <Box sx={{display: 'flex'}}>
          <Paper sx={{marginRight: '1rem'}}>
            <InputBase
              sx={{ml: 1, flex: 1}}
              placeholder='Search '
              inputProps={{'aria-label': 'search google maps'}}
              variant='outlined'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Button type='submit' sx={{p: '10px'}} aria-label='search'>
              <SearchIcon />
            </Button>
          </Paper>
          <IconButton onClick={() => getUsers()}>
            <RefreshIcon />
          </IconButton>
        </Box>
      </Paper>
      <Divider />
      <TableContainer sx={{maxHeight: '65vh'}}>
        <Table className={classes.table} stickyHeader aria-label='sticky table'>
          <TableHead>
            <TableRow>
              <TableCell
                onClick={() => {
                  if (editUserId) return
                  setRealUser('')
                }}
                sx={{
                  cursor: 'pointer',
                }}
              >
                #
              </TableCell>
              <TableCell
                onClick={handleSortValue('fullname')}
                onMouseOver={() => setOverText(true)}
                onMouseOut={() => setOverText(false)}
                sx={{
                  cursor: 'pointer',
                }}
              >
                <Box
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    position: 'relative',
                  }}
                >
                  <div>Full Name</div>
                  {showHoverArrow('fullname')}
                  {showArrow('fullname')}
                </Box>
              </TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Group</TableCell>
              <TableCell>Created at</TableCell>
              <TableCell>Super User</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          {usersSearch && usersSearch.length > 0 ? (
            <TableBody>
              {usersSearch
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((user, index) => (
                  <ReadOnlyRow
                    index={page * 5 + index}
                    key={user.id}
                    user={user}
                    handleEditClick={handleEditClick}
                    handleDelete={handleDelete}
                    setEditUserId={setEditUserId}
                  />
                ))}
            </TableBody>
          ) : loading === 'Loading...' ? (
            showException('Loading...')
          ) : realData.length === 0 ? (
            showException('No users')
          ) : (
            showException('No room matched')
          )}
        </Table>
      </TableContainer>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
        }}
      >
        <TablePagination
          rowsPerPageOptions={pages}
          count={users.length}
          rowsPerPage={rowsPerPage}
          page={page}
          SelectProps={{
            inputProps: {
              'aria-label': 'rows per page',
            },
            native: true,
          }}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          ActionsComponent={TablePaginationActions}
        />
      </Box>
    </Paper>
  )
}

export default ManageUsersPage
