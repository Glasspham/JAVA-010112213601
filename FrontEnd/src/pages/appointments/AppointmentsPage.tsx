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
import { Appointment, AppointmentStatus } from '../../types/appointment';
import { mockAppointments, mockConsultants } from '../../utils/mockData';
import { useAuth } from '../../contexts/AuthContext';

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
  const [tabValue, setTabValue] = useState(0);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedConsultant, setSelectedConsultant] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [notes, setNotes] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/appointments' } });
      return;
    }

    // Trong thực tế, đây sẽ là API call
    // Lọc các cuộc hẹn của người dùng hiện tại
    const userAppointments = mockAppointments.filter(appointment =>
      appointment.userId === user?.id
    );
    setAppointments(userAppointments);
  }, [isAuthenticated, navigate, user]);

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
    setSelectedConsultant('');
    setSelectedTime('');
    setNotes('');
  };

  const handleBookAppointment = () => {
    // Trong thực tế, đây sẽ là API call để đặt lịch hẹn
    // Giả lập thành công
    setBookingSuccess(true);

    // Đóng dialog sau 2 giây
    setTimeout(() => {
      setBookingSuccess(false);
      handleCloseDialog();

      // Thêm cuộc hẹn mới vào danh sách (giả lập)
      if (selectedDate && selectedConsultant && selectedTime) {
        const [startHour, startMinute] = selectedTime.split(':').map(Number);
        const endHour = startHour + 1;

        const newAppointment: Appointment = {
          id: String(Date.now()),
          userId: user?.id || '',
          consultantId: selectedConsultant,
          date: selectedDate,
          duration: 60, // Default duration is 60 minutes
          startTime: selectedTime,
          endTime: `${endHour}:${startMinute < 10 ? '0' + startMinute : startMinute}`,
          status: 'pending',
          notes: notes,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        setAppointments(prev => [...prev, newAppointment]);
      }
    }, 2000);
  };

  const getStatusColor = (status: AppointmentStatus) => {
    if (status === 'scheduled') return 'primary';
    if (status === 'completed') return 'success';
    if (status === 'cancelled') return 'error';
    if (status === 'rescheduled') return 'warning';
    if (status === 'pending') return 'info';
    if (status === 'confirmed') return 'secondary';
    return 'default';
  };

  const getStatusText = (status: AppointmentStatus) => {
    if (status === 'scheduled') return 'Đã lên lịch';
    if (status === 'completed') return 'Đã hoàn thành';
    if (status === 'cancelled') return 'Đã hủy';
    if (status === 'rescheduled') return 'Đã đổi lịch';
    if (status === 'pending') return 'Chờ xác nhận';
    if (status === 'confirmed') return 'Đã xác nhận';
    return '';
  };

  // Tạo danh sách các khung giờ có sẵn
  const availableTimes = [
    '09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00'
  ];

  // Lọc các cuộc hẹn theo trạng thái
  const upcomingAppointments = appointments.filter(
    appointment => (appointment.status === 'scheduled' || appointment.status === 'pending' || appointment.status === 'confirmed') && new Date(appointment.date) >= new Date()
  );

  const pastAppointments = appointments.filter(
    appointment => appointment.status === 'completed' || appointment.status === 'cancelled' || new Date(appointment.date) < new Date()
  );

  return (
    <Container>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ mt:3 }}>
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
                const consultant = mockConsultants.find(c => c.id === appointment.consultantId);
                return (
                  <React.Fragment key={appointment.id}>
                    <ListItem alignItems="flex-start">
                      <ListItemAvatar>
                        <Avatar
                          src={consultant?.profilePicture}
                          alt={`${consultant?.firstName} ${consultant?.lastName}`}
                        />
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="h6" component="span">
                              {consultant?.firstName} {consultant?.lastName}
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
                                {new Date(appointment.date).toLocaleDateString('vi-VN', {
                                  weekday: 'long',
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
                                })}
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                              <AccessTimeIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                              <Typography variant="body2" component="span">
                                {appointment.startTime} - {appointment.endTime}
                              </Typography>
                            </Box>
                            {appointment.notes && (
                              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                Ghi chú: {appointment.notes}
                              </Typography>
                            )}
                            <Box sx={{ mt: 2 }}>
                              <Button
                                variant="outlined"
                                size="small"
                                sx={{ mr: 1 }}
                              >
                                Đổi lịch
                              </Button>
                              <Button
                                variant="outlined"
                                color="error"
                                size="small"
                              >
                                Hủy lịch
                              </Button>
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
                const consultant = mockConsultants.find(c => c.id === appointment.consultantId);
                return (
                  <React.Fragment key={appointment.id}>
                    <ListItem alignItems="flex-start">
                      <ListItemAvatar>
                        <Avatar
                          src={consultant?.profilePicture}
                          alt={`${consultant?.firstName} ${consultant?.lastName}`}
                        />
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="h6" component="span">
                              {consultant?.firstName} {consultant?.lastName}
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
                                {new Date(appointment.date).toLocaleDateString('vi-VN', {
                                  weekday: 'long',
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
                                })}
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                              <AccessTimeIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                              <Typography variant="body2" component="span">
                                {appointment.startTime} - {appointment.endTime}
                              </Typography>
                            </Box>
                            {appointment.notes && (
                              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                Ghi chú: {appointment.notes}
                              </Typography>
                            )}
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
              Đặt lịch hẹn thành công! Chúng tôi sẽ gửi thông tin xác nhận qua email của bạn.
            </Alert>
          ) : (
            <Box sx={{ mt: 2 }}>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
                <Box>
                  <FormControl fullWidth sx={{ mb: 3 }}>
                    <InputLabel id="consultant-select-label">Chuyên viên tư vấn</InputLabel>
                    <Select
                      labelId="consultant-select-label"
                      id="consultant-select"
                      value={selectedConsultant}
                      label="Chuyên viên tư vấn"
                      onChange={(e) => setSelectedConsultant(e.target.value)}
                    >
                      {mockConsultants.map((consultant) => (
                        <MenuItem key={consultant.id} value={consultant.id}>
                          {consultant.firstName} {consultant.lastName} - {consultant.specialization?.join(', ') || 'N/A'}
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
                    label="Ghi chú"
                    multiline
                    rows={4}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    fullWidth
                    placeholder="Mô tả ngắn gọn về vấn đề bạn muốn tư vấn"
                    sx={{ mb: 3 }}
                  />

                  <Alert severity="info" sx={{ mb: 3 }}>
                    <Typography variant="body2">
                      Vui lòng đặt lịch hẹn trước ít nhất 24 giờ để đảm bảo chuyên viên tư vấn có thể sắp xếp thời gian phù hợp.
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
            disabled={!selectedConsultant || !selectedDate || !selectedTime || bookingSuccess}
          >
            Đặt lịch
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AppointmentsPage;
