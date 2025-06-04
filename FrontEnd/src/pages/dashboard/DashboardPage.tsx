import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Tab,
  Alert,
  Button,
  IconButton,
  Tooltip,
  Stack
} from '@mui/material';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import {
  Dashboard as DashboardIcon,
  TrendingUp as TrendingUpIcon,
  People as PeopleIcon,
  School as SchoolIcon,
  EventNote as EventNoteIcon,
  Assessment as AssessmentIcon,
  Download as DownloadIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`dashboard-tabpanel-${index}`}
      aria-labelledby={`dashboard-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
};

const a11yProps = (index: number) => {
  return {
    id: `dashboard-tab-${index}`,
    'aria-controls': `dashboard-tabpanel-${index}`,
  };
};

// Dữ liệu mẫu cho biểu đồ
const userActivityData = [
  { name: 'T1', Đăng_ký: 40, Hoạt_động: 24 },
  { name: 'T2', Đăng_ký: 30, Hoạt_động: 13 },
  { name: 'T3', Đăng_ký: 20, Hoạt_động: 8 },
  { name: 'T4', Đăng_ký: 27, Hoạt_động: 15 },
  { name: 'T5', Đăng_ký: 18, Hoạt_động: 12 },
  { name: 'T6', Đăng_ký: 23, Hoạt_động: 18 },
  { name: 'T7', Đăng_ký: 34, Hoạt_động: 24 },
  { name: 'T8', Đăng_ký: 51, Hoạt_động: 40 },
  { name: 'T9', Đăng_ký: 54, Hoạt_động: 45 },
  { name: 'T10', Đăng_ký: 49, Hoạt_động: 38 },
  { name: 'T11', Đăng_ký: 60, Hoạt_động: 52 },
  { name: 'T12', Đăng_ký: 65, Hoạt_động: 58 },
];

const surveyCompletionData = [
  { name: 'Hoàn thành', value: 68, color: '#4caf50' },
  { name: 'Chưa hoàn thành', value: 32, color: '#ff9800' },
];

const riskLevelData = [
  { name: 'Thấp', value: 65, color: '#4caf50' },
  { name: 'Trung bình', value: 25, color: '#ff9800' },
  { name: 'Cao', value: 10, color: '#f44336' },
];

const courseCompletionData = [
  { name: 'Khóa học 1', hoàn_thành: 85 },
  { name: 'Khóa học 2', hoàn_thành: 72 },
  { name: 'Khóa học 3', hoàn_thành: 56 },
  { name: 'Khóa học 4', hoàn_thành: 93 },
  { name: 'Khóa học 5', hoàn_thành: 68 },
  { name: 'Khóa học 6', hoàn_thành: 77 },
];

const programAttendanceData = [
  { name: 'Chương trình 1', đăng_ký: 150, tham_gia: 120 },
  { name: 'Chương trình 2', đăng_ký: 80, tham_gia: 65 },
  { name: 'Chương trình 3', đăng_ký: 30, tham_gia: 25 },
  { name: 'Chương trình 4', đăng_ký: 20, tham_gia: 18 },
];

const consultantPerformanceData = [
  { name: 'Minh Nguyễn', đánh_giá: 4.8, buổi_tư_vấn: 45 },
  { name: 'Hương Trần', đánh_giá: 4.9, buổi_tư_vấn: 37 },
  { name: 'Tuấn Phạm', đánh_giá: 4.7, buổi_tư_vấn: 52 },
  { name: 'Linh Đỗ', đánh_giá: 4.6, buổi_tư_vấn: 29 },
];

const DashboardPage: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [timeRange, setTimeRange] = useState('year');
  const { user } = useAuth();

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleTimeRangeChange = (event: SelectChangeEvent) => {
    setTimeRange(event.target.value);
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          Báo cáo & Thống kê
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Tổng quan về hoạt động và hiệu quả của hệ thống phòng ngừa sử dụng ma túy
        </Typography>
      </Box>

      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel id="time-range-label">Khoảng thời gian</InputLabel>
          <Select
            labelId="time-range-label"
            value={timeRange}
            label="Khoảng thời gian"
            onChange={handleTimeRangeChange}
          >
            <MenuItem value="week">7 ngày qua</MenuItem>
            <MenuItem value="month">30 ngày qua</MenuItem>
            <MenuItem value="quarter">Quý này</MenuItem>
            <MenuItem value="year">Năm nay</MenuItem>
          </Select>
        </FormControl>

        <Box>
          <Tooltip title="Tải xuống báo cáo">
            <IconButton color="primary" sx={{ mr: 1 }}>
              <DownloadIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Làm mới dữ liệu">
            <IconButton color="primary">
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      <Box sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="dashboard tabs"
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab icon={<DashboardIcon />} label="Tổng quan" {...a11yProps(0)} />
            <Tab icon={<PeopleIcon />} label="Người dùng" {...a11yProps(1)} />
            <Tab icon={<SchoolIcon />} label="Khóa học" {...a11yProps(2)} />
            <Tab icon={<AssessmentIcon />} label="Khảo sát" {...a11yProps(3)} />
            <Tab icon={<EventNoteIcon />} label="Tư vấn" {...a11yProps(4)} />
            <Tab icon={<TrendingUpIcon />} label="Chương trình" {...a11yProps(5)} />
          </Tabs>
        </Box>

        {/* Tab Tổng quan */}
        <TabPanel value={tabValue} index={0}>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(4, 1fr)' }, gap: 3, mb: 4 }}>
            <Card sx={{ bgcolor: '#e8f5e9', boxShadow: 2 }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h6" gutterBottom>Tổng người dùng</Typography>
                <Typography variant="h3" color="primary.main">421</Typography>
                <Typography variant="body2" color="text.secondary">Tăng 12% so với tháng trước</Typography>
              </CardContent>
            </Card>

            <Card sx={{ bgcolor: '#e3f2fd', boxShadow: 2 }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h6" gutterBottom>Khóa học đã hoàn thành</Typography>
                <Typography variant="h3" color="primary.main">256</Typography>
                <Typography variant="body2" color="text.secondary">Tăng 8% so với tháng trước</Typography>
              </CardContent>
            </Card>

            <Card sx={{ bgcolor: '#fff8e1', boxShadow: 2 }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h6" gutterBottom>Khảo sát đã thực hiện</Typography>
                <Typography variant="h3" color="primary.main">189</Typography>
                <Typography variant="body2" color="text.secondary">Tăng 15% so với tháng trước</Typography>
              </CardContent>
            </Card>

            <Card sx={{ bgcolor: '#f3e5f5', boxShadow: 2 }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h6" gutterBottom>Buổi tư vấn đã hoàn thành</Typography>
                <Typography variant="h3" color="primary.main">163</Typography>
                <Typography variant="body2" color="text.secondary">Tăng 5% so với tháng trước</Typography>
              </CardContent>
            </Card>
          </Box>

          <Box sx={{ flexGrow: 1 }}>
            <Stack direction="row" spacing={3} sx={{ mb: 3 }}>
              <Box sx={{ width: '66.67%' }}>
                <Paper sx={{ p: 2, boxShadow: 2 }}>
                  <Typography variant="h6" gutterBottom>Hoạt động người dùng theo tháng</Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart
                      data={userActivityData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <RechartsTooltip />
                      <Legend />
                      <Line type="monotone" dataKey="Đăng_ký" stroke="#8884d8" activeDot={{ r: 8 }} />
                      <Line type="monotone" dataKey="Hoạt_động" stroke="#82ca9d" />
                    </LineChart>
                  </ResponsiveContainer>
                </Paper>
              </Box>

              <Box sx={{ width: '33.33%' }}>
                <Paper sx={{ p: 2, boxShadow: 2 }}>
                  <Typography variant="h6" gutterBottom>Phân bố mức độ nguy cơ</Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={riskLevelData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {riskLevelData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <RechartsTooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </Paper>
              </Box>
            </Stack>
          </Box>
        </TabPanel>

        {/* Tab Người dùng */}
        <TabPanel value={tabValue} index={1}>
          <Box sx={{ flexGrow: 1 }}>
            <Stack direction="row" spacing={3} sx={{ mb: 3 }}>
              <Box sx={{ width: '50%' }}>
                <Paper sx={{ p: 2, boxShadow: 2 }}>
                  <Typography variant="h6" gutterBottom>Phân bố người dùng theo vai trò</Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                      data={[
                        { name: 'Khách', số_lượng: 150 },
                        { name: 'Thành viên', số_lượng: 200 },
                        { name: 'Nhân viên', số_lượng: 35 },
                        { name: 'Chuyên viên', số_lượng: 25 },
                        { name: 'Quản lý', số_lượng: 8 },
                        { name: 'Admin', số_lượng: 3 },
                      ]}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <RechartsTooltip />
                      <Bar dataKey="số_lượng" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </Paper>
              </Box>

              <Box sx={{ width: '50%' }}>
                <Paper sx={{ p: 2, boxShadow: 2 }}>
                  <Typography variant="h6" gutterBottom>Người dùng mới theo tháng</Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart
                      data={userActivityData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <RechartsTooltip />
                      <Line type="monotone" dataKey="Đăng_ký" stroke="#8884d8" activeDot={{ r: 8 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </Paper>
              </Box>
            </Stack>

            <Box sx={{ width: '100%', mt: 3 }}>
              <Paper sx={{ p: 2, boxShadow: 2 }}>
                <Typography variant="h6" gutterBottom>Người dùng hoạt động tích cực</Typography>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Tên người dùng</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Vai trò</TableCell>
                        <TableCell>Khóa học hoàn thành</TableCell>
                        <TableCell>Khảo sát tham gia</TableCell>
                        <TableCell>Chương trình tham gia</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell>Nguyễn Văn A</TableCell>
                        <TableCell>nguyenvana@example.com</TableCell>
                        <TableCell>Thành viên</TableCell>
                        <TableCell>5</TableCell>
                        <TableCell>3</TableCell>
                        <TableCell>2</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Trần Thị B</TableCell>
                        <TableCell>tranthib@example.com</TableCell>
                        <TableCell>Thành viên</TableCell>
                        <TableCell>4</TableCell>
                        <TableCell>2</TableCell>
                        <TableCell>3</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Lê Văn C</TableCell>
                        <TableCell>levanc@example.com</TableCell>
                        <TableCell>Thành viên</TableCell>
                        <TableCell>6</TableCell>
                        <TableCell>4</TableCell>
                        <TableCell>1</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </Box>
          </Box>
        </TabPanel>

        {/* Tab Khóa học */}
        <TabPanel value={tabValue} index={2}>
          <Box sx={{ flexGrow: 1 }}>
            <Stack direction="row" spacing={3} sx={{ mb: 3 }}>
              <Box sx={{ width: '66.67%' }}>
                <Paper sx={{ p: 2, boxShadow: 2 }}>
                  <Typography variant="h6" gutterBottom>Tỷ lệ hoàn thành khóa học</Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                      data={courseCompletionData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <RechartsTooltip />
                      <Bar dataKey="hoàn_thành" fill="#4caf50" name="Tỷ lệ hoàn thành (%)" />
                    </BarChart>
                  </ResponsiveContainer>
                </Paper>
              </Box>

              <Box sx={{ width: '33.33%' }}>
                <Paper sx={{ p: 2, boxShadow: 2 }}>
                  <Typography variant="h6" gutterBottom>Phân bố đối tượng học viên</Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Học sinh', value: 45, color: '#4caf50' },
                          { name: 'Phụ huynh', value: 25, color: '#2196f3' },
                          { name: 'Giáo viên', value: 15, color: '#ff9800' },
                          { name: 'Đối tượng khác', value: 15, color: '#9c27b0' },
                        ]}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {riskLevelData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <RechartsTooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </Paper>
              </Box>
            </Stack>

            <Box sx={{ width: '100%', mt: 3 }}>
              <Paper sx={{ p: 2, boxShadow: 2 }}>
                <Typography variant="h6" gutterBottom>Khóa học phổ biến</Typography>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Tên khóa học</TableCell>
                        <TableCell>Đối tượng</TableCell>
                        <TableCell>Số người đăng ký</TableCell>
                        <TableCell>Tỷ lệ hoàn thành</TableCell>
                        <TableCell>Đánh giá trung bình</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell>Nhận thức về ma túy cho học sinh</TableCell>
                        <TableCell>Học sinh</TableCell>
                        <TableCell>245</TableCell>
                        <TableCell>85%</TableCell>
                        <TableCell>4.7/5</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Kỹ năng từ chối ma túy</TableCell>
                        <TableCell>Học sinh, Đại chúng</TableCell>
                        <TableCell>189</TableCell>
                        <TableCell>72%</TableCell>
                        <TableCell>4.5/5</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Hướng dẫn phụ huynh về phòng ngừa ma túy</TableCell>
                        <TableCell>Phụ huynh</TableCell>
                        <TableCell>156</TableCell>
                        <TableCell>68%</TableCell>
                        <TableCell>4.8/5</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </Box>
          </Box>
        </TabPanel>

        {/* Tab Khảo sát */}
        <TabPanel value={tabValue} index={3}>
          <Box sx={{ flexGrow: 1 }}>
            <Stack direction="row" spacing={3} sx={{ mb: 3 }}>
              <Box sx={{ width: '50%' }}>
                <Paper sx={{ p: 2, boxShadow: 2 }}>
                  <Typography variant="h6" gutterBottom>Tỷ lệ hoàn thành khảo sát</Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={surveyCompletionData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {surveyCompletionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <RechartsTooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </Paper>
              </Box>

              <Box sx={{ width: '50%' }}>
                <Paper sx={{ p: 2, boxShadow: 2 }}>
                  <Typography variant="h6" gutterBottom>Phân bố mức độ nguy cơ</Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={riskLevelData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {riskLevelData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <RechartsTooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </Paper>
              </Box>
            </Stack>

            <Box sx={{ width: '100%', mt: 3 }}>
              <Paper sx={{ p: 2, boxShadow: 2 }}>
                <Typography variant="h6" gutterBottom>Kết quả khảo sát theo khu vực</Typography>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Khu vực</TableCell>
                        <TableCell>Số lượng khảo sát</TableCell>
                        <TableCell>Nguy cơ thấp</TableCell>
                        <TableCell>Nguy cơ trung bình</TableCell>
                        <TableCell>Nguy cơ cao</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell>Quận 1</TableCell>
                        <TableCell>45</TableCell>
                        <TableCell>65%</TableCell>
                        <TableCell>25%</TableCell>
                        <TableCell>10%</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Quận 5</TableCell>
                        <TableCell>38</TableCell>
                        <TableCell>58%</TableCell>
                        <TableCell>32%</TableCell>
                        <TableCell>10%</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Quận 7</TableCell>
                        <TableCell>42</TableCell>
                        <TableCell>70%</TableCell>
                        <TableCell>20%</TableCell>
                        <TableCell>10%</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </Box>
          </Box>
        </TabPanel>

        {/* Tab Tư vấn */}
        <TabPanel value={tabValue} index={4}>
          <Box sx={{ flexGrow: 1 }}>
            <Stack direction="row" spacing={3} sx={{ mb: 3 }}>
              <Box sx={{ width: '50%' }}>
                <Paper sx={{ p: 2, boxShadow: 2 }}>
                  <Typography variant="h6" gutterBottom>Hiệu suất chuyên viên tư vấn</Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                      data={consultantPerformanceData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                      <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                      <RechartsTooltip />
                      <Legend />
                      <Bar yAxisId="left" dataKey="đánh_giá" fill="#8884d8" name="Đánh giá (5 sao)" />
                      <Bar yAxisId="right" dataKey="buổi_tư_vấn" fill="#82ca9d" name="Số buổi tư vấn" />
                    </BarChart>
                  </ResponsiveContainer>
                </Paper>
              </Box>

              <Box sx={{ width: '50%' }}>
                <Paper sx={{ p: 2, boxShadow: 2 }}>
                  <Typography variant="h6" gutterBottom>Lịch hẹn theo tháng</Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart
                      data={[
                        { name: 'T1', lịch_hẹn: 12 },
                        { name: 'T2', lịch_hẹn: 15 },
                        { name: 'T3', lịch_hẹn: 18 },
                        { name: 'T4', lịch_hẹn: 14 },
                        { name: 'T5', lịch_hẹn: 16 },
                        { name: 'T6', lịch_hẹn: 20 },
                        { name: 'T7', lịch_hẹn: 22 },
                        { name: 'T8', lịch_hẹn: 18 },
                        { name: 'T9', lịch_hẹn: 24 },
                        { name: 'T10', lịch_hẹn: 28 },
                        { name: 'T11', lịch_hẹn: 30 },
                        { name: 'T12', lịch_hẹn: 25 },
                      ]}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <RechartsTooltip />
                      <Line type="monotone" dataKey="lịch_hẹn" stroke="#8884d8" activeDot={{ r: 8 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </Paper>
              </Box>
            </Stack>

            <Box sx={{ width: '100%', mt: 3 }}>
              <Paper sx={{ p: 2, boxShadow: 2 }}>
                <Typography variant="h6" gutterBottom>Lịch hẹn gần đây</Typography>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Người dùng</TableCell>
                        <TableCell>Chuyên viên</TableCell>
                        <TableCell>Ngày</TableCell>
                        <TableCell>Thời gian</TableCell>
                        <TableCell>Trạng thái</TableCell>
                        <TableCell>Đánh giá</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell>Nguyễn Văn A</TableCell>
                        <TableCell>Minh Nguyễn</TableCell>
                        <TableCell>15/05/2023</TableCell>
                        <TableCell>09:00 - 10:00</TableCell>
                        <TableCell>Đã hoàn thành</TableCell>
                        <TableCell>5/5</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Trần Thị B</TableCell>
                        <TableCell>Hương Trần</TableCell>
                        <TableCell>16/05/2023</TableCell>
                        <TableCell>14:00 - 15:00</TableCell>
                        <TableCell>Đã hoàn thành</TableCell>
                        <TableCell>4/5</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Lê Văn C</TableCell>
                        <TableCell>Tuấn Phạm</TableCell>
                        <TableCell>18/05/2023</TableCell>
                        <TableCell>10:00 - 11:00</TableCell>
                        <TableCell>Đã hủy</TableCell>
                        <TableCell>-</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </Box>
          </Box>
        </TabPanel>

        {/* Tab Chương trình */}
        <TabPanel value={tabValue} index={5}>
          <Box sx={{ flexGrow: 1 }}>
            <Stack direction="row" spacing={3} sx={{ mb: 3 }}>
              <Box sx={{ width: '66.67%' }}>
                <Paper sx={{ p: 2, boxShadow: 2 }}>
                  <Typography variant="h6" gutterBottom>Tỷ lệ tham gia chương trình</Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                      data={programAttendanceData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <RechartsTooltip />
                      <Legend />
                      <Bar dataKey="đăng_ký" fill="#8884d8" name="Số người đăng ký" />
                      <Bar dataKey="tham_gia" fill="#82ca9d" name="Số người tham gia" />
                    </BarChart>
                  </ResponsiveContainer>
                </Paper>
              </Box>

              <Box sx={{ width: '33.33%' }}>
                <Paper sx={{ p: 2, boxShadow: 2 }}>
                  <Typography variant="h6" gutterBottom>Phân bố địa điểm tổ chức</Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Quận 1', value: 35, color: '#4caf50' },
                          { name: 'Quận 5', value: 25, color: '#2196f3' },
                          { name: 'Quận 7', value: 15, color: '#ff9800' },
                          { name: 'Quận khác', value: 25, color: '#9c27b0' },
                        ]}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {riskLevelData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <RechartsTooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </Paper>
              </Box>
            </Stack>

            <Box sx={{ width: '100%', mt: 3 }}>
              <Paper sx={{ p: 2, boxShadow: 2 }}>
                <Typography variant="h6" gutterBottom>Chương trình sắp tới</Typography>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Tên chương trình</TableCell>
                        <TableCell>Địa điểm</TableCell>
                        <TableCell>Ngày</TableCell>
                        <TableCell>Sức chứa</TableCell>
                        <TableCell>Đã đăng ký</TableCell>
                        <TableCell>Tỷ lệ đăng ký</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell>Ngày hội phòng chống ma túy</TableCell>
                        <TableCell>Trung tâm Văn hóa Thanh niên, Q1</TableCell>
                        <TableCell>26/06/2023</TableCell>
                        <TableCell>200</TableCell>
                        <TableCell>150</TableCell>
                        <TableCell>75%</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Hội thảo kỹ năng sống cho học sinh</TableCell>
                        <TableCell>Trường THPT Nguyễn Du, Q5</TableCell>
                        <TableCell>15/07/2023</TableCell>
                        <TableCell>100</TableCell>
                        <TableCell>80</TableCell>
                        <TableCell>80%</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Tọa đàm "Gia đình và phòng chống ma túy"</TableCell>
                        <TableCell>Hội trường Thành Đoàn, Q1</TableCell>
                        <TableCell>05/08/2023</TableCell>
                        <TableCell>150</TableCell>
                        <TableCell>30</TableCell>
                        <TableCell>20%</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </Box>
          </Box>
        </TabPanel>
      </Box>
    </Container>
  );
};

export default DashboardPage;
