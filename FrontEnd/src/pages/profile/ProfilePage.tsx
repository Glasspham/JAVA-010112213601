import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
  Divider,
  Chip,
  Paper,
  CircularProgress,
  Alert,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton
} from '@mui/material';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Work as WorkIcon,
  CalendarToday as CalendarIcon,
  Badge as BadgeIcon,
  Edit as EditIcon,
  PhotoCamera as PhotoCameraIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Lock as LockIcon
} from '@mui/icons-material';
import { AuthService } from '../../services/AuthService';
import { FileService } from '../../services/FileService';
import { UserProfileDTO } from '../../dto/UserProfileDTO';
import { UpdateProfileDTO } from '../../dto/UpdateProfileDTO';
import { UpdatePasswordDTO } from '../../dto/UpdatePasswordDTO';
import { toast } from 'react-toastify';

const ProfilePage: React.FC = () => {
  const [userProfile, setUserProfile] = useState<UserProfileDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [editForm, setEditForm] = useState({
    fullname: '',
    email: '',
    phone: '',
    position: '',
    majors: [] as string[],
    newMajor: ''
  });
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const authService = new AuthService();
  const fileService = new FileService();

  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Lấy username từ localStorage
        const authenDTO = await authService.readInfoFromLocal();
        
        if (!authenDTO.userName) {
          setError('Không tìm thấy thông tin người dùng');
          return;
        }

        const [code, data, message] = await authService.findByUsername(authenDTO.userName);
        
        if (code === 200 && data) {
          setUserProfile(data);
        } else {
          setError(message || 'Không thể tải thông tin hồ sơ');
          toast.error(message || 'Không thể tải thông tin hồ sơ');
        }
      } catch (error: any) {
        console.error('Error loading user profile:', error);
        setError('Có lỗi xảy ra khi tải thông tin hồ sơ');
        toast.error('Có lỗi xảy ra khi tải thông tin hồ sơ');
      } finally {
        setIsLoading(false);
      }
    };

    loadUserProfile();
  }, []);

  const handleEditClick = () => {
    if (userProfile) {
      setEditForm({
        fullname: userProfile.fullname,
        email: userProfile.email,
        phone: userProfile.phone,
        position: userProfile.position || '',
        majors: [...userProfile.majors],
        newMajor: ''
      });
      setSelectedFile(null);
      setPreviewImage(null);
      setIsEditDialogOpen(true);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddMajor = () => {
    if (editForm.newMajor.trim() && !editForm.majors.includes(editForm.newMajor.trim())) {
      setEditForm(prev => ({
        ...prev,
        majors: [...prev.majors, prev.newMajor.trim()],
        newMajor: ''
      }));
    }
  };

  const handleRemoveMajor = (index: number) => {
    setEditForm(prev => ({
      ...prev,
      majors: prev.majors.filter((_, i) => i !== index)
    }));
  };

  const handleUpdateProfile = async () => {
    if (!userProfile) return;

    setIsUpdating(true);
    try {
      let avatarPath = userProfile.avatar;

      // Upload file nếu có file được chọn
      if (selectedFile) {
        const [uploadCode, uploadData, uploadMessage] = await fileService.uploadFile(selectedFile);
        if (uploadCode === 200 && uploadData) {
          avatarPath = uploadData;
        } else {
          toast.error(uploadMessage || 'Lỗi khi upload ảnh');
          return;
        }
      }

      // Tạo object update profile
      const updateData: UpdateProfileDTO = {
        username: userProfile.username,
        fullname: editForm.fullname,
        password: '', // Không update password
        email: editForm.email,
        avatar: avatarPath,
        position: editForm.position,
        phone: editForm.phone,
        majors: editForm.majors,
        role: userProfile.role // Giữ nguyên role cũ
      };

      const [code, data, message] = await authService.updateProfile(userProfile.username, updateData);

      if (code === 200 && data) {
        setUserProfile(data);
        setIsEditDialogOpen(false);
        toast.success('Cập nhật hồ sơ thành công!');
      } else {
        toast.error(message || 'Cập nhật hồ sơ thất bại');
      }
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast.error('Có lỗi xảy ra khi cập nhật hồ sơ');
    } finally {
      setIsUpdating(false);
    }
  };

  const handlePasswordClick = () => {
    setPasswordForm({
      oldPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setIsPasswordDialogOpen(true);
  };

  const handleUpdatePassword = async () => {
    if (!userProfile) return;

    // Validation
    if (!passwordForm.oldPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      toast.error('Vui lòng điền đầy đủ thông tin');
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('Mật khẩu mới và xác nhận mật khẩu không khớp');
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      toast.error('Mật khẩu mới phải có ít nhất 6 ký tự');
      return;
    }

    setIsUpdatingPassword(true);
    try {
      const updatePasswordData: UpdatePasswordDTO = {
        oldpassword: passwordForm.oldPassword,
        newpassword: passwordForm.newPassword
      };

      const [code, data, message] = await authService.updatePassword(userProfile.username, updatePasswordData);

      if (code === 200) {
        setIsPasswordDialogOpen(false);
        setPasswordForm({
          oldPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        toast.success('Đổi mật khẩu thành công!');
      } else {
        toast.error(message || 'Đổi mật khẩu thất bại');
      }
    } catch (error: any) {
      console.error('Error updating password:', error);
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi đổi mật khẩu');
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'error';
      case 'SPECIALIST':
        return 'warning';
      case 'USER':
        return 'primary';
      default:
        return 'default';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'Quản trị viên';
      case 'SPECIALIST':
        return 'Chuyên viên';
      case 'USER':
        return 'Người dùng';
      default:
        return role;
    }
  };

  if (isLoading) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error || !userProfile) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error">{error || 'Không thể tải thông tin hồ sơ'}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Hồ sơ cá nhân
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<LockIcon />}
            onClick={handlePasswordClick}
          >
            Đổi mật khẩu
          </Button>
          <Button
            variant="contained"
            startIcon={<EditIcon />}
            onClick={handleEditClick}
          >
            Chỉnh sửa
          </Button>
        </Box>
      </Box>

      <Card sx={{ borderRadius: 2, overflow: 'hidden' }}>
        <Box sx={{ bgcolor: 'primary.main', height: 120, position: 'relative' }}>
          <Box
            sx={{
              position: 'absolute',
              bottom: -50,
              left: '50%',
              transform: 'translateX(-50%)',
            }}
          >
            <Avatar
              src={`http://localhost:8080/${userProfile.avatar}`}
              alt={userProfile.fullname}
              sx={{
                width: 100,
                height: 100,
                border: '4px solid white',
                boxShadow: 2
              }}
            />
          </Box>
        </Box>
        
        <CardContent sx={{ pt: 8, pb: 4 }}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography variant="h5" component="h2" gutterBottom>
              {userProfile.fullname}
            </Typography>
            <Typography variant="body1" color="text.secondary" gutterBottom>
              @{userProfile.username}
            </Typography>
            <Chip
              label={getRoleLabel(userProfile.role)}
              color={getRoleColor(userProfile.role) as any}
              sx={{ mt: 1 }}
            />
          </Box>

          <Divider sx={{ my: 3 }} />

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 3 }}>
            <Paper sx={{ p: 2, height: '100%' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <EmailIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6">Email</Typography>
              </Box>
              <Typography variant="body1">{userProfile.email}</Typography>
            </Paper>

            <Paper sx={{ p: 2, height: '100%' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <PhoneIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6">Số điện thoại</Typography>
              </Box>
              <Typography variant="body1">{userProfile.phone}</Typography>
            </Paper>

            {(userProfile.role === 'ADMIN' || userProfile.role === 'SPECIALIST') && (
              <Paper sx={{ p: 2, height: '100%' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <WorkIcon sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="h6">Vị trí</Typography>
                </Box>
                <Typography variant="body1">
                  {userProfile.position || 'Chưa cập nhật'}
                </Typography>
              </Paper>
            )}

            <Paper sx={{ p: 2, height: '100%' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CalendarIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6">Ngày tham gia</Typography>
              </Box>
              <Typography variant="body1">
                {formatDate(userProfile.createDate)}
              </Typography>
            </Paper>
          </Box>

          {(userProfile.role === 'ADMIN' || userProfile.role === 'SPECIALIST') &&
           userProfile.majors && userProfile.majors.length > 0 && (
            <Box sx={{ mt: 3 }}>
              <Paper sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <BadgeIcon sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="h6">Chuyên ngành</Typography>
                </Box>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {userProfile.majors.map((major, index) => (
                    <Chip
                      key={index}
                      label={major}
                      variant="outlined"
                      color="primary"
                    />
                  ))}
                </Box>
              </Paper>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Dialog chỉnh sửa hồ sơ */}
      <Dialog open={isEditDialogOpen} onClose={() => setIsEditDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Chỉnh sửa hồ sơ cá nhân</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            {/* Upload Avatar */}
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
              <Avatar
                src={previewImage || `http://localhost:8080/${userProfile?.avatar}`}
                alt="Preview"
                sx={{ width: 100, height: 100, mb: 2 }}
              />
              <input
                accept="image/*"
                style={{ display: 'none' }}
                id="avatar-upload"
                type="file"
                onChange={handleFileChange}
              />
              <label htmlFor="avatar-upload">
                <Button
                  variant="outlined"
                  component="span"
                  startIcon={<PhotoCameraIcon />}
                >
                  Thay đổi ảnh đại diện
                </Button>
              </label>
            </Box>

            {/* Form fields */}
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 2, mb: 3 }}>
              <TextField
                label="Họ và tên"
                value={editForm.fullname}
                onChange={(e) => setEditForm(prev => ({ ...prev, fullname: e.target.value }))}
                fullWidth
                required
              />
              <TextField
                label="Email"
                value={editForm.email}
                onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                fullWidth
                required
                type="email"
              />
              <TextField
                label="Số điện thoại"
                value={editForm.phone}
                onChange={(e) => setEditForm(prev => ({ ...prev, phone: e.target.value }))}
                fullWidth
                required
              />
              {(userProfile?.role === 'ADMIN' || userProfile?.role === 'SPECIALIST') && (
                <TextField
                  label="Vị trí"
                  value={editForm.position}
                  onChange={(e) => setEditForm(prev => ({ ...prev, position: e.target.value }))}
                  fullWidth
                />
              )}
            </Box>

            {/* Majors - chỉ hiển thị cho ADMIN và SPECIALIST */}
            {(userProfile?.role === 'ADMIN' || userProfile?.role === 'SPECIALIST') && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom>Chuyên ngành</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                  {editForm.majors.map((major, index) => (
                    <Chip
                      key={index}
                      label={major}
                      onDelete={() => handleRemoveMajor(index)}
                      deleteIcon={<DeleteIcon />}
                      color="primary"
                      variant="outlined"
                    />
                  ))}
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <TextField
                    label="Thêm chuyên ngành"
                    value={editForm.newMajor}
                    onChange={(e) => setEditForm(prev => ({ ...prev, newMajor: e.target.value }))}
                    size="small"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddMajor();
                      }
                    }}
                  />
                  <Button
                    variant="outlined"
                    onClick={handleAddMajor}
                    startIcon={<AddIcon />}
                    disabled={!editForm.newMajor.trim()}
                  >
                    Thêm
                  </Button>
                </Box>
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsEditDialogOpen(false)}>Hủy</Button>
          <Button
            onClick={handleUpdateProfile}
            variant="contained"
            disabled={isUpdating}
          >
            {isUpdating ? <CircularProgress size={20} /> : 'Cập nhật'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog đổi mật khẩu */}
      <Dialog open={isPasswordDialogOpen} onClose={() => setIsPasswordDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Đổi mật khẩu</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField
              label="Mật khẩu hiện tại"
              type="password"
              value={passwordForm.oldPassword}
              onChange={(e) => setPasswordForm(prev => ({ ...prev, oldPassword: e.target.value }))}
              fullWidth
              required
            />
            <TextField
              label="Mật khẩu mới"
              type="password"
              value={passwordForm.newPassword}
              onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
              fullWidth
              required
              helperText="Mật khẩu phải có ít nhất 6 ký tự"
            />
            <TextField
              label="Xác nhận mật khẩu mới"
              type="password"
              value={passwordForm.confirmPassword}
              onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
              fullWidth
              required
              error={passwordForm.confirmPassword !== '' && passwordForm.newPassword !== passwordForm.confirmPassword}
              helperText={
                passwordForm.confirmPassword !== '' && passwordForm.newPassword !== passwordForm.confirmPassword
                  ? 'Mật khẩu không khớp'
                  : ''
              }
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsPasswordDialogOpen(false)}>Hủy</Button>
          <Button
            onClick={handleUpdatePassword}
            variant="contained"
            disabled={isUpdatingPassword}
          >
            {isUpdatingPassword ? <CircularProgress size={20} /> : 'Đổi mật khẩu'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ProfilePage;
