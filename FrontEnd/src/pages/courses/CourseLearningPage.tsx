import React, { useState, useEffect } from "react";
import { Container, Typography, Box, Card, CardContent, Button, Chip, List, ListItemIcon, ListItemText, ListItemButton, Paper, Alert } from "@mui/material";
import { PlayArrow as PlayArrowIcon } from "@mui/icons-material";
import { useParams } from "react-router-dom";
import { CourseService, CourseDetailItem } from "../../services/CourseService";
import ClientLayout from "../../components/layout/ClientLayout";
import { getVideoUrl, handleVideoError } from "../../utils/imageUtils";

const CourseLearningPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const courseService = new CourseService();
  // State management
  const [currentLesson, setCurrentLesson] = useState<CourseDetailItem | null>(null);
  const [lessons, setLessons] = useState<CourseDetailItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourseData = async () => {
      if (!id) return;
      setLoading(true);
      setError(null);

      try {
        console.log("Loading course data for learning page, ID:", id);
        const response = await courseService.getCourseById(parseInt(id));
        console.log("Course learning data response:", response);

        if (response.code === 200 && response.data) {
          const courseData = response.data;
          console.log("Course details:", courseData.courseDetail);
          if (courseData.courseDetail && courseData.courseDetail.length > 0) {
            console.log("First lesson content:", courseData.courseDetail[0].content);
            console.log("First lesson objective:", courseData.courseDetail[0].objective);
          }
          setLessons(courseData.courseDetail);

          // Set first lesson as current
          setCurrentLesson(courseData.courseDetail[0] || null);
        } else {
          setError(response.message || "Không thể tải dữ liệu khóa học");
        }
      } catch (error) {
        console.error("Error loading course data:", error);
        setError("Đã xảy ra lỗi khi tải khóa học");
      } finally {
        setLoading(false);
      }
    };

    fetchCourseData();
  }, [id]);

  const handleLessonSelect = (lesson: CourseDetailItem) => {
    setCurrentLesson(lesson);
  };

  // Function to safely render HTML content
  const renderHtmlContent = (content: string | null | undefined) => {
    if (!content) return "";

    // If content looks like HTML (contains tags), return as is
    if (content.includes("<") && content.includes(">")) {
      return content;
    }

    // If it's plain text, wrap in paragraph tags
    return `<p>${content}</p>`;
  };

  if (loading) {
    return (
      <ClientLayout>
        <Container>
          <Box sx={{ py: 4, textAlign: "center" }}>
            <Typography>Đang tải khóa học...</Typography>
          </Box>
        </Container>
      </ClientLayout>
    );
  }

  if (error) {
    return (
      <ClientLayout>
        <Container>
          <Box sx={{ py: 4, textAlign: "center" }}>
            <Alert severity="error">{error}</Alert>
          </Box>
        </Container>
      </ClientLayout>
    );
  }

  return (
    <ClientLayout>
      <Box sx={{ display: "flex", minHeight: "calc(100vh - 128px)" }}>
        {/* Left Sidebar - Always visible */}
        <Box
          sx={{
            width: 300,
            flexShrink: 0,
            borderRight: 1,
            borderColor: "divider",
            bgcolor: "background.paper",
          }}
        >
          <Box sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Nội dung khóa học
            </Typography>

            <List>
              {lessons.map((lesson, index) => (
                <ListItemButton key={lesson.id || index} selected={currentLesson?.id === lesson.id} onClick={() => handleLessonSelect(lesson)}>
                  <ListItemIcon>
                    <PlayArrowIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText primary={`${index + 1}. ${lesson.name}`} secondary={`${lesson.duration} giờ`} />
                </ListItemButton>
              ))}
            </List>
          </Box>
        </Box>

        {/* Main Content */}
        <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
          {/* Header */}
          <Paper sx={{ p: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography variant="h6">{currentLesson?.name || "Chọn bài học"}</Typography>
            <Box sx={{ display: "flex", gap: 1 }}>
              <Chip label={`${lessons.length} bài học`} color="primary" variant="outlined" />
            </Box>
          </Paper>

          {/* Content Area */}
          <Container maxWidth="lg" sx={{ py: 3 }}>
            {currentLesson ? (
              <Card>
                <CardContent>
                  <Typography variant="h4" gutterBottom>
                    {currentLesson.name}
                  </Typography>

                  <Box sx={{ display: "flex", gap: 1, mb: 3 }}>
                    <Chip label="Video" size="small" />
                    <Chip label={`${currentLesson.duration} giờ`} size="small" variant="outlined" />
                  </Box>

                  {currentLesson.video && (
                    <Box sx={{ mb: 3 }}>
                      <video width="100%" height="400" controls src={getVideoUrl(currentLesson.video)} style={{ borderRadius: 8 }} onError={handleVideoError}>
                        Trình duyệt của bạn không hỗ trợ video.
                      </video>
                    </Box>
                  )}

                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" gutterBottom>
                      Mục đích bài học
                    </Typography>
                    <Box
                      sx={{
                        mb: 3,
                        "& p": { margin: "8px 0" },
                        "& ul, & ol": { paddingLeft: "20px" },
                        "& h1, & h2, & h3, & h4, & h5, & h6": { margin: "16px 0 8px 0" },
                        "& blockquote": { borderLeft: "4px solid #ddd", paddingLeft: "16px", margin: "16px 0" },
                        "& a": { color: "primary.main", textDecoration: "underline" },
                      }}
                      dangerouslySetInnerHTML={{ __html: renderHtmlContent(currentLesson.objective) }}
                    />

                    <Typography variant="h6" gutterBottom>
                      Nội dung bài học
                    </Typography>
                    <Box
                      sx={{
                        "& p": { margin: "8px 0" },
                        "& ul, & ol": { paddingLeft: "20px" },
                        "& h1, & h2, & h3, & h4, & h5, & h6": { margin: "16px 0 8px 0" },
                        "& blockquote": { borderLeft: "4px solid #ddd", paddingLeft: "16px", margin: "16px 0" },
                        "& a": { color: "primary.main", textDecoration: "underline" },
                      }}
                      dangerouslySetInnerHTML={{ __html: renderHtmlContent(currentLesson.content) }}
                    />
                  </Box>

                  <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}>
                    <Button
                      variant="outlined"
                      onClick={() => {
                        const currentIndex = lessons.findIndex((l) => l.id === currentLesson.id);
                        if (currentIndex > 0) {
                          setCurrentLesson(lessons[currentIndex - 1]);
                        }
                      }}
                      disabled={lessons.findIndex((l) => l.id === currentLesson.id) === 0}
                    >
                      Bài trước
                    </Button>

                    <Button
                      variant="outlined"
                      onClick={() => {
                        const currentIndex = lessons.findIndex((l) => l.id === currentLesson.id);
                        if (currentIndex < lessons.length - 1) {
                          setCurrentLesson(lessons[currentIndex + 1]);
                        }
                      }}
                      disabled={lessons.findIndex((l) => l.id === currentLesson.id) === lessons.length - 1}
                    >
                      Bài tiếp theo
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            ) : (
              <Alert severity="info">Vui lòng chọn một bài học để bắt đầu.</Alert>
            )}
          </Container>
        </Box>
      </Box>
    </ClientLayout>
  );
};

export default CourseLearningPage;
