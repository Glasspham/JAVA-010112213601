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
  Avatar,
  Rating,
  SelectChangeEvent
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
  Visibility as VisibilityIcon,
  Phone as PhoneIcon,
  Email as EmailIcon
} from '@mui/icons-material';
import { Consultant, ConsultantSpecialty } from '../../types/consultant';
import { mockConsultants } from '../../utils/mockData';
import { Link } from 'react-router-dom';

const AdminConsultantsPage: React.FC = () => {
  // State for consultants data
  const [consultants, setConsultants] = useState<Consultant[]>([]);
  const [filteredConsultants, setFilteredConsultants] = useState<Consultant[]>([]);

  // State for pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // State for search and filter
  const [searchTerm, setSearchTerm] = useState('');
  const [specialtyFilter, setSpecialtyFilter] = useState<string>('all');

  // State for consultant dialog
  const [openConsultantDialog, setOpenConsultantDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState<'add' | 'edit'>('add');
  const [currentConsultant, setCurrentConsultant] = useState<Consultant | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    specialty: [] as ConsultantSpecialty[],
    bio: '',
    email: '',
    phone: '',
    avatar: '',
    rating: 5,
    availability: true
  });

  // State for delete confirmation dialog
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [consultantToDelete, setConsultantToDelete] = useState<Consultant | null>(null);

  // State for notifications
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'info' | 'warning'
  });

  // Load consultants data
  useEffect(() => {
    // In a real app, this would be an API call
    setConsultants(mockConsultants);
    setFilteredConsultants(mockConsultants);
  }, []);

  // Filter consultants based on search term and specialty filter
  useEffect(() => {
    let result = [...consultants];

    // Apply search filter
    if (searchTerm) {
      result = result.filter(consultant =>
        consultant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        consultant.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        consultant.bio.toLowerCase().includes(searchTerm.toLowerCase()) ||
        consultant.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        consultant.phone.includes(searchTerm)
      );
    }

    // Apply specialty filter
    if (specialtyFilter !== 'all') {
      result = result.filter(consultant =>
        consultant.specialty.includes(specialtyFilter as ConsultantSpecialty)
      );
    }

    setFilteredConsultants(result);
    setPage(0); // Reset to first page when filtering
  }, [searchTerm, specialtyFilter, consultants]);

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

  const handleSpecialtyFilterChange = (event: SelectChangeEvent) => {
    setSpecialtyFilter(event.target.value);
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setSpecialtyFilter('all');
  };

  // Handle consultant dialog
  const handleOpenAddDialog = () => {
    setDialogMode('add');
    setFormData({
      name: '',
      title: '',
      specialty: [],
      bio: '',
      email: '',
      phone: '',
      avatar: '',
      rating: 5,
      availability: true
    });
    setOpenConsultantDialog(true);
  };

  const handleOpenEditDialog = (consultant: Consultant) => {
    setDialogMode('edit');
    setCurrentConsultant(consultant);
    setFormData({
      name: consultant.name,
      title: consultant.title,
      specialty: [...consultant.specialty],
      bio: consultant.bio,
      email: consultant.email,
      phone: consultant.phone,
      avatar: consultant.avatar || '',
      rating: consultant.rating,
      availability: consultant.availability
    });
    setOpenConsultantDialog(true);
  };

  const handleCloseConsultantDialog = () => {
    setOpenConsultantDialog(false);
    setCurrentConsultant(null);
  };

  const handleFormChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRatingChange = (event: React.SyntheticEvent, newValue: number | null) => {
    setFormData(prev => ({
      ...prev,
      rating: newValue || 5
    }));
  };

  const handleAvailabilityChange = (event: SelectChangeEvent) => {
    setFormData(prev => ({
      ...prev,
      availability: event.target.value === 'true'
    }));
  };

  const handleSpecialtyChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value;
    setFormData(prev => ({
      ...prev,
      specialty: typeof value === 'string' ? [value as ConsultantSpecialty] : value as ConsultantSpecialty[]
    }));
  };

  const handleSaveConsultant = () => {
    // Validate form
    if (!formData.name || !formData.title || !formData.specialty.length || !formData.bio || !formData.email || !formData.phone) {
      setSnackbar({
        open: true,
        message: 'Vui lòng điền đầy đủ thông tin',
        severity: 'error'
      });
      return;
    }

    if (dialogMode === 'add') {
      // In a real app, this would be an API call to create a new consultant
      const newConsultant: Consultant = {
        id: String(Date.now()),
        name: formData.name,
        title: formData.title,
        specialty: formData.specialty,
        bio: formData.bio,
        email: formData.email,
        phone: formData.phone,
        avatar: formData.avatar,
        rating: formData.rating,
        availability: formData.availability,
        createdAt: new Date()
      };

      setConsultants(prev => [...prev, newConsultant]);
      setSnackbar({
        open: true,
        message: 'Chuyên viên đã được thêm thành công',
        severity: 'success'
      });
    } else {
      // In a real app, this would be an API call to update the consultant
      if (currentConsultant) {
        const updatedConsultants = consultants.map(consultant =>
          consultant.id === currentConsultant.id
            ? {
                ...consultant,
                name: formData.name,
                title: formData.title,
                specialty: formData.specialty,
                bio: formData.bio,
                email: formData.email,
                phone: formData.phone,
                avatar: formData.avatar,
                rating: formData.rating,
                availability: formData.availability
              }
            : consultant
        );
        setConsultants(updatedConsultants);
        setSnackbar({
          open: true,
          message: 'Chuyên viên đã được cập nhật thành công',
          severity: 'success'
        });
      }
    }

    handleCloseConsultantDialog();
  };

  // Handle delete consultant
  const handleOpenDeleteDialog = (consultant: Consultant) => {
    setConsultantToDelete(consultant);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setConsultantToDelete(null);
  };

  const handleDeleteConsultant = () => {
    if (consultantToDelete) {
      // In a real app, this would be an API call to delete the consultant
      const updatedConsultants = consultants.filter(consultant => consultant.id !== consultantToDelete.id);
      setConsultants(updatedConsultants);
      setSnackbar({
        open: true,
        message: 'Chuyên viên đã được xóa thành công',
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

  // Get specialty display text
  const getSpecialtyDisplay = (specialty: ConsultantSpecialty) => {
    if (specialty === 'addiction') return 'Nghiện';
    if (specialty === 'youth') return 'Thanh thiếu niên';
    if (specialty === 'family') return 'Gia đình';
    if (specialty === 'education') return 'Giáo dục';
    if (specialty === 'mental_health') return 'Sức khỏe tâm thần';
    return specialty;
  };

  return (
    <Container>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Quản lý chuyên viên tư vấn
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Quản lý tất cả chuyên viên tư vấn trong hệ thống
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
            <InputLabel id="specialty-filter-label">Chuyên môn</InputLabel>
            <Select
              labelId="specialty-filter-label"
              id="specialty-filter"
              value={specialtyFilter}
              onChange={handleSpecialtyFilterChange}
              label="Chuyên môn"
            >
              <MenuItem value="all">Tất cả</MenuItem>
              <MenuItem value="addiction">Nghiện</MenuItem>
              <MenuItem value="youth">Thanh thiếu niên</MenuItem>
              <MenuItem value="family">Gia đình</MenuItem>
              <MenuItem value="education">Giáo dục</MenuItem>
              <MenuItem value="mental_health">Sức khỏe tâm thần</MenuItem>
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
            Thêm chuyên viên
          </Button>
        </Box>
      </Paper>

      {/* Consultants Table */}
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 'calc(100vh - 300px)' }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Chuyên viên</TableCell>
                <TableCell>Chức danh</TableCell>
                <TableCell>Chuyên môn</TableCell>
                <TableCell>Liên hệ</TableCell>
                <TableCell>Đánh giá</TableCell>
                <TableCell>Trạng thái</TableCell>
                <TableCell align="center">Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredConsultants
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((consultant) => (
                  <TableRow hover key={consultant.id}>
                    <TableCell>{consultant.id}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar
                          src={consultant.avatar}
                          alt={consultant.name}
                          sx={{ mr: 2, width: 40, height: 40 }}
                        />
                        {consultant.name}
                      </Box>
                    </TableCell>
                    <TableCell>{consultant.title}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {consultant.specialty.map((spec) => (
                          <Chip
                            key={spec}
                            label={getSpecialtyDisplay(spec)}
                            size="small"
                            color="primary"
                            variant="outlined"
                          />
                        ))}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <EmailIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                          {consultant.email}
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                          <PhoneIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                          {consultant.phone}
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Rating value={consultant.rating} readOnly size="small" />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={consultant.availability ? 'Đang hoạt động' : 'Không hoạt động'}
                        color={consultant.availability ? 'success' : 'error'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="Xem chi tiết">
                        <IconButton component={Link} to={`/consultants/${consultant.id}`} color="info">
                          <VisibilityIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Chỉnh sửa">
                        <IconButton onClick={() => handleOpenEditDialog(consultant)} color="primary">
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Xóa">
                        <IconButton onClick={() => handleOpenDeleteDialog(consultant)} color="error">
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={filteredConsultants.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Số hàng mỗi trang:"
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} của ${count}`}
        />
      </Paper>

      {/* Add/Edit Consultant Dialog */}
      <Dialog open={openConsultantDialog} onClose={handleCloseConsultantDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {dialogMode === 'add' ? 'Thêm chuyên viên mới' : 'Chỉnh sửa chuyên viên'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              name="name"
              label="Họ tên"
              fullWidth
              value={formData.name}
              onChange={handleFormChange}
            />

            <TextField
              name="title"
              label="Chức danh"
              fullWidth
              value={formData.title}
              onChange={handleFormChange}
            />

            <FormControl fullWidth>
              <InputLabel id="specialty-label">Chuyên môn</InputLabel>
              <Select
                labelId="specialty-label"
                id="specialty"
                multiple
                value={formData.specialty}
                onChange={handleSpecialtyChange}
                label="Chuyên môn"
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {(selected as ConsultantSpecialty[]).map((value) => (
                      <Chip key={value} label={getSpecialtyDisplay(value)} />
                    ))}
                  </Box>
                )}
              >
                <MenuItem value="addiction">Nghiện</MenuItem>
                <MenuItem value="youth">Thanh thiếu niên</MenuItem>
                <MenuItem value="family">Gia đình</MenuItem>
                <MenuItem value="education">Giáo dục</MenuItem>
                <MenuItem value="mental_health">Sức khỏe tâm thần</MenuItem>
              </Select>
            </FormControl>

            <TextField
              name="bio"
              label="Tiểu sử"
              fullWidth
              multiline
              rows={3}
              value={formData.bio}
              onChange={handleFormChange}
            />

            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                name="email"
                label="Email"
                fullWidth
                value={formData.email}
                onChange={handleFormChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                name="phone"
                label="Số điện thoại"
                fullWidth
                value={formData.phone}
                onChange={handleFormChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PhoneIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            <TextField
              name="avatar"
              label="URL ảnh đại diện"
              fullWidth
              value={formData.avatar}
              onChange={handleFormChange}
            />

            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Đánh giá
              </Typography>
              <Rating
                name="rating"
                value={formData.rating}
                onChange={handleRatingChange}
                precision={0.5}
              />
            </Box>

            <FormControl fullWidth>
              <InputLabel id="availability-label">Trạng thái</InputLabel>
              <Select
                labelId="availability-label"
                id="availability"
                value={formData.availability.toString()}
                onChange={handleAvailabilityChange}
                label="Trạng thái"
              >
                <MenuItem value="true">Đang hoạt động</MenuItem>
                <MenuItem value="false">Không hoạt động</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConsultantDialog}>Hủy</Button>
          <Button onClick={handleSaveConsultant} variant="contained" color="primary">
            {dialogMode === 'add' ? 'Thêm' : 'Lưu'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Xác nhận xóa</DialogTitle>
        <DialogContent>
          <Typography>
            Bạn có chắc chắn muốn xóa chuyên viên "{consultantToDelete?.name}" không?
          </Typography>
          <Typography variant="body2" color="error" sx={{ mt: 2 }}>
            Lưu ý: Hành động này không thể hoàn tác.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Hủy</Button>
          <Button onClick={handleDeleteConsultant} variant="contained" color="error">
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

export default AdminConsultantsPage;
