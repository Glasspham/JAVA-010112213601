import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Alert,
  CircularProgress,
  SelectChangeEvent
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  History as HistoryIcon,
  Assessment as AssessmentIcon
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import ClientLayout from '../../components/layout/ClientLayout';
import { SurveyMark, Survey } from '../../types/survey';
import { SurveyService } from '../../services/SurveyService';
import { AuthService } from '../../services/AuthService';

const SurveyHistoryPage: React.FC = () => {
  const surveyService = new SurveyService();
  const authService = new AuthService();

  const [markHistory, setMarkHistory] = useState<SurveyMark[]>([]);
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [selectedSurvey, setSelectedSurvey] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load all surveys for filter
  const loadSurveys = async () => {
    try {
      const [code, data] = await surveyService.findAllSurveys({
        page: 1,
        limit: 100
      });
      if (code === 200) {
        setSurveys(data.content);
      }
    } catch (error) {
      console.error('Error loading surveys:', error);
    }
  };

  // Load mark history
  const loadMarkHistory = async (surveyId?: number) => {
    try {
      setLoading(true);
      setError(null);
      
      const authenDTO = await authService.readInfoFromLocal();
      if (authenDTO.userName) {
        const [code, data, message] = await surveyService.getMarkHistory(
          authenDTO.userName, 
          surveyId
        );
        
        if (code === 200) {
          setMarkHistory(data || []);
        } else {
          setError(message || 'Không thể tải lịch sử điểm');
        }
      } else {
        setError('Không tìm thấy thông tin người dùng');
      }
    } catch (error) {
      console.error('Error loading mark history:', error);
      setError('Có lỗi xảy ra khi tải lịch sử điểm');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSurveys();
    loadMarkHistory();
  }, []);

  const handleSurveyFilterChange = (event: SelectChangeEvent) => {
    const surveyId = event.target.value;
    setSelectedSurvey(surveyId);
    
    if (surveyId === '') {
      loadMarkHistory(); // Load all
    } else {
      loadMarkHistory(parseInt(surveyId)); // Load specific survey
    }
  };

  const getSurveyName = (surveyName: string | null) => {
    return surveyName || 'Khảo sát không xác định';
  };

  const getScoreColor = (score: number) => {
    if (score >= 70) return 'success';
    if (score >= 50) return 'warning';
    return 'error';
  };

  return (
    <ClientLayout>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Button
            component={Link}
            to="/surveys"
            startIcon={<ArrowBackIcon />}
            sx={{ mb: 2 }}
          >
            Quay lại danh sách khảo sát
          </Button>
          <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AssessmentIcon />
            Lịch sử điểm các bài khảo sát
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Xem tất cả điểm số và lịch sử các bài khảo sát của bạn
          </Typography>
        </Box>

        {/* Filter */}
        <Box sx={{ mb: 3 }}>
          <FormControl sx={{ minWidth: 300 }}>
            <InputLabel id="survey-filter-label">Lọc theo khảo sát</InputLabel>
            <Select
              labelId="survey-filter-label"
              id="survey-filter"
              value={selectedSurvey}
              onChange={handleSurveyFilterChange}
              label="Lọc theo khảo sát"
            >
              <MenuItem value="">
                <em>Tất cả khảo sát</em>
              </MenuItem>
              {surveys.map((survey) => (
                <MenuItem key={survey.id} value={survey.id?.toString() || ''}>
                  {survey.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {/* Loading */}
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        )}

        {/* Error */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* History Table */}
        {!loading && !error && (
          <Paper sx={{ overflow: 'hidden' }}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>STT</TableCell>
                    <TableCell>Tên khảo sát</TableCell>
                    <TableCell>Điểm số</TableCell>
                    <TableCell>Ngày làm</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {markHistory.length > 0 ? (
                    markHistory.map((mark, index) => (
                      <TableRow key={mark.id} hover>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>
                          <Typography variant="body1" fontWeight="medium">
                            {getSurveyName(mark.surveyName)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={`${mark.mark}%`}
                            color={getScoreColor(mark.mark)}
                            variant="filled"
                          />
                        </TableCell>
                        <TableCell>
                          {new Date(mark.createDate).toLocaleDateString('vi-VN', {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit'
                          })}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} align="center">
                        <Box sx={{ py: 4 }}>
                          <HistoryIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                          <Typography variant="h6" color="text.secondary">
                            Chưa có lịch sử điểm
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Bạn chưa hoàn thành bài khảo sát nào
                          </Typography>
                        </Box>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        )}

        {/* Statistics */}
        {!loading && !error && markHistory.length > 0 && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              Thống kê
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 2 }}>
              <Paper sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h4" color="primary">
                  {markHistory.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Tổng số lần làm
                </Typography>
              </Paper>
              <Paper sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h4" color="primary">
                  {markHistory.length > 0 ? Math.round(markHistory.reduce((sum, mark) => sum + mark.mark, 0) / markHistory.length) : 0}%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Điểm trung bình
                </Typography>
              </Paper>
              <Paper sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h4" color="primary">
                  {markHistory.length > 0 ? Math.max(...markHistory.map(mark => mark.mark)) : 0}%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Điểm cao nhất
                </Typography>
              </Paper>
            </Box>
          </Box>
        )}
      </Container>
    </ClientLayout>
  );
};

export default SurveyHistoryPage;
