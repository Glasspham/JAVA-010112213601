import React, { useState, useEffect } from 'react';
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
    firstName: '',
    lastName: '',
    role: 'member' as UserRole
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

  // Load users data
  useEffect(() => {
    // In a real app, this would be an API call
    setUsers(mockUsers);
    setFilteredUsers(mockUsers);
  }, []);

  // Filter users based on search term and role filter
  useEffect(() => {
    let result = [...users];

    // Apply search filter
    if (searchTerm) {
      result = result.filter(user =>
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.lastName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply role filter
    if (roleFilter !== 'all') {
      result = result.filter(user => user.role === roleFilter);
    }

    setFilteredUsers(result);
    setPage(0); // Reset to first page when filtering
  }, [searchTerm, roleFilter, users]);

  // Handle pagination changes
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Handle search and filter changes
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleRoleFilterChange = (event: SelectChangeEvent) => {
    setRoleFilter(event.target.value);
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setRoleFilter('all');
  };

  // Handle user dialog
  const handleOpenAddDialog = () => {
    setDialogMode('add');
    setFormData({
      email: '',
      firstName: '',
      lastName: '',
      role: 'member'
    });
    setOpenUserDialog(true);
  };

  const handleOpenEditDialog = (user: User) => {
    setDialogMode('edit');
    setCurrentUser(user);
    setFormData({
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role
    });
    setOpenUserDialog(true);
  };

  const handleCloseUserDialog = () => {
    setOpenUserDialog(false);
    setCurrentUser(null);
  };

  const handleFormChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRoleChange = (event: SelectChangeEvent) => {
    setFormData(prev => ({
      ...prev,
      role: event.target.value as UserRole
    }));
  };

  const handleSaveUser = () => {
    if (dialogMode === 'add') {
      // In a real app, this would be an API call to create a new user
      const newUser: User = {
        id: String(Date.now()),
        ...formData,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      setUsers(prev => [...prev, newUser]);
      setSnackbar({
        open: true,
        message: 'Người dùng đã được thêm thành công',
        severity: 'success'
      });
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

  // Handle delete user
  const handleOpenDeleteDialog = (user: User) => {
    setUserToDelete(user);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setUserToDelete(null);
  };

  const handleDeleteUser = () => {
    if (userToDelete) {
      // In a real app, this would be an API call to delete the user
      const updatedUsers = users.filter(user => user.id !== userToDelete.id);
      setUsers(updatedUsers);
      setSnackbar({
        open: true,
        message: 'Người dùng đã được xóa thành công',
        severity: 'success'
      });
    }

    handleCloseDeleteDialog();
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
      case 'admin':
        return { text: 'Quản trị viên', color: 'error' };
      case 'manager':
        return { text: 'Quản lý', color: 'warning' };
      case 'consultant':
        return { text: 'Chuyên viên', color: 'info' };
      case 'staff':
        return { text: 'Nhân viên', color: 'secondary' };
      case 'member':
        return { text: 'Thành viên', color: 'primary' };
      case 'guest':
        return { text: 'Khách', color: 'default' };
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
              <MenuItem value="admin">Quản trị viên</MenuItem>
              <MenuItem value="manager">Quản lý</MenuItem>
              <MenuItem value="consultant">Chuyên viên</MenuItem>
              <MenuItem value="staff">Nhân viên</MenuItem>
              <MenuItem value="member">Thành viên</MenuItem>
              <MenuItem value="guest">Khách</MenuItem>
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
              {filteredUsers
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((user) => {
                  const roleDisplay = getRoleDisplay(user.role);
                  return (
                    <TableRow hover key={user.id}>
                      <TableCell>{user.id}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{`${user.firstName} ${user.lastName}`}</TableCell>
                      <TableCell>
                        <Chip
                          label={roleDisplay.text}
                          color={roleDisplay.color as any}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        {new Date(user.createdAt).toLocaleDateString('vi-VN')}
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title="Chỉnh sửa">
                          <IconButton onClick={() => handleOpenEditDialog(user)} color="primary">
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Xóa">
                          <IconButton onClick={() => handleOpenDeleteDialog(user)} color="error">
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={filteredUsers.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Số hàng mỗi trang:"
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} của ${count}`}
        />
      </Paper>

      {/* Add/Edit User Dialog */}
      <Dialog open={openUserDialog} onClose={handleCloseUserDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {dialogMode === 'add' ? 'Thêm người dùng mới' : 'Chỉnh sửa người dùng'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              name="email"
              label="Email"
              fullWidth
              value={formData.email}
              onChange={handleFormChange}
              disabled={dialogMode === 'edit'} // Email không thể thay đổi khi chỉnh sửa
            />
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                name="firstName"
                label="Tên"
                fullWidth
                value={formData.firstName}
                onChange={handleFormChange}
              />
              <TextField
                name="lastName"
                label="Họ"
                fullWidth
                value={formData.lastName}
                onChange={handleFormChange}
              />
            </Box>
            <FormControl fullWidth>
              <InputLabel id="role-label">Vai trò</InputLabel>
              <Select
                labelId="role-label"
                id="role"
                value={formData.role}
                onChange={handleRoleChange}
                label="Vai trò"
              >
                <MenuItem value="admin">Quản trị viên</MenuItem>
                <MenuItem value="manager">Quản lý</MenuItem>
                <MenuItem value="consultant">Chuyên viên</MenuItem>
                <MenuItem value="staff">Nhân viên</MenuItem>
                <MenuItem value="member">Thành viên</MenuItem>
                <MenuItem value="guest">Khách</MenuItem>
              </Select>
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

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Xác nhận xóa</DialogTitle>
        <DialogContent>
          <Typography>
            Bạn có chắc chắn muốn xóa người dùng "{userToDelete?.firstName} {userToDelete?.lastName}" không?
          </Typography>
          <Typography variant="body2" color="error" sx={{ mt: 2 }}>
            Lưu ý: Hành động này không thể hoàn tác.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Hủy</Button>
          <Button onClick={handleDeleteUser} variant="contained" color="error">
            Xóa
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
