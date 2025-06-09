import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  CardMedia,
  Button,
  Paper,
  Grid,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  FormControlLabel,
  Checkbox,
  LinearProgress,
  Snackbar
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  CalendarMonth as CalendarMonthIcon,
  LocationOn as LocationOnIcon,
  People as PeopleIcon,
  AccessTime as AccessTimeIcon,
  CheckCircle as CheckCircleIcon,
  EventAvailable as EventAvailableIcon
} from '@mui/icons-material';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { CommunityProgram } from '../../types/program';
import { mockPrograms } from '../../utils/mockData';
import { useAuth } from '../../contexts/AuthContext';
import '../../styles/ProgramCard.css';

const ProgramDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [program, setProgram] = useState<CommunityProgram | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Trong thực tế, đây sẽ là API call
    const fetchProgram = async () => {
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 500));

        const foundProgram = mockPrograms.find(p => p.id === id);
        if (foundProgram) {
          setProgram(foundProgram as unknown as CommunityProgram);
        } else {
          setError('Không tìm thấy chương trình');
        }
      } catch (error) {
        setError('Đã xảy ra lỗi khi tải thông tin chương trình');
      } finally {
        setLoading(false);
      }
    };

    fetchProgram();
  }, [id]);

  const handleOpenDialog = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/programs/${id}` } });
      return;
    }

    setOpenDialog(true);

    // Nếu đã đăng nhập, điền sẵn thông tin từ user
    if (user) {
      setName(`${user.firstName} ${user.lastName}`);
      setEmail(user.email);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleRegister = () => {
    // Trong thực tế, đây sẽ là API call để đăng ký tham gia
    // Giả lập thành công
    setRegistrationSuccess(true);

    // Đóng dialog sau 2 giây
    setTimeout(() => {
      setOpenDialog(false);
      setRegistrationSuccess(false);
      setOpenSnackbar(true);

      // Reset form
      setName('');
      setEmail('');
      setPhone('');
      setAgreeTerms(false);
    }, 2000);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const isProgramPast = program ? new Date(program.endDate) < new Date() : false;
  const isProgramFull = program ? program.registeredCount >= program.capacity : false;

  if (loading) {
    return (
      <Container>
        <Box sx={{ py: 4, textAlign: 'center' }}>
          <Typography>Đang tải thông tin chương trình...</Typography>
          <LinearProgress sx={{ mt: 2 }} />
        </Box>
      </Container>
    );
  }

  if (error || !program) {
    return (
      <Container>
        <Box sx={{ py: 4, textAlign: 'center' }}>
          <Typography color="error">{error || 'Không tìm thấy chương trình'}</Typography>
          <Button
            component={Link}
            to="/programs"
            startIcon={<ArrowBackIcon />}
            sx={{ mt: 2 }}
          >
            Quay lại danh sách chương trình
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container>
      <Button
        component={Link}
        to="/programs"
        startIcon={<ArrowBackIcon />}
        sx={{ mb: 3 }}
      >
        Quay lại danh sách chương trình
      </Button>

      <Card sx={{ borderRadius: 2, overflow: 'hidden', mb: 4 }}>
        <CardMedia
          component="img"
          height="300"
          image={program.image}
          alt={program.title}
          sx={{ objectFit: 'cover' }}
        />
        <CardContent>
          <Typography variant="h4" component="h1" gutterBottom>
            {program.title}
          </Typography>

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
            <Chip
              icon={<CalendarMonthIcon />}
              label={new Date(program.startDate).toLocaleDateString('vi-VN', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
              color="primary"
              variant="outlined"
            />
            <Chip
              icon={<LocationOnIcon />}
              label={program.location}
              color="primary"
              variant="outlined"
            />
            <Chip
              icon={<PeopleIcon />}
              label={`${program.registeredCount}/${program.capacity} người đã đăng ký`}
              color="primary"
              variant="outlined"
            />
            {isProgramPast ? (
              <Chip
                label="Đã kết thúc"
                color="default"
              />
            ) : isProgramFull ? (
              <Chip
                label="Đã đủ số lượng"
                color="error"
              />
            ) : (
              <Chip
                label="Còn nhận đăng ký"
                color="success"
              />
            )}
          </Box>

          <Typography variant="h5" gutterBottom>
            Mô tả chương trình
          </Typography>
          <Typography variant="body1" paragraph>
            {program.description}
          </Typography>

          <Typography variant="body1" paragraph>
            Chương trình này được tổ chức nhằm nâng cao nhận thức về phòng chống ma túy trong cộng đồng.
            Thông qua các hoạt động tương tác, triển lãm và tư vấn trực tiếp, người tham gia sẽ được trang bị
            kiến thức và kỹ năng cần thiết để phòng tránh ma túy.
          </Typography>

          <Divider sx={{ my: 3 }} />

          <Typography variant="h5" gutterBottom>
            Thông tin chi tiết
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
            <Box>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <CalendarMonthIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Thời gian"
                    secondary={`${new Date(program.startDate).toLocaleDateString('vi-VN')} - ${new Date(program.endDate).toLocaleDateString('vi-VN')}`}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <AccessTimeIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Giờ bắt đầu"
                    secondary="08:30 - 16:30"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <LocationOnIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Địa điểm"
                    secondary={program.location}
                  />
                </ListItem>
              </List>
            </Box>
            <Box>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <PeopleIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Số lượng người tham gia"
                    secondary={`${program.registeredCount}/${program.capacity} người đã đăng ký`}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <EventAvailableIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Đăng ký"
                    secondary={isProgramPast ? "Đã kết thúc" : isProgramFull ? "Đã đủ số lượng" : "Còn nhận đăng ký"}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Phí tham gia"
                    secondary="Miễn phí"
                  />
                </ListItem>
              </List>
            </Box>
          </Box>

          <Divider sx={{ my: 3 }} />

          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Button
              variant="contained"
              size="large"
              startIcon={<EventAvailableIcon />}
              onClick={handleOpenDialog}
              disabled={isProgramPast || isProgramFull}
              className="detail-button"
              sx={{ px: 4, py: 1.5 }}
            >
              {isProgramPast ? "Chương trình đã kết thúc" : isProgramFull ? "Đã đủ số lượng" : "Đăng ký tham gia"}
            </Button>
          </Box>
        </CardContent>
      </Card>

      <Paper sx={{ p: 3, borderRadius: 2, mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          Nội dung chương trình
        </Typography>
        <List>
          <ListItem>
            <ListItemIcon>
              <CheckCircleIcon color="primary" />
            </ListItemIcon>
            <ListItemText
              primary="Triển lãm thông tin"
              secondary="Triển lãm cung cấp thông tin về các loại ma túy phổ biến, tác hại và cách nhận biết."
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <CheckCircleIcon color="primary" />
            </ListItemIcon>
            <ListItemText
              primary="Hội thảo chuyên đề"
              secondary="Các chuyên gia sẽ chia sẻ kiến thức và kinh nghiệm về phòng chống ma túy."
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <CheckCircleIcon color="primary" />
            </ListItemIcon>
            <ListItemText
              primary="Hoạt động tương tác"
              secondary="Các hoạt động nhóm giúp người tham gia rèn luyện kỹ năng từ chối và phòng tránh ma túy."
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <CheckCircleIcon color="primary" />
            </ListItemIcon>
            <ListItemText
              primary="Tư vấn trực tiếp"
              secondary="Các chuyên viên tư vấn sẽ có mặt để hỗ trợ và giải đáp thắc mắc."
            />
          </ListItem>
        </List>
      </Paper>

      <Paper sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="h5" gutterBottom>
          Lưu ý khi tham gia
        </Typography>
        <Alert severity="info" sx={{ mb: 3 }}>
          <Typography variant="body1">
            Vui lòng đến đúng giờ và mang theo giấy tờ tùy thân để đăng ký tham gia.
          </Typography>
        </Alert>
        <Typography variant="body1" paragraph>
          Để có trải nghiệm tốt nhất khi tham gia chương trình, vui lòng lưu ý:
        </Typography>
        <List>
          <ListItem>
            <ListItemIcon>
              <CheckCircleIcon color="primary" />
            </ListItemIcon>
            <ListItemText primary="Đăng ký trước để đảm bảo có chỗ" />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <CheckCircleIcon color="primary" />
            </ListItemIcon>
            <ListItemText primary="Mang theo giấy tờ tùy thân để xác nhận đăng ký" />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <CheckCircleIcon color="primary" />
            </ListItemIcon>
            <ListItemText primary="Đến trước 15 phút để hoàn tất thủ tục đăng ký" />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <CheckCircleIcon color="primary" />
            </ListItemIcon>
            <ListItemText primary="Chuẩn bị sẵn câu hỏi nếu bạn muốn tư vấn trực tiếp" />
          </ListItem>
        </List>
      </Paper>

      {/* Dialog đăng ký tham gia */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          Đăng ký tham gia chương trình
        </DialogTitle>
        <DialogContent>
          {registrationSuccess ? (
            <Alert severity="success" sx={{ my: 2 }}>
              Đăng ký tham gia thành công! Chúng tôi sẽ gửi thông tin xác nhận qua email của bạn.
            </Alert>
          ) : (
            <Box sx={{ mt: 2 }}>
              <TextField
                label="Họ và tên"
                value={name}
                onChange={(e) => setName(e.target.value)}
                fullWidth
                margin="normal"
                required
              />
              <TextField
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
                margin="normal"
                required
              />
              <TextField
                label="Số điện thoại"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                fullWidth
                margin="normal"
                required
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    color="primary"
                  />
                }
                label="Tôi đồng ý với điều khoản và điều kiện tham gia chương trình"
                sx={{ mt: 2 }}
              />
              <Alert severity="info" sx={{ mt: 2 }}>
                <Typography variant="body2">
                  Thông tin của bạn sẽ chỉ được sử dụng cho mục đích đăng ký tham gia chương trình này.
                </Typography>
              </Alert>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Hủy</Button>
          <Button
            variant="contained"
            onClick={handleRegister}
            disabled={!name || !email || !phone || !agreeTerms || registrationSuccess}
            className="detail-button"
          >
            Đăng ký
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message="Đăng ký tham gia thành công! Chúng tôi sẽ gửi thông tin xác nhận qua email của bạn."
      />
    </Container>
  );
};

export default ProgramDetailPage;
