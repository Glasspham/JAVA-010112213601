import React, { useState, useEffect } from "react";
import { Container, Typography, Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, Button, TextField, InputAdornment, FormControl, InputLabel, Select, MenuItem, IconButton, Tooltip, Dialog, DialogTitle, DialogContent, DialogActions, Chip, Alert, CircularProgress, SelectChangeEvent } from "@mui/material";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { Add as AddIcon, Search as SearchIcon, Edit as EditIcon, Delete as DeleteIcon, Refresh as RefreshIcon } from "@mui/icons-material";
import { Survey, Question, Answer } from "../../types/survey";
import { SurveyService } from "../../services/SurveyService";

const SURVEY_TYPES = [
  { value: "ASSIST", label: "ASSIST" },
  { value: "CRAFFT", label: "CRAFFT" },
];

const AdminSurveysPage: React.FC = () => {
  const surveyService = new SurveyService();

  // State for surveys data
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State for pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalElements, setTotalElements] = useState(0);

  // State for search and filter
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("");

  // State for survey dialog
  const [openSurveyDialog, setOpenSurveyDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState<"add" | "edit">("add");
  const [currentSurvey, setCurrentSurvey] = useState<Survey | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    type: "ASSIST",
    questions: [] as Question[],
  });

  // State for question dialog
  const [openQuestionDialog, setOpenQuestionDialog] = useState(false);
  const [questionFormData, setQuestionFormData] = useState({
    content: "",
    answers: [
      { content: "", correct: false },
      { content: "", correct: false },
    ] as Answer[],
  });
  const [editingQuestionIndex, setEditingQuestionIndex] = useState<number | null>(null);

  // Load surveys from API
  const loadSurveys = async () => {
    try {
      setLoading(true);
      setError(null);

      const [code, data, message] = await surveyService.findAllSurveys({
        page: page + 1,
        limit: rowsPerPage,
        keyword: searchTerm || undefined,
        type: typeFilter || undefined,
      });

      if (code === 200) {
        setSurveys(data.content);
        setTotalElements(data.totalElements);
      } else {
        setError(message || "Failed to load surveys");
      }
    } catch (error) {
      console.error("Error loading surveys:", error);
      setError("An error occurred while loading surveys");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSurveys();
  }, [page, rowsPerPage, searchTerm, typeFilter]);

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
    setPage(0);
  };

  const handleTypeFilterChange = (event: SelectChangeEvent) => {
    setTypeFilter(event.target.value);
    setPage(0);
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setTypeFilter("");
    setPage(0);
  };

  // Handle survey dialog
  const handleOpenAddDialog = () => {
    setDialogMode("add");
    setFormData({
      name: "",
      type: "ASSIST",
      questions: [],
    });
    setOpenSurveyDialog(true);
  };

  const handleCloseSurveyDialog = () => {
    setOpenSurveyDialog(false);
    setCurrentSurvey(null);
  };

  const handleFormChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTypeChange = (event: SelectChangeEvent) => {
    setFormData((prev) => ({
      ...prev,
      type: event.target.value,
    }));
  };

  // Handle question dialog
  const handleOpenAddQuestionDialog = () => {
    setQuestionFormData({
      content: "",
      answers: [
        { id: null, content: "", correct: false },
        { id: null, content: "", correct: false },
      ],
    });
    setEditingQuestionIndex(null);
    setOpenQuestionDialog(true);
  };

  const handleCloseQuestionDialog = () => {
    setOpenQuestionDialog(false);
    setEditingQuestionIndex(null);
  };

  const handleQuestionFormChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setQuestionFormData((prev) => ({
      ...prev,
      content: value,
    }));
  };

  const handleAnswerChange = (index: number, field: "content" | "correct", value: string | boolean) => {
    setQuestionFormData((prev) => {
      const newAnswers = [...prev.answers];
      newAnswers[index] = { ...newAnswers[index], [field]: value };
      return {
        ...prev,
        answers: newAnswers,
      };
    });
  };

  const handleAddAnswer = () => {
    setQuestionFormData((prev) => ({
      ...prev,
      answers: [...prev.answers, { id: null, content: "", correct: false }],
    }));
  };

  const handleRemoveAnswer = (index: number) => {
    if (questionFormData.answers.length <= 2) {
      Swal.fire({
        icon: "warning",
        title: "Cảnh báo",
        text: "Cần ít nhất 2 đáp án cho mỗi câu hỏi",
      });
      return;
    }

    setQuestionFormData((prev) => {
      const newAnswers = [...prev.answers];
      newAnswers.splice(index, 1);
      return {
        ...prev,
        answers: newAnswers,
      };
    });
  };

  const handleSaveQuestion = () => {
    // Validate question
    if (!questionFormData.content.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Cảnh báo",
        text: "Vui lòng nhập nội dung câu hỏi",
      });
      return;
    }

    // Validate answers
    const validAnswers = questionFormData.answers.filter((ans) => ans.content.trim() !== "");
    if (validAnswers.length < 2) {
      Swal.fire({
        icon: "warning",
        title: "Cảnh báo",
        text: "Cần ít nhất 2 đáp án hợp lệ cho mỗi câu hỏi",
      });
      return;
    }

    const newQuestion: Question = {
      id: null,
      content: questionFormData.content,
      answers: validAnswers.map((ans) => ({ ...ans, id: null })),
    };

    setFormData((prev) => {
      const newQuestions = [...prev.questions];
      if (editingQuestionIndex !== null) {
        newQuestions[editingQuestionIndex] = newQuestion;
      } else {
        newQuestions.push(newQuestion);
      }
      return {
        ...prev,
        questions: newQuestions,
      };
    });

    handleCloseQuestionDialog();
  };

  const handleEditQuestion = (index: number) => {
    const question = formData.questions[index];
    setQuestionFormData({
      content: question.content,
      answers: question.answers.map((ans) => ({ ...ans })),
    });
    setEditingQuestionIndex(index);
    setOpenQuestionDialog(true);
  };

  const handleRemoveQuestion = (index: number) => {
    setFormData((prev) => {
      const newQuestions = [...prev.questions];
      newQuestions.splice(index, 1);
      return {
        ...prev,
        questions: newQuestions,
      };
    });
  };

  const handleEditSurvey = (survey: Survey) => {
    setDialogMode("edit");
    setCurrentSurvey(survey);

    // Ensure type is valid, default to ASSIST if not
    const validType = SURVEY_TYPES.find((t) => t.value === survey.type) ? survey.type : "ASSIST";

    setFormData({
      name: survey.name,
      type: validType,
      questions: survey.questions.map((q) => ({ ...q })),
    });
    setOpenSurveyDialog(true);
  };

  const handleDeleteSurvey = async (surveyName: string, surveyId: number | null) => {
    if (!surveyId) return;

    const result = await Swal.fire({
      title: "Xác nhận xóa?",
      text: `Bạn có chắc muốn xóa khảo sát "${surveyName}" không?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
    });

    if (result.isConfirmed) {
      try {
        const [code, data, message] = await surveyService.deleteSurvey(surveyId);

        if (code === 200) {
          toast.success(`Xóa khảo sát "${surveyName}" thành công`);
          loadSurveys();
        } else {
          toast.error(message || "Không thể xóa khảo sát. Vui lòng thử lại sau.");
        }
      } catch (error) {
        console.error("Error deleting survey:", error);
        toast.error("Không thể xóa khảo sát. Vui lòng thử lại sau.");
      }
    }
  };

  const handleSaveSurvey = async () => {
    // Validate survey
    if (!formData.name.trim() || formData.questions.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "Cảnh báo",
        text: "Vui lòng điền tên khảo sát và thêm ít nhất một câu hỏi",
      });
      return;
    }

    try {
      const surveyData: Survey = {
        id: dialogMode === "edit" ? currentSurvey?.id || null : null,
        name: formData.name,
        type: formData.type,
        questions: formData.questions,
      };

      let code: number, data: Survey, message: string;

      if (dialogMode === "edit" && currentSurvey?.id) {
        [code, data, message] = await surveyService.updateSurvey(currentSurvey.id, surveyData);
      } else {
        [code, data, message] = await surveyService.createSurvey(surveyData);
      }

      if (code === 200) {
        toast.success(dialogMode === "edit" ? "Cập nhật khảo sát thành công" : "Thêm khảo sát thành công");
        handleCloseSurveyDialog();
        loadSurveys();
      } else {
        toast.error(message || `Có lỗi xảy ra khi ${dialogMode === "edit" ? "cập nhật" : "tạo"} khảo sát`);
      }
    } catch (error) {
      console.error(`Error ${dialogMode === "edit" ? "updating" : "creating"} survey:`, error);
      toast.error(`Có lỗi xảy ra khi ${dialogMode === "edit" ? "cập nhật" : "tạo"} khảo sát`);
    }
  };

  if (loading && surveys.length === 0) {
    return (
      <Container>
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "400px" }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Quản lý khảo sát
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Quản lý tất cả khảo sát trong hệ thống
        </Typography>
      </Box>

      {/* Toolbar */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, alignItems: "center" }}>
          <TextField
            label="Tìm kiếm"
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={handleSearchChange}
            sx={{ flexGrow: 1, minWidth: "200px" }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />

          <FormControl variant="outlined" size="small" sx={{ minWidth: "150px" }}>
            <InputLabel id="type-filter-label">Loại</InputLabel>
            <Select labelId="type-filter-label" id="type-filter" value={typeFilter} onChange={handleTypeFilterChange} label="Loại">
              <MenuItem value="">Tất cả</MenuItem>
              {SURVEY_TYPES.map((type) => (
                <MenuItem key={type.value} value={type.value}>
                  {type.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Tooltip title="Đặt lại bộ lọc">
            <IconButton onClick={handleResetFilters}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>

          <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenAddDialog} sx={{ ml: "auto" }}>
            Thêm khảo sát
          </Button>
        </Box>
      </Paper>

      {/* Surveys Table */}
      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <TableContainer sx={{ maxHeight: "calc(100vh - 300px)" }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>STT</TableCell>
                <TableCell>Tên khảo sát</TableCell>
                <TableCell>Loại</TableCell>
                <TableCell>Số câu hỏi</TableCell>
                <TableCell align="center">Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {surveys.map((survey, index) => (
                <TableRow hover key={survey.id}>
                  <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                  <TableCell>{survey.name}</TableCell>
                  <TableCell>
                    <Chip label={SURVEY_TYPES.find((t) => t.value === survey.type)?.label || survey.type} color="primary" size="small" />
                  </TableCell>
                  <TableCell>{survey.questions.length}</TableCell>
                  <TableCell align="center">
                    <Tooltip title="Chỉnh sửa">
                      <IconButton color="primary" onClick={() => handleEditSurvey(survey)}>
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Xóa">
                      <IconButton color="error" onClick={() => handleDeleteSurvey(survey.name, survey.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination rowsPerPageOptions={[5, 10, 25, 50]} component="div" count={totalElements} rowsPerPage={rowsPerPage} page={page} onPageChange={handleChangePage} onRowsPerPageChange={handleChangeRowsPerPage} labelRowsPerPage="Số hàng mỗi trang:" labelDisplayedRows={({ from, to, count }) => `${from}-${to} của ${count}`} />
      </Paper>

      {/* Add/Edit Survey Dialog */}
      <Dialog open={openSurveyDialog} onClose={handleCloseSurveyDialog} maxWidth="md" fullWidth>
        <DialogTitle>{dialogMode === "add" ? "Thêm khảo sát mới" : "Chỉnh sửa khảo sát"}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
            <TextField name="name" label="Tên khảo sát" fullWidth value={formData.name} onChange={handleFormChange} />
            <FormControl fullWidth>
              <InputLabel id="type-label">Loại</InputLabel>
              <Select labelId="type-label" id="type" value={formData.type} onChange={handleTypeChange} label="Loại">
                {SURVEY_TYPES.map((type) => (
                  <MenuItem key={type.value} value={type.value}>
                    {type.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Box>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                <Typography variant="subtitle1">Danh sách câu hỏi</Typography>
                <Button variant="outlined" startIcon={<AddIcon />} onClick={handleOpenAddQuestionDialog}>
                  Thêm câu hỏi
                </Button>
              </Box>
              {formData.questions.length > 0 ? (
                <Box>
                  {formData.questions.map((question, index) => (
                    <Paper key={index} sx={{ p: 2, mb: 2 }}>
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <Box sx={{ flexGrow: 1 }}>
                          <Typography variant="subtitle2" gutterBottom>
                            Câu {index + 1}: {question.content}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {question.answers.length} đáp án
                          </Typography>
                        </Box>
                        <Box>
                          <IconButton onClick={() => handleEditQuestion(index)} color="primary" size="small">
                            <EditIcon />
                          </IconButton>
                          <IconButton onClick={() => handleRemoveQuestion(index)} color="error" size="small">
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      </Box>
                    </Paper>
                  ))}
                </Box>
              ) : (
                <Alert severity="info">Chưa có câu hỏi nào. Vui lòng thêm câu hỏi cho khảo sát.</Alert>
              )}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseSurveyDialog}>Hủy</Button>
          <Button onClick={handleSaveSurvey} variant="contained">
            {dialogMode === "add" ? "Tạo khảo sát" : "Cập nhật"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add/Edit Question Dialog */}
      <Dialog open={openQuestionDialog} onClose={handleCloseQuestionDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{editingQuestionIndex !== null ? "Chỉnh sửa câu hỏi" : "Thêm câu hỏi mới"}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
            <TextField label="Nội dung câu hỏi" fullWidth multiline rows={2} value={questionFormData.content} onChange={handleQuestionFormChange} />
            <Box>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                <Typography variant="subtitle2">Đáp án</Typography>
                <Button variant="outlined" size="small" startIcon={<AddIcon />} onClick={handleAddAnswer}>
                  Thêm đáp án
                </Button>
              </Box>
              {questionFormData.answers.map((answer, index) => (
                <Box key={index} sx={{ display: "flex", gap: 1, mb: 1, alignItems: "center" }}>
                  <TextField label={`Đáp án ${index + 1}`} fullWidth size="small" value={answer.content} onChange={(e) => handleAnswerChange(index, "content", e.target.value)} />
                  <FormControl size="small" sx={{ minWidth: 100 }}>
                    <InputLabel>Đúng</InputLabel>
                    <Select value={answer.correct ? "true" : "false"} onChange={(e) => handleAnswerChange(index, "correct", e.target.value === "true")} label="Đúng">
                      <MenuItem value="false">Sai</MenuItem>
                      <MenuItem value="true">Đúng</MenuItem>
                    </Select>
                  </FormControl>
                  <IconButton onClick={() => handleRemoveAnswer(index)} color="error" size="small" disabled={questionFormData.answers.length <= 2}>
                    <DeleteIcon />
                  </IconButton>
                </Box>
              ))}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseQuestionDialog}>Hủy</Button>
          <Button onClick={handleSaveQuestion} variant="contained">
            {editingQuestionIndex !== null ? "Cập nhật" : "Thêm"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminSurveysPage;
