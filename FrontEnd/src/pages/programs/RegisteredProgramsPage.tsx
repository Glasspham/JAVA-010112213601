import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  CardMedia,
  Button,
  Alert
} from '@mui/material';
import {
  CalendarMonth as CalendarMonthIcon,
  LocationOn as LocationOnIcon,
  People as PeopleIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import ClientLayout from '../../components/layout/ClientLayout';
import { ProgramService } from '../../services/ProgramService';
import { CommunityProgram } from '../../types/program';

const RegisteredProgramsPage: React.FC = () => {
  const [programs, setPrograms] = useState<CommunityProgram[]>([]);
  const [loading, setLoading] = useState(true);
  const programService = new ProgramService();

  useEffect(() => {
    fetchMyRegisteredPrograms();
  }, []);

  const fetchMyRegisteredPrograms = async () => {
    try {
      setLoading(true);
      const username = localStorage.getItem('USERNAME');
      
      if (!username) {
        setLoading(false);
        return;
      }

      const [code, data, message] = await programService.getRegisteredPrograms(username);

      if (code === 200 && data) {
        const mappedPrograms = data.map((item: any) => ({
          id: item.id,
          title: item.title,
          description: item.description || '',
          startDate: item.date,
          endDate: item.date, // API chỉ trả về date, dùng làm cả startDate và endDate
          location: item.address,
          capacity: item.capacity,
          registeredCount: item.users ? item.users.length : 0,
          image: item.image ? `${process.env.REACT_APP_API_URL}/${item.image}` : `${process.env.REACT_APP_API_URL}/default_no_image.png`
        }));
        setPrograms(mappedPrograms);
      }
    } catch (error) {
      console.error('Error fetching registered programs:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ClientLayout>
      <Container>
        <Box sx={{ mb: 3 }}>
          <Button
            component={Link}
            to="/programs"
            startIcon={<ArrowBackIcon />}
            sx={{ mb: 2 }}
          >
            Quay lại danh sách chương trình
          </Button>
          
          <Typography variant="h4" component="h1" gutterBottom>
            Chương trình đã đăng ký
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Danh sách các chương trình cộng đồng mà bạn đã đăng ký tham gia.
          </Typography>
        </Box>

        {loading ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h6">
              Đang tải danh sách chương trình...
            </Typography>
          </Box>
        ) : !localStorage.getItem('USERNAME') ? (
          <Alert severity="warning" sx={{ mb: 3 }}>
            Vui lòng đăng nhập để xem danh sách chương trình đã đăng ký.
          </Alert>
        ) : programs.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h6" gutterBottom>
              Bạn chưa đăng ký chương trình nào
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              Hãy khám phá và đăng ký các chương trình cộng đồng thú vị.
            </Typography>
            <Button
              component={Link}
              to="/programs"
              variant="contained"
              color="primary"
            >
              Xem danh sách chương trình
            </Button>
          </Box>
        ) : (
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 3 }}>
            {programs.map((program) => (
              <Card key={program.id} sx={{ borderRadius: 2, overflow: 'hidden' }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={program.image}
                  alt={program.title}
                />
                <CardContent>
                  <Typography variant="h6" component="h3" gutterBottom sx={{ mb: 2 }}>
                    {program.title}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <CalendarMonthIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      {new Date(program.startDate).toLocaleDateString('vi-VN', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <LocationOnIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      {program.location}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <PeopleIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      {program.registeredCount}/{program.capacity} người tham gia
                    </Typography>
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {program.description}
                  </Typography>
                  
                  <Button
                    component={Link}
                    to={`/programs/${program.id}`}
                    variant="outlined"
                    fullWidth
                  >
                    Xem chi tiết
                  </Button>
                </CardContent>
              </Card>
            ))}
          </Box>
        )}
      </Container>
    </ClientLayout>
  );
};

export default RegisteredProgramsPage;
