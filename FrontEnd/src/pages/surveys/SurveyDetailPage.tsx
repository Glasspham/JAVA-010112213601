import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Card, 
  CardContent, 
  Button, 
  Paper,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  LinearProgress,
  Divider,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import { 
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Survey, Question, Answer, SurveyMark } from '../../types/survey';
import { SurveyService } from '../../services/SurveyService';
import { AuthService } from '../../services/AuthService';
import { useAuth } from '../../contexts/AuthContext';
import ClientLayout from '../../components/layout/ClientLayout';

const SurveyDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const surveyService = new SurveyService();
  const authService = new AuthService();
  
  const [survey, setSurvey] = useState<Survey | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeStep, setActiveStep] = useState(0);
  const [answers, setAnswers] = useState<{ [questionId: number]: number }>({});
  const [completed, setCompleted] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [score, setScore] = useState<number>(0);
  const [showHistory, setShowHistory] = useState(false);
  const [markHistory, setMarkHistory] = useState<SurveyMark[]>([]);
  
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  // Load survey data
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/surveys/${id}` } });
      return;
    }

    const loadSurvey = async () => {
      if (!id) {
        setError('Survey ID not found');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        const [code, data, message] = await surveyService.getSurveyById(parseInt(id));
        
        if (code === 200) {
          setSurvey(data);
          // Initialize answers object
          const initialAnswers: { [questionId: number]: number } = {};
          data.questions.forEach(question => {
            if (question.id) {
              initialAnswers[question.id] = -1;
            }
          });
          setAnswers(initialAnswers);
        } else {
          setError(message || 'Survey not found');
        }
      } catch (error) {
        console.error('Error loading survey:', error);
        setError('An error occurred while loading survey');
      } finally {
        setLoading(false);
      }
    };

    loadSurvey();
  }, [id, isAuthenticated, navigate]);

  const handleAnswerChange = (questionId: number, answerIndex: number) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answerIndex
    }));
  };

  const handleNext = () => {
    if (survey && activeStep < survey.questions.length - 1) {
      setActiveStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep(prev => prev - 1);
    }
  };

  const handleSubmit = () => {
    setOpenDialog(true);
  };

  const calculateScore = () => {
    if (!survey) return 0;

    let correctAnswers = 0;
    const totalQuestions = survey.questions.length;

    survey.questions.forEach(question => {
      if (question.id && answers[question.id] !== -1) {
        const selectedAnswerIndex = answers[question.id];
        const selectedAnswer = question.answers[selectedAnswerIndex];
        if (selectedAnswer && selectedAnswer.correct) {
          correctAnswers++;
        }
      }
    });

    return (correctAnswers / totalQuestions) * 100;
  };

  const handleConfirmSubmit = async () => {
    const calculatedScore = calculateScore();
    setScore(calculatedScore);

    // Gọi API chấm điểm
    try {
      const authenDTO = await authService.readInfoFromLocal();
      if (authenDTO.userName && survey?.id) {
        await surveyService.markSurvey(authenDTO.userName, survey.id, Math.round(calculatedScore));
      }
    } catch (error) {
      console.error('Error saving survey mark:', error);
      // Không hiển thị lỗi cho user vì điểm số vẫn được tính và hiển thị
    }

    setCompleted(true);
    setOpenDialog(false);
  };

  const isCurrentQuestionAnswered = () => {
    if (!survey) return false;
    const currentQuestion = survey.questions[activeStep];
    return currentQuestion.id ? answers[currentQuestion.id] !== -1 : false;
  };

  const getProgress = () => {
    if (!survey) return 0;
    return ((activeStep + 1) / survey.questions.length) * 100;
  };

  const loadMarkHistory = async () => {
    try {
      const authenDTO = await authService.readInfoFromLocal();
      console.log('Auth data:', authenDTO);
      if (authenDTO.userName && survey?.id) {
        console.log('Calling API with:', authenDTO.userName, survey.id);
        const [code, data, message] = await surveyService.getMarkHistory(authenDTO.userName, survey.id);
        console.log('API response:', code, data, message);
        if (code === 200) {
          setMarkHistory(data || []);
          setShowHistory(true);
        } else {
          console.error('API error:', message);
          setMarkHistory([]);
          setShowHistory(true);
        }
      }
    } catch (error) {
      console.error('Error loading mark history:', error);
      setMarkHistory([]);
      setShowHistory(true);
    }
  };

  if (loading) {
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

  if (error) {
    return (
      <ClientLayout>
        <Container>
          <Alert severity="error" sx={{ mt: 4 }}>
            {error}
          </Alert>
          <Box sx={{ mt: 2 }}>
            <Button component={Link} to="/surveys" variant="outlined">
              Quay lại danh sách khảo sát
            </Button>
          </Box>
        </Container>
      </ClientLayout>
    );
  }

  if (!survey) {
    return (
      <ClientLayout>
        <Container>
          <Alert severity="warning" sx={{ mt: 4 }}>
            Không tìm thấy khảo sát
          </Alert>
        </Container>
      </ClientLayout>
    );
  }

  if (completed) {
    return (
      <ClientLayout>
        <Container maxWidth="md" sx={{ py: 4 }}>
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <CheckCircleIcon sx={{ fontSize: 64, color: 'success.main', mb: 2 }} />
            <Typography variant="h4" gutterBottom>
              Hoàn thành khảo sát!
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              Cảm ơn bạn đã tham gia khảo sát "{survey.name}".
              Phản hồi của bạn rất quan trọng đối với chúng tôi.
            </Typography>

            {/* Score Display */}
            <Box sx={{ my: 3, p: 3, bgcolor: 'primary.light', borderRadius: 2 }}>
              <Typography variant="h5" gutterBottom sx={{ color: 'primary.contrastText' }}>
                Điểm số của bạn
              </Typography>
              <Typography variant="h3" sx={{ color: 'primary.contrastText', fontWeight: 'bold' }}>
                {score.toFixed(1)}%
              </Typography>
              <Typography variant="body2" sx={{ color: 'primary.contrastText', mt: 1 }}>
                ({survey.questions.filter((q, index) => {
                  if (q.id && answers[q.id] !== -1) {
                    const selectedAnswer = q.answers[answers[q.id]];
                    return selectedAnswer && selectedAnswer.correct;
                  }
                  return false;
                }).length}/{survey.questions.length} câu đúng)
              </Typography>
            </Box>

            <Box sx={{ mt: 3 }}>
              <Button
                component={Link}
                to="/surveys"
                variant="contained"
                sx={{ mr: 2 }}
              >
                Khảo sát khác
              </Button>
              <Button
                component={Link}
                to="/"
                variant="outlined"
              >
                Về trang chủ
              </Button>
            </Box>
          </Paper>
        </Container>
      </ClientLayout>
    );
  }

  const currentQuestion = survey.questions[activeStep];

  return (
    <ClientLayout>
      <Container maxWidth="md" sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Button
              component={Link}
              to="/surveys"
              startIcon={<ArrowBackIcon />}
            >
              Quay lại
            </Button>
            <Button
              onClick={loadMarkHistory}
              variant="outlined"
              size="small"
            >
              Lịch sử của bài này
            </Button>
          </Box>
          <Typography variant="h4" gutterBottom>
            {survey.name}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Câu hỏi {activeStep + 1} / {survey.questions.length}
          </Typography>
        </Box>

        {/* Progress */}
        <Box sx={{ mb: 4 }}>
          <LinearProgress 
            variant="determinate" 
            value={getProgress()} 
            sx={{ height: 8, borderRadius: 4 }}
          />
        </Box>

        {/* Question */}
        <Card sx={{ mb: 4 }}>
          <CardContent sx={{ p: 4 }}>
            <FormControl component="fieldset" fullWidth>
              <FormLabel component="legend" sx={{ mb: 3, fontSize: '1.2rem', fontWeight: 'medium' }}>
                {currentQuestion.content}
              </FormLabel>
              <RadioGroup
                value={currentQuestion.id ? answers[currentQuestion.id] : -1}
                onChange={(e) => currentQuestion.id && handleAnswerChange(currentQuestion.id, parseInt(e.target.value))}
              >
                {currentQuestion.answers.map((answer, index) => (
                  <FormControlLabel
                    key={index}
                    value={index}
                    control={<Radio />}
                    label={answer.content}
                    sx={{ 
                      mb: 1,
                      '& .MuiFormControlLabel-label': {
                        fontSize: '1rem'
                      }
                    }}
                  />
                ))}
              </RadioGroup>
            </FormControl>
          </CardContent>
        </Card>

        {/* Navigation */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button
            onClick={handleBack}
            disabled={activeStep === 0}
            startIcon={<ArrowBackIcon />}
            variant="outlined"
          >
            Câu trước
          </Button>

          {activeStep === survey.questions.length - 1 ? (
            <Button
              onClick={handleSubmit}
              disabled={!isCurrentQuestionAnswered()}
              variant="contained"
              endIcon={<CheckCircleIcon />}
            >
              Hoàn thành
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              disabled={!isCurrentQuestionAnswered()}
              variant="contained"
              endIcon={<ArrowForwardIcon />}
            >
              Câu tiếp theo
            </Button>
          )}
        </Box>

        {/* Mark History Dialog */}
        <Dialog open={showHistory} onClose={() => setShowHistory(false)} maxWidth="md" fullWidth>
          <DialogTitle>Tất cả các lần làm bài "{survey.name}"</DialogTitle>
          <DialogContent>
            {markHistory.length > 0 ? (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>STT</TableCell>
                      <TableCell>Điểm số</TableCell>
                      <TableCell>Ngày làm</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {markHistory.map((mark, index) => (
                      <TableRow key={mark.id}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>
                          <Typography variant="h6" color="primary">
                            {mark.mark}%
                          </Typography>
                        </TableCell>
                        <TableCell>{new Date(mark.createDate).toLocaleDateString('vi-VN')}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Typography>Bạn chưa làm bài khảo sát này lần nào trước đây.</Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowHistory(false)}>Đóng</Button>
          </DialogActions>
        </Dialog>

        {/* Confirmation Dialog */}
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
          <DialogTitle>Xác nhận nộp bài</DialogTitle>
          <DialogContent>
            <Typography>
              Bạn có chắc chắn muốn nộp bài khảo sát này không?
              Sau khi nộp bài, bạn sẽ không thể thay đổi câu trả lời.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Hủy</Button>
            <Button onClick={handleConfirmSubmit} variant="contained">
              Xác nhận nộp bài
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </ClientLayout>
  );
};

export default SurveyDetailPage;
