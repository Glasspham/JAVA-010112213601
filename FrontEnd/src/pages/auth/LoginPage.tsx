import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Avatar,
  Grid,
  Link as MuiLink,
  Alert,
  CircularProgress
} from '@mui/material';
import { LockOutlined } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formErrors, setFormErrors] = useState<{ email?: string; password?: string }>({});
  const { login, isLoading, error } = useAuth();
  const navigate = useNavigate();

  const validateForm = () => {
    const errors: { email?: string; password?: string } = {};
    let isValid = true;

    if (!email) {
      errors.email = 'Email là bắt buộc';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Email không hợp lệ';
      isValid = false;
    }

    if (!password) {
      errors.password = 'Mật khẩu là bắt buộc';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        await login(email, password);
        navigate('/');
      } catch (error) {
        console.error('Login failed:', error);
      }
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper
        elevation={3}
        sx={{
          mt: 8,
          p: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          borderRadius: 2
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
          <LockOutlined />
        </Avatar>
        <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
          Đăng nhập
        </Typography>

        {error && (
          <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, width: '100%' }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={!!formErrors.email}
            helperText={formErrors.email}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Mật khẩu"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={!!formErrors.password}
            helperText={formErrors.password}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2, py: 1.5 }}
            disabled={isLoading}
          >
            {isLoading ? <CircularProgress size={24} /> : 'Đăng nhập'}
          </Button>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            <Box>
              <MuiLink component={Link} to="/forgot-password" variant="body2">
                Quên mật khẩu?
              </MuiLink>
            </Box>
            <Box>
              <MuiLink component={Link} to="/register" variant="body2">
                {"Chưa có tài khoản? Đăng ký"}
              </MuiLink>
            </Box>
          </Box>
        </Box>
      </Paper>

      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <MuiLink component={Link} to="/" variant="body2">
          Quay lại trang chủ
        </MuiLink>
      </Box>
    </Container>
  );
};

export default LoginPage;
