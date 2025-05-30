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
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from '@mui/material';
import { Email as EmailIcon, Phone as PhoneIcon, Work as WorkIcon, CalendarToday as CalendarIcon, Badge as BadgeIcon, Edit as EditIcon, Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { mockUsers } from '../../utils/mockData';

const ProfilePage: React.FC = () => {
  const [userProfile, setUserProfile] = useState<any | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    fullname: '',
    email: '',
    phone: '',
    position: '',
    majors: [] as string[],
    newMajor: ''
  });

  useEffect(() => {
    setUserProfile({
      fullname: mockUsers[0].firstName + ' ' + mockUsers[0].lastName,
      username: mockUsers[0].id,
      email: mockUsers[0].email,
      phone: '0123456789',
      avatar: '',
      position: 'Khách',
      majors: ['CNTT'],
      role: 'USER',
      createDate: mockUsers[0].createdAt || new Date().toISOString(),
    });
  }, []);

  if (!userProfile) return null;

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Hồ sơ cá nhân
        </Typography>
        <Button variant="contained" startIcon={<EditIcon />} onClick={() => setIsEditDialogOpen(true)}>
          Chỉnh sửa
        </Button>
      </Box>
      <Card sx={{ borderRadius: 2, overflow: 'hidden' }}>
        <Box sx={{ bgcolor: 'primary.main', height: 120, position: 'relative' }}>
          <Box sx={{ position: 'absolute', bottom: -50, left: '50%', transform: 'translateX(-50%)' }}>
            <Avatar src={userProfile.avatar} alt={userProfile.fullname} sx={{ width: 100, height: 100, border: '4px solid white', boxShadow: 2 }} />
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
            <Chip label={userProfile.role} color="primary" sx={{ mt: 1 }} />
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
            <Paper sx={{ p: 2, height: '100%' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <WorkIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6">Vị trí</Typography>
              </Box>
              <Typography variant="body1">{userProfile.position}</Typography>
            </Paper>
            <Paper sx={{ p: 2, height: '100%' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CalendarIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6">Ngày tham gia</Typography>
              </Box>
              <Typography variant="body1">{userProfile.createDate.toString()}</Typography>
            </Paper>
          </Box>
          <Box sx={{ mt: 3 }}>
            <Paper sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <BadgeIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6">Chuyên ngành</Typography>
              </Box>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {userProfile.majors.map((major: string, index: number) => (
                  <Chip key={index} label={major} variant="outlined" color="primary" />
                ))}
              </Box>
            </Paper>
          </Box>
        </CardContent>
      </Card>
      <Dialog open={isEditDialogOpen} onClose={() => setIsEditDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Chỉnh sửa hồ sơ cá nhân</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 2, mb: 3 }}>
              <TextField label="Họ và tên" value={editForm.fullname} onChange={(e) => setEditForm(prev => ({ ...prev, fullname: e.target.value }))} fullWidth required />
              <TextField label="Email" value={editForm.email} onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))} fullWidth required type="email" />
              <TextField label="Số điện thoại" value={editForm.phone} onChange={(e) => setEditForm(prev => ({ ...prev, phone: e.target.value }))} fullWidth required />
              <TextField label="Vị trí" value={editForm.position} onChange={(e) => setEditForm(prev => ({ ...prev, position: e.target.value }))} fullWidth />
            </Box>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>Chuyên ngành</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                {editForm.majors.map((major, index) => (
                  <Chip key={index} label={major} color="primary" variant="outlined" onDelete={() => setEditForm(prev => ({ ...prev, majors: prev.majors.filter((_, i) => i !== index) }))} deleteIcon={<DeleteIcon />} />
                ))}
              </Box>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField label="Thêm chuyên ngành" value={editForm.newMajor} onChange={(e) => setEditForm(prev => ({ ...prev, newMajor: e.target.value }))} size="small" onKeyPress={(e) => { if (e.key === 'Enter') { e.preventDefault(); if (editForm.newMajor.trim() && !editForm.majors.includes(editForm.newMajor.trim())) { setEditForm(prev => ({ ...prev, majors: [...prev.majors, prev.newMajor.trim()], newMajor: '' })); } } }} />
                <Button variant="outlined" onClick={() => { if (editForm.newMajor.trim() && !editForm.majors.includes(editForm.newMajor.trim())) { setEditForm(prev => ({ ...prev, majors: [...prev.majors, prev.newMajor.trim()], newMajor: '' })); } }} startIcon={<AddIcon />} disabled={!editForm.newMajor.trim()}>
                  Thêm
                </Button>
              </Box>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsEditDialogOpen(false)}>Hủy</Button>
          <Button onClick={() => setIsEditDialogOpen(false)} variant="contained">Cập nhật</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ProfilePage;
