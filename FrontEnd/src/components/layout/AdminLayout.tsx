import React, { useState } from "react";
import { AppBar, Box, CssBaseline, Divider, Drawer, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar, Typography, Avatar, Menu, MenuItem } from "@mui/material";
import { Menu as MenuIcon, Home as HomeIcon, EventNote as EventNoteIcon, Groups as GroupsIcon, Person as PersonIcon, Dashboard as DashboardIcon, Logout as LogoutIcon, People as PeopleIcon, Book as BookIcon, Assignment as SurveyIcon } from "@mui/icons-material";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { AuthService } from "../../services/AuthService";
import { toast } from "react-toastify";
import { UTIL_AWAIT_TIME } from "../../utils/UtilFunction";
import { getAvatarUrl } from "../../utils/imageUtils";

const drawerWidth = 260;

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [userFullname, setUserFullname] = useState<string>("");
  const [userAvatar, setUserAvatar] = useState<string>("");
  const [userRole, setUserRole] = useState<string>("");
  const _authService = new AuthService();

  // Lấy fullname và avatar từ localStorage khi component mount
  React.useEffect(() => {
    const loadUserInfo = async () => {
      try {
        const authenDTO = await _authService.readInfoFromLocal();
        if (authenDTO.userName) {
          const [code, data] = await _authService.findByUsername(authenDTO.userName);
          if (code === 200 && data) {
            setUserFullname(data.fullname || "");
            setUserAvatar(data.avatar || "");
            setUserRole(data.role || "");
          }
        }
      } catch (error) {
        console.error("Error loading user info:", error);
      }
    };

    loadUserInfo();
  }, []);

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
    _authService.deleteInfoFromLocal();
    toast.warning("Đã đăng xuất");
    await UTIL_AWAIT_TIME(1000);
    navigate("/login");
  };

  // Admin menu items
  const allAdminMenuItems = [
    { text: "Dashboard", icon: <DashboardIcon />, path: "/admin/dashboard" },
    { text: "Quản lý người dùng", icon: <PeopleIcon />, path: "/admin/users", adminOnly: true },
    { text: "Quản lý khóa học", icon: <BookIcon />, path: "/admin/courses" },
    { text: "Quản lý khảo sát", icon: <SurveyIcon />, path: "/admin/surveys" },
    { text: "Quản lý lịch hẹn", icon: <EventNoteIcon />, path: "/admin/appointments" },
    { text: "Quản lý chương trình", icon: <GroupsIcon />, path: "/admin/programs" },
    { text: "Quản lý chuyên viên", icon: <PersonIcon />, path: "/admin/consultants", adminOnly: true },
  ];

  // Lọc menu items dựa trên role
  const adminMenuItems = allAdminMenuItems.filter((item) => {
    if (item.adminOnly && userRole === "SPECIALIST") {
      return false;
    }
    return true;
  });

  // Client menu items
  const clientMenuItems = [{ text: "Xem trang chủ", icon: <HomeIcon />, path: "/" }];

  const drawer = (
    <div>
      <Toolbar
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "primary.main",
          color: "white",
          py: 1,
        }}
      >
        <Typography variant="h6" noWrap component="div">
          Admin Dashboard
        </Typography>
      </Toolbar>
      <Divider />
      <Box sx={{ p: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
          <Avatar src={userAvatar ? getAvatarUrl(userAvatar) : undefined} sx={{ bgcolor: "secondary.main", mr: 2 }}>
            {!userAvatar && (userFullname ? userFullname.charAt(0).toUpperCase() : user?.firstName?.charAt(0) || "U")}
          </Avatar>
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
              {userFullname || `${user?.firstName || ""} ${user?.lastName || ""}`.trim() || "User"}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : "User"}
            </Typography>
          </Box>
        </Box>
      </Box>
      <Divider />
      <List>
        {adminMenuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              component={Link}
              to={item.path}
              selected={location.pathname === item.path}
              sx={{
                "&.Mui-selected": {
                  backgroundColor: "primary.light",
                  color: "white",
                  "&:hover": {
                    backgroundColor: "primary.main",
                  },
                  "& .MuiListItemIcon-root": {
                    color: "white",
                  },
                },
              }}
            >
              <ListItemIcon
                sx={{
                  color: location.pathname === item.path ? "white" : "inherit",
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {clientMenuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              component={Link}
              to={item.path}
              sx={{
                "&:hover": {
                  backgroundColor: "rgba(0, 0, 0, 0.04)",
                },
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          bgcolor: "white",
          color: "text.primary",
          boxShadow: 1,
        }}
      >
        <Toolbar>
          <IconButton color="inherit" aria-label="open drawer" edge="start" onClick={handleDrawerToggle} sx={{ mr: 2, display: { sm: "none" } }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            {adminMenuItems.find((item) => item.path === location.pathname)?.text || "Dashboard"}
          </Typography>
          <IconButton size="large" edge="end" aria-label="account of current user" aria-haspopup="true" onClick={handleProfileMenuOpen} color="inherit">
            <Avatar src={userAvatar ? getAvatarUrl(userAvatar) : undefined} sx={{ bgcolor: "primary.main" }}>
              {!userAvatar && (userFullname ? userFullname.charAt(0).toUpperCase() : user?.firstName?.charAt(0) || "U")}
            </Avatar>
          </IconButton>
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleProfileMenuClose} transformOrigin={{ horizontal: "right", vertical: "top" }} anchorOrigin={{ horizontal: "right", vertical: "bottom" }}>
            <MenuItem
              onClick={() => {
                handleProfileMenuClose();
                navigate("/admin/profile");
              }}
            >
              <ListItemIcon>
                <PersonIcon fontSize="small" />
              </ListItemIcon>
              Hồ sơ cá nhân
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <LogoutIcon fontSize="small" />
              </ListItemIcon>
              Đăng xuất
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }} aria-label="mailbox folders">
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          bgcolor: "#f5f5f5",
          minHeight: "100vh",
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
};

export default AdminLayout;
