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
  FormGroup,
  FormControlLabel,
  Checkbox,
  SelectChangeEvent,
  CircularProgress,
  Card,
  CardContent,
  CardActions,
  Avatar
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
  Visibility as VisibilityIcon,
  Upload as UploadIcon,
  VideoLibrary as VideoIcon
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { CourseService, CourseDTO, CourseDetail, CourseResponse, CourseSearch } from '../../services/CourseService';
import { handleImageError, handleVideoError } from '../../utils/imageUtils';
import { toast } from 'react-toastify';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';


const OBJECTS = ['Học sinh', 'Giáo viên', 'Phụ huynh', 'Chung'];

const AdminCoursesPage: React.FC = () => {
  const courseService = new CourseService();

  // State for courses data
  const [courses, setCourses] = useState<CourseResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // State for pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // State for search and filter
  const [searchTerm, setSearchTerm] = useState('');
  const [objectFilter, setObjectFilter] = useState<string>('');

  // State for course dialog
  const [openCourseDialog, setOpenCourseDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState<'add' | 'edit'>('add');
  const [currentCourse, setCurrentCourse] = useState<CourseResponse | null>(null);

  // State for delete dialog
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState<CourseResponse | null>(null);
  
  // Form data state
  const [formData, setFormData] = useState<CourseDTO>({
    name: '',
    description: '',
    image: '',
    objects: [],
    courseDetail: []
  });

  // File upload states
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [videoFiles, setVideoFiles] = useState<{ [key: number]: File }>({});
  const [videoPreviews, setVideoPreviews] = useState<{ [key: number]: string }>({});

  // Load courses data
  const loadCourses = async () => {
    setLoading(true);
    try {
      const searchParams: CourseSearch = {
        page: page + 1, // API uses 1-based pagination
        limit: rowsPerPage,
        keyword: searchTerm || undefined,
        object: objectFilter || undefined
      };

      const [code, data, message] = await courseService.findAllCourses(searchParams);
      
      if (code === 200 && data) {
        setCourses(data.content);
        setTotalElements(data.totalElements);
        setTotalPages(data.totalPages);
      } else {
        toast.error(message || 'Lỗi khi tải danh sách khóa học');
      }
    } catch (error) {
      console.error('Error loading courses:', error);
      toast.error('Lỗi khi tải danh sách khóa học');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourses();
  }, [page, rowsPerPage, searchTerm, objectFilter]);

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
    setPage(0);
  };

  const handleObjectFilterChange = (event: SelectChangeEvent) => {
    setObjectFilter(event.target.value);
    setPage(0);
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setObjectFilter('');
    setPage(0);
  };

  // Handle course dialog
  const handleOpenAddDialog = () => {
    setDialogMode('add');
    setFormData({
      name: '',
      description: '',
      image: '',
      objects: [],
      courseDetail: []
    });
    setImageFile(null);
    setImagePreview(null);
    setVideoFiles({});
    setVideoPreviews({});
    setOpenCourseDialog(true);
  };

  const handleOpenEditDialog = async (course: CourseResponse) => {
    console.log('Opening edit dialog for course:', course);
    setDialogMode('edit');
    setCurrentCourse(course);

    try {
      // Load full course details for editing
      console.log('Loading course details for ID:', course.id);
      const response = await courseService.getCourseById(course.id);
      console.log('Course details response:', response);

      if (response.code === 200 && response.data) {
        const courseDetail = response.data;
        setFormData({
          name: courseDetail.name,
          description: courseDetail.description,
          image: courseDetail.image,
          objects: courseDetail.objects,
          courseDetail: courseDetail.courseDetail
        });

        // Set image preview if exists
        if (courseDetail.image) {
          setImagePreview(courseService.getImageUrl(courseDetail.image));
        }

        // Set video previews for existing videos
        const videoPreviewsObj: { [key: number]: string } = {};
        courseDetail.courseDetail.forEach((detail, index) => {
          if (detail.video) {
            videoPreviewsObj[index] = courseService.getVideoUrl(detail.video);
          }
        });
        setVideoPreviews(videoPreviewsObj);
      } else {
        console.error('Failed to load course details:', response);
        toast.error(response.message || 'Lỗi khi tải chi tiết khóa học');
      }
    } catch (error) {
      console.error('Error loading course details:', error);
      toast.error('Lỗi khi tải chi tiết khóa học');
    }

    setOpenCourseDialog(true);
  };

  const handleCloseCourseDialog = () => {
    setOpenCourseDialog(false);
    setCurrentCourse(null);
    // Clear file states
    setImageFile(null);
    setImagePreview(null);
    setVideoFiles({});
    setVideoPreviews({});
  };

  const handleOpenDeleteDialog = (course: CourseResponse) => {
    setCourseToDelete(course);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setCourseToDelete(null);
  };

  const handleFormChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleObjectChange = (object: string) => {
    setFormData(prev => {
      const currentObjects = [...prev.objects];
      if (currentObjects.includes(object)) {
        return {
          ...prev,
          objects: currentObjects.filter(o => o !== object)
        };
      } else {
        return {
          ...prev,
          objects: [...currentObjects, object]
        };
      }
    });
  };

  const handleCourseDetailChange = (index: number, field: string, value: any) => {
    setFormData(prev => {
      const newCourseDetail = [...prev.courseDetail];
      newCourseDetail[index] = {
        ...newCourseDetail[index],
        [field]: value
      };
      return {
        ...prev,
        courseDetail: newCourseDetail
      };
    });
  };

  const addCourseDetail = () => {
    setFormData(prev => ({
      ...prev,
      courseDetail: [
        ...prev.courseDetail,
        {
          name: '',
          video: '',
          duration: 1,
          objective: '',
          content: ''
        }
      ]
    }));
  };

  const removeCourseDetail = (index: number) => {
    setFormData(prev => ({
      ...prev,
      courseDetail: prev.courseDetail.filter((_, i) => i !== index)
    }));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const handleVideoUpload = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setVideoFiles(prev => ({
        ...prev,
        [index]: file
      }));
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setVideoPreviews(prev => ({
        ...prev,
        [index]: previewUrl
      }));
    }
  };

  const handleSaveCourse = async () => {
    setLoading(true);
    try {
      if (dialogMode === 'add') {
        const [code, data, message] = await courseService.createCourse(formData, imageFile || undefined, videoFiles);

        if (code === 200) {
          toast.success('Khóa học đã được tạo thành công');
          handleCloseCourseDialog();
          loadCourses();
        } else {
          toast.error(message || 'Lỗi khi tạo khóa học');
        }
      } else if (dialogMode === 'edit' && currentCourse) {
        // Upload image if changed
        let imageUrl = formData.image;
        if (imageFile) {
          const uploadResponse = await courseService.uploadFile(imageFile);
          if (uploadResponse.code === 200) {
            imageUrl = uploadResponse.data;
          }
        }

        // Upload videos if changed
        const updatedCourseDetail = [...formData.courseDetail];
        for (const [index, file] of Object.entries(videoFiles)) {
          const uploadResponse = await courseService.uploadFile(file);
          if (uploadResponse.code === 200) {
            updatedCourseDetail[parseInt(index)].video = uploadResponse.data;
          }
        }

        const courseData: CourseDetail = {
          id: currentCourse.id,
          name: formData.name,
          description: formData.description,
          duration: formData.courseDetail.reduce((total, detail) => total + detail.duration, 0),
          sallybus: null,
          image: imageUrl,
          createDate: currentCourse.createDate,
          updateDate: new Date().toISOString().split('T')[0],
          objects: formData.objects,
          courseDetail: updatedCourseDetail
        };

        const response = await courseService.updateCourse(currentCourse.id, courseData);

        if (response.code === 200) {
          toast.success('Khóa học đã được cập nhật thành công');
          handleCloseCourseDialog();
          loadCourses();
        } else {
          toast.error(response.message || 'Lỗi khi cập nhật khóa học');
        }
      }
    } catch (error) {
      console.error('Error saving course:', error);
      toast.error(dialogMode === 'add' ? 'Lỗi khi tạo khóa học' : 'Lỗi khi cập nhật khóa học');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCourse = async () => {
    if (!courseToDelete || !courseToDelete.id) {
      console.error('No course to delete or missing ID');
      return;
    }

    setLoading(true);
    try {
      console.log('Deleting course with ID:', courseToDelete.id);
      const response = await courseService.deleteCourse(courseToDelete.id);

      if (response.code === 200) {
        toast.success('Khóa học đã được xóa thành công');
        handleCloseDeleteDialog();
        loadCourses();
      } else {
        toast.error(response.message || 'Lỗi khi xóa khóa học');
      }
    } catch (error) {
      console.error('Error deleting course:', error);
      toast.error('Lỗi khi xóa khóa học');
    } finally {
      setLoading(false);
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
              <InputLabel id="object-filter-label">Đối tượng</InputLabel>
              <Select
                labelId="object-filter-label"
                id="object-filter"
                value={objectFilter}
                onChange={handleObjectFilterChange}
                label="Đối tượng"
              >
                <MenuItem value="">Tất cả</MenuItem>
                {OBJECTS.map((object) => (
                  <MenuItem key={object} value={object}>{object}</MenuItem>
                ))}
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
                  <TableCell>Tên khóa học</TableCell>
                  <TableCell>Đối tượng</TableCell>
                  <TableCell>Ngày tạo</TableCell>
                  <TableCell align="center">Thao tác</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      <CircularProgress />
                    </TableCell>
                  </TableRow>
                ) : courses.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      <Typography variant="body2" color="text.secondary">
                        Không có khóa học nào
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  courses.map((course) => (
                    <TableRow hover key={course.id}>
                      <TableCell>{course.id}</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar
                            src={courseService.getImageUrl(course.image)}
                            alt={course.name}
                            sx={{ width: 40, height: 40 }}
                          />
                          <Box>
                            <Typography variant="subtitle2">{course.name}</Typography>
                            <Typography variant="caption" color="text.secondary">
                              {course.description}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {course.objects.map((object) => (
                            <Chip
                              key={object}
                              label={object}
                              size="small"
                              color="primary"
                              variant="outlined"
                            />
                          ))}
                        </Box>
                      </TableCell>
                      <TableCell>
                        {new Date(course.createDate).toLocaleDateString('vi-VN')}
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title="Chỉnh sửa">
                          <IconButton
                            color="primary"
                            onClick={() => handleOpenEditDialog(course)}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Xóa">
                          <IconButton
                            color="error"
                            onClick={() => handleOpenDeleteDialog(course)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={totalElements}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="Số hàng mỗi trang:"
            labelDisplayedRows={({ from, to, count }) => `${from}-${to} của ${count}`}
          />
        </Paper>

        {/* Add/Edit Course Dialog */}
        <Dialog open={openCourseDialog} onClose={handleCloseCourseDialog} maxWidth="lg" fullWidth>
          <DialogTitle>
            {dialogMode === 'add' ? 'Thêm khóa học mới' : 'Chỉnh sửa khóa học'}
          </DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 2 }}>
              {/* Basic Information */}
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>Thông tin cơ bản</Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <TextField
                      label="Tên khóa học"
                      fullWidth
                      value={formData.name}
                      onChange={(e) => handleFormChange('name', e.target.value)}
                      required
                    />
                    <TextField
                      label="Mô tả"
                      fullWidth
                      multiline
                      rows={3}
                      value={formData.description}
                      onChange={(e) => handleFormChange('description', e.target.value)}
                      required
                    />

                    {/* Image Upload */}
                    <Box>
                      <Typography variant="subtitle2" gutterBottom>Hình ảnh khóa học</Typography>
                      <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                        <Button
                          variant="outlined"
                          component="label"
                          startIcon={<UploadIcon />}
                        >
                          Chọn hình ảnh
                          <input
                            type="file"
                            hidden
                            accept="image/*"
                            onChange={handleImageUpload}
                          />
                        </Button>
                        {imagePreview && (
                          <Box sx={{ ml: 2 }}>
                            <img
                              src={imagePreview}
                              alt="Preview"
                              style={{
                                width: 100,
                                height: 100,
                                objectFit: 'cover',
                                borderRadius: 8,
                                border: '1px solid #ddd'
                              }}
                              onError={handleImageError}
                            />
                            <Typography variant="caption" display="block" sx={{ mt: 0.5, textAlign: 'center' }}>
                              {imageFile?.name}
                            </Typography>
                          </Box>
                        )}
                      </Box>
                    </Box>

                    {/* Objects Selection */}
                    <Box>
                      <Typography variant="subtitle2" gutterBottom>Đối tượng</Typography>
                      <FormGroup row>
                        {OBJECTS.map((object) => (
                          <FormControlLabel
                            key={object}
                            control={
                              <Checkbox
                                checked={formData.objects.includes(object)}
                                onChange={() => handleObjectChange(object)}
                              />
                            }
                            label={object}
                          />
                        ))}
                      </FormGroup>
                    </Box>
                  </Box>
                </CardContent>
              </Card>

              {/* Course Details */}
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6">Chi tiết bài học</Typography>
                    <Button
                      variant="outlined"
                      startIcon={<AddIcon />}
                      onClick={addCourseDetail}
                    >
                      Thêm bài học
                    </Button>
                  </Box>

                  {formData.courseDetail.map((detail, index) => (
                    <Card key={index} variant="outlined" sx={{ mb: 2 }}>
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                          <Typography variant="subtitle1">Bài học {index + 1}</Typography>
                          <IconButton
                            color="error"
                            onClick={() => removeCourseDetail(index)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>

                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                          <TextField
                            label="Tên bài học"
                            fullWidth
                            value={detail.name}
                            onChange={(e) => handleCourseDetailChange(index, 'name', e.target.value)}
                            required
                          />

                          <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                            <TextField
                              label="Thời lượng (giờ)"
                              type="number"
                              value={detail.duration}
                              onChange={(e) => handleCourseDetailChange(index, 'duration', parseFloat(e.target.value) || 1)}
                              inputProps={{ min: 0.1, step: 0.1 }}
                              sx={{ width: '200px' }}
                              required
                            />

                            <Box sx={{ flexGrow: 1 }}>
                              <Button
                                variant="outlined"
                                component="label"
                                startIcon={<VideoIcon />}
                                fullWidth
                              >
                                Chọn video
                                <input
                                  type="file"
                                  hidden
                                  accept="video/*"
                                  onChange={(e) => handleVideoUpload(index, e)}
                                />
                              </Button>
                              {videoFiles[index] && (
                                <Typography variant="caption" display="block" sx={{ mt: 0.5 }}>
                                  Đã chọn: {videoFiles[index].name}
                                </Typography>
                              )}
                            </Box>

                            {videoPreviews[index] && (
                              <Box sx={{ mt: 2 }}>
                                <Typography variant="caption" display="block" sx={{ mb: 1, fontWeight: 'medium' }}>
                                  Xem trước video:
                                </Typography>
                                <Box
                                  sx={{
                                    position: 'relative',
                                    width: 200,
                                    height: 120,
                                    borderRadius: 1,
                                    overflow: 'hidden',
                                    border: '1px solid',
                                    borderColor: 'divider',
                                    boxShadow: 1
                                  }}
                                >
                                  <video
                                    src={videoPreviews[index]}
                                    style={{
                                      width: '100%',
                                      height: '100%',
                                      objectFit: 'cover'
                                    }}
                                    controls
                                    onError={handleVideoError}
                                  />
                                </Box>
                                <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                                  {videoFiles[index]?.name || (formData.courseDetail[index]?.video ? `Video hiện tại: ${formData.courseDetail[index].video.split('/').pop()}` : '')}
                                </Typography>
                              </Box>
                            )}
                          </Box>

                          <Box>
                            <Typography variant="subtitle2" gutterBottom>Mục tiêu bài học</Typography>
                            <Box sx={{ border: '1px solid #ddd', borderRadius: 1 }}>
                              <CKEditor
                                editor={ClassicEditor as any}
                                data={detail.objective}
                                onChange={(event, editor) => {
                                  const data = editor.getData();
                                  handleCourseDetailChange(index, 'objective', data);
                                }}
                                config={{
                                  toolbar: ['heading', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', '|', 'undo', 'redo'],
                                  placeholder: 'Nhập mục tiêu của bài học...'
                                }}
                              />
                            </Box>
                          </Box>

                          <Box>
                            <Typography variant="subtitle2" gutterBottom>Nội dung bài học</Typography>
                            <Box sx={{ border: '1px solid #ddd', borderRadius: 1 }}>
                              <CKEditor
                                editor={ClassicEditor as any}
                                data={detail.content}
                                onChange={(event, editor) => {
                                  const data = editor.getData();
                                  handleCourseDetailChange(index, 'content', data);
                                }}
                                config={{
                                  toolbar: ['heading', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', 'blockQuote', '|', 'undo', 'redo'],
                                  placeholder: 'Nhập nội dung chi tiết của bài học...'
                                }}
                              />
                            </Box>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  ))}

                  {formData.courseDetail.length === 0 && (
                    <Alert severity="info">
                      Chưa có bài học nào. Nhấn "Thêm bài học" để bắt đầu.
                    </Alert>
                  )}
                </CardContent>
              </Card>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseCourseDialog}>Hủy</Button>
            <Button
              onClick={handleSaveCourse}
              variant="contained"
              disabled={loading || !formData.name || !formData.description}
            >
              {loading ? <CircularProgress size={20} /> : 'Lưu'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
          <DialogTitle>Xác nhận xóa khóa học</DialogTitle>
          <DialogContent>
            <Typography>
              Bạn có chắc chắn muốn xóa khóa học "{courseToDelete?.name}"?
              Hành động này không thể hoàn tác.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDeleteDialog}>Hủy</Button>
            <Button
              onClick={handleDeleteCourse}
              variant="contained"
              color="error"
              disabled={loading}
            >
              {loading ? <CircularProgress size={20} /> : 'Xóa'}
            </Button>
          </DialogActions>
        </Dialog>


      </Container>
  );
};

export default AdminCoursesPage;
