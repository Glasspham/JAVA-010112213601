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
  TablePagination,
  Button,
  IconButton,
  Tooltip,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  InputAdornment,
  Alert,
  Snackbar,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  SelectChangeEvent
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
  Visibility as VisibilityIcon,
  AddCircle as AddCircleIcon,
  RemoveCircle as RemoveCircleIcon
} from '@mui/icons-material';
import { Survey, SurveyQuestion as Question, SurveyType } from '../../types/survey';
import { mockSurveys } from '../../utils/mockData';
import { Link } from 'react-router-dom';

const AdminSurveysPage: React.FC = () => {
  // State for surveys data
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [filteredSurveys, setFilteredSurveys] = useState<Survey[]>([]);

  // State for pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // State for search and filter
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  // State for survey dialog
  const [openSurveyDialog, setOpenSurveyDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState<'add' | 'edit'>('add');
  const [currentSurvey, setCurrentSurvey] = useState<Survey | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'CUSTOM' as SurveyType,
    questions: [] as Question[]
  });

  // State for question dialog
  const [openQuestionDialog, setOpenQuestionDialog] = useState(false);
  const [questionFormData, setQuestionFormData] = useState({
    text: '',
    options: ['', '', '', '']
  });
  const [editingQuestionIndex, setEditingQuestionIndex] = useState<number | null>(null);

  // State for delete confirmation dialog
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [surveyToDelete, setSurveyToDelete] = useState<Survey | null>(null);

  // State for notifications
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'info' | 'warning'
  });

  // Load surveys data
  useEffect(() => {
    // In a real app, this would be an API call
    setSurveys(mockSurveys);
    setFilteredSurveys(mockSurveys);
  }, []);

  // Filter surveys based on search term and type filter
  useEffect(() => {
    let result = [...surveys];

    // Apply search filter
    if (searchTerm) {
      result = result.filter(survey =>
        survey.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        survey.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply type filter
    if (typeFilter !== 'all') {
      result = result.filter(survey => survey.type === typeFilter);
    }

    setFilteredSurveys(result);
    setPage(0); // Reset to first page when filtering
  }, [searchTerm, typeFilter, surveys]);

  // Handle pagination changes
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Handle search and filter changes
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleTypeFilterChange = (event: SelectChangeEvent) => {
    setTypeFilter(event.target.value);
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setTypeFilter('all');
  };

  // Handle survey dialog
  const handleOpenAddDialog = () => {
    setDialogMode('add');
    setFormData({
      title: '',
      description: '',
      type: 'CUSTOM' as SurveyType,
      questions: []
    });
    setOpenSurveyDialog(true);
  };

  const handleOpenEditDialog = (survey: Survey) => {
    setDialogMode('edit');
    setCurrentSurvey(survey);
    setFormData({
      title: survey.title,
      description: survey.description,
      type: survey.type,
      questions: [...survey.questions]
    });
    setOpenSurveyDialog(true);
  };

  const handleCloseSurveyDialog = () => {
    setOpenSurveyDialog(false);
    setCurrentSurvey(null);
  };

  const handleFormChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTypeChange = (event: SelectChangeEvent) => {
    setFormData(prev => ({
      ...prev,
      type: event.target.value as SurveyType
    }));
  };

  // Handle question dialog
  const handleOpenAddQuestionDialog = () => {
    setQuestionFormData({
      text: '',
      options: ['', '', '', '']
    });
    setEditingQuestionIndex(null);
    setOpenQuestionDialog(true);
  };

  const handleOpenEditQuestionDialog = (index: number) => {
    const question = formData.questions[index];
    setQuestionFormData({
      text: question.text,
      options: [...question.options]
    });
    setEditingQuestionIndex(index);
    setOpenQuestionDialog(true);
  };

  const handleCloseQuestionDialog = () => {
    setOpenQuestionDialog(false);
    setEditingQuestionIndex(null);
  };

  const handleQuestionFormChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setQuestionFormData(prev => ({
      ...prev,
      text: value
    }));
  };

  const handleOptionChange = (index: number, value: string) => {
    setQuestionFormData(prev => {
      const newOptions = [...prev.options];
      newOptions[index] = value;
      return {
        ...prev,
        options: newOptions
      };
    });
  };

  const handleAddOption = () => {
    setQuestionFormData(prev => ({
      ...prev,
      options: [...prev.options, '']
    }));
  };

  const handleRemoveOption = (index: number) => {
    if (questionFormData.options.length <= 2) {
      setSnackbar({
        open: true,
        message: 'Cần ít nhất 2 lựa chọn cho mỗi câu hỏi',
        severity: 'error'
      });
      return;
    }

    setQuestionFormData(prev => {
      const newOptions = [...prev.options];
      newOptions.splice(index, 1);
      return {
        ...prev,
        options: newOptions
      };
    });
  };

  const handleSaveQuestion = () => {
    // Validate question
    if (!questionFormData.text.trim()) {
      setSnackbar({
        open: true,
        message: 'Vui lòng nhập nội dung câu hỏi',
        severity: 'error'
      });
      return;
    }

    // Validate options
    const validOptions = questionFormData.options.filter(opt => opt.trim() !== '');
    if (validOptions.length < 2) {
      setSnackbar({
        open: true,
        message: 'Cần ít nhất 2 lựa chọn hợp lệ cho mỗi câu hỏi',
        severity: 'error'
      });
      return;
    }

    const newQuestion: Question = {
      id: editingQuestionIndex !== null ? formData.questions[editingQuestionIndex].id : String(Date.now()),
      text: questionFormData.text,
      options: validOptions,
      scores: validOptions.map(() => 0) // Default scores to 0
    };

    setFormData(prev => {
      const newQuestions = [...prev.questions];
      if (editingQuestionIndex !== null) {
        newQuestions[editingQuestionIndex] = newQuestion;
      } else {
        newQuestions.push(newQuestion);
      }
      return {
        ...prev,
        questions: newQuestions
      };
    });

    handleCloseQuestionDialog();
  };

  const handleRemoveQuestion = (index: number) => {
    setFormData(prev => {
      const newQuestions = [...prev.questions];
      newQuestions.splice(index, 1);
      return {
        ...prev,
        questions: newQuestions
      };
    });
  };

  const handleSaveSurvey = () => {
    // Validate survey
    if (!formData.title.trim() || !formData.description.trim() || formData.questions.length === 0) {
      setSnackbar({
        open: true,
        message: 'Vui lòng điền đầy đủ thông tin và thêm ít nhất một câu hỏi',
        severity: 'error'
      });
      return;
    }

    if (dialogMode === 'add') {
      // In a real app, this would be an API call to create a new survey
      const newSurvey: Survey = {
        id: String(Date.now()),
        ...formData,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      setSurveys(prev => [...prev, newSurvey]);
      setSnackbar({
        open: true,
        message: 'Khảo sát đã được thêm thành công',
        severity: 'success'
      });
    } else {
      // In a real app, this would be an API call to update the survey
      if (currentSurvey) {
        const updatedSurveys = surveys.map(survey =>
          survey.id === currentSurvey.id
            ? { ...survey, ...formData, updatedAt: new Date() }
            : survey
        );
        setSurveys(updatedSurveys);
        setSnackbar({
          open: true,
          message: 'Khảo sát đã được cập nhật thành công',
          severity: 'success'
        });
      }
    }

    handleCloseSurveyDialog();
  };

  // Handle delete survey
  const handleOpenDeleteDialog = (survey: Survey) => {
    setSurveyToDelete(survey);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setSurveyToDelete(null);
  };

  const handleDeleteSurvey = () => {
    if (surveyToDelete) {
      // In a real app, this would be an API call to delete the survey
      const updatedSurveys = surveys.filter(survey => survey.id !== surveyToDelete.id);
      setSurveys(updatedSurveys);
      setSnackbar({
        open: true,
        message: 'Khảo sát đã được xóa thành công',
        severity: 'success'
      });
    }

    handleCloseDeleteDialog();
  };

  // Handle snackbar close
  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({
      ...prev,
      open: false
    }));
  };

  return (
    <Container>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Quản lý khảo sát
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Quản lý tất cả khảo sát đánh giá nguy cơ trong hệ thống
        </Typography>
      </Box>

      {/* Toolbar */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
          <TextField
            label="Tìm kiếm"
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={handleSearchChange}
            sx={{ flexGrow: 1, minWidth: '200px' }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />

          <FormControl variant="outlined" size="small" sx={{ minWidth: '150px' }}>
            <InputLabel id="type-filter-label">Loại</InputLabel>
            <Select
              labelId="type-filter-label"
              id="type-filter"
              value={typeFilter}
              onChange={handleTypeFilterChange}
              label="Loại"
            >
              <MenuItem value="all">Tất cả</MenuItem>
              <MenuItem value="CUSTOM">Tùy chỉnh</MenuItem>
              <MenuItem value="ASSIST">ASSIST</MenuItem>
              <MenuItem value="CRAFFT">CRAFFT</MenuItem>
            </Select>
          </FormControl>

          <Tooltip title="Đặt lại bộ lọc">
            <IconButton onClick={handleResetFilters}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenAddDialog}
            sx={{ ml: 'auto' }}
          >
            Thêm khảo sát
          </Button>
        </Box>
      </Paper>

      {/* Surveys Table */}
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 'calc(100vh - 300px)' }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Tiêu đề</TableCell>
                <TableCell>Loại</TableCell>
                <TableCell>Số câu hỏi</TableCell>
                <TableCell>Ngày tạo</TableCell>
                <TableCell align="center">Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredSurveys
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((survey) => (
                  <TableRow hover key={survey.id}>
                    <TableCell>{survey.id}</TableCell>
                    <TableCell>{survey.title}</TableCell>
                    <TableCell>
                      <Chip
                        label={survey.type}
                        color="primary"
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{survey.questions.length}</TableCell>
                    <TableCell>
                      {new Date(survey.createdAt).toLocaleDateString('vi-VN')}
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="Xem">
                        <IconButton
                          component={Link}
                          to={`/surveys/${survey.id}`}
                          color="info"
                        >
                          <VisibilityIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Chỉnh sửa">
                        <IconButton onClick={() => handleOpenEditDialog(survey)} color="primary">
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Xóa">
                        <IconButton onClick={() => handleOpenDeleteDialog(survey)} color="error">
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={filteredSurveys.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Số hàng mỗi trang:"
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} của ${count}`}
        />
      </Paper>

      {/* Add/Edit Survey Dialog */}
      <Dialog open={openSurveyDialog} onClose={handleCloseSurveyDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {dialogMode === 'add' ? 'Thêm khảo sát mới' : 'Chỉnh sửa khảo sát'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              name="title"
              label="Tiêu đề"
              fullWidth
              value={formData.title}
              onChange={handleFormChange}
            />
            <TextField
              name="description"
              label="Mô tả"
              fullWidth
              multiline
              rows={3}
              value={formData.description}
              onChange={handleFormChange}
            />
            <FormControl fullWidth>
              <InputLabel id="type-label">Loại</InputLabel>
              <Select
                labelId="type-label"
                id="type"
                value={formData.type}
                onChange={handleTypeChange}
                label="Loại"
              >
                <MenuItem value="CUSTOM">Tùy chỉnh</MenuItem>
                <MenuItem value="ASSIST">ASSIST</MenuItem>
                <MenuItem value="CRAFFT">CRAFFT</MenuItem>
              </Select>
            </FormControl>
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="subtitle1">Danh sách câu hỏi</Typography>
                <Button
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={handleOpenAddQuestionDialog}
                >
                  Thêm câu hỏi
                </Button>
              </Box>
              {formData.questions.length > 0 ? (
                <List>
                  {formData.questions.map((question, index) => (
                    <React.Fragment key={question.id}>
                      <ListItem>
                        <ListItemText
                          primary={`Câu ${index + 1}: ${question.text}`}
                          secondary={`${question.options.length} lựa chọn`}
                        />
                        <ListItemSecondaryAction>
                          <IconButton edge="end" onClick={() => handleOpenEditQuestionDialog(index)}>
                            <EditIcon />
                          </IconButton>
                          <IconButton edge="end" onClick={() => handleRemoveQuestion(index)}>
                            <DeleteIcon />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                      {index < formData.questions.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              ) : (
                <Alert severity="info">
                  Chưa có câu hỏi nào. Vui lòng thêm ít nhất một câu hỏi.
                </Alert>
              )}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseSurveyDialog}>Hủy</Button>
          <Button
            onClick={handleSaveSurvey}
            variant="contained"
            color="primary"
            disabled={!formData.title || !formData.description || formData.questions.length === 0}
          >
            {dialogMode === 'add' ? 'Thêm' : 'Lưu'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add/Edit Question Dialog */}
      <Dialog open={openQuestionDialog} onClose={handleCloseQuestionDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingQuestionIndex !== null ? 'Chỉnh sửa câu hỏi' : 'Thêm câu hỏi mới'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              label="Nội dung câu hỏi"
              fullWidth
              value={questionFormData.text}
              onChange={handleQuestionFormChange}
            />
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Các lựa chọn
              </Typography>
              {questionFormData.options.map((option, index) => (
                <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <TextField
                    label={`Lựa chọn ${index + 1}`}
                    fullWidth
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    sx={{ mr: 1 }}
                  />
                  <IconButton color="error" onClick={() => handleRemoveOption(index)}>
                    <RemoveCircleIcon />
                  </IconButton>
                </Box>
              ))}
              <Button
                startIcon={<AddCircleIcon />}
                onClick={handleAddOption}
                sx={{ mt: 1 }}
              >
                Thêm lựa chọn
              </Button>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseQuestionDialog}>Hủy</Button>
          <Button onClick={handleSaveQuestion} variant="contained" color="primary">
            Lưu
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Xác nhận xóa</DialogTitle>
        <DialogContent>
          <Typography>
            Bạn có chắc chắn muốn xóa khảo sát "{surveyToDelete?.title}" không?
          </Typography>
          <Typography variant="body2" color="error" sx={{ mt: 2 }}>
            Lưu ý: Hành động này không thể hoàn tác.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Hủy</Button>
          <Button onClick={handleDeleteSurvey} variant="contained" color="error">
            Xóa
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default AdminSurveysPage;
