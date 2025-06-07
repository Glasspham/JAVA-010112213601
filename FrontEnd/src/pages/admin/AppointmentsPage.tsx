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
  Visibility as VisibilityIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';
import { Appointment, AppointmentStatus } from '../../types/appointment';
import { mockAppointments, mockConsultants, mockUsers } from '../../utils/mockData';
import { Link } from 'react-router-dom';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

const AdminAppointmentsPage: React.FC = () => {
  // State for appointments data
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([]);

  // State for pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // State for search and filter
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<Date | null>(null);

  // State for appointment dialog
  const [openAppointmentDialog, setOpenAppointmentDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState<'add' | 'edit'>('add');
  const [currentAppointment, setCurrentAppointment] = useState<Appointment | null>(null);
  const [formData, setFormData] = useState({
    userId: '',
    consultantId: '',
    date: new Date(),
    time: '09:00',
    duration: 60,
    status: 'pending' as AppointmentStatus,
    notes: ''
  });

  // State for delete confirmation dialog
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [appointmentToDelete, setAppointmentToDelete] = useState<Appointment | null>(null);

  // State for status change dialog
  const [openStatusDialog, setOpenStatusDialog] = useState(false);
  const [appointmentToChangeStatus, setAppointmentToChangeStatus] = useState<Appointment | null>(null);
  const [newStatus, setNewStatus] = useState<AppointmentStatus>('pending' as AppointmentStatus);

  // State for notifications
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'info' | 'warning'
  });

  // Load appointments data
  useEffect(() => {
    // In a real app, this would be an API call
    setAppointments(mockAppointments);
    setFilteredAppointments(mockAppointments);
  }, []);

  // Filter appointments based on search term, status filter, and date filter
  useEffect(() => {
    let result = [...appointments];

    // Apply search filter
    if (searchTerm) {
      result = result.filter(appointment => {
        const user = mockUsers.find(u => u.id === appointment.userId);
        const consultant = mockConsultants.find(c => c.id === appointment.consultantId);
        return (
          user?.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user?.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          consultant?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          appointment.notes?.toLowerCase().includes(searchTerm.toLowerCase())
        );
      });
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(appointment => appointment.status === statusFilter);
    }

    // Apply date filter
    if (dateFilter) {
      const filterDate = new Date(dateFilter);
      result = result.filter(appointment => {
        const appointmentDate = new Date(appointment.date);
        return (
          appointmentDate.getDate() === filterDate.getDate() &&
          appointmentDate.getMonth() === filterDate.getMonth() &&
          appointmentDate.getFullYear() === filterDate.getFullYear()
        );
      });
    }

    setFilteredAppointments(result);
    setPage(0); // Reset to first page when filtering
  }, [searchTerm, statusFilter, dateFilter, appointments]);

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

  const handleStatusFilterChange = (event: SelectChangeEvent) => {
    setStatusFilter(event.target.value);
  };

  const handleDateFilterChange = (date: Date | null) => {
    setDateFilter(date);
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setDateFilter(null);
  };

  // Handle appointment dialog
  const handleOpenAddDialog = () => {
    setDialogMode('add');
    setFormData({
      userId: '',
      consultantId: '',
      date: new Date(),
      time: '09:00',
      duration: 60,
      status: 'pending' as AppointmentStatus,
      notes: ''
    });
    setOpenAppointmentDialog(true);
  };

  const handleOpenEditDialog = (appointment: Appointment) => {
    setDialogMode('edit');
    setCurrentAppointment(appointment);

    const appointmentDate = new Date(appointment.date);
    const appointmentTime = format(appointmentDate, 'HH:mm');

    setFormData({
      userId: appointment.userId,
      consultantId: appointment.consultantId,
      date: appointmentDate,
      time: appointmentTime,
      duration: appointment.duration || 60,
      status: appointment.status,
      notes: appointment.notes || ''
    });
    setOpenAppointmentDialog(true);
  };

  const handleCloseAppointmentDialog = () => {
    setOpenAppointmentDialog(false);
    setCurrentAppointment(null);
  };

  const handleFormChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleStatusChange = (event: SelectChangeEvent) => {
    setFormData(prev => ({
      ...prev,
      status: event.target.value as AppointmentStatus
    }));
  };

  const handleDateChange = (date: Date | null) => {
    if (date) {
      setFormData(prev => ({
        ...prev,
        date
      }));
    }
  };

  const handleUserChange = (event: SelectChangeEvent) => {
    setFormData(prev => ({
      ...prev,
      userId: event.target.value
    }));
  };

  const handleConsultantChange = (event: SelectChangeEvent) => {
    setFormData(prev => ({
      ...prev,
      consultantId: event.target.value
    }));
  };

  const handleSaveAppointment = () => {
    // Validate form
    if (!formData.userId || !formData.consultantId || !formData.date || !formData.time) {
      setSnackbar({
        open: true,
        message: 'Vui lòng điền đầy đủ thông tin',
        severity: 'error'
      });
      return;
    }

    // Combine date and time
    const dateTime = new Date(formData.date);
    const [hours, minutes] = formData.time.split(':').map(Number);
    dateTime.setHours(hours, minutes);

    if (dialogMode === 'add') {
      // In a real app, this would be an API call to create a new appointment
      const newAppointment: Appointment = {
        id: String(Date.now()),
        userId: formData.userId,
        consultantId: formData.consultantId,
        date: dateTime,
        duration: formData.duration,
        status: formData.status,
        notes: formData.notes,
        createdAt: new Date()
      };

      setAppointments(prev => [...prev, newAppointment]);
      setSnackbar({
        open: true,
        message: 'Lịch hẹn đã được thêm thành công',
        severity: 'success'
      });
    } else {
      // In a real app, this would be an API call to update the appointment
      if (currentAppointment) {
        const updatedAppointments = appointments.map(appointment =>
          appointment.id === currentAppointment.id
            ? {
                ...appointment,
                userId: formData.userId,
                consultantId: formData.consultantId,
                date: dateTime,
                duration: formData.duration,
                status: formData.status,
                notes: formData.notes
              }
            : appointment
        );
        setAppointments(updatedAppointments);
        setSnackbar({
          open: true,
          message: 'Lịch hẹn đã được cập nhật thành công',
          severity: 'success'
        });
      }
    }

    handleCloseAppointmentDialog();
  };

  // Handle delete appointment
  const handleOpenDeleteDialog = (appointment: Appointment) => {
    setAppointmentToDelete(appointment);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setAppointmentToDelete(null);
  };

  const handleDeleteAppointment = () => {
    if (appointmentToDelete) {
      // In a real app, this would be an API call to delete the appointment
      const updatedAppointments = appointments.filter(appointment => appointment.id !== appointmentToDelete.id);
      setAppointments(updatedAppointments);
      setSnackbar({
        open: true,
        message: 'Lịch hẹn đã được xóa thành công',
        severity: 'success'
      });
    }

    handleCloseDeleteDialog();
  };

  // Handle status change
  const handleOpenStatusDialog = (appointment: Appointment) => {
    setAppointmentToChangeStatus(appointment);
    setNewStatus(appointment.status);
    setOpenStatusDialog(true);
  };

  const handleCloseStatusDialog = () => {
    setOpenStatusDialog(false);
    setAppointmentToChangeStatus(null);
  };

  const handleNewStatusChange = (event: SelectChangeEvent) => {
    setNewStatus(event.target.value as AppointmentStatus);
  };

  const handleUpdateStatus = () => {
    if (appointmentToChangeStatus) {
      // In a real app, this would be an API call to update the appointment status
      const updatedAppointments = appointments.map(appointment =>
        appointment.id === appointmentToChangeStatus.id
          ? { ...appointment, status: newStatus }
          : appointment
      );
      setAppointments(updatedAppointments);
      setSnackbar({
        open: true,
        message: 'Trạng thái lịch hẹn đã được cập nhật thành công',
        severity: 'success'
      });
    }

    handleCloseStatusDialog();
  };

  // Handle snackbar close
  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({
      ...prev,
      open: false
    }));
  };

  // Get status display text and color
  const getStatusDisplay = (status: AppointmentStatus) => {
    if (status === 'pending') return { text: 'Chờ xác nhận', color: 'warning' };
    if (status === 'confirmed') return { text: 'Đã xác nhận', color: 'info' };
    if (status === 'completed') return { text: 'Đã hoàn thành', color: 'success' };
    if (status === 'cancelled') return { text: 'Đã hủy', color: 'error' };
    return { text: status, color: 'default' };
  };

  // Get user and consultant names
  const getUserName = (userId: string) => {
    const user = mockUsers.find(u => u.id === userId);
    return user ? `${user.firstName} ${user.lastName}` : 'Unknown';
  };

  const getConsultantName = (consultantId: string) => {
    const consultant = mockConsultants.find(c => c.id === consultantId);
    return consultant ? consultant.name : 'Unknown';
  };

  return (
    <Container>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Quản lý lịch hẹn
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Quản lý tất cả lịch hẹn tư vấn trong hệ thống
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
            <InputLabel id="status-filter-label">Trạng thái</InputLabel>
            <Select
              labelId="status-filter-label"
              id="status-filter"
              value={statusFilter}
              onChange={handleStatusFilterChange}
              label="Trạng thái"
            >
              <MenuItem value="all">Tất cả</MenuItem>
              <MenuItem value="pending">Chờ xác nhận</MenuItem>
              <MenuItem value="confirmed">Đã xác nhận</MenuItem>
              <MenuItem value="completed">Đã hoàn thành</MenuItem>
              <MenuItem value="cancelled">Đã hủy</MenuItem>
            </Select>
          </FormControl>

          <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={vi}>
            <DatePicker
              label="Lọc theo ngày"
              value={dateFilter}
              onChange={handleDateFilterChange}
              slotProps={{ textField: { size: 'small' } }}
            />
          </LocalizationProvider>

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
            Thêm lịch hẹn
          </Button>
        </Box>
      </Paper>

      {/* Appointments Table */}
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 'calc(100vh - 300px)' }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Người dùng</TableCell>
                <TableCell>Chuyên viên</TableCell>
                <TableCell>Ngày</TableCell>
                <TableCell>Thời gian</TableCell>
                <TableCell>Thời lượng</TableCell>
                <TableCell>Trạng thái</TableCell>
                <TableCell align="center">Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredAppointments
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((appointment) => {
                  const statusDisplay = getStatusDisplay(appointment.status);
                  const appointmentDate = new Date(appointment.date);
                  return (
                    <TableRow hover key={appointment.id}>
                      <TableCell>{appointment.id}</TableCell>
                      <TableCell>{getUserName(appointment.userId)}</TableCell>
                      <TableCell>{getConsultantName(appointment.consultantId)}</TableCell>
                      <TableCell>{format(appointmentDate, 'dd/MM/yyyy')}</TableCell>
                      <TableCell>{format(appointmentDate, 'HH:mm')}</TableCell>
                      <TableCell>{appointment.duration} phút</TableCell>
                      <TableCell>
                        <Chip
                          label={statusDisplay.text}
                          color={statusDisplay.color as any}
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title="Thay đổi trạng thái">
                          <IconButton onClick={() => handleOpenStatusDialog(appointment)} color="info">
                            <CheckCircleIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Chỉnh sửa">
                          <IconButton onClick={() => handleOpenEditDialog(appointment)} color="primary">
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Xóa">
                          <IconButton onClick={() => handleOpenDeleteDialog(appointment)} color="error">
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
          count={filteredAppointments.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Số hàng mỗi trang:"
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} của ${count}`}
        />
      </Paper>

      {/* Add/Edit Appointment Dialog */}
      <Dialog open={openAppointmentDialog} onClose={handleCloseAppointmentDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {dialogMode === 'add' ? 'Thêm lịch hẹn mới' : 'Chỉnh sửa lịch hẹn'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <FormControl fullWidth>
              <InputLabel id="user-label">Người dùng</InputLabel>
              <Select
                labelId="user-label"
                id="user"
                value={formData.userId}
                onChange={handleUserChange}
                label="Người dùng"
              >
                {mockUsers.map(user => (
                  <MenuItem key={user.id} value={user.id}>
                    {user.firstName} {user.lastName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel id="consultant-label">Chuyên viên</InputLabel>
              <Select
                labelId="consultant-label"
                id="consultant"
                value={formData.consultantId}
                onChange={handleConsultantChange}
                label="Chuyên viên"
              >
                {mockConsultants.map(consultant => (
                  <MenuItem key={consultant.id} value={consultant.id}>
                    {consultant.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={vi}>
                <DatePicker
                  label="Ngày hẹn"
                  value={formData.date}
                  onChange={handleDateChange}
                  sx={{ width: '50%' }}
                />
              </LocalizationProvider>

              <TextField
                name="time"
                label="Thời gian"
                type="time"
                value={formData.time}
                onChange={handleFormChange}
                InputLabelProps={{ shrink: true }}
                inputProps={{ step: 300 }}
                sx={{ width: '50%' }}
              />
            </Box>

            <TextField
              name="duration"
              label="Thời lượng (phút)"
              type="number"
              fullWidth
              value={formData.duration}
              onChange={handleFormChange}
              InputProps={{ inputProps: { min: 15, step: 15 } }}
            />

            <FormControl fullWidth>
              <InputLabel id="status-label">Trạng thái</InputLabel>
              <Select
                labelId="status-label"
                id="status"
                value={formData.status}
                onChange={handleStatusChange}
                label="Trạng thái"
              >
                <MenuItem value="pending">Chờ xác nhận</MenuItem>
                <MenuItem value="confirmed">Đã xác nhận</MenuItem>
                <MenuItem value="completed">Đã hoàn thành</MenuItem>
                <MenuItem value="cancelled">Đã hủy</MenuItem>
              </Select>
            </FormControl>

            <TextField
              name="notes"
              label="Ghi chú"
              fullWidth
              multiline
              rows={3}
              value={formData.notes}
              onChange={handleFormChange}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAppointmentDialog}>Hủy</Button>
          <Button onClick={handleSaveAppointment} variant="contained" color="primary">
            {dialogMode === 'add' ? 'Thêm' : 'Lưu'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Status Change Dialog */}
      <Dialog open={openStatusDialog} onClose={handleCloseStatusDialog}>
        <DialogTitle>Thay đổi trạng thái lịch hẹn</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 1 }}>
            <FormControl fullWidth>
              <InputLabel id="new-status-label">Trạng thái mới</InputLabel>
              <Select
                labelId="new-status-label"
                id="new-status"
                value={newStatus}
                onChange={handleNewStatusChange}
                label="Trạng thái mới"
              >
                <MenuItem value="pending">Chờ xác nhận</MenuItem>
                <MenuItem value="confirmed">Đã xác nhận</MenuItem>
                <MenuItem value="completed">Đã hoàn thành</MenuItem>
                <MenuItem value="cancelled">Đã hủy</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseStatusDialog}>Hủy</Button>
          <Button onClick={handleUpdateStatus} variant="contained" color="primary">
            Cập nhật
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Xác nhận xóa</DialogTitle>
        <DialogContent>
          <Typography>
            Bạn có chắc chắn muốn xóa lịch hẹn này không?
          </Typography>
          <Typography variant="body2" color="error" sx={{ mt: 2 }}>
            Lưu ý: Hành động này không thể hoàn tác.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Hủy</Button>
          <Button onClick={handleDeleteAppointment} variant="contained" color="error">
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

export default AdminAppointmentsPage;
