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
  Event as EventIcon,
  LocationOn as LocationIcon
} from '@mui/icons-material';
import { Program, ProgramStatus } from '../../types/program';
import { mockPrograms } from '../../utils/mockData';
import { Link } from 'react-router-dom';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format, isAfter, isBefore } from 'date-fns';
import { vi } from 'date-fns/locale';

const AdminProgramsPage: React.FC = () => {
  // State for programs data
  const [programs, setPrograms] = useState<Program[]>([]);
  const [filteredPrograms, setFilteredPrograms] = useState<Program[]>([]);

  // State for pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // State for search and filter
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<Date | null>(null);

  // State for program dialog
  const [openProgramDialog, setOpenProgramDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState<'add' | 'edit'>('add');
  const [currentProgram, setCurrentProgram] = useState<Program | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    date: new Date(),
    time: '09:00',
    duration: 120,
    capacity: 50,
    registrations: 0,
    status: 'upcoming' as ProgramStatus,
    image: ''
  });

  // State for delete confirmation dialog
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [programToDelete, setProgramToDelete] = useState<Program | null>(null);

  // State for notifications
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'info' | 'warning'
  });

  // Load programs data
  useEffect(() => {
    // In a real app, this would be an API call
    setPrograms(mockPrograms);
    setFilteredPrograms(mockPrograms);
  }, []);

  // Filter programs based on search term, status filter, and date filter
  useEffect(() => {
    let result = [...programs];

    // Apply search filter
    if (searchTerm) {
      result = result.filter(program =>
        program.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        program.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        program.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(program => program.status === statusFilter);
    }

    // Apply date filter
    if (dateFilter) {
      const filterDate = new Date(dateFilter);
      result = result.filter(program => {
        const programDate = new Date(program.date);
        return (
          programDate.getDate() === filterDate.getDate() &&
          programDate.getMonth() === filterDate.getMonth() &&
          programDate.getFullYear() === filterDate.getFullYear()
        );
      });
    }

    setFilteredPrograms(result);
    setPage(0); // Reset to first page when filtering
  }, [searchTerm, statusFilter, dateFilter, programs]);

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

  // Handle program dialog
  const handleOpenAddDialog = () => {
    setDialogMode('add');
    setFormData({
      title: '',
      description: '',
      location: '',
      date: new Date(),
      time: '09:00',
      duration: 120,
      capacity: 50,
      registrations: 0,
      status: 'upcoming' as ProgramStatus,
      image: ''
    });
    setOpenProgramDialog(true);
  };

  const handleOpenEditDialog = (program: Program) => {
    setDialogMode('edit');
    setCurrentProgram(program);

    const programDate = new Date(program.date);
    const programTime = format(programDate, 'HH:mm');

    setFormData({
      title: program.title,
      description: program.description,
      location: program.location,
      date: programDate,
      time: programTime,
      duration: program.duration,
      capacity: program.capacity,
      registrations: program.registrations,
      status: program.status,
      image: program.image || ''
    });
    setOpenProgramDialog(true);
  };

  const handleCloseProgramDialog = () => {
    setOpenProgramDialog(false);
    setCurrentProgram(null);
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
      status: event.target.value as ProgramStatus
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

  const handleSaveProgram = () => {
    // Validate form
    if (!formData.title || !formData.description || !formData.location || !formData.date || !formData.time) {
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
      // In a real app, this would be an API call to create a new program
      const newProgram: Program = {
        id: String(Date.now()),
        title: formData.title,
        description: formData.description,
        location: formData.location,
        date: dateTime,
        duration: formData.duration,
        capacity: formData.capacity,
        registrations: formData.registrations,
        status: formData.status,
        image: formData.image,
        createdAt: new Date()
      };

      setPrograms(prev => [...prev, newProgram]);
      setSnackbar({
        open: true,
        message: 'Chương trình đã được thêm thành công',
        severity: 'success'
      });
    } else {
      // In a real app, this would be an API call to update the program
      if (currentProgram) {
        const updatedPrograms = programs.map(program =>
          program.id === currentProgram.id
            ? {
                ...program,
                title: formData.title,
                description: formData.description,
                location: formData.location,
                date: dateTime,
                duration: formData.duration,
                capacity: formData.capacity,
                registrations: formData.registrations,
                status: formData.status,
                image: formData.image
              }
            : program
        );
        setPrograms(updatedPrograms);
        setSnackbar({
          open: true,
          message: 'Chương trình đã được cập nhật thành công',
          severity: 'success'
        });
      }
    }

    handleCloseProgramDialog();
  };

  // Handle delete program
  const handleOpenDeleteDialog = (program: Program) => {
    setProgramToDelete(program);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setProgramToDelete(null);
  };

  const handleDeleteProgram = () => {
    if (programToDelete) {
      // In a real app, this would be an API call to delete the program
      const updatedPrograms = programs.filter(program => program.id !== programToDelete.id);
      setPrograms(updatedPrograms);
      setSnackbar({
        open: true,
        message: 'Chương trình đã được xóa thành công',
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

  // Get status display text and color
  const getStatusDisplay = (status: ProgramStatus) => {
    if (status === 'upcoming') return { text: 'Sắp diễn ra', color: 'info' };
    if (status === 'ongoing') return { text: 'Đang diễn ra', color: 'warning' };
    if (status === 'completed') return { text: 'Đã hoàn thành', color: 'success' };
    if (status === 'cancelled') return { text: 'Đã hủy', color: 'error' };
    return { text: status, color: 'default' };
  };

  // Calculate registration percentage
  const getRegistrationPercentage = (program: Program) => {
    return Math.round((program.registrations / program.capacity) * 100);
  };

  return (
    <Container>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Quản lý chương trình cộng đồng
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Quản lý tất cả chương trình cộng đồng trong hệ thống
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
              <MenuItem value="upcoming">Sắp diễn ra</MenuItem>
              <MenuItem value="ongoing">Đang diễn ra</MenuItem>
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
            Thêm chương trình
          </Button>
        </Box>
      </Paper>

      {/* Programs Table */}
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 'calc(100vh - 300px)' }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Tiêu đề</TableCell>
                <TableCell>Địa điểm</TableCell>
                <TableCell>Ngày</TableCell>
                <TableCell>Thời gian</TableCell>
                <TableCell>Sức chứa</TableCell>
                <TableCell>Đã đăng ký</TableCell>
                <TableCell>Trạng thái</TableCell>
                <TableCell align="center">Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredPrograms
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((program) => {
                  const statusDisplay = getStatusDisplay(program.status);
                  const programDate = new Date(program.date);
                  return (
                    <TableRow hover key={program.id}>
                      <TableCell>{program.id}</TableCell>
                      <TableCell>{program.title}</TableCell>
                      <TableCell>{program.location}</TableCell>
                      <TableCell>{format(programDate, 'dd/MM/yyyy')}</TableCell>
                      <TableCell>{format(programDate, 'HH:mm')}</TableCell>
                      <TableCell>{program.capacity}</TableCell>
                      <TableCell>
                        {program.registrations} ({getRegistrationPercentage(program)}%)
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={statusDisplay.text}
                          color={statusDisplay.color as any}
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title="Xem chi tiết">
                          <IconButton component={Link} to={`/programs/${program.id}`} color="info">
                            <VisibilityIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Chỉnh sửa">
                          <IconButton onClick={() => handleOpenEditDialog(program)} color="primary">
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Xóa">
                          <IconButton onClick={() => handleOpenDeleteDialog(program)} color="error">
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
          count={filteredPrograms.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Số hàng mỗi trang:"
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} của ${count}`}
        />
      </Paper>

      {/* Add/Edit Program Dialog */}
      <Dialog open={openProgramDialog} onClose={handleCloseProgramDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {dialogMode === 'add' ? 'Thêm chương trình mới' : 'Chỉnh sửa chương trình'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              name="title"
              label="Tiêu đề"
              fullWidth
              value={formData.title}
              onChange={handleFormChange}
            />

            <TextField
              name="description"
              label="Mô tả"
              fullWidth
              multiline
              rows={3}
              value={formData.description}
              onChange={handleFormChange}
            />

            <TextField
              name="location"
              label="Địa điểm"
              fullWidth
              value={formData.location}
              onChange={handleFormChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LocationIcon />
                  </InputAdornment>
                ),
              }}
            />

            <Box sx={{ display: 'flex', gap: 2 }}>
              <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={vi}>
                <DatePicker
                  label="Ngày"
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

            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                name="duration"
                label="Thời lượng (phút)"
                type="number"
                fullWidth
                value={formData.duration}
                onChange={handleFormChange}
                InputProps={{ inputProps: { min: 30 } }}
              />

              <TextField
                name="capacity"
                label="Sức chứa"
                type="number"
                fullWidth
                value={formData.capacity}
                onChange={handleFormChange}
                InputProps={{ inputProps: { min: 1 } }}
              />
            </Box>

            <TextField
              name="registrations"
              label="Số lượng đã đăng ký"
              type="number"
              fullWidth
              value={formData.registrations}
              onChange={handleFormChange}
              InputProps={{ inputProps: { min: 0 } }}
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
                <MenuItem value="upcoming">Sắp diễn ra</MenuItem>
                <MenuItem value="ongoing">Đang diễn ra</MenuItem>
                <MenuItem value="completed">Đã hoàn thành</MenuItem>
                <MenuItem value="cancelled">Đã hủy</MenuItem>
              </Select>
            </FormControl>

            <TextField
              name="image"
              label="URL hình ảnh"
              fullWidth
              value={formData.image}
              onChange={handleFormChange}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseProgramDialog}>Hủy</Button>
          <Button onClick={handleSaveProgram} variant="contained" color="primary">
            {dialogMode === 'add' ? 'Thêm' : 'Lưu'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Xác nhận xóa</DialogTitle>
        <DialogContent>
          <Typography>
            Bạn có chắc chắn muốn xóa chương trình "{programToDelete?.title}" không?
          </Typography>
          <Typography variant="body2" color="error" sx={{ mt: 2 }}>
            Lưu ý: Hành động này không thể hoàn tác.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Hủy</Button>
          <Button onClick={handleDeleteProgram} variant="contained" color="error">
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

export default AdminProgramsPage;
