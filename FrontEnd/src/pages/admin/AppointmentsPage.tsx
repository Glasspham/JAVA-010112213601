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
  CircularProgress,
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
import { Appointment, AppointmentStatus, Specialist, AppointmentCreateRequest } from '../../types/appointment';
import { AppointmentService } from '../../services/AppointmentService';
import { AuthService } from '../../services/AuthService';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { toast } from 'react-toastify';

const AdminAppointmentsPage: React.FC = () => {
  const appointmentService = new AppointmentService();
  const authService = new AuthService();

  // State for appointments data
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [specialists, setSpecialists] = useState<Specialist[]>([]);
  const [users, setUsers] = useState<Specialist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State for pagination
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // State for search and filter
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [dateFilter, setDateFilter] = useState<Date | null>(null);

  // State for appointment dialog
  const [openAppointmentDialog, setOpenAppointmentDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState<'add' | 'edit'>('add');
  const [currentAppointment, setCurrentAppointment] = useState<Appointment | null>(null);
  const [formData, setFormData] = useState({
    username: '',
    specialistName: '',
    date: new Date(),
    time: '',
    duration: 0
  });

  // Load appointments data
  const loadAppointments = async () => {
    try {
      setLoading(true);
      setError(null);

      const dateParam = dateFilter ? format(dateFilter, 'yyyy-MM-dd') : undefined;

      const [code, data, message] = await appointmentService.findAllAppointments({
        page: page,
        limit: rowsPerPage,
        keyword: searchTerm || undefined,
        status: statusFilter || undefined,
        date: dateParam
      });

      if (code === 200) {
        setAppointments(data.content);
        setTotalPages(data.totalPages);
        setTotalElements(data.totalElements);
      } else {
        setError(message || 'Failed to load appointments');
      }
    } catch (error) {
      console.error('Error loading appointments:', error);
      setError('An error occurred while loading appointments');
    } finally {
      setLoading(false);
    }
  };

  // Load specialists data
  const loadSpecialists = async () => {
    try {
      const [code, data, message] = await appointmentService.getSpecialists();
      if (code === 200) {
        setSpecialists(data);
      } else {
        console.error('Failed to load specialists:', message);
      }
    } catch (error) {
      console.error('Error loading specialists:', error);
    }
  };

  // Load users data
  const loadUsers = async () => {
    try {
      const [code, data, message] = await appointmentService.getUsers();
      if (code === 200) {
        setUsers(data);
      } else {
        console.error('Failed to load users:', message);
      }
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  useEffect(() => {
    loadSpecialists();
    loadUsers();
  }, []);

  useEffect(() => {
    loadAppointments();
  }, [page, rowsPerPage, searchTerm, statusFilter, dateFilter]);

  // Handle pagination changes
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage + 1); // API uses 1-based pagination
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(1);
  };

  // Handle search and filter changes
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setPage(1);
  };

  const handleStatusFilterChange = (event: SelectChangeEvent) => {
    setStatusFilter(event.target.value);
    setPage(1);
  };

  const handleDateFilterChange = (date: Date | null) => {
    setDateFilter(date);
    setPage(1);
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setStatusFilter('');
    setDateFilter(null);
    setPage(1);
  };

  // Handle appointment dialog
  const handleOpenAddDialog = () => {
    setDialogMode('add');
    setFormData({
      username: '',
      specialistName: '',
      date: new Date(),
      time: '',
      duration: 0
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

  const handleUserChange = (event: SelectChangeEvent) => {
    setFormData(prev => ({
      ...prev,
      username: event.target.value
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

  const handleSpecialistChange = (event: SelectChangeEvent) => {
    setFormData(prev => ({
      ...prev,
      specialistName: event.target.value
    }));
  };

  const handleSaveAppointment = async () => {
    // Validate form
    if (!formData.username || !formData.specialistName || !formData.date || !formData.time) {
      toast.error('Vui lòng điền đầy đủ thông tin');
      return;
    }

    // Validate duration
    if (formData.duration <= 0) {
      toast.error('Thời lượng phải lớn hơn 0 phút');
      return;
    }

    // Check if date and time is not in the past
    const now = new Date();
    const selectedDateTime = new Date(formData.date);
    const [hours, minutes] = formData.time.split(':').map(Number);
    selectedDateTime.setHours(hours, minutes, 0, 0);

    if (selectedDateTime <= now) {
      toast.error('Không thể đặt lịch hẹn cho thời gian trong quá khứ hoặc hiện tại');
      return;
    }

    try {
      const appointmentRequest: AppointmentCreateRequest = {
        id: 9007199254740991,
        username: formData.username,
        specialistName: formData.specialistName,
        date: format(formData.date, 'yyyy-MM-dd'),
        hours: formData.time + ':00',
        duration: formData.duration,
        status: 'PENDING'
      };

      const [code, data, message] = await appointmentService.createAppointment(appointmentRequest);

      if (code === 200) {
        toast.success('Lịch hẹn đã được thêm thành công');
        handleCloseAppointmentDialog();
        loadAppointments(); // Reload appointments
      } else {
        toast.error(message || 'Có lỗi xảy ra khi tạo lịch hẹn');
      }
    } catch (error) {
      console.error('Error creating appointment:', error);
      toast.error('Có lỗi xảy ra khi tạo lịch hẹn');
    }
  };

  const handleChangeStatus = async (appointmentId: number, newStatus: string) => {
    try {
      const [code, data, message] = await appointmentService.changeAppointmentStatus(appointmentId, newStatus);

      if (code === 200) {
        toast.success('Cập nhật trạng thái thành công');
        loadAppointments();
      } else {
        toast.error(message || 'Có lỗi xảy ra khi cập nhật trạng thái');
      }
    } catch (error) {
      console.error('Error changing appointment status:', error);
      toast.error('Có lỗi xảy ra khi cập nhật trạng thái');
    }
  };

  // Get status display text and color
  const getStatusDisplay = (status: string) => {
    if (status === 'PENDING') return { text: 'Chờ xác nhận', color: 'warning' };
    if (status === 'CONFIRM') return { text: 'Đã xác nhận', color: 'info' };
    if (status === 'COMPLETE') return { text: 'Đã hoàn thành', color: 'success' };
    if (status === 'CANCEL') return { text: 'Đã hủy', color: 'error' };
    return { text: status, color: 'default' };
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
              <MenuItem value="">Tất cả</MenuItem>
              <MenuItem value="PENDING">Chờ xác nhận</MenuItem>
              <MenuItem value="CONFIRM">Đã xác nhận</MenuItem>
              <MenuItem value="COMPLETE">Đã hoàn thành</MenuItem>
              <MenuItem value="CANCEL">Đã hủy</MenuItem>
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
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    <Alert severity="error">{error}</Alert>
                  </TableCell>
                </TableRow>
              ) : appointments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    Không có dữ liệu
                  </TableCell>
                </TableRow>
              ) : (
                appointments.map((appointment, index) => {
                  const statusDisplay = getStatusDisplay(appointment.status);
                  return (
                    <TableRow hover key={appointment.id}>
                      <TableCell>{index + 1 + (page - 1) * rowsPerPage}</TableCell>
                      <TableCell>{appointment.userFullName}</TableCell>
                      <TableCell>{appointment.specialistFullname}</TableCell>
                      <TableCell>{appointment.date}</TableCell>
                      <TableCell>{appointment.hours}</TableCell>
                      <TableCell>{appointment.duration}</TableCell>
                      <TableCell>
                        <Chip
                          label={statusDisplay.text}
                          color={statusDisplay.color as any}
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="center">
                        {appointment.status === 'PENDING' && (
                          <>
                            <Tooltip title="Xác nhận">
                              <IconButton
                                color="success"
                                onClick={() => handleChangeStatus(appointment.id, 'CONFIRM')}
                                sx={{ mr: 1 }}
                              >
                                <CheckCircleIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Hủy">
                              <IconButton
                                color="error"
                                onClick={() => handleChangeStatus(appointment.id, 'CANCEL')}
                              >
                                <CancelIcon />
                              </IconButton>
                            </Tooltip>
                          </>
                        )}
                        {appointment.status === 'CONFIRM' && (
                          <Tooltip title="Hoàn thành">
                            <IconButton
                              color="primary"
                              onClick={() => handleChangeStatus(appointment.id, 'COMPLETE')}
                            >
                              <CheckCircleIcon />
                            </IconButton>
                          </Tooltip>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={totalElements}
          rowsPerPage={rowsPerPage}
          page={page - 1}
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
                value={formData.username}
                onChange={handleUserChange}
                label="Người dùng"
              >
                {users.map(user => (
                  <MenuItem key={user.id} value={user.username}>
                    {user.fullname} - {user.email}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel id="specialist-label">Chuyên gia</InputLabel>
              <Select
                labelId="specialist-label"
                id="specialist"
                value={formData.specialistName}
                onChange={handleSpecialistChange}
                label="Chuyên gia"
              >
                {specialists.map(specialist => (
                  <MenuItem key={specialist.id} value={specialist.username}>
                    {specialist.fullname} - {specialist.position}
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
                  minDate={new Date()}
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
              InputProps={{ inputProps: { min: 1, step: 15 } }}
              helperText="Thời lượng phải lớn hơn 0 phút"
            />

            <Alert severity="info">
              Trạng thái mặc định sẽ là "Chờ xác nhận" khi tạo lịch hẹn mới.
            </Alert>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAppointmentDialog}>Hủy</Button>
          <Button onClick={handleSaveAppointment} variant="contained" color="primary">
            {dialogMode === 'add' ? 'Thêm' : 'Lưu'}
          </Button>
        </DialogActions>
      </Dialog>


    </Container>
  );
};

export default AdminAppointmentsPage;
