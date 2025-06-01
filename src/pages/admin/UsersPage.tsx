import React, { useState, useEffect, use } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Button,
  IconButton,
  Tooltip,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  Alert,
  Snackbar,
  SelectChangeEvent
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
  FilterList as FilterListIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { User, UserRole } from '../../types/user';
import { mockUsers } from '../../utils/mockData';
import { UserSearch } from '../../dto/UserSearch';
import { UserService } from '../../services/UserService';
import { UserDTO } from '../../dto/UserDTO';
import { toast } from 'react-toastify';
import { FileService } from '../../services/FileService';
import Swal from 'sweetalert2';

const UsersPage: React.FC = () => {
  // State for users data
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);

  // State for pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // State for search and filter
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');

  // State for user dialog
  const [openUserDialog, setOpenUserDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState<'add' | 'edit'>('add');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    fullname: '',
    password: '1234',
    avatar: '',
    position: '',
    phone: '',
    major: [],
    role: 'USER' as UserRole
  });

  // State for delete confirmation dialog
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  // State for notifications
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'info' | 'warning'
  });



  //----------------------------------------------------------------
  const _userService = new UserService();
  const _fileService = new FileService();
  const [userSearch, setUserSearch] = useState(new UserSearch());
  const [listUser, setListUser] = useState<any[]>([]);
  const [totalPage, setTotalPage] = useState(0);
  const [fromIndex, setFromIndex] = useState(0);
  const [toIndex, setToIndex] = useState(0);
  const [totalElement, setTotalElement] = useState(0);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const [userDTO, setUserDTO] = useState<UserDTO>(new UserDTO());


  useEffect(() => {
    const findAllUser = async () => {
      const [codefindAllUser, pageUser, messageFindAllUser] = await _userService.findAll(userSearch);

      console.log("Thong tin user: ", pageUser);

      setListUser(pageUser.content);
      setTotalPage(pageUser.totalPages);
      setFromIndex((userSearch.page - 1) * userSearch.limit);
      setToIndex(userSearch.page * userSearch.limit);
      setTotalElement(pageUser.totalElements);
    }

    findAllUser();

  }, [userSearch.timer]);
  //----------------------------------------------------------------

  // Load users data
  useEffect(() => {
    // In a real app, this would be an API call
    setUsers(mockUsers);
    setFilteredUsers(mockUsers);
  }, []);

  // Handle pagination changes
  const handleChangePage = (event: unknown, newPage: number) => {
    // console.log("Chuyển trang 1 ");

    setUserSearch(prev => ({
      ...prev,
      page: newPage + 1,
      timer: Date.now()
    }));
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Handle search and filter changes - call api 
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    let keyworkInput = event.target.value;
    setUserSearch(prev => ({
      ...prev,
      keyword: keyworkInput,
      page: 1,
      timer: Date.now()
    }));
  };



  //---call api - search role 
  const handleRoleFilterChange = (event: SelectChangeEvent) => {
    setRoleFilter(event.target.value);
    let roleInput: string | null = event.target.value;
    if (roleInput === 'all')
      roleInput = null;
    setUserSearch(prev => ({
      ...prev,
      roleName: roleInput,
      timer: Date.now()
    }));

  };


  //----reset filter - call api 
  const handleResetFilters = () => {
    setSearchTerm('');
    setRoleFilter('all');
    setUserSearch(prev => ({
      ...prev,
      keyword: null,
      roleName: null,
      timer: Date.now()
    }));
  };

  //-----xử lý ảnh 
  // const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const handleAvatarChange = async (event: any) => {
    const file = event.target.files[0];
    if (file) {

      //----lưu file vào state
      const file = event.target.files?.[0] ?? null;
      setAvatarFile(file);


      // Kiểm tra định dạng ảnh (tùy chọn)
      const isImage = file.type.startsWith('image/');
      if (!isImage) {
        toast.error('Vui lòng chọn một tệp hình ảnh hợp lệ!');
        return;
      }

      // Tạo URL để preview
      const previewUrl = URL.createObjectURL(file);
      setAvatarPreview(previewUrl); // state để render ảnh
      setFormData((prev) => ({
        ...prev,
        avatar: file, // lưu file để gửi lên backend
      }));
    }
  };

  //----xóa user 
  // const deleteUser = (name: any, id: any) => {
  //   console.log("name = ", name);
  //   console.log("id = ", id);


  // }

  const deleteUser = async (name: string, id: number) => {

    const result = await Swal.fire({
      title: `Xác nhận xóa?`,
      text: `Bạn có chắc muốn xóa người dùng "${name}" không?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy"
    });

    if (result.isConfirmed) {
      try {
        const [code, data, message] = await _userService.deleteUser(id);


        await Swal.fire({
          icon: "success",
          title: "Đã xóa!",
          text: `Người dùng "${name}" đã được xóa.`,
          timer: 2000,
          showConfirmButton: false
        });

        setUserSearch(prev => ({
          ...prev,
          timer: Date.now()
        }));

        // TODO: cập nhật lại danh sách người dùng sau khi xóa
      } catch (error) {
        console.error("Lỗi khi xóa:", error);
        Swal.fire({
          icon: "error",
          title: "Lỗi",
          text: "Không thể xóa người dùng. Vui lòng thử lại sau.",
        });
      }
    }
  };


  // Handle user dialog
  const handleOpenAddDialog = () => {
    setDialogMode('add');
    setFormData({
      email: '',
      username: '',
      fullname: '',
      password: '1234',
      avatar: '',
      position: '',
      phone: '',
      major: [],
      role: 'USER'
    });
    setOpenUserDialog(true);
  };

  const handleOpenEditDialog = (userDTO: UserDTO) => {
    setDialogMode('edit');
    // setCurrentUser(user);
    // setFormData({
    //   email: '',
    //   username: '',
    //   fullname: '',
    //   role: 'USER'
    // });
    setOpenUserDialog(true);
  };

  const handleCloseUserDialog = () => {
    setOpenUserDialog(false);
    setCurrentUser(null);
  };

  const handleFormChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    // setFormData(prev => ({
    //   ...prev,
    //   [name]: value
    // }));

    setUserDTO(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRoleChange = (event: SelectChangeEvent) => {
    // setFormData(prev => ({
    //   ...prev,
    //   role: event.target.value as UserRole
    // }));

    setUserDTO(prev => ({
      ...prev,
      role: event.target.value
    }));

  };

  const handleSaveUser = async () => {
    if (dialogMode === 'add') {
      if (!userDTO.role)
        userDTO.role = 'USER';

      try {
        let [code, value, mess] = await _userService.createUser(userDTO, avatarFile);
        if (code === 200) {
          toast.success("Thêm người dùng thành công")
          setUserSearch(prev => ({
            ...prev,
            // page: 1,
            timer: Date.now()
          }));
        } else {
          toast.error(mess);
        }
      } catch (error) {
        toast.error("Lỗi khi thêm người dùng");
      }


      setUserDTO(new UserDTO());

    } else {
      // In a real app, this would be an API call to update the user
      if (currentUser) {
        const updatedUsers = users.map(user =>
          user.id === currentUser.id
            ? { ...user, ...formData, updatedAt: new Date() }
            : user
        );
        setUsers(updatedUsers);
        setSnackbar({
          open: true,
          message: 'Người dùng đã được cập nhật thành công',
          severity: 'success'
        });
      }
    }

    handleCloseUserDialog();
  };


  // Handle snackbar close
  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({
      ...prev,
      open: false
    }));
  };

  // Get role display text and color
  const getRoleDisplay = (role: UserRole) => {
    switch (role) {
      case 'ADMIN':
        return { text: 'Quản trị viên', color: 'error' };
      case 'SPECIALIST':
        return { text: 'Chuyên viên', color: 'info' };
      case 'USER':
        return { text: 'Người dùng', color: 'secondary' };
      default:
        return { text: role, color: 'default' };
    }
  };

  return (
    <Container>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Quản lý người dùng
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Quản lý tất cả người dùng trong hệ thống
        </Typography>
      </Box>

      {/* Toolbar */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
          <TextField
            label="Tìm kiếm"
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={handleSearchChange}
            sx={{ flexGrow: 1, minWidth: '200px' }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />

          <FormControl variant="outlined" size="small" sx={{ minWidth: '150px' }}>
            <InputLabel id="role-filter-label">Vai trò</InputLabel>
            <Select
              labelId="role-filter-label"
              id="role-filter"
              value={roleFilter}
              onChange={handleRoleFilterChange}
              label="Vai trò"
            >
              <MenuItem value="all">Tất cả</MenuItem>
              <MenuItem value="ADMIN">Quản trị viên</MenuItem>
              <MenuItem value="SPECIALIST">Chuyên viên</MenuItem>
              <MenuItem value="USER">Người dùng</MenuItem>
            </Select>
          </FormControl>

          <Tooltip title="Đặt lại bộ lọc">
            <IconButton onClick={handleResetFilters}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenAddDialog}
            sx={{ ml: 'auto' }}
          >
            Thêm người dùng
          </Button>
        </Box>
      </Paper>

      {/* Users Table */}
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 'calc(100vh - 300px)' }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Họ tên</TableCell>
                <TableCell>Vai trò</TableCell>
                <TableCell>Ngày tạo</TableCell>
                <TableCell align="center">Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>

              {listUser?.map((user) => {
                const roleDisplay = getRoleDisplay(user.role);
                return (
                  <TableRow hover key={user.id}>
                    <TableCell>{user.id}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{`${user.fullname}`}</TableCell>
                    <TableCell>
                      <Chip
                        label={roleDisplay.text}
                        color={roleDisplay.color as any}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {new Date(user.createDate).toLocaleDateString('vi-VN')}
                    </TableCell>
                    <TableCell align="center">
                      {user.role !== 'ADMIN' && (
                        <>
                          <Tooltip title="Chỉnh sửa">
                            <IconButton onClick={() => handleOpenEditDialog(user)} color="primary">
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Xóa">
                            <IconButton onClick={() => deleteUser(user.fullname, user.id)} color="error">
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Nút bấm chuyển trang  */}
        <TablePagination
          rowsPerPageOptions={[5]}
          component="div"
          count={totalElement}
          rowsPerPage={userSearch.limit}
          page={userSearch.page - 1}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Số hàng mỗi trang:"
          labelDisplayedRows={({ from, to, count }) =>
            `${from}–${Math.min(to, count)} của ${count}`
          }
        />
      </Paper>

      {/* Add/Edit User Dialog */}
      <Dialog open={openUserDialog} onClose={handleCloseUserDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {dialogMode === 'add' ? 'Thêm người dùng mới' : 'Chỉnh sửa người dùng'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              name="email"
              label="Email"
              fullWidth
              value={userDTO.email}
              onChange={handleFormChange}
            />
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                name="username"
                label="Tên đăng nhập"
                fullWidth
                value={userDTO.username}
                onChange={handleFormChange}
              />
              <TextField
                name="fullname"
                label="Họ và tên"
                fullWidth
                value={userDTO.fullname}
                onChange={handleFormChange}
              />
            </Box>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                name="position"
                label="Chức vụ"
                fullWidth
                value={userDTO.position}
                onChange={handleFormChange}
              />
              <TextField
                name="phone"
                label="Số điện thoại"
                fullWidth
                value={userDTO.phone}
                onChange={handleFormChange}
              />
            </Box>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <FormControl sx={{ width: '50%' }}>
                <InputLabel id="role-label">Vai trò</InputLabel>
                <Select
                  labelId="role-label"
                  id="role"
                  value={userDTO.role || "USER"}
                  onChange={handleRoleChange}
                  label="Vai trò"
                >
                  <MenuItem value="ADMIN">Quản trị viên</MenuItem>
                  <MenuItem value="SPECIALIST">Chuyên viên</MenuItem>
                  <MenuItem value="USER">Người dùng</MenuItem>
                </Select>
              </FormControl>

              {/* <FormControl sx={{ width: '50%' }}>
                <InputLabel id="major-label">Major</InputLabel>
                <Select
                  labelId="major-label"
                  id="major"
                  multiple
                  // value={formData.role}
                  // onChange={handleRoleChange}
                  label="Vai trò"
                >
                  <MenuItem value="ADMIN">Quản trị viên</MenuItem>
                  <MenuItem value="SPECIALIST">Chuyên viên</MenuItem>
                  <MenuItem value="USER">Người dùng</MenuItem>
                </Select>
              </FormControl> */}
            </Box>

            <FormControl fullWidth>
              <InputLabel shrink htmlFor="avatar-upload">
                Ảnh đại diện
              </InputLabel>
              <input
                accept="image/*"
                id="avatar-upload"
                type="file"
                style={{ marginTop: 8 }}
                onChange={handleAvatarChange}
              />
              {avatarPreview && (
                <img
                  src={avatarPreview}
                  alt="Ảnh đại diện preview"
                  // style={{ marginTop: 16, maxWidth: '100%', maxHeight: 200, borderRadius: 8 }}

                  style={{
                    marginTop: 16,
                    width: 100,
                    height: 100,
                    objectFit: 'cover',
                    // borderRadius: '50%' 
                  }}
                />
              )}
            </FormControl>

          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseUserDialog}>Hủy</Button>
          <Button onClick={handleSaveUser} variant="contained" color="primary">
            {dialogMode === 'add' ? 'Thêm' : 'Lưu'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default UsersPage;
