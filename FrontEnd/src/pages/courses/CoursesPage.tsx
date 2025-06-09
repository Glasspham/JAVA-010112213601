import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Box,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Chip,
  Pagination,
  IconButton,
  Tooltip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { Course, AudienceType } from '../../types/course';
import { mockCourses } from '../../utils/mockData';

interface CoursesPageProps {
  isAdmin?: boolean;
}

const CoursesPage: React.FC<CoursesPageProps> = ({ isAdmin = false }) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [audienceFilter, setAudienceFilter] = useState<AudienceType | 'all'>('all');
  const [page, setPage] = useState(1);
  const coursesPerPage = 6;

  useEffect(() => {
    // Trong thực tế, đây sẽ là API call
    setCourses(mockCourses);
    setFilteredCourses(mockCourses);
  }, []);

  useEffect(() => {
    let result = [...courses];

    // Lọc theo từ khóa tìm kiếm
    if (searchTerm) {
      result = result.filter(course =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Lọc theo đối tượng
    if (audienceFilter !== 'all') {
      result = result.filter(course =>
        course.audienceType.includes(audienceFilter as AudienceType)
      );
    }

    setFilteredCourses(result);
    setPage(1); // Reset về trang đầu tiên khi lọc
  }, [searchTerm, audienceFilter, courses]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleAudienceFilterChange = (event: SelectChangeEvent<AudienceType | 'all'>) => {
    setAudienceFilter(event.target.value as AudienceType | 'all');
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  // Tính toán các khóa học hiển thị trên trang hiện tại
  const indexOfLastCourse = page * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = filteredCourses.slice(indexOfFirstCourse, indexOfLastCourse);
  const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);

  // Hàm hiển thị nhãn đối tượng
  const getAudienceLabel = (type: AudienceType) => {
    switch(type) {
      case 'student': return 'Học sinh';
      case 'parent': return 'Phụ huynh';
      case 'teacher': return 'Giáo viên';
      case 'general': return 'Chung';
      default: return type;
    }
  };

  // Render giao diện admin
  const renderAdminView = () => {
    return (
      <Container>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" component="h1">
            Quản lý khóa học
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            component={Link}
            to="/admin/courses/create"
          >
            Thêm khóa học mới
          </Button>
        </Box>

        {/* Bộ lọc và tìm kiếm */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
            <TextField
              fullWidth
              label="Tìm kiếm khóa học"
              variant="outlined"
              value={searchTerm}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
            <FormControl fullWidth variant="outlined">
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
          </Box>
        </Box>

        {/* Bảng dữ liệu */}
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
          <TableContainer sx={{ maxHeight: 600 }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Tiêu đề</TableCell>
                  <TableCell>Đối tượng</TableCell>
                  <TableCell>Thời lượng</TableCell>
                  <TableCell>Số lượt học</TableCell>
                  <TableCell align="center">Thao tác</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {currentCourses.map((course) => (
                  <TableRow hover key={course.id}>
                    <TableCell>{course.id}</TableCell>
                    <TableCell>{course.title}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {course.audienceType.map((type) => (
                          <Chip
                            key={type}
                            label={getAudienceLabel(type)}
                            size="small"
                            color="primary"
                            variant="outlined"
                          />
                        ))}
                      </Box>
                    </TableCell>
                    <TableCell>{course.duration} phút</TableCell>
                    <TableCell>{Math.floor(Math.random() * 100)}</TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <Tooltip title="Xem chi tiết">
                          <IconButton component={Link} to={`/courses/${course.id}`} color="info">
                            <ViewIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Chỉnh sửa">
                          <IconButton component={Link} to={`/admin/courses/edit/${course.id}`} color="primary">
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Xóa">
                          <IconButton color="error">
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={handlePageChange}
                color="primary"
                size="large"
              />
            </Box>
          )}
        </Paper>
      </Container>
    );
  };

  // Render giao diện client
  const renderClientView = () => {
    return (
      <Container>
        <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4 }}>
          Khóa học trực tuyến
        </Typography>

        {/* Bộ lọc và tìm kiếm */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
            <TextField
              fullWidth
              label="Tìm kiếm khóa học"
              variant="outlined"
              value={searchTerm}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
            <FormControl fullWidth variant="outlined">
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
          </Box>
        </Box>

        {/* Hiển thị số lượng kết quả */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="body1">
            Hiển thị {filteredCourses.length} khóa học
          </Typography>
        </Box>

        {/* Danh sách khóa học */}
        {currentCourses.length > 0 ? (
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 4 }}>
            {currentCourses.map((course) => (
              <Card key={course.id} sx={{ height: '100%', display: 'flex', flexDirection: 'column', borderRadius: 2 }}>
                <CardMedia
                  component="img"
                  height="140"
                  image={course.thumbnail}
                  alt={course.title}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h5" component="h2">
                    {course.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {course.description}
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                    {course.audienceType.map((type) => (
                      <Chip
                        key={type}
                        label={getAudienceLabel(type)}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    ))}
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    Thời lượng: {course.duration} phút
                  </Typography>
                </CardContent>
                <Box sx={{ p: 2 }}>
                  <Button
                    component={Link}
                    to={`/courses/${course.id}`}
                    variant="contained"
                    fullWidth
                  >
                    Xem chi tiết
                  </Button>
                </Box>
              </Card>
            ))}
          </Box>
        ) : (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h6">
              Không tìm thấy khóa học nào phù hợp với tiêu chí tìm kiếm.
            </Typography>
          </Box>
        )}

        {/* Phân trang */}
        {totalPages > 1 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={handlePageChange}
              color="primary"
              size="large"
            />
          </Box>
        )}
      </Container>
    );
  };

  return isAdmin ? renderAdminView() : renderClientView();
};

export default CoursesPage;
