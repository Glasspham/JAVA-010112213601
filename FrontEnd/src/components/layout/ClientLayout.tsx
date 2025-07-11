import React, { useState } from "react";
import { AppBar, Box, CssBaseline, Toolbar, Typography, Button, Container, IconButton, Avatar, Menu, MenuItem, ListItemIcon, Tabs, Tab, useMediaQuery, Drawer, List, ListItem, ListItemButton, ListItemText, Divider } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Menu as MenuIcon, Home as HomeIcon, School as SchoolIcon, AssessmentOutlined as AssessmentIcon, EventNote as EventNoteIcon, Groups as GroupsIcon, Person as PersonIcon, Logout as LogoutIcon, Dashboard as DashboardIcon, MedicalServices, Psychology as PsychologyIcon } from "@mui/icons-material";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { AuthService } from "../../services/AuthService";
import { UTIL_AWAIT_TIME } from "../../utils/UtilFunction";
import { toast } from "react-toastify";
import { getAvatarUrl } from "../../utils/imageUtils";

interface ClientLayoutProps {
  children: React.ReactNode;
}

const ClientLayout: React.FC<ClientLayoutProps> = ({ children }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [userFullname, setUserFullname] = useState<string>("");
  const [userRole, setUserRole] = useState<string>("");
  const [userAvatar, setUserAvatar] = useState<string>("");
  const _authService = new AuthService();

  // Lấy fullname và avatar từ localStorage khi component mount
  React.useEffect(() => {
    const loadUserInfo = async () => {
      try {
        const authenDTO = await _authService.readInfoFromLocal();
        if (authenDTO.userName) {
          // Lấy role trực tiếp từ localStorage (từ JWT token)
          const roleFromToken = authenDTO.role || "";
          // Loại bỏ prefix ROLE_ nếu có để so sánh
          const cleanRole = roleFromToken.replace("ROLE_", "");
          setUserRole(cleanRole);
          // Gọi API để lấy thông tin chi tiết khác
          const [code, data] = await _authService.findByUsername(authenDTO.userName);
          if (code === 200 && data) {
            setUserFullname(data.fullname || "");
            setUserAvatar(data.avatar || "");
          }
        }
      } catch (error) {
        console.error("Error loading user info:", error);
      }
    };

    if (isAuthenticated) {
      loadUserInfo();
    }
  }, [isAuthenticated]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    console.log("Trong hàm logout ");

    // logout();
    // handleProfileMenuClose();
    // navigate('/');

    _authService.deleteInfoFromLocal();
    toast.warning("Đã đăng xuất");
    await UTIL_AWAIT_TIME(1000);
    navigate("/login");
  };

  const menuItems = [
    { text: "Trang chủ", icon: <HomeIcon />, path: "/" },
    { text: "Khóa học", icon: <SchoolIcon />, path: "/courses" },
    { text: "Chuyên viên", icon: <PsychologyIcon />, path: "/consultants" },
    { text: "Đánh giá nguy cơ", icon: <AssessmentIcon />, path: "/surveys" },
    { text: "Đặt lịch tư vấn", icon: <EventNoteIcon />, path: "/appointments" },
    { text: "Chương trình cộng đồng", icon: <GroupsIcon />, path: "/programs" },
  ];

  const getTabValue = () => {
    const currentPath = location.pathname;
    const index = menuItems.findIndex((item) => currentPath === item.path || (item.path !== "/" && currentPath.startsWith(item.path)));
    return index !== -1 ? index : 0;
  };

  const drawer = (
    <Box sx={{ width: 250 }}>
      <Box sx={{ p: 2, bgcolor: "primary.main", color: "white" }}>
        <Typography variant="h6">Menu</Typography>
      </Box>
      <Divider />
      <List>
        {menuItems.map((item, index) => (
          <ListItem key={index} disablePadding>
            <ListItemButton
              component={Link}
              to={item.path}
              selected={location.pathname === item.path}
              onClick={handleDrawerToggle}
              sx={{
                "&.Mui-selected": {
                  bgcolor: "primary.light",
                  color: "white",
                  "&:hover": {
                    bgcolor: "primary.main",
                  },
                },
              }}
            >
              <ListItemIcon sx={{ color: location.pathname === item.path ? "primary.main" : "inherit" }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <CssBaseline />
      <AppBar position="fixed" color="primary" elevation={1}>
        <Toolbar>
          {isMobile && (
            <IconButton color="inherit" aria-label="open drawer" edge="start" onClick={handleDrawerToggle} sx={{ mr: 2 }}>
              <MenuIcon />
            </IconButton>
          )}
          <MedicalServices sx={{ fontSize: 32, mr: 1 }} />

          {!isMobile && (
            <Tabs
              value={getTabValue()}
              textColor="inherit"
              indicatorColor="secondary"
              sx={{
                flexGrow: 1,
                "& .MuiTab-root": {
                  minWidth: "auto",
                  px: 2,
                  fontWeight: "medium",
                  fontSize: "0.9rem",
                  textTransform: "none",
                },
              }}
            >
              {menuItems.map((item, index) => (
                <Tab key={index} label={item.text} component={Link} to={item.path} icon={item.icon} iconPosition="start" />
              ))}
            </Tabs>
          )}

          {isAuthenticated ? (
            <>
              <IconButton size="large" edge="end" aria-label="account of current user" aria-haspopup="true" onClick={handleProfileMenuOpen} color="inherit">
                <Avatar src={userAvatar ? getAvatarUrl(userAvatar) : undefined} sx={{ bgcolor: "secondary.main", width: 32, height: 32 }}>
                  {!userAvatar && (userFullname ? userFullname.charAt(0).toUpperCase() : user?.firstName?.charAt(0) || "U")}
                </Avatar>
              </IconButton>
              <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleProfileMenuClose} transformOrigin={{ horizontal: "right", vertical: "top" }} anchorOrigin={{ horizontal: "right", vertical: "bottom" }}>
                <MenuItem
                  onClick={() => {
                    handleProfileMenuClose();
                    navigate("/profile");
                  }}
                >
                  <ListItemIcon>
                    <PersonIcon fontSize="small" />
                  </ListItemIcon>
                  Hồ sơ cá nhân
                </MenuItem>
                {(userRole === "ADMIN" || userRole === "SPECIALIST") && (
                  <MenuItem
                    onClick={() => {
                      handleProfileMenuClose();
                      navigate("/admin/dashboard");
                    }}
                  >
                    <ListItemIcon>
                      <DashboardIcon fontSize="small" />
                    </ListItemIcon>
                    Trang quản trị
                  </MenuItem>
                )}
                <MenuItem onClick={handleLogout}>
                  <ListItemIcon>
                    <LogoutIcon fontSize="small" />
                  </ListItemIcon>
                  Đăng xuất
                </MenuItem>
              </Menu>
            </>
          ) : (
            <Box>
              <Button color="inherit" component={Link} to="/login" sx={{ mr: 1 }}>
                Đăng nhập
              </Button>
              <Button
                variant="outlined"
                color="inherit"
                component={Link}
                to="/register"
                sx={{
                  borderColor: "white",
                  "&:hover": { borderColor: "white", bgcolor: "rgba(255,255,255,0.1)" },
                }}
              >
                Đăng ký
              </Button>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: 250 },
        }}
      >
        {drawer}
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, pt: 12, pb: 4 }}>
        <Container maxWidth="xl">{children}</Container>
      </Box>

      <Box
        component="footer"
        sx={{
          py: 3,
          px: 2,
          mt: "auto",
          backgroundColor: theme.palette.grey[100],
          borderTop: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="body2" color="text.secondary" align="center">
            © {new Date().getFullYear()} Hệ thống hỗ trợ phòng ngừa sử dụng ma túy
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default ClientLayout;
