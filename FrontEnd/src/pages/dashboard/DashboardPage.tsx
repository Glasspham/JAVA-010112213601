import React, { useState, useEffect } from "react";
import { Container, Typography, Box, Card, CardContent, Paper, FormControl, InputLabel, Select, MenuItem, CircularProgress, Alert, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Line, Legend, PieChart, Pie, Cell, ComposedChart } from "recharts";
import { Groups as GroupsIcon, Event as EventIcon, People as PeopleIcon, School as SchoolIcon } from "@mui/icons-material";
import DashboardService, { DashboardStats, MonthlyStats, LocationStats } from "../../services/DashboardService";
import { CourseService } from "../../services/CourseService";
import { AuthService } from "../../services/AuthService";

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [yearlyStats, setYearlyStats] = useState<MonthlyStats[]>([]);
  const [locationStats, setLocationStats] = useState<LocationStats[]>([]);
  const [recentCourses, setRecentCourses] = useState<any[]>([]);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string>("");
  const authService = new AuthService();
  // Tạo danh sách năm từ 2020 đến năm hiện tại + 2
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 2020 + 3 }, (_, i) => 2020 + i);
  // Tên tháng tiếng Việt
  const monthNames = ["T1", "T2", "T3", "T4", "T5", "T6", "T7", "T8", "T9", "T10", "T11", "T12"];

  useEffect(() => {
    fetchDashboardStats();
    fetchRecentCourses();
    loadUserRole();
  }, []);

  useEffect(() => {
    fetchYearlyStats();
    fetchLocationStats();
  }, [selectedYear]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const stats = await DashboardService.getDashboardStats();
      setDashboardStats(stats);
      setError(null);
    } catch (err) {
      setError("Không thể tải dữ liệu thống kê");
      console.error("Error fetching dashboard stats:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchYearlyStats = async () => {
    try {
      const stats = await DashboardService.getYearlyStats(selectedYear);
      setYearlyStats(stats);
    } catch (err) {
      console.error("Error fetching yearly stats:", err);
    }
  };

  const fetchLocationStats = async () => {
    try {
      const stats = await DashboardService.getLocationStats(selectedYear);
      setLocationStats(stats);
    } catch (err) {
      console.error("Error fetching location stats:", err);
    }
  };

  const fetchRecentCourses = async () => {
    try {
      const courseService = new CourseService();
      const [code, data, message] = await courseService.findAllCourses({
        page: 1,
        limit: 5,
        keyword: "",
      });
      if (code === 200) {
        setRecentCourses(data.content || []);
      }
    } catch (err) {
      console.error("Error fetching recent courses:", err);
    }
  };

  const loadUserRole = async () => {
    try {
      const authenDTO = await authService.readInfoFromLocal();
      if (authenDTO.userName) {
        const [code, data] = await authService.findByUsername(authenDTO.userName);
        if (code === 200 && data) {
          setUserRole(data.role || "");
        }
      }
    } catch (error) {
      console.error("Error loading user role:", error);
    }
  };

  // Chuyển đổi dữ liệu cho biểu đồ
  const chartData = yearlyStats.map((stat, index) => ({
    month: monthNames[index],
    programs: stat.cntProgram,
    registrations: stat.cntRegister,
  }));

  const handleCardClick = (type: string) => {
    // Chặn navigation cho SPECIALIST đối với users và specialists
    if (userRole === "SPECIALIST" && (type === "users" || type === "specialists")) {
      return;
    }

    switch (type) {
      case "users":
        navigate("/admin/users");
        break;
      case "specialists":
        navigate("/admin/users"); // Có thể filter theo specialist
        break;
      case "courses":
        navigate("/admin/courses");
        break;
      case "programs":
        navigate("/admin/programs");
        break;
      default:
        break;
    }
  };

  if (loading) {
    return (
      <Container maxWidth="xl">
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "400px" }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="xl">
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: "bold", color: "primary.main" }}>
          Dashboard - Thống kê Hệ thống
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Tổng quan về hoạt động hệ thống quản lý cộng đồng
        </Typography>
      </Box>

      {/* Thống kê tổng quan */}
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3, mb: 4 }}>
        <Box sx={{ flex: "1 1 250px", minWidth: "250px" }}>
          <Card
            sx={{
              bgcolor: "#e8f5e9",
              boxShadow: 2,
              cursor: userRole === "SPECIALIST" ? "default" : "pointer",
              "&:hover": { boxShadow: userRole === "SPECIALIST" ? 2 : 4 },
            }}
            onClick={() => handleCardClick("users")}
          >
            <CardContent sx={{ textAlign: "center" }}>
              <GroupsIcon sx={{ fontSize: 40, color: "primary.main", mb: 1 }} />
              <Typography variant="h6" gutterBottom>
                Tổng người dùng
              </Typography>
              <Typography variant="h3" color="primary.main">
                {dashboardStats?.cntUser || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Người dùng hệ thống
              </Typography>
            </CardContent>
          </Card>
        </Box>

        <Box sx={{ flex: "1 1 250px", minWidth: "250px" }}>
          <Card
            sx={{
              bgcolor: "#e3f2fd",
              boxShadow: 2,
              cursor: userRole === "SPECIALIST" ? "default" : "pointer",
              "&:hover": { boxShadow: userRole === "SPECIALIST" ? 2 : 4 },
            }}
            onClick={() => handleCardClick("specialists")}
          >
            <CardContent sx={{ textAlign: "center" }}>
              <PeopleIcon sx={{ fontSize: 40, color: "primary.main", mb: 1 }} />
              <Typography variant="h6" gutterBottom>
                Chuyên gia
              </Typography>
              <Typography variant="h3" color="primary.main">
                {dashboardStats?.cntSpecialist || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Chuyên gia tư vấn
              </Typography>
            </CardContent>
          </Card>
        </Box>

        <Box sx={{ flex: "1 1 250px", minWidth: "250px" }}>
          <Card sx={{ bgcolor: "#fff8e1", boxShadow: 2, cursor: "pointer", "&:hover": { boxShadow: 4 } }} onClick={() => handleCardClick("courses")}>
            <CardContent sx={{ textAlign: "center" }}>
              <SchoolIcon sx={{ fontSize: 40, color: "primary.main", mb: 1 }} />
              <Typography variant="h6" gutterBottom>
                Khóa học
              </Typography>
              <Typography variant="h3" color="primary.main">
                {dashboardStats?.cntCourse || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Khóa học trực tuyến
              </Typography>
            </CardContent>
          </Card>
        </Box>

        <Box sx={{ flex: "1 1 250px", minWidth: "250px" }}>
          <Card sx={{ bgcolor: "#f3e5f5", boxShadow: 2, cursor: "pointer", "&:hover": { boxShadow: 4 } }} onClick={() => handleCardClick("programs")}>
            <CardContent sx={{ textAlign: "center" }}>
              <EventIcon sx={{ fontSize: 40, color: "primary.main", mb: 1 }} />
              <Typography variant="h6" gutterBottom>
                Chương trình
              </Typography>
              <Typography variant="h3" color="primary.main">
                {dashboardStats?.cntProgram || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Chương trình cộng đồng
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Biểu đồ thống kê theo năm - 2 biểu đồ trên cùng 1 hàng */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: "bold", color: "primary.main" }}>
          Thống kê theo năm {selectedYear}
        </Typography>
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Năm</InputLabel>
          <Select value={selectedYear} label="Năm" onChange={(e) => setSelectedYear(Number(e.target.value))}>
            {years.map((year) => (
              <MenuItem key={year} value={year}>
                {year}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3, mb: 4 }}>
        {/* Biểu đồ chương trình theo tháng */}
        <Box sx={{ flex: "2 1 600px", minWidth: "600px" }}>
          <Paper sx={{ p: 3, boxShadow: 2 }}>
            <Typography variant="h6" gutterBottom>
              Thống kê chương trình theo tháng
            </Typography>
            <ResponsiveContainer width="100%" height={400}>
              <ComposedChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                <RechartsTooltip formatter={(value, name) => [value, name === "programs" ? "Số chương trình" : "Số lượt đăng ký"]} labelFormatter={(label) => `Tháng ${label}`} />
                <Legend />
                <Bar yAxisId="left" dataKey="programs" fill="#8884d8" name="Số chương trình" />
                <Line yAxisId="right" type="monotone" dataKey="registrations" stroke="#82ca9d" strokeWidth={3} name="Số lượt đăng ký" />
              </ComposedChart>
            </ResponsiveContainer>
          </Paper>
        </Box>

        {/* Biểu đồ địa điểm tổ chức */}
        <Box sx={{ flex: "1 1 400px", minWidth: "400px" }}>
          <Paper sx={{ p: 3, boxShadow: 2 }}>
            <Typography variant="h6" gutterBottom>
              Địa điểm tổ chức
            </Typography>
            <Box sx={{ height: 400, display: "flex", alignItems: "center", justifyContent: "center" }}>
              {locationStats.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={locationStats.map((item, index) => ({
                        ...item,
                        name: item.location,
                        value: item.count,
                        color: `hsl(${(index * 137.5) % 360}, 70%, 50%)`,
                      }))}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {locationStats.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={`hsl(${(index * 137.5) % 360}, 70%, 50%)`} />
                      ))}
                    </Pie>
                    <RechartsTooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <Box sx={{ textAlign: "center", py: 4 }}>
                  <Box
                    sx={{
                      width: 120,
                      height: 120,
                      borderRadius: "50%",
                      border: "3px dashed #ccc",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mx: "auto",
                      mb: 2,
                    }}
                  >
                    <Typography variant="h4" color="text.disabled">
                      ⚬
                    </Typography>
                  </Box>
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    Chưa có dữ liệu
                  </Typography>
                  <Typography variant="body2" color="text.disabled">
                    Không có chương trình nào được tổ chức trong năm {selectedYear}
                  </Typography>
                </Box>
              )}
            </Box>
          </Paper>
        </Box>
      </Box>

      {/* Bảng khóa học gần đây */}
      <Paper sx={{ p: 3, boxShadow: 2, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Khóa học gần đây
        </Typography>
        {recentCourses.length > 0 ? (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>STT</TableCell>
                  <TableCell>Tên khóa học</TableCell>
                  <TableCell>Mô tả</TableCell>
                  <TableCell>Ngày tạo</TableCell>
                  <TableCell>Trạng thái</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {recentCourses.map((course, index) => (
                  <TableRow key={course.id || index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: "medium" }}>
                        {course.name}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {course.description?.substring(0, 80)}...
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{new Date(course.createDate).toLocaleDateString("vi-VN")}</Typography>
                    </TableCell>
                    <TableCell>
                      <Box
                        sx={{
                          px: 1,
                          py: 0.5,
                          borderRadius: 1,
                          bgcolor: "success.light",
                          color: "success.dark",
                          fontSize: "0.75rem",
                          fontWeight: "medium",
                          display: "inline-block",
                        }}
                      >
                        Hoạt động
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Box sx={{ textAlign: "center", py: 4 }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Chưa có khóa học nào
            </Typography>
            <Typography variant="body2" color="text.disabled">
              Hệ thống chưa có khóa học nào được tạo
            </Typography>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default DashboardPage;
