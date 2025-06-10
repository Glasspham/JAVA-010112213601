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
  SelectChangeEvent,
  Grid
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
import { toast } from 'react-toastify';
import { ProgramService } from '../../services/ProgramService';
import { ProgramDTO } from '../../dto/ProgramDTO';
import { ProgramSearch } from '../../dto/ProgramSearch';

const AdminProgramsPage: React.FC = () => {
  // State for programs data
  const [programs, setPrograms] = useState<Program[]>([]);
  const [filteredPrograms, setFilteredPrograms] = useState<Program[]>([]);

  // NEW STATE FOR API CALLS
  const _programService = new ProgramService();
  const [programSearch, setProgramSearch] = useState(new ProgramSearch());
  const [listProgram, setListProgram] = useState<any[]>([]); // Using any[] for now, will map to Program[]
  const [totalPage, setTotalPage] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  // State for pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(programSearch.limit);

  // State for search and filter
  const [searchTerm, setSearchTerm] = useState(programSearch.keyword || '');
  const [statusFilter, setStatusFilter] = useState(programSearch.status || 'all');
  const [dateFilter, setDateFilter] = useState<Date | null>(programSearch.date ? new Date(programSearch.date) : null);

  // State for program dialog
  const [openProgramDialog, setOpenProgramDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState<'add' | 'edit'>('add');
  const [currentProgram, setCurrentProgram] = useState<Program | null>(null);
  const [formData, setFormData] = useState({
    id: 0,
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

  // Helper function to map ProgramDTO from API to UI's Program interface
  const mapProgramDTOToProgram = (dto: ProgramDTO & { time?: string, countParticipant?: number }): Program => {
    // Xử lý an toàn cho date và time
    let programDate: Date;
    try {
      // Đảm bảo dto.date có định dạng yyyy-MM-dd
      const dateStr = dto.date || new Date().toISOString().split('T')[0];
      const [year, month, day] = dateStr.split('-').map(Number);
      
      // Đảm bảo hourse và minus là số hợp lệ
      const hourse = Math.max(0, Math.min(23, dto.hourse || 0));
      const minus = Math.max(0, Math.min(59, dto.minus || 0));
      
      programDate = new Date(year, month - 1, day, hourse, minus);
      
      // Kiểm tra tính hợp lệ của date
      if (isNaN(programDate.getTime())) {
        console.warn('Invalid date detected, using current date');
        programDate = new Date();
      }
    } catch (error) {
      console.error('Error creating date:', error);
      programDate = new Date();
    }

    return {
      id: dto.id.toString(),
      title: dto.title,
      description: '',
      location: dto.address,
      date: programDate,
      duration: ((dto.hourse || 0) * 60) + (dto.minus || 0),
      capacity: dto.capacity,
      registrations: dto.countParticipant || 0,
      status: dto.status as ProgramStatus,
      image: '',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  };

  // Helper function to map UI's formData to ProgramDTO for API calls
  const mapFormDataToProgramDTO = (data: typeof formData): ProgramDTO => {
    const programDTO = new ProgramDTO();
    programDTO.id = data.id;
    programDTO.title = data.title;
    programDTO.address = data.location; // Map location to address
    programDTO.date = format(data.date, 'yyyy-MM-dd'); // Format date to YYYY-MM-DD
    programDTO.hourse = parseInt(data.time.split(':')[0]);
    programDTO.minus = parseInt(data.time.split(':')[1]);
    programDTO.status = data.status;
    programDTO.capacity = data.capacity;
    return programDTO;
  };

  // Load programs data from API
  useEffect(() => {
    const findAllPrograms = async () => {
      try {
        const [code, pageData, message] = await _programService.findAll(programSearch);
        if (code === 200 && pageData && pageData.content) {
          const mappedPrograms = pageData.content.map((dto: ProgramDTO & { time?: string, countParticipant?: number }) => mapProgramDTOToProgram(dto));
          setListProgram(mappedPrograms); // Keep raw mapped list for display
          setPrograms(mappedPrograms); // Update main programs state
          setFilteredPrograms(mappedPrograms); // Update filtered programs state directly
          setTotalPage(pageData.totalPages);
          setTotalElements(pageData.totalElements);
        } else {
          toast.error(`Lỗi khi tải dữ liệu chương trình: ${message}`);
        }
      } catch (error: any) {
        toast.error(`Lỗi kết nối khi tải dữ liệu chương trình: ${error.message}`);
      }
    };

    findAllPrograms();
  }, [programSearch.timer, programSearch.page, programSearch.limit]); // Trigger on timer, page, or limit change

  // Existing useEffect for filtering - this will now primarily work on `programs` (the mapped data)
  useEffect(() => {
    let result = [...programs]; // Use the full list from API

    // Apply search filter
    if (searchTerm) {
      result = result.filter(program =>
        program.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        program.description.toLowerCase().includes(searchTerm.toLowerCase()) || // description is empty now, might not work as intended
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
  }, [searchTerm, statusFilter, dateFilter, programs]); // programs is now updated by API call

  // Handle pagination changes
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage); // MUI uses 0-indexed
    setProgramSearch(prev => ({
      ...prev,
      page: newPage + 1, // API uses 1-indexed
      timer: Date.now() // Trigger useEffect
    }));
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newLimit = parseInt(event.target.value, 10);
    setRowsPerPage(newLimit);
    setPage(0); // Reset to first page
    setProgramSearch(prev => ({
      ...prev,
      limit: newLimit,
      page: 1, // API uses 1-indexed
      timer: Date.now() // Trigger useEffect
    }));
  };

  // Handle search and filter changes - call api
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setProgramSearch(prev => ({
      ...prev,
      keyword: event.target.value,
      page: 1, // Reset page on new search
      timer: Date.now()
    }));
  };

  const handleStatusFilterChange = (event: SelectChangeEvent) => {
    const selectedStatus = event.target.value;
    setStatusFilter(selectedStatus);
    setProgramSearch(prev => ({
      ...prev,
      status: selectedStatus === 'all' ? null : selectedStatus,
      page: 1, // Reset page on new filter
      timer: Date.now()
    }));
  };

  const handleDateFilterChange = (date: Date | null) => {
    setDateFilter(date);
    setProgramSearch(prev => ({
      ...prev,
      date: date ? format(date, 'yyyy-MM-dd') : null,
      page: 1, // Reset page on new filter
      timer: Date.now()
    }));
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setDateFilter(null);
    setProgramSearch(prev => ({
      ...prev,
      keyword: null,
      status: null,
      date: null,
      page: 1, // Reset page
      timer: Date.now()
    }));
  };

  // Handle program dialog
  const handleOpenAddDialog = () => {
    setDialogMode('add');
    setFormData({
      id: 0,
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

    // Retrieve full DTO data to fill form if needed, or rely on existing Program data
    // Assuming Program object has enough data for editing (e.g. date, time extracted from date object)
    const programDate = new Date(program.date);
    const programTime = format(programDate, 'HH:mm'); // Format date object back to HH:mm string

    setFormData({
      id: parseInt(program.id), // Convert string ID back to number for DTO
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

  const handleSaveProgram = async () => {
    if (!formData.title || !formData.location || !formData.date || !formData.time || !formData.capacity) {
      toast.error('Vui lòng điền đầy đủ thông tin bắt buộc.');
      return;
    }

    try {
      const programDTO = mapFormDataToProgramDTO(formData);
      let code, data, message;

      if (dialogMode === 'add') {
        [code, data, message] = await _programService.createProgram(programDTO);
      } else {
        [code, data, message] = await _programService.updateProgram(programDTO.id, programDTO);
      }

      if (code === 200) {
        toast.success(message || `Chương trình đã được ${dialogMode === 'add' ? 'thêm' : 'cập nhật'} thành công!`);
        handleCloseProgramDialog();
        // Trigger a refresh of the program list
        setProgramSearch(prev => ({
          ...prev,
          timer: Date.now()
        }));
      } else {
        toast.error(message || `Đã có lỗi xảy ra khi ${dialogMode === 'add' ? 'thêm' : 'cập nhật'} chương trình.`);
      }
    } catch (error: any) {
      toast.error(`Lỗi kết nối: ${error.message}`);
    }
  };

  const handleOpenDeleteDialog = (program: Program) => {
    setProgramToDelete(program);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setProgramToDelete(null);
  };

  const handleDeleteProgram = async () => {
    if (programToDelete) {
      try {
        const [code, data, message] = await _programService.deleteProgram(parseInt(programToDelete.id)); // Convert ID to number
        if (code === 200) {
          toast.success(message || 'Chương trình đã được xóa thành công!');
          handleCloseDeleteDialog();
          // Trigger a refresh of the program list
          setProgramSearch(prev => ({
            ...prev,
            timer: Date.now()
          }));
        } else {
          toast.error(message || 'Đã có lỗi xảy ra khi xóa chương trình.');
        }
      } catch (error: any) {
        toast.error(`Lỗi kết nối: ${error.message}`);
      }
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const getStatusDisplay = (status: ProgramStatus) => {
    switch (status) {
      case 'upcoming':
        return 'Sắp diễn ra';
      case 'ongoing':
        return 'Đang diễn ra';
      case 'completed':
        return 'Đã hoàn thành';
      case 'cancelled':
        return 'Đã hủy';
      default:
        return status;
    }
  };

  const getRegistrationPercentage = (program: Program) => {
    if (program.capacity === 0) return '0%';
    const percentage = (program.registrations / program.capacity) * 100;
    return `${percentage.toFixed(0)}%`;
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          Quản lý Chương trình Cộng đồng
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Thêm, chỉnh sửa và quản lý các chương trình, sự kiện phòng chống tệ nạn xã hội
        </Typography>
      </Box>

      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <TextField
            label="Tìm kiếm chương trình"
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ width: '40%' }}
          />
          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel>Trạng thái</InputLabel>
            <Select value={statusFilter} onChange={handleStatusFilterChange} label="Trạng thái">
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
              format="dd/MM/yyyy"
            />
          </LocalizationProvider>
          <Button variant="outlined" onClick={handleResetFilters}>
            Đặt lại bộ lọc
          </Button>
          <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenAddDialog}>
            Thêm chương trình
          </Button>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Tiêu đề</TableCell>
                <TableCell>Địa điểm</TableCell>
                <TableCell>Ngày</TableCell>
                <TableCell>Thời gian</TableCell>
                <TableCell>Sức chứa</TableCell>
                <TableCell>Đã đăng ký</TableCell>
                <TableCell>Trạng thái</TableCell>
                <TableCell align="right">Hành động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredPrograms.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((program) => (
                <TableRow key={program.id}>
                  <TableCell>
                    <Link to={`/programs/${program.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                      <Typography variant="body1" fontWeight="medium">{program.title}</Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                        {program.description ? program.description.substring(0, 50) + '...' : 'Không có mô tả'}
                      </Typography>
                    </Link>
                  </TableCell>
                  <TableCell>{program.location}</TableCell>
                  <TableCell>{format(new Date(program.date), 'dd/MM/yyyy')}</TableCell>
                  <TableCell>{format(new Date(program.date), 'HH:mm')}</TableCell> {/* Using program.date directly which is a Date object now */}
                  <TableCell>{program.capacity}</TableCell>
                  <TableCell>{program.registrations}</TableCell>
                  <TableCell>
                    <Chip
                      label={getStatusDisplay(program.status)}
                      color={
                        program.status === 'upcoming' ? 'info' :
                          program.status === 'ongoing' ? 'success' :
                            program.status === 'completed' ? 'default' :
                              'error'
                      }
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="Chi tiết">
                      <IconButton component={Link} to={`/programs/${program.id}`} color="info">
                        <VisibilityIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Chỉnh sửa">
                      <IconButton color="primary" onClick={() => handleOpenEditDialog(program)}>
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Xóa">
                      <IconButton color="error" onClick={() => handleOpenDeleteDialog(program)}>
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
              {filteredPrograms.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    Không có chương trình nào được tìm thấy.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={totalElements} // Use totalElements from API
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Số hàng mỗi trang:"
          labelDisplayedRows={({ from, to, count }) =>
            `Hiển thị ${from}-${to} trên ${count !== -1 ? count : `hơn ${to}`}`
          }
        />
      </Paper>

      {/* Program Dialog (Add/Edit) */}
      <Dialog open={openProgramDialog} onClose={handleCloseProgramDialog} maxWidth="md" fullWidth>
        <DialogTitle>{dialogMode === 'add' ? 'Thêm Chương trình mới' : 'Chỉnh sửa Chương trình'}</DialogTitle>
        <DialogContent dividers>
          <TextField
            autoFocus
            margin="dense"
            name="title"
            label="Tiêu đề chương trình"
            type="text"
            fullWidth
            variant="outlined"
            value={formData.title}
            onChange={handleFormChange}
            sx={{ mb: 2 }}
            required
          />
          <TextField
            margin="dense"
            name="location" // Mapped to address in DTO
            label="Địa điểm"
            type="text"
            fullWidth
            variant="outlined"
            value={formData.location}
            onChange={handleFormChange}
            sx={{ mb: 2 }}
            required
          />
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2, mb: 2 }}>
            <Box>
              <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={vi}>
                <DatePicker
                  label="Ngày diễn ra"
                  value={formData.date}
                  onChange={handleDateChange}
                  format="dd/MM/yyyy"
                  sx={{ width: '100%' }}
                />
              </LocalizationProvider>
            </Box>
            <Box>
              <TextField
                margin="dense"
                name="time"
                label="Thời gian (HH:mm)"
                type="time"
                fullWidth
                variant="outlined"
                value={formData.time}
                onChange={handleFormChange}
                InputLabelProps={{
                  shrink: true,
                }}
                inputProps={{
                  step: 300, // 5 minute intervals
                }}
                required
              />
            </Box>
          </Box>
          <TextField
            margin="dense"
            name="capacity"
            label="Sức chứa"
            type="number"
            fullWidth
            variant="outlined"
            value={formData.capacity}
            onChange={handleFormChange}
            sx={{ mb: 2 }}
            required
            inputProps={{ min: 0 }}
          />
          <FormControl fullWidth margin="dense" sx={{ mb: 2 }}>
            <InputLabel>Trạng thái</InputLabel>
            <Select
              name="status"
              value={formData.status}
              label="Trạng thái"
              onChange={handleStatusChange}
              required
            >
              <MenuItem value="upcoming">Sắp diễn ra</MenuItem>
              <MenuItem value="ongoing">Đang diễn ra</MenuItem>
              <MenuItem value="completed">Đã hoàn thành</MenuItem>
              <MenuItem value="cancelled">Đã hủy</MenuItem>
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            name="description"
            label="Mô tả chương trình"
            type="text"
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            value={formData.description}
            onChange={handleFormChange}
            sx={{ mb: 2 }}
            // Not required for API, but for UI it can be
          />
          {/* Image field is not handled by API, so remove or keep as UI only */}
          {/* <TextField
            margin="dense"
            name="image"
            label="URL ảnh đại diện"
            type="text"
            fullWidth
            variant="outlined"
            value={formData.image}
            onChange={handleFormChange}
            sx={{ mb: 2 }}
          /> */}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseProgramDialog}>Hủy</Button>
          <Button onClick={handleSaveProgram} variant="contained" color="primary">
            {dialogMode === 'add' ? 'Thêm' : 'Cập nhật'}
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
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Hủy</Button>
          <Button onClick={handleDeleteProgram} color="error" variant="contained">
            Xóa
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default AdminProgramsPage;
