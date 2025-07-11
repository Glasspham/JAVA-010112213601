import React, { useState } from "react";
import { Container, Box, Typography, TextField, Button, Paper, Avatar, Link as MuiLink, CircularProgress } from "@mui/material";
import { PersonAddOutlined } from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import { AuthService } from "../../services/AuthService";
import { toast } from "react-toastify";

const RegisterPage: React.FC = () => {
  const [username, setUsername] = useState("");
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [formErrors, setFormErrors] = useState<{
    username?: string;
    fullname?: string;
    email?: string;
    phone?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  const authService = new AuthService();
  const navigate = useNavigate();

  const validateForm = () => {
    const errors: {
      username?: string;
      fullname?: string;
      email?: string;
      phone?: string;
      password?: string;
      confirmPassword?: string;
    } = {};
    let isValid = true;

    if (!username) {
      errors.username = "Tên đăng nhập là bắt buộc";
      isValid = false;
    }

    if (!fullname) {
      errors.fullname = "Họ tên là bắt buộc";
      isValid = false;
    }

    if (!email) {
      errors.email = "Email là bắt buộc";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = "Email không hợp lệ";
      isValid = false;
    }

    if (!phone) {
      errors.phone = "Số điện thoại là bắt buộc";
      isValid = false;
    } else if (!/^[0-9]{10,11}$/.test(phone)) {
      errors.phone = "Số điện thoại không hợp lệ";
      isValid = false;
    }

    if (!password) {
      errors.password = "Mật khẩu là bắt buộc";
      isValid = false;
    } else if (password.length < 6) {
      errors.password = "Mật khẩu phải có ít nhất 6 ký tự";
      isValid = false;
    }

    if (!confirmPassword) {
      errors.confirmPassword = "Xác nhận mật khẩu là bắt buộc";
      isValid = false;
    } else if (confirmPassword !== password) {
      errors.confirmPassword = "Mật khẩu không khớp";
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      setIsLoading(true);
      try {
        const registerData = {
          username,
          fullname,
          password,
          phone,
          email,
        };

        const [code, data, message] = await authService.register(registerData);

        if (code === 200) {
          toast.success("Đăng ký tài khoản thành công!");
          setTimeout(() => {
            navigate("/login");
          }, 750);
        } else {
          toast.error(message || "Đăng ký thất bại");
        }
      } catch (error: any) {
        console.error("Registration failed:", error);
        toast.error(error.response?.data?.message || "Đăng ký thất bại");
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <Container component="main" maxWidth="sm">
      <Paper
        elevation={3}
        sx={{
          mt: 8,
          p: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          borderRadius: 2,
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "primary.main" }}>
          <PersonAddOutlined />
        </Avatar>
        <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
          Đăng ký tài khoản
        </Typography>

        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, width: "100%" }}>
          <Box sx={{ mb: 2 }}>
            <TextField autoComplete="username" name="username" required fullWidth id="username" label="Tên đăng nhập" autoFocus value={username} onChange={(e) => setUsername(e.target.value)} error={!!formErrors.username} helperText={formErrors.username} />
          </Box>
          <Box sx={{ mb: 2 }}>
            <TextField required fullWidth id="fullname" label="Họ và tên" name="fullname" autoComplete="name" value={fullname} onChange={(e) => setFullname(e.target.value)} error={!!formErrors.fullname} helperText={formErrors.fullname} />
          </Box>
          <Box sx={{ mb: 2 }}>
            <TextField required fullWidth id="email" label="Email" name="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} error={!!formErrors.email} helperText={formErrors.email} />
          </Box>
          <Box sx={{ mb: 2 }}>
            <TextField required fullWidth id="phone" label="Số điện thoại" name="phone" autoComplete="tel" value={phone} onChange={(e) => setPhone(e.target.value)} error={!!formErrors.phone} helperText={formErrors.phone} />
          </Box>
          <Box sx={{ mb: 2 }}>
            <TextField required fullWidth name="password" label="Mật khẩu" type="password" id="password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} error={!!formErrors.password} helperText={formErrors.password} />
          </Box>
          <Box sx={{ mb: 2 }}>
            <TextField required fullWidth name="confirmPassword" label="Xác nhận mật khẩu" type="password" id="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} error={!!formErrors.confirmPassword} helperText={formErrors.confirmPassword} />
          </Box>
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2, py: 1.5 }} disabled={isLoading}>
            {isLoading ? <CircularProgress size={24} /> : "Đăng ký"}
          </Button>
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <MuiLink component={Link} to="/login" variant="body2">
              Đã có tài khoản? Đăng nhập
            </MuiLink>
          </Box>
        </Box>
      </Paper>

      <Box sx={{ mt: 4, textAlign: "center" }}>
        <MuiLink component={Link} to="/" variant="body2">
          Quay lại trang chủ
        </MuiLink>
      </Box>
    </Container>
  );
};

export default RegisterPage;
