import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  CardMedia,
  Button,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Chip,
  Pagination,
  Grid,
  Paper,
  Divider,
  Alert
} from '@mui/material';
import {
  Search as SearchIcon,
  CalendarMonth as CalendarMonthIcon,
  LocationOn as LocationOnIcon,
  People as PeopleIcon
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { CommunityProgram } from '../../types/program';
import { mockPrograms } from '../../utils/mockData';
import '../../styles/ProgramCard.css';

interface ProgramsPageProps {
  isAdmin?: boolean;
}

const ProgramsPage: React.FC<ProgramsPageProps> = ({ isAdmin = false }) => {
  const [programs, setPrograms] = useState<CommunityProgram[]>([]);
  const [filteredPrograms, setFilteredPrograms] = useState<CommunityProgram[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [timeFilter, setTimeFilter] = useState<string>('all');
  const [page, setPage] = useState(1);
  const programsPerPage = 6;

  useEffect(() => {
    // Trong thực tế, đây sẽ là API call
    setPrograms(mockPrograms as unknown as CommunityProgram[]);
    setFilteredPrograms(mockPrograms as unknown as CommunityProgram[]);
  }, []);

  useEffect(() => {
    let result = [...programs];

    // Lọc theo từ khóa tìm kiếm
    if (searchTerm) {
      result = result.filter(program =>
        program.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        program.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        program.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Lọc theo thời gian
    const now = new Date();
    if (timeFilter === 'upcoming') {
      result = result.filter(program => new Date(program.startDate) > now);
    } else if (timeFilter === 'past') {
      result = result.filter(program => new Date(program.endDate) < now);
    } else if (timeFilter === 'current') {
      result = result.filter(program =>
        new Date(program.startDate) <= now && new Date(program.endDate) >= now
      );
    }

    setFilteredPrograms(result);
    setPage(1); // Reset về trang đầu tiên khi lọc
  }, [searchTerm, timeFilter, programs]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleTimeFilterChange = (event: SelectChangeEvent<string>) => {
    setTimeFilter(event.target.value);
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  // Tính toán các chương trình hiển thị trên trang hiện tại
  const indexOfLastProgram = page * programsPerPage;
  const indexOfFirstProgram = indexOfLastProgram - programsPerPage;
  const currentPrograms = filteredPrograms.slice(indexOfFirstProgram, indexOfLastProgram);
  const totalPages = Math.ceil(filteredPrograms.length / programsPerPage);

  // Lấy chương trình sắp diễn ra gần nhất
  const upcomingPrograms = [...programs]
    .filter(program => new Date(program.startDate) > new Date())
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
    .slice(0, 1);

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 2 }}>
        Chương trình cộng đồng
      </Typography>
      <Typography variant="body1" paragraph sx={{ mb: 4 }}>
        Tham gia các chương trình truyền thông và giáo dục cộng đồng về phòng chống ma túy.
        Các chương trình này giúp nâng cao nhận thức và kết nối cộng đồng trong việc phòng ngừa sử dụng ma túy.
      </Typography>

      {/* Chương trình nổi bật */}
      {upcomingPrograms.length > 0 && (
        <Box sx={{ mb: 5 }}>
          <Typography variant="h5" component="h2" gutterBottom>
            Chương trình sắp diễn ra
          </Typography>
          <Card sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, borderRadius: 2, overflow: 'hidden' }}>
            <CardMedia
              component="img"
              sx={{ width: { xs: '100%', md: 300 }, height: { xs: 200, md: 'auto' } }}
              image={upcomingPrograms[0].image}
              alt={upcomingPrograms[0].title}
            />
            <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
              <CardContent sx={{ flex: '1 0 auto' }}>
                <Typography component="h3" variant="h5" gutterBottom>
                  {upcomingPrograms[0].title}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <CalendarMonthIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                  <Typography variant="body2" color="text.secondary">
                    {new Date(upcomingPrograms[0].startDate).toLocaleDateString('vi-VN', {
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
                    {upcomingPrograms[0].location}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <PeopleIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                  <Typography variant="body2" color="text.secondary">
                    {upcomingPrograms[0].registeredCount}/{upcomingPrograms[0].capacity} người đã đăng ký
                  </Typography>
                </Box>
                <Typography variant="body1" paragraph>
                  {upcomingPrograms[0].description}
                </Typography>
                <Button
                  component={Link}
                  to={`/programs/${upcomingPrograms[0].id}`}
                  variant="contained"
                  sx={{ mt: 2 }}
                >
                  Đăng ký tham gia
                </Button>
              </CardContent>
            </Box>
          </Card>
        </Box>
      )}

      {/* Bộ lọc và tìm kiếm */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
          <TextField
            fullWidth
            label="Tìm kiếm chương trình"
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
            <InputLabel id="time-filter-label">Thời gian</InputLabel>
            <Select
              labelId="time-filter-label"
              id="time-filter"
              value={timeFilter}
              onChange={handleTimeFilterChange}
              label="Thời gian"
            >
              <MenuItem value="all">Tất cả</MenuItem>
              <MenuItem value="upcoming">Sắp diễn ra</MenuItem>
              <MenuItem value="current">Đang diễn ra</MenuItem>
              <MenuItem value="past">Đã kết thúc</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

      {/* Hiển thị số lượng kết quả */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="body1">
          Hiển thị {filteredPrograms.length} chương trình
        </Typography>
      </Box>

      {/* Danh sách chương trình */}
      {currentPrograms.length > 0 ? (
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 4 }}>
          {currentPrograms.map((program) => (
            <Box key={program.id}>
              <Card className="program-card">
                <CardMedia
                  component="img"
                  className="program-image"
                  image={program.image}
                  alt={program.title}
                />
                <CardContent className="card-content">
                  <Typography className="program-title" variant="h5" component="h3">
                    {program.title}
                  </Typography>
                  <Box className="program-info">
                    <CalendarMonthIcon className="program-info-icon" fontSize="small" />
                    <Typography variant="body2" color="text.secondary">
                      {new Date(program.startDate).toLocaleDateString('vi-VN', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </Typography>
                  </Box>
                  <Box className="program-info">
                    <LocationOnIcon className="program-info-icon" fontSize="small" />
                    <Typography variant="body2" color="text.secondary">
                      {program.location}
                    </Typography>
                  </Box>
                  <Box className="program-info">
                    <PeopleIcon className="program-info-icon" fontSize="small" />
                    <Typography variant="body2" color="text.secondary">
                      {program.registeredCount}/{program.capacity} người đã đăng ký
                    </Typography>
                  </Box>
                  <Typography className="program-description" variant="body2" color="text.secondary" paragraph>
                    {program.description}
                  </Typography>
                  <Box className="card-actions">
                    <Button
                      component={Link}
                      to={`/programs/${program.id}`}
                      variant="contained"
                      fullWidth
                      className="detail-button"
                      color="primary"
                    >
                      {new Date(program.endDate) < new Date() ? 'Xem chi tiết' : 'Đăng ký tham gia'}
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Box>
          ))}
        </Box>
      ) : (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h6">
            Không tìm thấy chương trình nào phù hợp với tiêu chí tìm kiếm.
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

      {/* Thông tin bổ sung */}
      <Box sx={{ mt: 6, mb: 4 }}>
        <Paper sx={{ p: 3, borderRadius: 2 }}>
          <Typography variant="h5" gutterBottom>
            Tại sao nên tham gia chương trình cộng đồng?
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 3 }}>
            <Box>
              <Box sx={{ textAlign: 'center', p: 2 }}>
                <Box sx={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  bgcolor: 'primary.main',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '2rem',
                  fontWeight: 'bold',
                  margin: '0 auto 16px'
                }}>
                  1
                </Box>
                <Typography variant="h6" gutterBottom>
                  Nâng cao nhận thức
                </Typography>
                <Typography variant="body2">
                  Các chương trình cộng đồng giúp nâng cao nhận thức về tác hại của ma túy và cách phòng tránh.
                </Typography>
              </Box>
            </Box>
            <Box>
              <Box sx={{ textAlign: 'center', p: 2 }}>
                <Box sx={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  bgcolor: 'primary.main',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '2rem',
                  fontWeight: 'bold',
                  margin: '0 auto 16px'
                }}>
                  2
                </Box>
                <Typography variant="h6" gutterBottom>
                  Kết nối cộng đồng
                </Typography>
                <Typography variant="body2">
                  Tham gia các chương trình giúp kết nối với những người có cùng mối quan tâm và xây dựng mạng lưới hỗ trợ.
                </Typography>
              </Box>
            </Box>
            <Box>
              <Box sx={{ textAlign: 'center', p: 2 }}>
                <Box sx={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  bgcolor: 'primary.main',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '2rem',
                  fontWeight: 'bold',
                  margin: '0 auto 16px'
                }}>
                  3
                </Box>
                <Typography variant="h6" gutterBottom>
                  Học hỏi từ chuyên gia
                </Typography>
                <Typography variant="body2">
                  Các chương trình thường có sự tham gia của các chuyên gia trong lĩnh vực, giúp bạn học hỏi kiến thức và kỹ năng mới.
                </Typography>
              </Box>
            </Box>
          </Box>
          <Alert severity="info" sx={{ mt: 3 }}>
            <Typography variant="body2">
              Đăng ký tham gia các chương trình cộng đồng là miễn phí. Tuy nhiên, số lượng người tham gia có giới hạn, vì vậy hãy đăng ký sớm để đảm bảo có chỗ.
            </Typography>
          </Alert>
        </Paper>
      </Box>
    </Container>
  );
};

export default ProgramsPage;
