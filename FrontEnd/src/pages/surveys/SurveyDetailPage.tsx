import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Card, 
  CardContent, 
  Button, 
  Paper,
  Stepper,
  Step,
  StepLabel,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  LinearProgress,
  Divider,
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from '@mui/material';
import { 
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  School as SchoolIcon,
  EventNote as EventNoteIcon,
  Groups as GroupsIcon
} from '@mui/icons-material';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Survey, SurveyResponse, RiskLevel } from '../../types/survey';
import { mockSurveys } from '../../utils/mockData';
import { useAuth } from '../../contexts/AuthContext';

const SurveyDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [survey, setSurvey] = useState<Survey | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeStep, setActiveStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [completed, setCompleted] = useState(false);
  const [result, setResult] = useState<{
    totalScore: number;
    riskLevel: RiskLevel;
    recommendations: string[];
  } | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/surveys/${id}` } });
      return;
    }

    // Trong thực tế, đây sẽ là API call
    const fetchSurvey = async () => {
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const foundSurvey = mockSurveys.find(s => s.id === id);
        if (foundSurvey) {
          setSurvey(foundSurvey);
          // Khởi tạo mảng answers với giá trị -1 (chưa chọn)
          setAnswers(new Array(foundSurvey.questions.length).fill(-1));
        } else {
          setError('Không tìm thấy bài khảo sát');
        }
      } catch (error) {
        setError('Đã xảy ra lỗi khi tải bài khảo sát');
      } finally {
        setLoading(false);
      }
    };

    fetchSurvey();
  }, [id, isAuthenticated, navigate]);

  const handleNext = () => {
    if (answers[activeStep] === -1) {
      setOpenDialog(true);
      return;
    }
    
    if (activeStep === survey!.questions.length - 1) {
      // Hoàn thành khảo sát
      calculateResult();
    } else {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleAnswerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newAnswers = [...answers];
    newAnswers[activeStep] = parseInt(event.target.value);
    setAnswers(newAnswers);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const calculateResult = () => {
    if (!survey) return;
    
    // Tính tổng điểm
    let totalScore = 0;
    for (let i = 0; i < answers.length; i++) {
      if (answers[i] !== -1) {
        totalScore += survey.questions[i].scores[answers[i]];
      }
    }
    
    // Xác định mức độ nguy cơ
    let riskLevel: RiskLevel = 'low';
    if (totalScore >= 8) {
      riskLevel = 'high';
    } else if (totalScore >= 4) {
      riskLevel = 'moderate';
    }
    
    // Đề xuất dựa trên mức độ nguy cơ
    const recommendations: string[] = [];
    if (riskLevel === 'low') {
      recommendations.push('Tham gia khóa học "Nhận thức về ma túy" để nâng cao kiến thức');
      recommendations.push('Tiếp tục duy trì lối sống lành mạnh và tránh xa các chất gây nghiện');
    } else if (riskLevel === 'moderate') {
      recommendations.push('Tham gia khóa học "Kỹ năng từ chối ma túy" để trang bị kỹ năng phòng tránh');
      recommendations.push('Đặt lịch tư vấn với chuyên viên để được hỗ trợ cụ thể hơn');
      recommendations.push('Tham gia các chương trình cộng đồng để nhận được sự hỗ trợ từ cộng đồng');
    } else {
      recommendations.push('Đặt lịch tư vấn khẩn cấp với chuyên viên để được hỗ trợ ngay lập tức');
      recommendations.push('Tham gia khóa học "Phòng ngừa tái nghiện" để được hỗ trợ');
      recommendations.push('Liên hệ với các dịch vụ hỗ trợ chuyên nghiệp');
    }
    
    setResult({
      totalScore,
      riskLevel,
      recommendations
    });
    
    setCompleted(true);
  };

  const getRiskLevelText = (level: RiskLevel) => {
    switch (level) {
      case 'low':
        return 'Thấp';
      case 'moderate':
        return 'Trung bình';
      case 'high':
        return 'Cao';
      default:
        return '';
    }
  };

  const getRiskLevelColor = (level: RiskLevel) => {
    switch (level) {
      case 'low':
        return 'success.main';
      case 'moderate':
        return 'warning.main';
      case 'high':
        return 'error.main';
      default:
        return '';
    }
  };

  if (loading) {
    return (
      <Container>
        <Box sx={{ py: 4, textAlign: 'center' }}>
          <Typography>Đang tải bài khảo sát...</Typography>
          <LinearProgress sx={{ mt: 2 }} />
        </Box>
      </Container>
    );
  }

  if (error || !survey) {
    return (
      <Container>
        <Box sx={{ py: 4, textAlign: 'center' }}>
          <Typography color="error">{error || 'Không tìm thấy bài khảo sát'}</Typography>
          <Button 
            component={Link} 
            to="/surveys" 
            startIcon={<ArrowBackIcon />}
            sx={{ mt: 2 }}
          >
            Quay lại danh sách khảo sát
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container>
      <Button 
        component={Link} 
        to="/surveys" 
        startIcon={<ArrowBackIcon />}
        sx={{ mb: 3 }}
      >
        Quay lại danh sách khảo sát
      </Button>
      
      <Paper sx={{ p: 3, borderRadius: 2, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {survey.title}
        </Typography>
        <Typography variant="body1" paragraph>
          {survey.description}
        </Typography>
        <Alert severity="info" sx={{ mb: 2 }}>
          <Typography variant="body2">
            Bài khảo sát gồm {survey.questions.length} câu hỏi. Vui lòng trả lời tất cả các câu hỏi để nhận kết quả chính xác nhất.
          </Typography>
        </Alert>
      </Paper>
      
      {!completed ? (
        <Card sx={{ borderRadius: 2 }}>
          <CardContent>
            <Box sx={{ mb: 3 }}>
              <LinearProgress 
                variant="determinate" 
                value={(activeStep / survey.questions.length) * 100} 
                sx={{ height: 10, borderRadius: 5 }}
              />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Câu hỏi {activeStep + 1}/{survey.questions.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {Math.round((activeStep / survey.questions.length) * 100)}% hoàn thành
                </Typography>
              </Box>
            </Box>
            
            <Box sx={{ mb: 4 }}>
              <Typography variant="h5" component="h2" gutterBottom>
                {survey.questions[activeStep].text}
              </Typography>
              <FormControl component="fieldset" sx={{ width: '100%' }}>
                <RadioGroup
                  aria-label={`question-${activeStep}`}
                  name={`question-${activeStep}`}
                  value={answers[activeStep].toString()}
                  onChange={handleAnswerChange}
                >
                  {survey.questions[activeStep].options.map((option, index) => (
                    <FormControlLabel
                      key={index}
                      value={index.toString()}
                      control={<Radio />}
                      label={option}
                      sx={{ 
                        mb: 1, 
                        p: 1, 
                        borderRadius: 1,
                        '&:hover': { bgcolor: 'action.hover' }
                      }}
                    />
                  ))}
                </RadioGroup>
              </FormControl>
            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Button
                disabled={activeStep === 0}
                onClick={handleBack}
                startIcon={<ArrowBackIcon />}
              >
                Quay lại
              </Button>
              <Button
                variant="contained"
                onClick={handleNext}
                endIcon={<ArrowForwardIcon />}
              >
                {activeStep === survey.questions.length - 1 ? 'Hoàn thành' : 'Tiếp theo'}
              </Button>
            </Box>
          </CardContent>
        </Card>
      ) : (
        <Box>
          <Card sx={{ borderRadius: 2, mb: 4 }}>
            <CardContent>
              <Typography variant="h5" component="h2" gutterBottom align="center">
                Kết quả đánh giá
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                <Box 
                  sx={{ 
                    display: 'inline-flex', 
                    flexDirection: 'column', 
                    alignItems: 'center',
                    p: 2,
                    border: 1,
                    borderColor: getRiskLevelColor(result!.riskLevel),
                    borderRadius: 2,
                    bgcolor: `${getRiskLevelColor(result!.riskLevel)}10`
                  }}
                >
                  <Typography variant="body1" gutterBottom>
                    Mức độ nguy cơ:
                  </Typography>
                  <Typography 
                    variant="h4" 
                    component="div" 
                    sx={{ 
                      fontWeight: 'bold', 
                      color: getRiskLevelColor(result!.riskLevel)
                    }}
                  >
                    {getRiskLevelText(result!.riskLevel)}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Điểm số: {result!.totalScore}/{survey.questions.reduce((total, q) => total + Math.max(...q.scores), 0)}
                  </Typography>
                </Box>
              </Box>
              
              <Divider sx={{ my: 3 }} />
              
              <Typography variant="h6" gutterBottom>
                Đề xuất cho bạn:
              </Typography>
              <List>
                {result!.recommendations.map((rec, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <CheckCircleIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText primary={rec} />
                  </ListItem>
                ))}
              </List>
              
              <Alert 
                severity={result!.riskLevel === 'high' ? 'error' : result!.riskLevel === 'moderate' ? 'warning' : 'info'} 
                sx={{ mt: 2 }}
              >
                <Typography variant="body1">
                  {result!.riskLevel === 'high' 
                    ? 'Bạn có nguy cơ cao về sử dụng ma túy. Vui lòng liên hệ với chuyên viên tư vấn ngay lập tức để được hỗ trợ.' 
                    : result!.riskLevel === 'moderate'
                    ? 'Bạn có nguy cơ trung bình về sử dụng ma túy. Hãy tham khảo các đề xuất và cân nhắc việc tư vấn với chuyên viên.'
                    : 'Bạn có nguy cơ thấp về sử dụng ma túy. Hãy tiếp tục duy trì lối sống lành mạnh và nâng cao nhận thức.'}
                </Typography>
              </Alert>
            </CardContent>
          </Card>
          
          <Typography variant="h5" component="h2" gutterBottom>
            Các bước tiếp theo
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 3 }}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', borderRadius: 2 }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <SchoolIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
                  <Typography variant="h6">
                    Khóa học trực tuyến
                  </Typography>
                </Box>
                <Typography variant="body2" paragraph>
                  Tham gia các khóa học trực tuyến để nâng cao nhận thức và kỹ năng phòng tránh ma túy.
                </Typography>
              </CardContent>
              <Box sx={{ p: 2, pt: 0 }}>
                <Button 
                  component={Link} 
                  to="/courses" 
                  variant="outlined" 
                  fullWidth
                >
                  Xem khóa học
                </Button>
              </Box>
            </Card>
            
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', borderRadius: 2 }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <EventNoteIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
                  <Typography variant="h6">
                    Tư vấn trực tuyến
                  </Typography>
                </Box>
                <Typography variant="body2" paragraph>
                  Đặt lịch hẹn với chuyên viên tư vấn để được hỗ trợ trực tiếp và chuyên sâu hơn.
                </Typography>
              </CardContent>
              <Box sx={{ p: 2, pt: 0 }}>
                <Button 
                  component={Link} 
                  to="/appointments" 
                  variant="outlined" 
                  fullWidth
                >
                  Đặt lịch hẹn
                </Button>
              </Box>
            </Card>
            
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', borderRadius: 2 }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <GroupsIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
                  <Typography variant="h6">
                    Chương trình cộng đồng
                  </Typography>
                </Box>
                <Typography variant="body2" paragraph>
                  Tham gia các chương trình cộng đồng để kết nối và nhận được sự hỗ trợ từ cộng đồng.
                </Typography>
              </CardContent>
              <Box sx={{ p: 2, pt: 0 }}>
                <Button 
                  component={Link} 
                  to="/programs" 
                  variant="outlined" 
                  fullWidth
                >
                  Xem chương trình
                </Button>
              </Box>
            </Card>
          </Box>
        </Box>
      )}
      
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Vui lòng trả lời câu hỏi"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Bạn cần trả lời câu hỏi hiện tại trước khi tiếp tục.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} autoFocus>
            Đã hiểu
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default SurveyDetailPage;
