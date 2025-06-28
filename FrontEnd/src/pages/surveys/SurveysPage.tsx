import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  CardActions,
  Button,

  Chip,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  SelectChangeEvent
} from '@mui/material';
import {
  Search as SearchIcon,
  Assessment as AssessmentIcon,
  Quiz as QuizIcon,
  History as HistoryIcon
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import ClientLayout from '../../components/layout/ClientLayout';
import { Survey } from '../../types/survey';
import { SurveyService } from '../../services/SurveyService';
import { useAuth } from '../../contexts/AuthContext';

const SURVEY_TYPES = [
  { value: 'ASSIST', label: 'ASSIST' },
  { value: 'CRAFFT', label: 'CRAFFT' }
];

const SurveysPage: React.FC = () => {
  const surveyService = new SurveyService();
  const { isAuthenticated } = useAuth();

  // State for surveys data
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State for pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  // State for search and filter
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('');

  // Load surveys from API
  const loadSurveys = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [code, data, message] = await surveyService.findAllSurveys({
        page: page,
        limit: 12,
        keyword: searchTerm || undefined,
        type: typeFilter || undefined
      });

      if (code === 200) {
        setSurveys(data.content);
        setTotalPages(data.totalPages);
        setTotalElements(data.totalElements);
      } else {
        setError(message || 'Failed to load surveys');
      }
    } catch (error) {
      console.error('Error loading surveys:', error);
      setError('An error occurred while loading surveys');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSurveys();
  }, [page, searchTerm, typeFilter]); // eslint-disable-line react-hooks/exhaustive-deps

  // Handle search and filter changes
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setPage(1);
  };

  const handleTypeFilterChange = (event: SelectChangeEvent) => {
    setTypeFilter(event.target.value);
    setPage(1);
  };



  const getSurveyIcon = (type: string) => {
    switch (type) {
      case 'ASSESSMENT':
        return <AssessmentIcon />;
      case 'POLL':
        return <QuizIcon />;
      default:
        return <AssessmentIcon />;
    }
  };

  const getSurveyTypeLabel = (type: string) => {
    return SURVEY_TYPES.find(t => t.value === type)?.label || type;
  };

  if (loading && surveys.length === 0) {
    return (
      <ClientLayout>
        <Container>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
            <CircularProgress />
          </Box>
        </Container>
      </ClientLayout>
    );
  }

  return (
    <ClientLayout>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Box>
              <Typography variant="h3" component="h1" gutterBottom>
                Khảo sát
              </Typography>
              <Typography variant="h6" color="text.secondary">
                Tham gia các khảo sát để đóng góp ý kiến và nhận được hỗ trợ phù hợp
              </Typography>
            </Box>
            {isAuthenticated && (
              <Button
                component={Link}
                to="/all-survey-history"
                variant="contained"
                startIcon={<HistoryIcon />}
              >
                Xem lịch sử điểm
              </Button>
            )}
          </Box>
        </Box>

        {/* Search and Filter */}
        <Box sx={{ mb: 4, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <TextField
            label="Tìm kiếm khảo sát"
            variant="outlined"
            value={searchTerm}
            onChange={handleSearchChange}
            sx={{ flexGrow: 1, minWidth: '300px' }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          <FormControl variant="outlined" sx={{ minWidth: '200px' }}>
            <InputLabel>Loại khảo sát</InputLabel>
            <Select
              value={typeFilter}
              onChange={handleTypeFilterChange}
              label="Loại khảo sát"
            >
              <MenuItem value="">Tất cả</MenuItem>
              {SURVEY_TYPES.map(type => (
                <MenuItem key={type.value} value={type.value}>{type.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Surveys Grid */}
        {surveys.length > 0 ? (
          <>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 3 }}>
              {surveys.map((survey) => (
                <Box key={survey.id}>
                  <Card 
                    sx={{ 
                      height: '100%', 
                      display: 'flex', 
                      flexDirection: 'column',
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: 4
                      }
                    }}
                  >
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Box sx={{ mr: 2, color: 'primary.main' }}>
                          {getSurveyIcon(survey.type)}
                        </Box>
                        <Chip 
                          label={getSurveyTypeLabel(survey.type)} 
                          size="small" 
                          color="primary" 
                          variant="outlined"
                        />
                      </Box>
                      
                      <Typography variant="h6" component="h3" gutterBottom>
                        {survey.name}
                      </Typography>
                      
                      <Typography variant="body2" color="text.secondary" paragraph>
                        {survey.questions.length} câu hỏi
                      </Typography>
                    </CardContent>
                    
                    <CardActions sx={{ p: 2, pt: 0 }}>
                      <Button
                        component={Link}
                        to={`/surveys/${survey.id}`}
                        variant="contained"
                        fullWidth
                        startIcon={<AssessmentIcon />}
                      >
                        Bắt đầu khảo sát
                      </Button>
                    </CardActions>
                  </Card>
                </Box>
              ))}
            </Box>

            {/* Pagination */}
            {totalPages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Trang {page} / {totalPages} - Tổng {totalElements} khảo sát
                  </Typography>
                </Box>
              </Box>
            )}
          </>
        ) : (
          !loading && (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <AssessmentIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Không tìm thấy khảo sát nào
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {searchTerm || typeFilter 
                  ? 'Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc'
                  : 'Hiện tại chưa có khảo sát nào được tạo'
                }
              </Typography>
            </Box>
          )
        )}
      </Container>
    </ClientLayout>
  );
};

export default SurveysPage;
