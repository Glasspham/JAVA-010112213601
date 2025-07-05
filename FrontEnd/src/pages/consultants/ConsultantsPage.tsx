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
  Rating,
  Pagination,
  Divider
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { UserService } from '../../services/UserService';
import { UserSearch } from '../../dto/UserSearch';
import { toast } from 'react-toastify';

interface ConsultantsPageProps {
  isAdmin?: boolean;
}

const ConsultantsPage: React.FC<ConsultantsPageProps> = ({ isAdmin = false }) => {
  const [consultants, setConsultants] = useState<any[]>([]);
  const [filteredConsultants, setFilteredConsultants] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [specializationFilter, setSpecializationFilter] = useState<string>('all');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const consultantsPerPage = 8;

  // Services
  const userService = new UserService();
  const [userSearch, setUserSearch] = useState<UserSearch>({
    keyword: undefined,
    roleName: 'SPECIALIST',
    majorName: '',
    page: 1,
    limit: consultantsPerPage,
    timer: Date.now()
  });

  // Lấy danh sách tất cả các chuyên môn từ dữ liệu
  const allSpecializations = [
    'Nghiện',
    'Thanh thiếu niên',
    'Gia đình',
    'Giáo dục',
    'Sức khỏe tâm thần'
  ];

  // Load consultants data from API
  useEffect(() => {
    const loadConsultants = async () => {
      try {
        setLoading(true);
        const [code, pageData, message] = await userService.findAll(userSearch);

        if (code === 200 && pageData) {
          // Map API data to consultant format
          const consultantsData = pageData.content.map((user: any) => ({
            id: user.id,
            firstName: user.fullname.split(' ')[0] || '',
            lastName: user.fullname.split(' ').slice(1).join(' ') || '',
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phone,
            profilePicture: user.avatar ? `${process.env.REACT_APP_API_URL}/${user.avatar}` : `${process.env.REACT_APP_API_URL}/default-avatar.png`,
            specialization: user.majors || [],
            education: user.position || 'Chuyên viên tư vấn',
            experience: 5, // Default experience
            bio: `${user.fullname} là một chuyên viên tư vấn có kinh nghiệm trong lĩnh vực ${user.majors?.join(', ') || 'tư vấn tâm lý'}. Với chuyên môn sâu và tâm huyết với nghề, ${user.fullname} luôn sẵn sàng hỗ trợ và đồng hành cùng bạn trong hành trình vượt qua khó khăn.`,
            rating: 4.8, // Default rating
            reviewCount: 25, // Default review count
            createdAt: new Date(user.createDate)
          }));

          setConsultants(consultantsData);
          setFilteredConsultants(consultantsData);
          setTotalElements(pageData.totalElements);
          setTotalPages(pageData.totalPages);
        } else {
          toast.error(message || 'Không thể tải danh sách chuyên viên');
        }
      } catch (error) {
        console.error('Error loading consultants:', error);
        toast.error('Có lỗi xảy ra khi tải danh sách chuyên viên');
      } finally {
        setLoading(false);
      }
    };

    loadConsultants();
  }, [userSearch.timer]);

  // No need for client-side filtering since API handles it

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const keyword = event.target.value;
    setSearchTerm(keyword);
    setUserSearch(prev => ({
      ...prev,
      keyword: keyword || undefined,
      page: 1,
      timer: Date.now()
    }));
  };

  const handleSpecializationFilterChange = (event: SelectChangeEvent<string>) => {
    const specialty = event.target.value;
    setSpecializationFilter(specialty);
    setUserSearch(prev => ({
      ...prev,
      majorName: specialty === 'all' ? '' : specialty,
      page: 1,
      timer: Date.now()
    }));
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    setUserSearch(prev => ({
      ...prev,
      page: value,
      timer: Date.now()
    }));
  };

  // Use consultants directly since API handles pagination
  const currentConsultants = consultants;

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4 }}>
        Chuyên viên tư vấn
      </Typography>

      {/* Bộ lọc và tìm kiếm */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
          <TextField
            fullWidth
            label="Tìm kiếm chuyên viên"
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
            <InputLabel id="specialization-filter-label">Chuyên môn</InputLabel>
            <Select
              labelId="specialization-filter-label"
              id="specialization-filter"
              value={specializationFilter}
              onChange={handleSpecializationFilterChange}
              label="Chuyên môn"
            >
              <MenuItem value="all">Tất cả</MenuItem>
              {allSpecializations.map((spec) => (
                <MenuItem key={spec} value={spec}>{spec}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Box>

      {/* Hiển thị số lượng kết quả */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="body1">
          {loading ? 'Đang tải...' : `Hiển thị ${totalElements} chuyên viên tư vấn`}
        </Typography>
      </Box>

      {/* Danh sách chuyên viên */}
      {currentConsultants.length > 0 ? (
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 4 }}>
          {currentConsultants.map((consultant) => (
            <Card key={consultant.id} sx={{ height: '100%', display: 'flex', flexDirection: 'column', borderRadius: 2, overflow: 'hidden' }}>
              <Box sx={{ position: 'relative' }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={consultant.profilePicture}
                  alt={`${consultant.firstName} ${consultant.lastName}`}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    bgcolor: 'rgba(0,0,0,0.6)',
                    color: 'white',
                    p: 1
                  }}
                >
                  <Typography variant="h6" component="div">
                    {consultant.fullname}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Rating value={consultant.rating} precision={0.1} size="small" readOnly />
                    <Typography variant="body2" sx={{ ml: 1 }}>
                      ({consultant.reviewCount})
                    </Typography>
                  </Box>
                </Box>
              </Box>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  <strong>Chuyên môn:</strong> {consultant.specialization?.join(', ') || 'N/A'}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  <strong>Học vấn:</strong> {consultant.education || 'N/A'}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  <strong>Kinh nghiệm:</strong> {consultant.experience || 0} năm
                </Typography>
                <Divider sx={{ my: 1 }} />
                <Typography variant="body2" color="text.secondary" sx={{
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  {consultant.bio}
                </Typography>
              </CardContent>
              <Box sx={{ p: 2, pt: 0 }}>
                <Button
                  component={Link}
                  to={`/consultants/${consultant.id}`}
                  variant="contained"
                  fullWidth
                >
                  Xem chi tiết
                </Button>
              </Box>
            </Card>
          ))}
        </Box>
      ) : (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h6">
            Không tìm thấy chuyên viên tư vấn nào phù hợp với tiêu chí tìm kiếm.
          </Typography>
        </Box>
      )}

      {/* Phân trang */}
      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Pagination
            count={totalPages}
            page={userSearch.page}
            onChange={handlePageChange}
            color="primary"
            size="large"
          />
        </Box>
      )}
    </Container>
  );
};

export default ConsultantsPage;
