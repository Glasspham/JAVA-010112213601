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
import { Consultant } from '../../types/consultant';
import { mockConsultants } from '../../utils/mockData';

interface ConsultantsPageProps {
  isAdmin?: boolean;
}

const ConsultantsPage: React.FC<ConsultantsPageProps> = ({ isAdmin = false }) => {
  const [consultants, setConsultants] = useState<Consultant[]>([]);
  const [filteredConsultants, setFilteredConsultants] = useState<Consultant[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [specializationFilter, setSpecializationFilter] = useState<string>('all');
  const [page, setPage] = useState(1);
  const consultantsPerPage = 8;

  // Lấy danh sách tất cả các chuyên môn từ dữ liệu
  const allSpecializations = React.useMemo(() => {
    const specializations = new Set<string>();
    mockConsultants.forEach(consultant => {
      consultant.specialization?.forEach(spec => {
        specializations.add(spec);
      });
    });
    return Array.from(specializations);
  }, []);

  useEffect(() => {
    // Trong thực tế, đây sẽ là API call
    setConsultants(mockConsultants);
    setFilteredConsultants(mockConsultants);
  }, []);

  useEffect(() => {
    let result = [...consultants];

    // Lọc theo từ khóa tìm kiếm
    if (searchTerm) {
      result = result.filter(consultant =>
        `${consultant.firstName || ''} ${consultant.lastName || ''}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        consultant.specialization?.some(spec => spec.toLowerCase().includes(searchTerm.toLowerCase())) ||
        consultant.education?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Lọc theo chuyên môn
    if (specializationFilter !== 'all') {
      result = result.filter(consultant =>
        consultant.specialization?.includes(specializationFilter)
      );
    }

    setFilteredConsultants(result);
    setPage(1); // Reset về trang đầu tiên khi lọc
  }, [searchTerm, specializationFilter, consultants]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSpecializationFilterChange = (event: SelectChangeEvent<string>) => {
    setSpecializationFilter(event.target.value);
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  // Tính toán các chuyên viên hiển thị trên trang hiện tại
  const indexOfLastConsultant = page * consultantsPerPage;
  const indexOfFirstConsultant = indexOfLastConsultant - consultantsPerPage;
  const currentConsultants = filteredConsultants.slice(indexOfFirstConsultant, indexOfLastConsultant);
  const totalPages = Math.ceil(filteredConsultants.length / consultantsPerPage);

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
          Hiển thị {filteredConsultants.length} chuyên viên tư vấn
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
                    {consultant.firstName} {consultant.lastName}
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
            page={page}
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
