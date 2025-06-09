import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  CardMedia,
  Button,
  Grid,
  Chip,
  Divider,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Alert,
  Snackbar
} from '@mui/material';
import {
  AccessTime as AccessTimeIcon,
  CheckCircle as CheckCircleIcon,
  ArrowBack as ArrowBackIcon,
  PlayArrow as PlayArrowIcon
} from '@mui/icons-material';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Course, AudienceType } from '../../types/course';
import { mockCourses } from '../../utils/mockData';
import { useAuth } from '../../contexts/AuthContext';

const CourseDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Trong thực tế, đây sẽ là API call
    const fetchCourse = async () => {
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 500));

        const foundCourse = mockCourses.find(c => c.id === id);
        if (foundCourse) {
          setCourse(foundCourse);
        } else {
          setError('Không tìm thấy khóa học');
        }
      } catch (error) {
        setError('Đã xảy ra lỗi khi tải khóa học');
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  const handleEnrollCourse = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/courses/${id}` } });
      return;
    }

    // Trong thực tế, đây sẽ là API call để đăng ký khóa học
    setOpenSnackbar(true);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

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

  if (loading) {
    return (
      <Container>
        <Box sx={{ py: 4, textAlign: 'center' }}>
          <Typography>Đang tải khóa học...</Typography>
        </Box>
      </Container>
    );
  }

  if (error || !course) {
    return (
      <Container>
        <Box sx={{ py: 4, textAlign: 'center' }}>
          <Typography color="error">{error || 'Không tìm thấy khóa học'}</Typography>
          <Button
            component={Link}
            to="/courses"
            startIcon={<ArrowBackIcon />}
            sx={{ mt: 2 }}
          >
            Quay lại danh sách khóa học
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container>
      <Button
        component={Link}
        to="/courses"
        startIcon={<ArrowBackIcon />}
        sx={{ mb: 3 }}
      >
        Quay lại danh sách khóa học
      </Button>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' }, gap: 4 }}>
        <Box>
          <Card sx={{ borderRadius: 2, overflow: 'hidden' }}>
            <CardMedia
              component="img"
              height="300"
              image={course.thumbnail}
              alt={course.title}
            />
            <CardContent>
              <Typography gutterBottom variant="h4" component="h1">
                {course.title}
              </Typography>

              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                {course.audienceType.map((type) => (
                  <Chip
                    key={type}
                    label={getAudienceLabel(type)}
                    color="primary"
                  />
                ))}
                <Chip
                  icon={<AccessTimeIcon />}
                  label={`${course.duration} phút`}
                  variant="outlined"
                />
              </Box>

              <Divider sx={{ my: 3 }} />

              <Typography variant="h5" gutterBottom>
                Mô tả khóa học
              </Typography>
              <Typography variant="body1" paragraph>
                {course.description}
              </Typography>

              <Typography variant="body1" paragraph>
                Khóa học này được thiết kế để giúp người học hiểu rõ về tác hại của ma túy và cách phòng tránh.
                Thông qua các bài giảng, video và tài liệu tương tác, người học sẽ được trang bị kiến thức và
                kỹ năng cần thiết để phòng ngừa sử dụng ma túy.
              </Typography>

              <Divider sx={{ my: 3 }} />

              <Typography variant="h5" gutterBottom>
                Nội dung khóa học
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText primary="Bài 1: Giới thiệu về ma túy và tác hại" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText primary="Bài 2: Nhận biết các loại ma túy phổ biến" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText primary="Bài 3: Kỹ năng từ chối và phòng tránh" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText primary="Bài 4: Hỗ trợ người thân và bạn bè" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText primary="Bài 5: Tổng kết và bài kiểm tra" />
                </ListItem>
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
            <Button
              variant="contained"
              fullWidth
              size="large"
              startIcon={<PlayArrowIcon />}
              onClick={handleEnrollCourse}
              sx={{ mb: 2 }}
            >
              Bắt đầu học ngay
            </Button>
            {!isAuthenticated && (
              <Typography variant="body2" color="text.secondary" align="center">
                Bạn cần đăng nhập để đăng ký khóa học
              </Typography>
            )}
          </Paper>

          <Paper sx={{ p: 3, borderRadius: 2, mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Thông tin khóa học
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Thời lượng:
              </Typography>
              <Typography variant="body2">
                {course.duration} phút
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Đối tượng:
              </Typography>
              <Typography variant="body2">
                {course.audienceType.map(type => getAudienceLabel(type)).join(', ')}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Ngày tạo:
              </Typography>
              <Typography variant="body2">
                {new Date(course.createdAt).toLocaleDateString('vi-VN')}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2" color="text.secondary">
                Cập nhật:
              </Typography>
              <Typography variant="body2">
                {new Date(course.updatedAt).toLocaleDateString('vi-VN')}
              </Typography>
            </Box>
          </Paper>
        </Box>
      </Box>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          Đăng ký khóa học thành công! Bạn có thể bắt đầu học ngay bây giờ.
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default CourseDetailPage;
