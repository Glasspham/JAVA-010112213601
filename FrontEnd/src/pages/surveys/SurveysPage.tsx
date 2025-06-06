import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Alert,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
  Pagination
} from '@mui/material';
import {
  AssessmentOutlined as AssessmentIcon,
  ArrowForward as ArrowForwardIcon,
  CheckCircle as CheckCircleIcon,
  Info as InfoIcon,
  Lock as LockIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { Survey } from '../../types/survey';
import { mockSurveys } from '../../utils/mockData';
import { useAuth } from '../../contexts/AuthContext';

interface SurveysPageProps {
  isAdmin?: boolean;
}

const SurveysPage: React.FC<SurveysPageProps> = ({ isAdmin = false }) => {
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Trong thực tế, đây sẽ là API call
    setSurveys(mockSurveys);
  }, []);

  const handleStartSurvey = (surveyId: string) => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/surveys/${surveyId}` } });
      return;
    }

    navigate(`/surveys/${surveyId}`);
  };

  // Render giao diện admin
  const renderAdminView = () => {
    return (
      <Container>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" component="h1">
            Quản lý khảo sát
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            component={Link}
            to="/admin/surveys/create"
          >
            Thêm khảo sát mới
          </Button>
        </Box>

        <Paper sx={{ width: '100%', overflow: 'hidden', mb: 4 }}>
          <TableContainer sx={{ maxHeight: 600 }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Tiêu đề</TableCell>
                  <TableCell>Loại</TableCell>
                  <TableCell>Số câu hỏi</TableCell>
                  <TableCell>Số lượt làm</TableCell>
                  <TableCell align="center">Thao tác</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {surveys.map((survey) => (
                  <TableRow hover key={survey.id}>
                    <TableCell>{survey.id}</TableCell>
                    <TableCell>{survey.title}</TableCell>
                    <TableCell>
                      <Chip
                        label={survey.type}
                        color="primary"
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{survey.questions.length}</TableCell>
                    <TableCell>{Math.floor(Math.random() * 100)}</TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <Tooltip title="Xem chi tiết">
                          <IconButton component={Link} to={`/surveys/${survey.id}`} color="info">
                            <ViewIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Chỉnh sửa">
                          <IconButton component={Link} to={`/admin/surveys/edit/${survey.id}`} color="primary">
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
        </Paper>

        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" component="h2" gutterBottom>
            Thống kê khảo sát
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 3 }}>
            <Card sx={{ bgcolor: '#e8f5e9', boxShadow: 2 }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h6" gutterBottom>Tổng số khảo sát</Typography>
                <Typography variant="h3" color="primary.main">{surveys.length}</Typography>
              </CardContent>
            </Card>

            <Card sx={{ bgcolor: '#e3f2fd', boxShadow: 2 }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h6" gutterBottom>Tổng lượt làm khảo sát</Typography>
                <Typography variant="h3" color="primary.main">189</Typography>
              </CardContent>
            </Card>

            <Card sx={{ bgcolor: '#fff8e1', boxShadow: 2 }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h6" gutterBottom>Khảo sát phổ biến nhất</Typography>
                <Typography variant="h5" color="primary.main">{surveys[0]?.title || "N/A"}</Typography>
              </CardContent>
            </Card>
          </Box>
        </Box>
      </Container>
    );
  };

  // Render giao diện client
  const renderClientView = () => {
    return (
      <Container>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom sx={{ mt: 3 }}>
            Đánh giá nguy cơ sử dụng ma túy
          </Typography>
          <Typography variant="body1" paragraph>
            Các bài khảo sát dưới đây giúp bạn đánh giá mức độ nguy cơ sử dụng ma túy.
            Kết quả đánh giá sẽ giúp bạn hiểu rõ hơn về tình trạng của mình và nhận được các đề xuất phù hợp.
          </Typography>
          <Alert severity="info" sx={{ mb: 3 }}>
            <Typography variant="body1">
              Các bài khảo sát này chỉ mang tính chất tham khảo và không thay thế cho đánh giá chuyên môn từ các chuyên gia y tế.
            </Typography>
          </Alert>
        </Box>

        <Box sx={{ mb: 5 }}>
          <Paper sx={{ p: 3, borderRadius: 2, bgcolor: 'primary.light', color: 'white' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <InfoIcon sx={{ mr: 2, fontSize: 40 }} />
              <Typography variant="h5">
                Tại sao nên làm bài đánh giá nguy cơ?
              </Typography>
            </Box>
            <Typography variant="body1" paragraph>
              Đánh giá nguy cơ sử dụng ma túy là bước đầu tiên quan trọng trong việc phòng ngừa và can thiệp sớm.
              Việc nhận biết mức độ nguy cơ sẽ giúp bạn:
            </Typography>
            <List>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleIcon sx={{ color: 'white' }} />
                </ListItemIcon>
                <ListItemText primary="Hiểu rõ hơn về tình trạng hiện tại của bản thân" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleIcon sx={{ color: 'white' }} />
                </ListItemIcon>
                <ListItemText primary="Nhận được đề xuất phù hợp với mức độ nguy cơ" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleIcon sx={{ color: 'white' }} />
                </ListItemIcon>
                <ListItemText primary="Có cơ sở để tìm kiếm sự hỗ trợ từ chuyên gia khi cần thiết" />
              </ListItem>
            </List>
          </Paper>
        </Box>

        <Typography variant="h5" component="h2" gutterBottom sx={{ mb: 3 }}>
          Các bài đánh giá nguy cơ
        </Typography>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 4, mb: 4 }}>
          {surveys.map((survey) => (
            <Card key={survey.id} sx={{ height: '100%', display: 'flex', flexDirection: 'column', borderRadius: 2 }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <AssessmentIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
                  <Typography variant="h5" component="h3">
                    {survey.title}
                  </Typography>
                </Box>
                <Chip
                  label={survey.type}
                  color="primary"
                  size="small"
                  sx={{ mb: 2 }}
                />
                <Typography variant="body1" paragraph>
                  {survey.description}
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Số câu hỏi: {survey.questions.length}
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Thời gian hoàn thành: khoảng {survey.questions.length * 2} phút
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Button
                    variant="contained"
                    endIcon={<ArrowForwardIcon />}
                    onClick={() => handleStartSurvey(survey.id)}
                  >
                    Bắt đầu đánh giá
                  </Button>
                  {!isAuthenticated && (
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <LockIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">
                        Cần đăng nhập
                      </Typography>
                    </Box>
                  )}
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>

        <Box sx={{ mb: 5 }}>
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h5" gutterBottom>
              Sau khi đánh giá nguy cơ
            </Typography>
            <Typography variant="body1" paragraph>
              Dựa trên kết quả đánh giá, hệ thống sẽ đề xuất các hành động phù hợp như:
            </Typography>
            <List>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleIcon color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary="Tham gia các khóa học trực tuyến"
                  secondary="Nâng cao nhận thức và kỹ năng phòng tránh ma túy"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleIcon color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary="Đặt lịch tư vấn với chuyên viên"
                  secondary="Nhận hỗ trợ trực tiếp từ các chuyên gia trong lĩnh vực"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleIcon color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary="Tham gia các chương trình cộng đồng"
                  secondary="Kết nối với cộng đồng và nhận hỗ trợ từ những người có cùng mối quan tâm"
                />
              </ListItem>
            </List>
            <Box sx={{ mt: 2 }}>
              <Button
                component={Link}
                to="/courses"
                variant="outlined"
                sx={{ mr: 2, mb: { xs: 2, sm: 0 } }}
              >
                Xem khóa học
              </Button>
              <Button
                component={Link}
                to="/appointments"
                variant="outlined"
                sx={{ mr: 2, mb: { xs: 2, sm: 0 } }}
              >
                Đặt lịch tư vấn
              </Button>
              <Button
                component={Link}
                to="/programs"
                variant="outlined"
              >
                Xem chương trình
              </Button>
            </Box>
          </Paper>
        </Box>
      </Container>
    );
  };

  return isAdmin ? renderAdminView() : renderClientView();
};

export default SurveysPage;
