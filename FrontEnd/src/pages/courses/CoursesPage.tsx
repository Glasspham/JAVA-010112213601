import React, { useState, useEffect } from "react";
import { Container, Typography,  Card, CardContent, CardMedia, Button, Box, TextField, InputAdornment, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent, Chip, Pagination, IconButton, Tooltip, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, CircularProgress, Alert } from "@mui/material";
import { Search as SearchIcon, Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Visibility as ViewIcon } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { CourseService, CourseResponse, CourseSearch } from "../../services/CourseService";
import { getImageUrl, handleImageError } from "../../utils/imageUtils";

interface CoursesPageProps {
  isAdmin?: boolean;
}

const CoursesPage: React.FC<CoursesPageProps> = ({ isAdmin = false }) => {
  const [courses, setCourses] = useState<CourseResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [audienceFilter, setAudienceFilter] = useState<string>("all");
  const [totalElement, setTotalElement] = useState(0);
  const [courseSearch, setCourseSearch] = useState<CourseSearch>({
    page: 1,
    limit: 6,
  });

  const _courseService = new CourseService();

  // Fetch courses from API
  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      setError(null);
      try {
        const [code, data, message] = await _courseService.findAllCourses(courseSearch);
        if (code === 200 && data) {
          setCourses(data.content || []);
          setTotalElement(data.totalElements || 0);
        } else {
          setError(message || "Không thể tải danh sách khóa học");
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
        setError("Có lỗi xảy ra khi tải danh sách khóa học");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [courseSearch]);

  // Handle search with debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setCourseSearch((prev) => ({
        ...prev,
        page: 1,
        keyword: searchTerm || undefined,
      }));
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  // Handle audience filter
  useEffect(() => {
    setCourseSearch((prev) => ({
      ...prev,
      page: 1,
      object: audienceFilter !== "all" ? audienceFilter : undefined,
    }));
  }, [audienceFilter]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleAudienceFilterChange = (event: SelectChangeEvent<string>) => {
    setAudienceFilter(event.target.value);
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setCourseSearch((prev) => ({
      ...prev,
      page: value,
    }));
  };

  const totalPages = Math.ceil(totalElement / courseSearch.limit);

  // Hàm hiển thị nhãn đối tượng
  const getAudienceLabel = (type: string) => {
    switch (type) {
      case "Học sinh":
        return "Học sinh";
      case "Giáo viên":
        return "Giáo viên";
      case "Chung":
        return "Chung";
      default:
        return type;
    }
  };

  // Render giao diện admin
  const renderAdminView = () => {
    return (
      <Container maxWidth={false}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
          <Typography variant="h4" component="h1">
            Quản lý khóa học
          </Typography>
          <Button variant="contained" color="primary" startIcon={<AddIcon />} component={Link} to="/admin/courses/create">
            Thêm khóa học mới
          </Button>
        </Box>

        {/* Bộ lọc và tìm kiếm */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 2 }}>
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
              <Select labelId="audience-filter-label" id="audience-filter" value={audienceFilter} onChange={handleAudienceFilterChange} label="Đối tượng">
                <MenuItem value="all">Tất cả</MenuItem>
                <MenuItem value="Học sinh">Học sinh</MenuItem>
                <MenuItem value="Giáo viên">Giáo viên</MenuItem>
                <MenuItem value="Chung">Chung</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>

        {/* Loading and Error States */}
        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress />
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Bảng dữ liệu */}
        {!loading && !error && (
          <Paper sx={{ width: "100%", overflow: "hidden" }}>
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
                  {courses.map((course) => (
                    <TableRow hover key={course.id}>
                      <TableCell>{course.id}</TableCell>
                      <TableCell>{course.name}</TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                          {course.objects.map((obj, index) => (
                            <Chip key={index} label={getAudienceLabel(obj)} size="small" color="primary" variant="outlined" />
                          ))}
                        </Box>
                      </TableCell>
                      <TableCell>{course.duration || 0} giờ</TableCell>
                      <TableCell>0</TableCell>
                      <TableCell align="center">
                        <Box sx={{ display: "flex", justifyContent: "center" }}>
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
              <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
                <Pagination count={totalPages} page={courseSearch.page} onChange={handlePageChange} color="primary" size="large" />
              </Box>
            )}
          </Paper>
        )}
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
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 2 }}>
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
              <Select labelId="audience-filter-label" id="audience-filter" value={audienceFilter} onChange={handleAudienceFilterChange} label="Đối tượng">
                <MenuItem value="all">Tất cả</MenuItem>
                <MenuItem value="Phụ huynh">Phụ huynh</MenuItem>
                <MenuItem value="Học sinh">Học sinh</MenuItem>
                <MenuItem value="Giáo viên">Giáo viên</MenuItem>
                <MenuItem value="Chung">Chung</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>

        {/* Loading and Error States */}
        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress />
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {!loading && !error && (
          <>
            {/* Hiển thị số lượng kết quả */}
            <Box sx={{ mb: 2 }}>
              <Typography variant="body1">Hiển thị {totalElement} khóa học</Typography>
            </Box>

            {/* Danh sách khóa học */}
            {courses.length > 0 ? (
              <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)" }, gap: 4 }}>
                {courses.map((course) => (
                  <Card key={course.id} sx={{ height: "100%", display: "flex", flexDirection: "column", borderRadius: 2 }}>
                    <CardMedia component="img" height="140" image={getImageUrl(course.image)} alt={course.name} onError={handleImageError} />
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography gutterBottom variant="h5" component="h2">
                        {course.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {course.description}
                      </Typography>
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mb: 2 }}>
                        {course.objects.map((obj, index) => (
                          <Chip key={index} label={getAudienceLabel(obj)} size="small" color="primary" variant="outlined" />
                        ))}
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        Thời lượng: {course.duration || 0} giờ
                      </Typography>
                    </CardContent>
                    <Box sx={{ p: 2 }}>
                      <Button component={Link} to={`/courses/${course.id}`} variant="contained" fullWidth>
                        Xem chi tiết
                      </Button>
                    </Box>
                  </Card>
                ))}
              </Box>
            ) : (
              <Box sx={{ textAlign: "center", py: 4 }}>
                <Typography variant="h6">Không tìm thấy khóa học nào phù hợp với tiêu chí tìm kiếm.</Typography>
              </Box>
            )}

            {/* Phân trang */}
            {totalPages > 1 && (
              <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                <Pagination count={totalPages} page={courseSearch.page} onChange={handlePageChange} color="primary" size="large" />
              </Box>
            )}
          </>
        )}
      </Container>
    );
  };

  return isAdmin ? renderAdminView() : renderClientView();
};

export default CoursesPage;
