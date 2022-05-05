import {
  Button,
  InputBase,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Box,
  TablePagination,
  Divider,
  TableContainer,
} from '@mui/material'
import {Fragment, useState, useEffect} from 'react'
import {toast, ToastContainer} from 'react-toastify'
import AddDialog from './AddDialog'
import EditableRow from './EditableRow'
import UseCookie from './../../context/auth/UseCookie'
import {getDataApi, postDataApi, putDataApi} from './../../services/fetchDataApi'
import ReadOnlyRow from './ReadOnlyRow'
import {useTheme} from '@mui/material/styles'
import SearchIcon from '@mui/icons-material/Search'
import RefreshIcon from '@mui/icons-material/Refresh'
import IconButton from '@mui/material/IconButton'
import FirstPageIcon from '@mui/icons-material/FirstPage'
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft'
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight'
import LastPageIcon from '@mui/icons-material/LastPage'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'

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
const numberRegex = /^\s*([^\s]\s*){3,20}$/
const group_regex =
  /^[A-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễếệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ 0123456789' ']{2,20}$/
const ManageGroupsPage = () => {
  const {cookies} = UseCookie()
  const [groups, setGroups] = useState([])
  const [searchValue, setSearchValue] = useState()
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(0)
  const pages = [5, 10, 25, {label: 'All', value: -1}]

  const [rowsPerPage, setRowsPerPage] = useState(pages[page])
  const [nameValidate, setNameValidate] = useState('')
  const [groupName, setGroupName] = useState('')
  const [editGroupName, setEditGroupName] = useState('')
  const [open, setOpen] = useState(false)
  const [overText, setOverText] = useState(false)

  const [editGroupNameId, setEditGroupNameId] = useState(null)

  const [sortName, setSortName] = useState(false)
  const [realGroup, setRealGroup] = useState('')

  const data = {
    groupName,
    setGroupName,
  }
  const getGroups = async () => {
    try {
      setLoading(true)
      const res = await getDataApi('groups/listgroup/', cookies?.auth?.access_token)
      const data = await res.json()
      const groupsData = data?.data
      if (res.status >= 200 && res.status <= 299 && groupsData.length !== groups.length) {
        setLoading(false)
        const groupPlus = groupsData?.map((group, index) => ({
          ...group,
          index: index + 1,
        }))

        setGroups(groupPlus)
      } else {
        setLoading(false)
        toast.error(data?.error?.message)
      }
    } catch (error) {
      setLoading(false)
      toast.error(error.message)
    }
  }
  useEffect(() => {
    getGroups()
  }, [groups, cookies?.auth?.access_token])

  const handleSort = (name) => {
    if (name === 'name' && !sortName) {
      return [...groups].sort((a, b) => a[name].localeCompare(b[name]))
    } else if (name === 'name' && sortName) {
      return [...groups].sort((a, b) => b[name].localeCompare(a[name]))
    }
  }
  const realData =
    realGroup && Array.isArray(groups) && groups.length !== 0 ? handleSort(realGroup) : groups
  const sortedSearch = searchValue
    ? realData.filter((group) => group.name.toLowerCase().includes(searchValue.toLowerCase()))
    : realData
  const sortSet = {
    name: [setSortName, sortName, overText],
  }

  const handleSortValue = (prop) => {
    return () => {
      if (editGroupNameId) return
      Object.keys(sortSet).forEach((item) => {
        if (item !== prop) {
          sortSet[item][0](false)
        } else {
          sortSet[item][0](false)
        }
      })
      setRealGroup(prop)
      if (realGroup !== prop) {
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
    if (realGroup === prop && !sortSet[prop][1]) {
      return <ArrowUpwardIcon sx={{position: 'absolute', fontSize: '1rem', right: '-20px'}} />
    } else if (realGroup === prop && sortSet[prop][1]) {
      return <ArrowDownwardIcon sx={{position: 'absolute', fontSize: '1rem', right: '-20px'}} />
    } else {
      return null
    }
  }

  const handleOpenDialog = () => {
    setOpen(true)
  }
  const handleCloseDialog = () => {
    setOpen(false)
    setGroupName('')
  }

  const handleAddGroupChange = (event) => {
    setGroupName(event.target.value)
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }
  const handleAddGroupSubmit = async (event) => {
    event.preventDefault()
    const numberBool = numberRegex.test(groupName)
    const roomBool = group_regex.test(groupName)
    if (numberBool === false || roomBool === false) {
      toast.error('Group name is invalid')
    } else {
      try {
        const res = await postDataApi(
          'groups/add_group/',
          {name: groupName},
          cookies?.auth?.access_token,
        )
        const data = await res.json()
        if (res.status >= 200 && res.status <= 299) {
          setGroups(data)
          handleCloseDialog()
          toast.success('Success')
        }

        if (res.status === 400) {
          toast.error(data?.error?.message)
        }
        if (res.status === 401) {
          toast.error(data?.messages[0].message)
        }
      } catch (error) {
        toast.error(error.message)
      }
    }
  }
  const handleEditGroupSubmit = async (e) => {
    e.preventDefault()
    const numberEditBool = numberRegex.test(editGroupName)
    if (numberEditBool === false) {
      setNameValidate('Group name is invalid')
      return
    } else {
      try {
        const res = await putDataApi(
          `groups/edit_group/${editGroupNameId}`,
          {
            name: editGroupName,
          },
          cookies?.auth?.access_token,
        )
        const data = await res.json()
        if (res.status >= 200 && res.status <= 299) {
          setGroups(data)
          handleCloseDialog()
          toast.success('Success')
          setNameValidate('')
        }

        if (res.status === 400) {
          toast.error(data?.error?.message)
        }

        if (res.status === 401) {
          toast.error(data?.messages[0].message)
        }
      } catch (error) {
        toast.error(error.message)
      }
    }
    setEditGroupNameId(null)
  }
  const handleEditClick = async (event, group) => {
    event.preventDefault()
    setEditGroupNameId(group.id)
    setEditGroupName(group.name)
    setNameValidate('')
  }

  const handleCancelClick = () => {
    setEditGroupNameId(null)
  }
  const handleDeleteLocal = (groupName) => {
    const newGroups = [...groups]
    const index = groups.findIndex((contact) => contact.name === groupName)

    newGroups.splice(index, 1)

    setGroups(newGroups)
  }

  const handleDeleteClick = async (name) => {
    if (window.confirm('Are you sure?')) {
      try {
        const res = await postDataApi('groups/delete_group/', {name}, cookies?.auth?.access_token)
        const data = await res.json()
        if (res.status >= 200 && res.status <= 299) {
          handleDeleteLocal(name)
        }
        if (res.status === 401) {
          toast.error(data?.messages[0].message)
        }
      } catch (error) {
        toast.error(error.message)
      }
    }
  }

  return (
    <Paper className='app-container' sx={{marginTop: '1rem'}}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '1rem',
        }}
      >
        <AddDialog
          open={open}
          handleOpenDialog={handleOpenDialog}
          handleCloseDialog={handleCloseDialog}
          groupName={groupName}
          handleAddGroupChange={handleAddGroupChange}
          handleAddGroupSubmit={handleAddGroupSubmit}
          data={data}
        />
        <Box sx={{display: 'flex'}}>
          <Paper sx={{marginRight: '1rem'}}>
            <InputBase
              sx={{ml: 1, flex: 1}}
              placeholder='Search '
              inputProps={{'aria-label': 'search google maps'}}
              variant='outlined'
              value={searchValue}
              onChange={(e) => {
                setSearchValue(e.target.value)
              }}
            />
            <Button type='submit' sx={{p: '10px'}} aria-label='search'>
              <SearchIcon />
            </Button>
          </Paper>
          <IconButton onClick={() => getGroups()}>
            <RefreshIcon />
          </IconButton>
        </Box>
      </Box>
      <Divider />
      <Box>
        <form onSubmit={handleEditGroupSubmit}>
          <TableContainer sx={{maxHeight: '65vh'}}>
            <Table stickyHeader>
              <TableHead></TableHead>
              <TableHead>
                <TableRow>
                  <TableCell
                    onClick={() => {
                      if (editGroupNameId) return
                      setRealGroup('')
                    }}
                    sx={{
                      cursor: 'pointer',
                      fontWeight: 'bold',
                    }}
                  >
                    #
                  </TableCell>
                  <TableCell
                    onClick={handleSortValue('name')}
                    onMouseOver={() => setOverText(true)}
                    onMouseOut={() => setOverText(false)}
                    sx={{
                      cursor: 'pointer',
                      fontWeight: 'bold',
                    }}
                  >
                    <Box
                      sx={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        position: 'relative',
                      }}
                    >
                      <div>Group Name</div>
                      {showHoverArrow('name')}
                      {showArrow('name')}
                    </Box>
                  </TableCell>
                  <TableCell sx={{fontWeight: 'bold'}}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedSearch &&
                  sortedSearch.length > 0 &&
                  sortedSearch
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((group, index) => (
                      <Fragment key={group.id}>
                        {editGroupNameId === group.id ? (
                          <EditableRow
                            index={page * 5 + index}
                            setNameValidate={setNameValidate}
                            nameValidate={nameValidate}
                            editGroupName={editGroupName}
                            setEditGroupName={setEditGroupName}
                            handleCancelClick={handleCancelClick}
                          />
                        ) : (
                          <ReadOnlyRow
                            index={page * 5 + index}
                            group={group}
                            handleEditClick={handleEditClick}
                            handleDeleteClick={handleDeleteClick}
                          />
                        )}
                      </Fragment>
                    ))}
              </TableBody>
            </Table>
          </TableContainer>
        </form>
      </Box>
      <Divider />
      <Box sx={{display: 'flex', justifyContent: 'flex-end'}}>
        <TablePagination
          rowsPerPageOptions={pages}
          count={groups.length}
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

export default ManageGroupsPage
