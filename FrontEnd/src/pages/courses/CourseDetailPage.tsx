import React, { useState, useEffect } from "react";
import { Container, Typography, Box, Card, CardContent, CardMedia, Button, Chip, Divider, Paper, List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import { AccessTime as AccessTimeIcon, CheckCircle as CheckCircleIcon, ArrowBack as ArrowBackIcon, PlayArrow as PlayArrowIcon } from "@mui/icons-material";
import { useParams, Link, useNavigate } from "react-router-dom";
import { CourseService, CourseDetail } from "../../services/CourseService";
import { getImageUrl, handleImageError } from "../../utils/imageUtils";
import { useAuth } from "../../contexts/AuthContext";
import { toast } from "react-toastify";

const CourseDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [course, setCourse] = useState<CourseDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const _courseService = new CourseService();

  useEffect(() => {
    const fetchCourse = async () => {
      if (!id) {
        setError("ID khóa học không hợp lệ");
        setLoading(false);
        return;
      }

      try {
        console.log("Fetching course with ID:", id);
        const response = await _courseService.getCourseById(parseInt(id));
        console.log("Course API response:", response);

        if (response.code === 200 && response.data) {
          console.log("Course data:", response.data);
          setCourse(response.data);
        } else {
          console.error("API error:", response);
          setError(response.message || "Không tìm thấy khóa học");
        }
      } catch (error) {
        console.error("Error fetching course:", error);
        setError("Đã xảy ra lỗi khi tải khóa học");
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id, _courseService]);

  const handleEnrollCourse = () => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: `/courses/${id}` } });
      return;
    }

    // Trong thực tế, đây sẽ là API call để đăng ký khóa học
    toast.success("Đăng ký khóa học thành công! Bạn có thể bắt đầu học ngay bây giờ.");
  };

  const handleStartLearning = () => {
    // Navigate to learning page - không cần đăng nhập
    navigate(`/courses/${id}/learn`);
  };

  // Hàm hiển thị nhãn đối tượng
  const getAudienceLabel = (type: string) => {
    switch (type) {
      case "Học sinh":
        return "Học sinh";
      case "Phụ huynh":
        return "Phụ huynh";
      case "Giáo viên":
        return "Giáo viên";
      case "Chung":
        return "Chung";
      default:
        return type;
    }
  };

  if (loading) {
    return (
      <Container>
        <Box sx={{ py: 4, textAlign: "center" }}>
          <Typography>Đang tải khóa học...</Typography>
        </Box>
      </Container>
    );
  }

  if (error || !course) {
    return (
      <Container>
        <Box sx={{ py: 4, textAlign: "center" }}>
          <Typography color="error">{error || "Không tìm thấy khóa học"}</Typography>
          <Button component={Link} to="/courses" startIcon={<ArrowBackIcon />} sx={{ mt: 2 }}>
            Quay lại danh sách khóa học
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container>
      <Button component={Link} to="/courses" startIcon={<ArrowBackIcon />} sx={{ mb: 3 }}>
        Quay lại danh sách khóa học
      </Button>

      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "2fr 1fr" }, gap: 4 }}>
        <Box>
          <Card sx={{ borderRadius: 2, overflow: "hidden" }}>
            <CardMedia component="img" height="300" image={getImageUrl(course.image)} alt={course.name} onError={handleImageError} />
            <CardContent>
              <Typography gutterBottom variant="h4" component="h1">
                {course.name}
              </Typography>

              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
                {course.objects.map((type, index) => (
                  <Chip key={index} label={getAudienceLabel(type)} color="primary" />
                ))}
                <Chip icon={<AccessTimeIcon />} label={`${course.duration || course.courseDetail.reduce((total, detail) => total + detail.duration, 0)} giờ`} variant="outlined" />
              </Box>

              <Divider sx={{ my: 3 }} />

              <Typography variant="h5" gutterBottom>
                Mô tả khóa học
              </Typography>
              <Typography variant="body1" paragraph>
                {course.description}
              </Typography>

              <Divider sx={{ my: 3 }} />

              <Typography variant="h5" gutterBottom>
                Nội dung khóa học
              </Typography>
              <List>
                {course.courseDetail.map((lesson, index) => (
                  <ListItem key={lesson.id || index}>
                    <ListItemIcon>
                      <CheckCircleIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText primary={`${index + 1}. ${lesson.name}`} secondary={`${lesson.duration} giờ`} />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Box>

        <Box>
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h5" gutterBottom>
              Đăng ký khóa học
            </Typography>
            <Typography variant="body1" paragraph>
              Khóa học này hoàn toàn miễn phí. Đăng ký ngay để bắt đầu học!
            </Typography>
            <Button variant="contained" fullWidth size="large" startIcon={<PlayArrowIcon />} onClick={handleStartLearning} sx={{ mb: 2 }}>
              Bắt đầu học ngay
            </Button>
          </Paper>

          <Paper sx={{ p: 3, borderRadius: 2, mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Thông tin khóa học
            </Typography>
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Thời lượng:
              </Typography>
              <Typography variant="body2">{course.duration || course.courseDetail.reduce((total, detail) => total + detail.duration, 0)} giờ</Typography>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Đối tượng:
              </Typography>
              <Typography variant="body2">{course.objects.map((type) => getAudienceLabel(type)).join(", ")}</Typography>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Ngày tạo:
              </Typography>
              <Typography variant="body2">{course.createDate}</Typography>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography variant="body2" color="text.secondary">
                Cập nhật:
              </Typography>
              <Typography variant="body2">{course.updateDate}</Typography>
            </Box>
          </Paper>
        </Box>
      </Box>
    </Container>
  );
};

export default CourseDetailPage;
