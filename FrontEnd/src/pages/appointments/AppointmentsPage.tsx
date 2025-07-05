import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Paper,
  Tabs,
  Tab,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Chip,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  IconButton
} from '@mui/material';
import {
  EventNote as EventNoteIcon,
  Person as PersonIcon,
  CalendarMonth as CalendarMonthIcon,
  AccessTime as AccessTimeIcon,
  Add as AddIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { Appointment, AppointmentStatus, Specialist, AppointmentCreateRequest } from '../../types/appointment';
import { AppointmentService } from '../../services/AppointmentService';
import { AuthService } from '../../services/AuthService';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import { getAvatarUrl } from '../../utils/imageUtils';

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
      id={`appointment-tabpanel-${index}`}
      aria-labelledby={`appointment-tab-${index}`}
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

interface AppointmentsPageProps {
  isAdmin?: boolean;
}

const AppointmentsPage: React.FC<AppointmentsPageProps> = ({ isAdmin = false }) => {
  const appointmentService = new AppointmentService();
  const authService = new AuthService();

  const [tabValue, setTabValue] = useState(0);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [specialists, setSpecialists] = useState<Specialist[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSpecialist, setSelectedSpecialist] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [duration, setDuration] = useState(0);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  // Load specialists data
  const loadSpecialists = async () => {
    try {
      const [code, data, message] = await appointmentService.getSpecialists();
      if (code === 200) {
        setSpecialists(data);
      } else {
        console.error('Failed to load specialists:', message);
      }
    } catch (error) {
      console.error('Error loading specialists:', error);
    }
  };

  // Load appointments data
  const loadAppointments = async () => {
    if (!isAuthenticated || !user) return;

    try {
      const authenDTO = await authService.readInfoFromLocal();
      if (!authenDTO.userName) return;

      const [code, data, message] = await appointmentService.findAppointmentsByUsername({
        page: 1,
        limit: 100,
        username: authenDTO.userName
      });

      if (code === 200) {
        setAppointments(data.content);
      } else {
        console.error('Failed to load appointments:', message);
      }
    } catch (error) {
      console.error('Error loading appointments:', error);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/appointments' } });
      return;
    }
    loadSpecialists();
    loadAppointments();
  }, [isAuthenticated, navigate, user]);

  // Get specialist avatar by name
  const getSpecialistAvatar = (specialistName: string): string => {
    const specialist = specialists.find(s => s.fullname === specialistName);
    return getAvatarUrl(specialist?.avatar);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    // Reset form
    setSelectedDate(null);
    setSelectedSpecialist('');
    setSelectedTime('');
    setDuration(0);
    setBookingSuccess(false);
  };

  const handleBookAppointment = async () => {
    if (!selectedSpecialist || !selectedDate || !selectedTime) {
      toast.error('Vui lòng điền đầy đủ thông tin');
      return;
    }

    // Validate duration
    if (duration <= 0) {
      toast.error('Thời lượng phải lớn hơn 0 phút');
      return;
    }

    // Check if date and time is not in the past
    const now = new Date();
    const selectedDateTime = new Date(selectedDate);
    const [hours, minutes] = selectedTime.split(':').map(Number);
    selectedDateTime.setHours(hours, minutes, 0, 0);

    if (selectedDateTime <= now) {
      toast.error('Không thể đặt lịch hẹn cho thời gian trong quá khứ hoặc hiện tại');
      return;
    }

    try {
      setLoading(true);
      const authenDTO = await authService.readInfoFromLocal();
      if (!authenDTO.userName) {
        toast.error('Không tìm thấy thông tin người dùng');
        return;
      }

      const appointmentRequest: AppointmentCreateRequest = {
        id: 9007199254740991,
        username: authenDTO.userName,
        specialistName: selectedSpecialist,
        date: format(selectedDate, 'yyyy-MM-dd'),
        hours: selectedTime + ':00',
        duration: duration,
        status: 'PENDING'
      };

      const [code, data, message] = await appointmentService.createAppointment(appointmentRequest);

      if (code === 200) {
        setBookingSuccess(true);
        toast.success('Đặt lịch hẹn thành công!');

        // Đóng dialog sau 2 giây và reload appointments
        setTimeout(() => {
          setBookingSuccess(false);
          handleCloseDialog();
          loadAppointments();
        }, 2000);
      } else {
        toast.error(message || 'Có lỗi xảy ra khi đặt lịch hẹn');
      }
    } catch (error) {
      console.error('Error creating appointment:', error);
      toast.error('Có lỗi xảy ra khi đặt lịch hẹn');
    } finally {
      setLoading(false);
    }
  };

  const handleChangeStatus = async (appointmentId: number, newStatus: string) => {
    try {
      const [code, data, message] = await appointmentService.changeAppointmentStatus(appointmentId, newStatus);

      if (code === 200) {
        toast.success('Cập nhật trạng thái thành công');
        loadAppointments();
      } else {
        toast.error(message || 'Có lỗi xảy ra khi cập nhật trạng thái');
      }
    } catch (error) {
      console.error('Error changing appointment status:', error);
      toast.error('Có lỗi xảy ra khi cập nhật trạng thái');
    }
  };

  const getStatusColor = (status: string) => {
    if (status === 'PENDING') return 'warning';
    if (status === 'CONFIRM') return 'info';
    if (status === 'COMPLETE') return 'success';
    if (status === 'CANCEL') return 'error';
    return 'default';
  };

  const getStatusText = (status: string) => {
    if (status === 'PENDING') return 'Chờ xác nhận';
    if (status === 'CONFIRM') return 'Đã xác nhận';
    if (status === 'COMPLETE') return 'Đã hoàn thành';
    if (status === 'CANCEL') return 'Đã hủy';
    return status;
  };

  // Tạo danh sách các khung giờ có sẵn
  const availableTimes = [
    '09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00'
  ];

  // Lọc các cuộc hẹn theo trạng thái
  const upcomingAppointments = appointments.filter(
    appointment => (appointment.status === 'PENDING' || appointment.status === 'CONFIRM') && new Date(appointment.date) >= new Date()
  );

  const pastAppointments = appointments.filter(
    appointment => appointment.status === 'COMPLETE' || appointment.status === 'CANCEL' || new Date(appointment.date) < new Date()
  );

  return (
    <Container>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Đặt lịch tư vấn
        </Typography>
        <Typography variant="body1" paragraph>
          Đặt lịch hẹn trực tuyến với chuyên viên tư vấn để được hỗ trợ về các vấn đề liên quan đến phòng ngừa sử dụng ma túy.
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenDialog}
          sx={{ mt: 2 }}
        >
          Đặt lịch hẹn mới
        </Button>
      </Box>

      <Paper sx={{ borderRadius: 2 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="appointment tabs">
            <Tab label="Lịch hẹn sắp tới" id="appointment-tab-0" aria-controls="appointment-tabpanel-0" />
            <Tab label="Lịch sử cuộc hẹn" id="appointment-tab-1" aria-controls="appointment-tabpanel-1" />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          {upcomingAppointments.length > 0 ? (
            <List>
              {upcomingAppointments.map((appointment) => {
                return (
                  <React.Fragment key={appointment.id}>
                    <ListItem alignItems="flex-start">
                      <ListItemAvatar>
                        <Avatar
                          src={getSpecialistAvatar(appointment.specialistFullname)}
                          alt={appointment.specialistFullname}
                        >
                          <PersonIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="h6" component="span">
                              {appointment.specialistFullname}
                            </Typography>
                            <Chip
                              label={getStatusText(appointment.status)}
                              color={getStatusColor(appointment.status)}
                              size="small"
                            />
                          </Box>
                        }
                        secondary={
                          <React.Fragment>
                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                              <CalendarMonthIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                              <Typography variant="body2" component="span">
                                {appointment.date}
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                              <AccessTimeIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                              <Typography variant="body2" component="span">
                                {appointment.hours} (Thời lượng: {appointment.duration} phút)
                              </Typography>
                            </Box>
                            <Box sx={{ mt: 2 }}>
                              <Button
                                variant="outlined"
                                size="small"
                                sx={{ mr: 1 }}
                                disabled
                              >
                                Đổi lịch
                              </Button>
                              {appointment.status === 'PENDING' && (
                                <Button
                                  variant="outlined"
                                  color="error"
                                  size="small"
                                  onClick={() => handleChangeStatus(appointment.id, 'CANCEL')}
                                >
                                  Hủy lịch
                                </Button>
                              )}
                              {appointment.status !== 'PENDING' && (
                                <Button
                                  variant="outlined"
                                  color="error"
                                  size="small"
                                  disabled
                                >
                                  Hủy lịch
                                </Button>
                              )}
                            </Box>
                          </React.Fragment>
                        }
                      />
                    </ListItem>
                    <Divider variant="inset" component="li" />
                  </React.Fragment>
                );
              })}
            </List>
          ) : (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="h6" gutterBottom>
                Bạn chưa có lịch hẹn nào sắp tới
              </Typography>
              <Typography variant="body1" paragraph>
                Hãy đặt lịch hẹn với chuyên viên tư vấn để được hỗ trợ.
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleOpenDialog}
              >
                Đặt lịch hẹn mới
              </Button>
            </Box>
          )}
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          {pastAppointments.length > 0 ? (
            <List>
              {pastAppointments.map((appointment) => {
                return (
                  <React.Fragment key={appointment.id}>
                    <ListItem alignItems="flex-start">
                      <ListItemAvatar>
                        <Avatar>
                          <PersonIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="h6" component="span">
                              {appointment.specialistFullname}
                            </Typography>
                            <Chip
                              label={getStatusText(appointment.status)}
                              color={getStatusColor(appointment.status)}
                              size="small"
                            />
                          </Box>
                        }
                        secondary={
                          <React.Fragment>
                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                              <CalendarMonthIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                              <Typography variant="body2" component="span">
                                {appointment.date}
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                              <AccessTimeIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                              <Typography variant="body2" component="span">
                                {appointment.hours} (Thời lượng: {appointment.duration} phút)
                              </Typography>
                            </Box>
                          </React.Fragment>
                        }
                      />
                    </ListItem>
                    <Divider variant="inset" component="li" />
                  </React.Fragment>
                );
              })}
            </List>
          ) : (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="h6" gutterBottom>
                Bạn chưa có lịch sử cuộc hẹn nào
              </Typography>
              <Typography variant="body1">
                Lịch sử cuộc hẹn sẽ hiển thị ở đây sau khi bạn hoàn thành các cuộc hẹn.
              </Typography>
            </Box>
          )}
        </TabPanel>
      </Paper>

      {/* Dialog đặt lịch hẹn */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Đặt lịch hẹn mới</Typography>
            <IconButton edge="end" color="inherit" onClick={handleCloseDialog} aria-label="close">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          {bookingSuccess ? (
            <Alert severity="success" sx={{ my: 2 }}>
              Đặt lịch hẹn thành công!
            </Alert>
          ) : (
            <Box sx={{ mt: 2 }}>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
                <Box>
                  <FormControl fullWidth sx={{ mb: 3 }}>
                    <InputLabel id="specialist-select-label">Chuyên gia tư vấn</InputLabel>
                    <Select
                      labelId="specialist-select-label"
                      id="specialist-select"
                      value={selectedSpecialist}
                      label="Chuyên gia tư vấn"
                      onChange={(e) => setSelectedSpecialist(e.target.value)}
                    >
                      {specialists.map((specialist) => (
                        <MenuItem key={specialist.id} value={specialist.username}>
                          {specialist.fullname} - {specialist.position}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  {/* Commented out date picker until we fix the issue */}
                  <TextField
                    label="Ngày hẹn"
                    type="date"
                    value={selectedDate ? selectedDate.toISOString().split('T')[0] : ''}
                    onChange={(e) => setSelectedDate(e.target.value ? new Date(e.target.value) : null)}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    inputProps={{ min: new Date().toISOString().split('T')[0] }}
                    fullWidth
                    sx={{ mb: 3 }}
                  />

                  <FormControl fullWidth sx={{ mb: 3 }}>
                    <InputLabel id="time-select-label">Thời gian</InputLabel>
                    <Select
                      labelId="time-select-label"
                      id="time-select"
                      value={selectedTime}
                      label="Thời gian"
                      onChange={(e) => setSelectedTime(e.target.value)}
                    >
                      {availableTimes.map((time) => (
                        <MenuItem key={time} value={time}>
                          {time} - {parseInt(time.split(':')[0]) + 1}:{time.split(':')[1]}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>

                <Box>
                  <TextField
                    label="Thời lượng (phút)"
                    type="number"
                    value={duration}
                    onChange={(e) => setDuration(parseFloat(e.target.value))}
                    fullWidth
                    sx={{ mb: 3 }}
                    InputProps={{ inputProps: { min: 1, step: 15 } }}
                    helperText="Thời lượng phải lớn hơn 0 phút"
                  />

                  <Alert severity="info" sx={{ mb: 3 }}>
                    <Typography variant="body2">
                      Vui lòng đặt lịch hẹn trước ít nhất 24 giờ để đảm bảo chuyên gia tư vấn có thể sắp xếp thời gian phù hợp.
                    </Typography>
                  </Alert>

                  <Alert severity="warning">
                    <Typography variant="body2">
                      Nếu bạn cần hủy hoặc đổi lịch, vui lòng thông báo trước ít nhất 12 giờ.
                    </Typography>
                  </Alert>
                </Box>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Hủy</Button>
          <Button
            variant="contained"
            onClick={handleBookAppointment}
            disabled={!selectedSpecialist || !selectedDate || !selectedTime || duration <= 0 || bookingSuccess || loading}
          >
            {loading ? 'Đang đặt lịch...' : 'Đặt lịch'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AppointmentsPage;
