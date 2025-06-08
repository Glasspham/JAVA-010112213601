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
  Grid,
  InputAdornment,
  Alert,
  Snackbar,
  FormGroup,
  FormControlLabel,
  Checkbox,
  SelectChangeEvent
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
  Visibility as VisibilityIcon
} from '@mui/icons-material';
import { Course, AudienceType } from '../../types/course';
import { mockCourses } from '../../utils/mockData';
import { Link } from 'react-router-dom';

const AdminCoursesPage: React.FC = () => {
  // State for courses data
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);

  // State for pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // State for search and filter
  const [searchTerm, setSearchTerm] = useState('');
  const [audienceFilter, setAudienceFilter] = useState<string>('all');

  // State for course dialog
  const [openCourseDialog, setOpenCourseDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState<'add' | 'edit'>('add');
  const [currentCourse, setCurrentCourse] = useState<Course | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    audienceType: [] as AudienceType[],
    duration: 60,
    thumbnail: '',
    content: ''
  });

  // State for delete confirmation dialog
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState<Course | null>(null);

  // State for notifications
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'info' | 'warning'
  });

  // Load courses data
  useEffect(() => {
    // In a real app, this would be an API call
    setCourses(mockCourses);
    setFilteredCourses(mockCourses);
  }, []);

  // Filter courses based on search term and audience filter
  useEffect(() => {
    let result = [...courses];

    // Apply search filter
    if (searchTerm) {
      result = result.filter(course =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply audience filter
    if (audienceFilter !== 'all') {
      result = result.filter(course =>
        course.audienceType.includes(audienceFilter as AudienceType)
      );
    }

    setFilteredCourses(result);
    setPage(0); // Reset to first page when filtering
  }, [searchTerm, audienceFilter, courses]);

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

  const handleAudienceFilterChange = (event: SelectChangeEvent) => {
    setAudienceFilter(event.target.value);
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setAudienceFilter('all');
  };

  // Handle course dialog
  const handleOpenAddDialog = () => {
    setDialogMode('add');
    setFormData({
      title: '',
      description: '',
      audienceType: [],
      duration: 60,
      thumbnail: '',
      content: ''
    });
    setOpenCourseDialog(true);
  };

  const handleOpenEditDialog = (course: Course) => {
    setDialogMode('edit');
    setCurrentCourse(course);
    setFormData({
      title: course.title,
      description: course.description,
      audienceType: [...course.audienceType],
      duration: course.duration,
      thumbnail: course.thumbnail,
      content: course.content
    });
    setOpenCourseDialog(true);
  };

  const handleCloseCourseDialog = () => {
    setOpenCourseDialog(false);
    setCurrentCourse(null);
  };

  const handleFormChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData(prev => ({
      ...prev,
      [name]: parseInt(value, 10) || 0
    }));
  };

  const handleAudienceTypeChange = (type: AudienceType) => {
    setFormData(prev => {
      const currentTypes = [...prev.audienceType];
      if (currentTypes.includes(type)) {
        return {
          ...prev,
          audienceType: currentTypes.filter(t => t !== type)
        };
      } else {
        return {
          ...prev,
          audienceType: [...currentTypes, type]
        };
      }
    });
  };

  const handleSaveCourse = () => {
    if (dialogMode === 'add') {
      // In a real app, this would be an API call to create a new course
      const newCourse: Course = {
        id: String(Date.now()),
        ...formData,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      setCourses(prev => [...prev, newCourse]);
      setSnackbar({
        open: true,
        message: 'Khóa học đã được thêm thành công',
        severity: 'success'
      });
    } else {
      // In a real app, this would be an API call to update the course
      if (currentCourse) {
        const updatedCourses = courses.map(course =>
          course.id === currentCourse.id
            ? { ...course, ...formData, updatedAt: new Date() }
            : course
        );
        setCourses(updatedCourses);
        setSnackbar({
          open: true,
          message: 'Khóa học đã được cập nhật thành công',
          severity: 'success'
        });
      }
    }

    handleCloseCourseDialog();
  };

  // Handle delete course
  const handleOpenDeleteDialog = (course: Course) => {
    setCourseToDelete(course);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setCourseToDelete(null);
  };

  const handleDeleteCourse = () => {
    if (courseToDelete) {
      // In a real app, this would be an API call to delete the course
      const updatedCourses = courses.filter(course => course.id !== courseToDelete.id);
      setCourses(updatedCourses);
      setSnackbar({
        open: true,
        message: 'Khóa học đã được xóa thành công',
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

  // Get audience type display text
  const getAudienceTypeDisplay = (type: AudienceType) => {
    switch (type) {
      case 'student':
        return 'Học sinh';
      case 'parent':
        return 'Phụ huynh';
      case 'teacher':
        return 'Giáo viên';
      case 'general':
        return 'Chung';
      default:
        return type;
    }
  };

  return (
    <Container>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Quản lý khóa học
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Quản lý tất cả khóa học trong hệ thống
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
            <InputLabel id="audience-filter-label">Đối tượng</InputLabel>
            <Select
              labelId="audience-filter-label"
              id="audience-filter"
              value={audienceFilter}
              onChange={handleAudienceFilterChange}
              label="Đối tượng"
            >
              <MenuItem value="all">Tất cả</MenuItem>
              <MenuItem value="student">Học sinh</MenuItem>
              <MenuItem value="parent">Phụ huynh</MenuItem>
              <MenuItem value="teacher">Giáo viên</MenuItem>
              <MenuItem value="general">Chung</MenuItem>
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
            Thêm khóa học
          </Button>
        </Box>
      </Paper>

      {/* Courses Table */}
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 'calc(100vh - 300px)' }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Tiêu đề</TableCell>
                <TableCell>Đối tượng</TableCell>
                <TableCell>Thời lượng (phút)</TableCell>
                <TableCell>Ngày tạo</TableCell>
                <TableCell align="center">Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredCourses
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((course) => (
                  <TableRow hover key={course.id}>
                    <TableCell>{course.id}</TableCell>
                    <TableCell>{course.title}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {course.audienceType.map((type) => (
                          <Chip
                            key={type}
                            label={getAudienceTypeDisplay(type)}
                            size="small"
                            color="primary"
                            variant="outlined"
                          />
                        ))}
                      </Box>
                    </TableCell>
                    <TableCell>{course.duration}</TableCell>
                    <TableCell>
                      {new Date(course.createdAt).toLocaleDateString('vi-VN')}
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="Xem">
                        <IconButton
                          component={Link}
                          to={`/courses/${course.id}`}
                          color="info"
                        >
                          <VisibilityIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Chỉnh sửa">
                        <IconButton onClick={() => handleOpenEditDialog(course)} color="primary">
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Xóa">
                        <IconButton onClick={() => handleOpenDeleteDialog(course)} color="error">
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
          count={filteredCourses.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Số hàng mỗi trang:"
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} của ${count}`}
        />
      </Paper>

      {/* Add/Edit Course Dialog */}
      <Dialog open={openCourseDialog} onClose={handleCloseCourseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {dialogMode === 'add' ? 'Thêm khóa học mới' : 'Chỉnh sửa khóa học'}
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
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                name="duration"
                label="Thời lượng (phút)"
                fullWidth
                type="number"
                value={formData.duration}
                onChange={handleNumberChange}
                InputProps={{ inputProps: { min: 1 } }}
              />
              <TextField
                name="thumbnail"
                label="URL hình ảnh"
                fullWidth
                value={formData.thumbnail}
                onChange={handleFormChange}
              />
            </Box>
            <FormControl component="fieldset">
              <Typography variant="subtitle2" gutterBottom>
                Đối tượng
              </Typography>
              <FormGroup row>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.audienceType.includes('student')}
                      onChange={() => handleAudienceTypeChange('student')}
                    />
                  }
                  label="Học sinh"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.audienceType.includes('parent')}
                      onChange={() => handleAudienceTypeChange('parent')}
                    />
                  }
                  label="Phụ huynh"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.audienceType.includes('teacher')}
                      onChange={() => handleAudienceTypeChange('teacher')}
                    />
                  }
                  label="Giáo viên"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.audienceType.includes('general')}
                      onChange={() => handleAudienceTypeChange('general')}
                    />
                  }
                  label="Chung"
                />
              </FormGroup>
            </FormControl>
            <TextField
              name="content"
              label="Nội dung"
              fullWidth
              multiline
              rows={6}
              value={formData.content}
              onChange={handleFormChange}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCourseDialog}>Hủy</Button>
          <Button
            onClick={handleSaveCourse}
            variant="contained"
            color="primary"
            disabled={!formData.title || !formData.description || formData.audienceType.length === 0}
          >
            {dialogMode === 'add' ? 'Thêm' : 'Lưu'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Xác nhận xóa</DialogTitle>
        <DialogContent>
          <Typography>
            Bạn có chắc chắn muốn xóa khóa học "{courseToDelete?.title}" không?
          </Typography>
          <Typography variant="body2" color="error" sx={{ mt: 2 }}>
            Lưu ý: Hành động này không thể hoàn tác.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Hủy</Button>
          <Button onClick={handleDeleteCourse} variant="contained" color="error">
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

export default AdminCoursesPage;
