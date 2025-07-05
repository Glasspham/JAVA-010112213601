import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Grid,
  Chip,
  Divider,
  Paper,
  Avatar,
  Rating,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Alert,
  Snackbar,
  Tab,
  Tabs
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  EventNote as EventNoteIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  School as SchoolIcon,
  Star as StarIcon,
  CheckCircle as CheckCircleIcon,
  AccessTime as AccessTimeIcon
} from '@mui/icons-material';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { UserService } from '../../services/UserService';
import { AuthService } from '../../services/AuthService';
import { toast } from 'react-toastify';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`consultant-tabpanel-${index}`}
      aria-labelledby={`consultant-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ py: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const ConsultantDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const [consultant, setConsultant] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const userService = new UserService();
  const authService = new AuthService();

  // Determine if coming from admin or client
  const isFromAdmin = location.pathname.includes('/admin/') ||
                     location.state?.from === 'admin' ||
                     document.referrer.includes('/admin/consultants');

  const backUrl = isFromAdmin ? '/admin/consultants' : '/consultants';
  const backText = isFromAdmin ? 'Quay lại quản lý chuyên viên' : 'Quay lại danh sách chuyên viên';

  useEffect(() => {
    const fetchConsultant = async () => {
      if (!id) {
        setError('ID chuyên viên không hợp lệ');
        setLoading(false);
        return;
      }

      try {
        const [code, userData, message] = await userService.getUserById(parseInt(id));

        if (code === 200 && userData) {
          // Check if user is SPECIALIST
          if (userData.role !== 'SPECIALIST') {
            setError('Người dùng này không phải là chuyên viên tư vấn');
            setLoading(false);
            return;
          }

          // Map API data to consultant format
          const consultantData = {
            id: userData.id,
            username: userData.username,
            firstName: userData.fullname.split(' ')[0] || '',
            lastName: userData.fullname.split(' ').slice(1).join(' ') || '',
            fullname: userData.fullname,
            email: userData.email,
            phoneNumber: userData.phone,
            profilePicture: userData.avatar ? `${process.env.REACT_APP_API_URL}/${userData.avatar}` : '',
            specialization: userData.majors || [],
            education: userData.position || 'Chuyên viên tư vấn',
            experience: 5, // Default experience
            bio: `${userData.fullname} là một chuyên viên tư vấn có kinh nghiệm trong lĩnh vực ${userData.majors?.join(', ') || 'tư vấn tâm lý'}. Với chuyên môn sâu và tâm huyết với nghề, ${userData.fullname} luôn sẵn sàng hỗ trợ và đồng hành cùng bạn trong hành trình vượt qua khó khăn.`,
            rating: 4.8, // Default rating
            reviewCount: 25, // Default review count
            availableDays: [1, 2, 3, 4, 5], // Monday to Friday
            availableHours: { start: '09:00', end: '17:00' },
            createdAt: new Date(userData.createDate)
          };

          setConsultant(consultantData);
        } else {
          setError(message || 'Không tìm thấy chuyên viên tư vấn');
          toast.error(message || 'Không tìm thấy chuyên viên tư vấn');
        }
      } catch (error: any) {
        console.error('Error loading consultant:', error);
        setError('Có lỗi xảy ra khi tải thông tin chuyên viên tư vấn');
        toast.error('Có lỗi xảy ra khi tải thông tin chuyên viên tư vấn');
      } finally {
        setLoading(false);
      }
    };

    fetchConsultant();
  }, [id]);

  const handleBookAppointment = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/consultants/${id}` } });
      return;
    }

    // Hiển thị thông báo tính năng đang phát triển
    setOpenSnackbar(true);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Chuyển đổi số ngày trong tuần thành chuỗi
  const getDayName = (day: number) => {
    const days = ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy'];
    return days[day];
  };

  if (loading) {
    return (
      <Container>
        <Box sx={{ py: 4, textAlign: 'center' }}>
          <Typography>Đang tải thông tin chuyên viên tư vấn...</Typography>
        </Box>
      </Container>
    );
  }

  if (error || !consultant) {
    return (
      <Container>
        <Box sx={{ py: 4, textAlign: 'center' }}>
          <Typography color="error">{error || 'Không tìm thấy chuyên viên tư vấn'}</Typography>
          <Button
            component={Link}
            to={backUrl}
            startIcon={<ArrowBackIcon />}
            sx={{ mt: 2 }}
          >
            {backText}
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container>
      <Button
        component={Link}
        to={backUrl}
        startIcon={<ArrowBackIcon />}
        sx={{ mb: 3 }}
      >
        {backText}
      </Button>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' }, gap: 4 }}>
        <Box>
          <Card sx={{ borderRadius: 2, overflow: 'hidden', mb: 4 }}>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: 'center', p: 3 }}>
              <Avatar
                src={consultant.profilePicture}
                alt={consultant.fullname}
                sx={{ width: 120, height: 120, mr: { xs: 0, sm: 3 }, mb: { xs: 2, sm: 0 } }}
              />
              <Box>
                <Typography variant="h4" component="h1" gutterBottom>
                  {consultant.fullname}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Rating value={consultant.rating} precision={0.1} readOnly />
                  <Typography variant="body2" sx={{ ml: 1 }}>
                    ({consultant.reviewCount} đánh giá)
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                  {consultant.specialization?.map((spec: string, index: number) => (
                    <Chip
                      key={index}
                      label={spec}
                      color="primary"
                      size="small"
                    />
                  ))}
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <SchoolIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                  <Typography variant="body2">{consultant.education}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <AccessTimeIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                  <Typography variant="body2">{consultant.experience} năm kinh nghiệm</Typography>
                </Box>
              </Box>
            </Box>

            <Divider />

            <Box sx={{ p: 3 }}>
              <Tabs value={tabValue} onChange={handleTabChange} aria-label="consultant tabs">
                <Tab label="Giới thiệu" id="consultant-tab-0" aria-controls="consultant-tabpanel-0" />
                <Tab label="Lịch làm việc" id="consultant-tab-1" aria-controls="consultant-tabpanel-1" />
                <Tab label="Đánh giá" id="consultant-tab-2" aria-controls="consultant-tabpanel-2" />
              </Tabs>

              <TabPanel value={tabValue} index={0}>
                <Typography variant="h6" gutterBottom>
                  Giới thiệu
                </Typography>
                <Typography variant="body1" paragraph>
                  {consultant.bio}
                </Typography>

                <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                  Chuyên môn
                </Typography>
                <List>
                  {consultant.specialization?.map((spec: string, index: number) => (
                    <ListItem key={index}>
                      <ListItemIcon>
                        <CheckCircleIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText primary={spec} />
                    </ListItem>
                  ))}
                </List>

                <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                  Thông tin liên hệ
                </Typography>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <EmailIcon />
                    </ListItemIcon>
                    <ListItemText primary={consultant.email} />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <PhoneIcon />
                    </ListItemIcon>
                    <ListItemText primary={consultant.phoneNumber} />
                  </ListItem>
                </List>
              </TabPanel>

              <TabPanel value={tabValue} index={1}>
                <Typography variant="h6" gutterBottom>
                  Lịch làm việc
                </Typography>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="body1" paragraph>
                    Chuyên viên tư vấn làm việc vào các ngày:
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                    {consultant.availableDays?.map((day: number, index: number) => (
                      <Chip
                        key={index}
                        label={getDayName(day)}
                        color="primary"
                        variant="outlined"
                      />
                    ))}
                  </Box>
                  <Typography variant="body1">
                    Giờ làm việc: {consultant.availableHours?.start || '09:00'} - {consultant.availableHours?.end || '17:00'}
                  </Typography>
                </Box>

                <Alert severity="info" sx={{ mb: 3 }}>
                  Vui lòng đặt lịch hẹn trước ít nhất 24 giờ để đảm bảo chuyên viên tư vấn có thể sắp xếp thời gian phù hợp.
                </Alert>

                <Button
                  variant="contained"
                  startIcon={<EventNoteIcon />}
                  onClick={handleBookAppointment}
                  size="large"
                >
                  Đặt lịch hẹn
                </Button>
              </TabPanel>

              <TabPanel value={tabValue} index={2}>
                <Typography variant="h6" gutterBottom>
                  Đánh giá từ người dùng
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Box sx={{ mr: 2 }}>
                    <Typography variant="h3" component="div" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                      {consultant.rating}
                    </Typography>
                    <Rating value={consultant.rating} precision={0.1} readOnly size="large" />
                    <Typography variant="body2">
                      {consultant.reviewCount} đánh giá
                    </Typography>
                  </Box>
                  <Box sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                      <Typography variant="body2" sx={{ minWidth: 30 }}>5</Typography>
                      <Box sx={{ flexGrow: 1, bgcolor: 'grey.300', height: 8, borderRadius: 4, mr: 1 }}>
                        <Box sx={{ bgcolor: 'primary.main', height: '100%', borderRadius: 4, width: '80%' }} />
                      </Box>
                      <Typography variant="body2">80%</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                      <Typography variant="body2" sx={{ minWidth: 30 }}>4</Typography>
                      <Box sx={{ flexGrow: 1, bgcolor: 'grey.300', height: 8, borderRadius: 4, mr: 1 }}>
                        <Box sx={{ bgcolor: 'primary.main', height: '100%', borderRadius: 4, width: '15%' }} />
                      </Box>
                      <Typography variant="body2">15%</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                      <Typography variant="body2" sx={{ minWidth: 30 }}>3</Typography>
                      <Box sx={{ flexGrow: 1, bgcolor: 'grey.300', height: 8, borderRadius: 4, mr: 1 }}>
                        <Box sx={{ bgcolor: 'primary.main', height: '100%', borderRadius: 4, width: '3%' }} />
                      </Box>
                      <Typography variant="body2">3%</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                      <Typography variant="body2" sx={{ minWidth: 30 }}>2</Typography>
                      <Box sx={{ flexGrow: 1, bgcolor: 'grey.300', height: 8, borderRadius: 4, mr: 1 }}>
                        <Box sx={{ bgcolor: 'primary.main', height: '100%', borderRadius: 4, width: '1%' }} />
                      </Box>
                      <Typography variant="body2">1%</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography variant="body2" sx={{ minWidth: 30 }}>1</Typography>
                      <Box sx={{ flexGrow: 1, bgcolor: 'grey.300', height: 8, borderRadius: 4, mr: 1 }}>
                        <Box sx={{ bgcolor: 'primary.main', height: '100%', borderRadius: 4, width: '1%' }} />
                      </Box>
                      <Typography variant="body2">1%</Typography>
                    </Box>
                  </Box>
                </Box>

                <Divider sx={{ my: 3 }} />

                <Box>
                  <Typography variant="body1" paragraph>
                    Chưa có đánh giá nào. Hãy là người đầu tiên đánh giá chuyên viên tư vấn này!
                  </Typography>
                  <Button
                    variant="outlined"
                    startIcon={<StarIcon />}
                    disabled={!isAuthenticated}
                  >
                    Viết đánh giá
                  </Button>
                  {!isAuthenticated && (
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      Bạn cần đăng nhập để viết đánh giá
                    </Typography>
                  )}
                </Box>
              </TabPanel>
            </Box>
          </Card>
        </Box>

        <Box>
          <Paper sx={{ p: 3, borderRadius: 2, mb: 3 }}>
            <Typography variant="h5" gutterBottom>
              Đặt lịch tư vấn
            </Typography>
            <Typography variant="body1" paragraph>
              Đặt lịch hẹn với chuyên viên tư vấn để được hỗ trợ trực tiếp.
            </Typography>
            <Button
              variant="contained"
              fullWidth
              size="large"
              startIcon={<EventNoteIcon />}
              onClick={handleBookAppointment}
              sx={{ mb: 2 }}
            >
              Đặt lịch hẹn
            </Button>
            {!isAuthenticated && (
              <Typography variant="body2" color="text.secondary" align="center">
                Bạn cần đăng nhập để đặt lịch hẹn
              </Typography>
            )}
          </Paper>

          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>
              Thông tin chuyên viên
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Chuyên môn:
              </Typography>
              <Typography variant="body2">
                {consultant.specialization?.join(', ') || 'N/A'}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Học vấn:
              </Typography>
              <Typography variant="body2">
                {consultant.education || 'N/A'}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Kinh nghiệm:
              </Typography>
              <Typography variant="body2">
                {consultant.experience || 0} năm
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Đánh giá:
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Rating value={consultant.rating} precision={0.1} size="small" readOnly />
                <Typography variant="body2" sx={{ ml: 1 }}>
                  ({consultant.reviewCount || 0})
                </Typography>
              </Box>
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
        <Alert onClose={handleCloseSnackbar} severity="info" sx={{ width: '100%' }}>
          Tính năng đặt lịch hẹn đang được phát triển và sẽ ra mắt sớm!
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ConsultantDetailPage;
