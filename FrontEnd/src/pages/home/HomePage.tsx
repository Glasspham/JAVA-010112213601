import React, { useEffect, useState } from "react";
import { Box, Typography, Container, Card, CardContent, CardMedia, Button, Paper, Divider, CircularProgress } from "@mui/material";
import { School as SchoolIcon, AssessmentOutlined as AssessmentIcon, EventNote as EventNoteIcon, Groups as GroupsIcon } from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { heroImage, aboutUsImage } from "../../utils/imageUrls";
import "../../styles/ProgramCard.css";
import { AuthService } from "../../services/AuthService";
import { CourseService, CourseResponse } from "../../services/CourseService";
import { ProgramService } from "../../services/ProgramService";
import { ProgramSearch } from "../../dto/ProgramSearch";
import { getImageUrl, handleImageError } from "../../utils/imageUtils";

const HomePage: React.FC = () => {
  const _authService = new AuthService();
  const courseService = new CourseService();
  const programService = new ProgramService();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [latestCourses, setLatestCourses] = useState<CourseResponse[]>([]);
  const [upcomingPrograms, setUpcomingPrograms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      var isAuthenStatus = await _authService.isAuthen();
      if (!isAuthenStatus) navigate("/login");
    };

    checkAuth();
  }, []);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        // Load latest courses
        const [courseCode, courseData] = await courseService.findAllCourses({
          page: 1,
          limit: 3,
          keyword: "",
        });

        if (courseCode === 200) {
          setLatestCourses(courseData.content || []);
        }

        // Load upcoming programs
        const programSearch: ProgramSearch = {
          page: 1,
          limit: 10,
          keyword: "",
          timer: 0,
        };

        const [programCode, programData] = await programService.findAll(programSearch);

        if (programCode === 200) {
          // Filter upcoming programs (future dates)
          const upcoming = (programData.content || [])
            .filter((program: any) => {
              const programDate = new Date(program.date);
              return programDate > new Date();
            })
            .slice(0, 2);
          setUpcomingPrograms(upcoming);
        }
      } catch (error) {
        console.error("Error loading homepage data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return (
    <Box>
      {/* Hero Section */}
      <Paper
        sx={{
          position: "relative",
          backgroundColor: "grey.800",
          color: "#fff",
          mb: 4,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          backgroundImage: `url(${heroImage})`,
          borderRadius: 2,
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: 0,
            bottom: 0,
            right: 0,
            left: 0,
            backgroundColor: "rgba(0,0,0,.5)",
          }}
        />
        <Box sx={{ display: "flex" }}>
          <Box sx={{ width: { xs: "100%", md: "50%" } }}>
            <Box
              sx={{
                position: "relative",
                p: { xs: 3, md: 6 },
                pr: { md: 0 },
                minHeight: 400,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <Typography component="h1" variant="h3" color="inherit" gutterBottom>
                Hỗ trợ phòng ngừa sử dụng ma túy
              </Typography>
              <Typography variant="h5" color="inherit" paragraph>
                Chúng tôi cung cấp các công cụ, khóa học và hỗ trợ để giúp cộng đồng phòng ngừa sử dụng ma túy.
              </Typography>
              <Box sx={{ mt: 2 }}>
                {!isAuthenticated ? (
                  <Button variant="contained" component={Link} to="/register" size="large" sx={{ mr: 2 }}>
                    Đăng ký ngay
                  </Button>
                ) : (
                  <Button variant="contained" component={Link} to="/surveys" size="large" sx={{ mr: 2 }}>
                    Đánh giá nguy cơ
                  </Button>
                )}
                <Button variant="outlined" component={Link} to="/courses" size="large" sx={{ color: "white", borderColor: "white" }}>
                  Khám phá khóa học
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>
      </Paper>

      {/* Giới thiệu tổ chức */}
      <Container sx={{ mb: 6 }}>
        <Typography variant="h4" component="h2" gutterBottom align="center" sx={{ mb: 4 }}>
          Về chúng tôi
        </Typography>
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 4 }}>
          <Box>
            <Typography variant="body1" paragraph>
              Tổ chức tình nguyện của chúng tôi được thành lập với sứ mệnh hỗ trợ cộng đồng trong việc phòng ngừa sử dụng ma túy. Chúng tôi tin rằng giáo dục và nhận thức là chìa khóa để giải quyết vấn đề này.
            </Typography>
            <Typography variant="body1" paragraph>
              Với đội ngũ chuyên gia và tình nguyện viên nhiệt huyết, chúng tôi cung cấp các chương trình giáo dục, tư vấn và hỗ trợ cho mọi đối tượng trong cộng đồng, từ học sinh, sinh viên đến phụ huynh và giáo viên.
            </Typography>
            <Typography variant="body1">Mục tiêu của chúng tôi là xây dựng một cộng đồng khỏe mạnh, nơi mọi người đều có kiến thức và kỹ năng để phòng tránh tác hại của ma túy.</Typography>
          </Box>
          <Box>
            <Box
              component="img"
              sx={{
                width: "100%",
                height: "auto",
                borderRadius: 2,
                boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
              }}
              alt="Tổ chức tình nguyện"
              src={aboutUsImage}
            />
          </Box>
        </Box>
      </Container>

      {/* Dịch vụ chính */}
      <Box sx={{ bgcolor: "background.paper", py: 6 }}>
        <Container>
          <Typography variant="h4" component="h2" gutterBottom align="center" sx={{ mb: 4 }}>
            Dịch vụ của chúng tôi
          </Typography>
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(4, 1fr)" }, gap: 4 }}>
            <Card sx={{ height: "100%", display: "flex", flexDirection: "column", borderRadius: 2 }}>
              <Box sx={{ p: 2, display: "flex", justifyContent: "center" }}>
                <SchoolIcon sx={{ fontSize: 60, color: "primary.main" }} />
              </Box>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h5" component="h3" align="center">
                  Khóa học trực tuyến
                </Typography>
                <Typography align="center">Các khóa học về nhận thức ma túy, kỹ năng phòng tránh và từ chối.</Typography>
              </CardContent>
              <Box sx={{ p: 2, display: "flex", justifyContent: "center" }}>
                <Button component={Link} to="/courses" variant="outlined">
                  Xem khóa học
                </Button>
              </Box>
            </Card>
            <Card sx={{ height: "100%", display: "flex", flexDirection: "column", borderRadius: 2 }}>
              <Box sx={{ p: 2, display: "flex", justifyContent: "center" }}>
                <AssessmentIcon sx={{ fontSize: 60, color: "primary.main" }} />
              </Box>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h5" component="h3" align="center">
                  Đánh giá nguy cơ
                </Typography>
                <Typography align="center">Các bài khảo sát đánh giá mức độ nguy cơ sử dụng ma túy.</Typography>
              </CardContent>
              <Box sx={{ p: 2, display: "flex", justifyContent: "center" }}>
                <Button component={Link} to="/surveys" variant="outlined">
                  Làm khảo sát
                </Button>
              </Box>
            </Card>
            <Card sx={{ height: "100%", display: "flex", flexDirection: "column", borderRadius: 2 }}>
              <Box sx={{ p: 2, display: "flex", justifyContent: "center" }}>
                <EventNoteIcon sx={{ fontSize: 60, color: "primary.main" }} />
              </Box>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h5" component="h3" align="center">
                  Tư vấn trực tuyến
                </Typography>
                <Typography align="center">Đặt lịch hẹn với chuyên viên tư vấn để được hỗ trợ.</Typography>
              </CardContent>
              <Box sx={{ p: 2, display: "flex", justifyContent: "center" }}>
                <Button component={Link} to="/appointments" variant="outlined">
                  Đặt lịch hẹn
                </Button>
              </Box>
            </Card>
            <Card sx={{ height: "100%", display: "flex", flexDirection: "column", borderRadius: 2 }}>
              <Box sx={{ p: 2, display: "flex", justifyContent: "center" }}>
                <GroupsIcon sx={{ fontSize: 60, color: "primary.main" }} />
              </Box>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h5" component="h3" align="center">
                  Chương trình cộng đồng
                </Typography>
                <Typography align="center">Các chương trình truyền thông và giáo dục cộng đồng.</Typography>
              </CardContent>
              <Box sx={{ p: 2, display: "flex", justifyContent: "center" }}>
                <Button component={Link} to="/programs" variant="outlined">
                  Xem chương trình
                </Button>
              </Box>
            </Card>
          </Box>
        </Container>
      </Box>

      {/* Khóa học mới nhất */}
      <Container sx={{ my: 6 }}>
        <Typography variant="h4" component="h2" gutterBottom align="center" sx={{ mb: 4 }}>
          Khóa học mới nhất
        </Typography>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress />
          </Box>
        ) : latestCourses.length > 0 ? (
          <>
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)" }, gap: 4 }}>
              {latestCourses.map((course) => (
                <Card key={course.id} sx={{ height: "100%", display: "flex", flexDirection: "column", borderRadius: 2 }}>
                  <CardMedia component="img" height="140" image={getImageUrl(course.image)} alt={course.name} onError={handleImageError}/>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h5" component="h3">
                      {course.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {course.description}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Thời lượng: {course.duration || 0} phút
                    </Typography>
                  </CardContent>
                  <Box sx={{ p: 2 }}>
                    <Button component={Link} to={`/courses/${course.id}`} variant="contained" fullWidth className="detail-button">
                      Xem chi tiết
                    </Button>
                  </Box>
                </Card>
              ))}
            </Box>
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
              <Button component={Link} to="/courses" variant="outlined" size="large">
                Xem tất cả khóa học
              </Button>
            </Box>
          </>
        ) : (
          <Box sx={{ textAlign: "center", py: 4 }}>
            <Typography variant="h6" color="text.secondary">
              Chưa có khóa học nào
            </Typography>
          </Box>
        )}
      </Container>

      {/* Chương trình sắp diễn ra */}
      <Box sx={{ bgcolor: "background.paper", py: 6 }}>
        <Container>
          <Typography variant="h4" component="h2" gutterBottom align="center" sx={{ mb: 4 }}>
            Chương trình sắp diễn ra
          </Typography>
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
              <CircularProgress />
            </Box>
          ) : upcomingPrograms.length > 0 ? (
            <>
              <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" }, gap: 4 }}>
                {upcomingPrograms.map((program) => (
                  <Card key={program.id} sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, borderRadius: 2 }}>
                    <CardMedia component="img" sx={{ width: { sm: 200 }, height: { xs: 200, sm: "auto" } }} image={getImageUrl(program.image)} alt={program.title} />
                    <Box sx={{ display: "flex", flexDirection: "column", width: "100%" }}>
                      <CardContent sx={{ flex: "1 0 auto" }}>
                        <Typography component="h3" variant="h5">
                          {program.title}
                        </Typography>
                        <Typography variant="subtitle1" color="text.secondary" component="div" sx={{ mb: 1 }}>
                          {new Date(program.date).toLocaleDateString("vi-VN")} - {program.time}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          {program.description}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Địa điểm: {program.address}
                        </Typography>
                      </CardContent>
                      <Box sx={{ display: "flex", alignItems: "center", pl: 2, pb: 2 }}>
                        <Button component={Link} to={`/programs/${program.id}`} variant="contained" className="detail-button">
                          Đăng ký tham gia
                        </Button>
                      </Box>
                    </Box>
                  </Card>
                ))}
              </Box>
              <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                <Button component={Link} to="/programs" variant="outlined" size="large">
                  Xem tất cả chương trình
                </Button>
              </Box>
            </>
          ) : (
            <Box sx={{ textAlign: "center", py: 4 }}>
              <Typography variant="h6" color="text.secondary">
                Hiện tại chưa có chương trình nào sắp diễn ra
              </Typography>
            </Box>
          )}
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ bgcolor: "primary.main", color: "white", py: 6, mt: 6 }}>
        <Container>
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" }, gap: 4 }}>
            <Box>
              <Typography variant="h6" gutterBottom>
                Về chúng tôi
              </Typography>
              <Typography variant="body2">Tổ chức tình nguyện hỗ trợ phòng ngừa sử dụng ma túy trong cộng đồng.</Typography>
            </Box>
            <Box>
              <Typography variant="h6" gutterBottom>
                Liên hệ
              </Typography>
              <Typography variant="body2">Địa chỉ: 123 Đường ABC, Quận XYZ, TP. HCM</Typography>
              <Typography variant="body2">Email: info@prevention.org</Typography>
              <Typography variant="body2">Điện thoại: (028) 1234 5678</Typography>
            </Box>
            <Box>
              <Typography variant="h6" gutterBottom>
                Theo dõi chúng tôi
              </Typography>
              <Typography variant="body2">Facebook • Twitter • Instagram • YouTube</Typography>
            </Box>
          </Box>
          <Divider sx={{ my: 3, bgcolor: "rgba(255,255,255,0.2)" }} />
          <Typography variant="body2" align="center">
            © {new Date().getFullYear()} Hệ thống hỗ trợ phòng ngừa sử dụng ma túy. Tất cả các quyền được bảo lưu.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage;
