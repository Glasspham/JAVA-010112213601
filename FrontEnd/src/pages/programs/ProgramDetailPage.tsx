import React, { useState, useEffect } from "react";
import { Container, Typography, Box, Card, CardContent, CardMedia, Button, Divider, List, ListItem, ListItemIcon, ListItemText, Chip, Alert, Dialog, DialogTitle, DialogContent, DialogActions, LinearProgress } from "@mui/material";
import { ArrowBack as ArrowBackIcon, CalendarMonth as CalendarMonthIcon, LocationOn as LocationOnIcon, People as PeopleIcon, AccessTime as AccessTimeIcon, EventAvailable as EventAvailableIcon } from "@mui/icons-material";
import { useParams, Link, useNavigate } from "react-router-dom";
import { CommunityProgram } from "../../types/program";
import { ProgramService } from "../../services/ProgramService";
import { useAuth } from "../../contexts/AuthContext";
import "../../styles/ProgramCard.css";
import { toast } from "react-toastify";
import { getImageUrl, handleImageError } from "../../utils/imageUtils";

const ProgramDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [program, setProgram] = useState<CommunityProgram | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingProgram, setLoadingProgram] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [checkingRegistration, setCheckingRegistration] = useState(false);
  const [dialogLoading, setDialogLoading] = useState(false);
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const programService = new ProgramService();
  // Helper function to map API response to CommunityProgram
  const mapApiResponseToCommunityProgram = (apiData: any): CommunityProgram => {
    let startDate: Date;
    try {
      const dateStr = apiData.date || new Date().toISOString().split("T")[0];
      const timeStr = apiData.time || "00:00:00";

      const [year, month, day] = dateStr.split("-").map(Number);
      const [hour, minute] = timeStr.split(":").map(Number);

      startDate = new Date(year, month - 1, day, hour, minute);

      if (isNaN(startDate.getTime())) {
        startDate = new Date();
      }
    } catch (error) {
      startDate = new Date();
    }

    return {
      id: apiData.id.toString(),
      title: apiData.title,
      description: apiData.description || "",
      location: apiData.address,
      startDate: startDate,
      endDate: new Date(startDate.getTime() + 2 * 60 * 60 * 1000), // Default 2 hours duration
      capacity: apiData.capacity,
      registeredCount: apiData.users ? apiData.users.length : 0,
      image: apiData.image ? getImageUrl(apiData.image) : getImageUrl(""),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  };

  useEffect(() => {
    const fetchProgram = async () => {
      if (!id) {
        setError("ID chương trình không hợp lệ");
        setLoadingProgram(false);
        return;
      }

      try {
        const [code, data, message] = await programService.findById(parseInt(id));
        if (code === 200 && data) {
          const mappedProgram = mapApiResponseToCommunityProgram(data);
          setProgram(mappedProgram);
        } else {
          setError(message || "Không tìm thấy chương trình");
        }
      } catch (error) {
        console.error("Error fetching program:", error);
        setError("Đã xảy ra lỗi khi tải thông tin chương trình");
      } finally {
        setLoadingProgram(false);
      }
    };

    fetchProgram();
  }, [id]);

  // Check if user is registered for this program
  useEffect(() => {
    const checkRegistrationStatus = async () => {
      if (!id || !isAuthenticated) return;

      const username = localStorage.getItem("USERNAME");
      if (!username) return;

      try {
        setCheckingRegistration(true);
        const [code, data] = await programService.isUserRegistered(username, parseInt(id));
        if (code === 200) {
          setIsRegistered(data === true);
        }
      } catch (error) {
        console.error("Error checking registration status:", error);
      } finally {
        setCheckingRegistration(false);
      }
    };

    checkRegistrationStatus();
  }, [id, isAuthenticated]);

  const handleOpenDialog = () => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: `/programs/${id}` } });
      return;
    }

    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleRegister = async () => {
    if (!id) return;

    const username = localStorage.getItem("USERNAME");
    const token = localStorage.getItem("TOKEN");

    if (!username || !token) {
      toast.error("Vui lòng đăng nhập để đăng ký chương trình");
      navigate("/login");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${process.env.REACT_APP_API_URL}/programs/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          username: username,
          programId: parseInt(id),
        }),
      });

      const result = await response.json();

      if (result.code === 200) {
        setRegistrationSuccess(true);
        toast.success("Đăng ký chương trình thành công!");

        // Cập nhật UI
        setIsRegistered(true);
        if (program) {
          setProgram({
            ...program,
            registeredCount: program.registeredCount + 1,
          });
        }

        // Đóng dialog sau 2 giây
        setTimeout(() => {
          setOpenDialog(false);
          setRegistrationSuccess(false);
        }, 2000);
      } else {
        if (result.code === 401) {
          toast.error("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại");
          navigate("/login");
        } else if (result.code === 400 && result.message.includes("full")) {
          toast.error("Chương trình đã đủ số lượng đăng ký");
        } else {
          toast.error(result.message || "Có lỗi xảy ra khi đăng ký chương trình");
        }
      }
    } catch (error: any) {
      console.error("Error registering for program:", error);
      const errorMessage = error.response?.data?.message || "Có lỗi xảy ra khi đăng ký chương trình";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const isProgramPast = program ? new Date(program.endDate) < new Date() : false;
  const isProgramFull = program ? program.registeredCount >= program.capacity : false;

  if (loadingProgram) {
    return (
      <Container>
        <Box sx={{ py: 4, textAlign: "center" }}>
          <Typography>Đang tải thông tin chương trình...</Typography>
          <LinearProgress sx={{ mt: 2 }} />
        </Box>
      </Container>
    );
  }

  if (error || !program) {
    return (
      <Container>
        <Box sx={{ py: 4, textAlign: "center" }}>
          <Typography color="error">{error || "Không tìm thấy chương trình"}</Typography>
          <Button component={Link} to="/programs" startIcon={<ArrowBackIcon />} sx={{ mt: 2 }}>
            Quay lại danh sách chương trình
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container>
      <Button component={Link} to="/programs" startIcon={<ArrowBackIcon />} sx={{ mb: 3 }}>
        Quay lại danh sách chương trình
      </Button>

      <Card sx={{ borderRadius: 2, overflow: "hidden", mb: 4 }}>
        <CardMedia component="img" height="300" image={program.image} alt={program.title} sx={{ objectFit: "cover" }} onError={handleImageError}/>
        <CardContent>
          <Typography variant="h4" component="h1" gutterBottom>
            {program.title}
          </Typography>

          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 3 }}>
            <Chip
              icon={<CalendarMonthIcon />}
              label={new Date(program.startDate).toLocaleDateString("vi-VN", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
              color="primary"
              variant="outlined"
            />
            <Chip icon={<LocationOnIcon />} label={program.location} color="primary" variant="outlined" />
            <Chip icon={<PeopleIcon />} label={`${program.registeredCount}/${program.capacity} người đã đăng ký`} color="primary" variant="outlined" />
            {isProgramPast ? <Chip label="Đã kết thúc" color="default" /> : isProgramFull ? <Chip label="Đã đủ số lượng" color="error" /> : <Chip label="Còn nhận đăng ký" color="success" />}
            {isAuthenticated && (checkingRegistration ? <Chip label="Đang kiểm tra..." color="default" variant="outlined" /> : isRegistered ? <Chip label="Đã đăng ký" color="success" /> : <Chip label="Chưa đăng ký" color="warning" variant="outlined" />)}
          </Box>

          {program.description && (
            <>
              <Typography variant="h5" gutterBottom>
                Mô tả chương trình
              </Typography>
              <Typography variant="body1" paragraph>
                {program.description}
              </Typography>
            </>
          )}

          <Divider sx={{ my: 3 }} />

          <Typography variant="h5" gutterBottom>
            Thông tin chi tiết
          </Typography>
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 3 }}>
            <Box>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <CalendarMonthIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText primary="Thời gian" secondary={`${new Date(program.startDate).toLocaleDateString("vi-VN")} - ${new Date(program.endDate).toLocaleDateString("vi-VN")}`} />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <AccessTimeIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Giờ bắt đầu"
                    secondary={new Date(program.startDate).toLocaleTimeString("vi-VN", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <LocationOnIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText primary="Địa điểm" secondary={program.location} />
                </ListItem>
              </List>
            </Box>
            <Box>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <PeopleIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText primary="Số lượng người tham gia" secondary={`${program.registeredCount}/${program.capacity} người đã đăng ký`} />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <EventAvailableIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText primary="Đăng ký" secondary={isProgramPast ? "Đã kết thúc" : isProgramFull ? "Đã đủ số lượng" : "Còn nhận đăng ký"} />
                </ListItem>
              </List>
            </Box>
          </Box>

          <Divider sx={{ my: 3 }} />

          <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
            {checkingRegistration ? (
              <Button variant="outlined" size="large" disabled sx={{ px: 4, py: 1.5 }}>
                Đang kiểm tra...
              </Button>
            ) : isRegistered ? (
              <Button variant="outlined" size="large" color="success" disabled sx={{ px: 4, py: 1.5 }}>
                Đã đăng ký
              </Button>
            ) : (
              <Button variant="contained" size="large" startIcon={<EventAvailableIcon />} onClick={handleOpenDialog} disabled={isProgramPast || isProgramFull || !isAuthenticated} className="detail-button" sx={{ px: 4, py: 1.5 }}>
                {!isAuthenticated ? "Đăng nhập để đăng ký" : isProgramPast ? "Chương trình đã kết thúc" : isProgramFull ? "Đã đủ số lượng" : "Đăng ký tham gia"}
              </Button>
            )}

            <Button variant="outlined" size="large" component={Link} to="/my-registered-programs" sx={{ px: 4, py: 1.5 }}>
              Chương trình đã đăng ký
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Dialog xác nhận đăng ký */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Xác nhận đăng ký tham gia chương trình</DialogTitle>
        <DialogContent>
          {registrationSuccess ? (
            <Alert severity="success" sx={{ my: 2 }}>
              Đăng ký tham gia thành công!
            </Alert>
          ) : (
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6" gutterBottom>
                {program.title}
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body1" gutterBottom>
                  <CalendarMonthIcon sx={{ mr: 1, verticalAlign: "middle" }} />
                  {new Date(program.startDate).toLocaleDateString("vi-VN", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  <LocationOnIcon sx={{ mr: 1, verticalAlign: "middle" }} />
                  {program.location}
                </Typography>
                <Typography variant="body1">
                  <PeopleIcon sx={{ mr: 1, verticalAlign: "middle" }} />
                  {program.registeredCount}/{program.capacity} người đã đăng ký
                </Typography>
              </Box>

              <Alert severity="info" sx={{ mt: 2 }}>
                <Typography variant="body2">
                  Bạn sẽ đăng ký tham gia với tài khoản: <strong>{user?.email}</strong>
                </Typography>
              </Alert>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} disabled={loading}>
            Hủy
          </Button>
          <Button variant="contained" onClick={handleRegister} disabled={loading || registrationSuccess} className="detail-button">
            {loading ? "Đang đăng ký..." : "Xác nhận đăng ký"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ProgramDetailPage;
