import React, { useState, useEffect, useRef } from "react";
import { Container, Typography, Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, Button, IconButton, Tooltip, Chip, Dialog, DialogTitle, DialogContent, DialogActions, TextField, FormControl, InputLabel, Select, MenuItem, InputAdornment, Alert, Snackbar, Avatar, SelectChangeEvent, CircularProgress } from "@mui/material";
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Search as SearchIcon, Refresh as RefreshIcon, Visibility as VisibilityIcon, Phone as PhoneIcon, Email as EmailIcon } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { UserService } from "../../services/UserService";
import { UserSearch } from "../../dto/UserSearch";
import { UserDTO } from "../../dto/UserDTO";
import { FileService } from "../../services/FileService";
import { toast } from "react-toastify";
import { getAvatarUrl } from "../../utils/imageUtils";

const AdminConsultantsPage: React.FC = () => {
  // State for consultants data
  const [consultants, setConsultants] = useState<any[]>([]);
  const [filteredConsultants, setFilteredConsultants] = useState<any[]>([]);

  // State for pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Services
  const userService = new UserService();
  const fileService = new FileService();
  const [userSearch, setUserSearch] = useState<UserSearch>({
    keyword: undefined,
    roleName: "SPECIALIST",
    majorName: "",
    page: 1,
    limit: 10,
    timer: Date.now(),
  });

  // State for search and filter
  const [searchTerm, setSearchTerm] = useState("");
  const [specialtyFilter, setSpecialtyFilter] = useState<string>("all");

  // State for consultant dialog
  const [openConsultantDialog, setOpenConsultantDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState<"add" | "edit">("add");
  const [currentConsultant, setCurrentConsultant] = useState<any>(null);
  const [formData, setFormData] = useState({
    username: "",
    name: "",
    title: "",
    specialty: [] as string[],
    bio: "",
    email: "",
    phone: "",
    avatar: "",
    password: "1234",
    rating: 5,
    availability: true,
  });

  // State for delete confirmation dialog
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [consultantToDelete, setConsultantToDelete] = useState<any>(null);

  // State for notifications
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error" | "info" | "warning",
  });

  // State for avatar upload
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  // Ref for search debounce
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Loading state
  const [isLoading, setIsLoading] = useState(false);

  // Load consultants data from API
  useEffect(() => {
    const loadConsultants = async () => {
      try {
        setIsLoading(true);
        console.log("Loading consultants with search params:", userSearch);
        const [code, pageData, message] = await userService.findAll(userSearch);
        console.log("API Response:", { code, pageData, message });

        if (code === 200 && pageData) {
          // Map API data to consultant format
          const consultantsData = pageData.content.map((user: any) => ({
            id: user.id,
            name: user.fullname,
            title: user.position || "Chuyên viên tư vấn",
            specialty: user.majors || [],
            bio: "", // API không có bio
            email: user.email,
            phone: user.phone,
            avatar: user.avatar ? getAvatarUrl(user.avatar) : getAvatarUrl(""),
            rating: 5, // Default rating
            availability: true, // Default availability
            createdAt: new Date(user.createDate),
          }));

          setConsultants(consultantsData);
          setFilteredConsultants(consultantsData);
          setTotalElements(pageData.totalElements);
          setTotalPages(pageData.totalPages);
        } else {
          toast.error(message || "Không thể tải danh sách chuyên viên");
        }
      } catch (error) {
        console.error("Error loading consultants:", error);
        toast.error("Có lỗi xảy ra khi tải danh sách chuyên viên");
      } finally {
        setIsLoading(false);
      }
    };

    loadConsultants();
  }, [userSearch.timer]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  // No need for client-side filtering since API handles it

  // Handle pagination changes
  const handleChangePage = (event: unknown, newPage: number) => {
    setUserSearch((prev) => ({
      ...prev,
      page: newPage + 1, // API page starts from 1
      timer: Date.now(),
    }));
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setUserSearch((prev) => ({
      ...prev,
      limit: newRowsPerPage,
      page: 1, // Reset to first page
      timer: Date.now(),
    }));
  };

  // Handle search and filter changes with debounce
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const keyword = event.target.value;
    setSearchTerm(keyword);

    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Debounce search to avoid too many API calls
    searchTimeoutRef.current = setTimeout(() => {
      setUserSearch((prev) => ({
        ...prev,
        keyword: keyword.trim() || undefined,
        page: 1,
        timer: Date.now(),
      }));
    }, 500);
  };

  const handleSpecialtyFilterChange = (event: SelectChangeEvent) => {
    const specialty = event.target.value;
    setSpecialtyFilter(specialty);

    // Clear search timeout if any
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    setUserSearch((prev) => ({
      ...prev,
      majorName: specialty === "all" ? "" : specialty,
      page: 1,
      timer: Date.now(),
    }));
  };

  const handleResetFilters = () => {
    // Clear search timeout if any
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    setSearchTerm("");
    setSpecialtyFilter("all");
    setUserSearch((prev) => ({
      ...prev,
      keyword: undefined,
      majorName: "",
      page: 1,
      timer: Date.now(),
    }));
  };

  // Handle consultant dialog
  const handleOpenAddDialog = () => {
    setDialogMode("add");
    setFormData({
      username: "",
      name: "",
      title: "",
      specialty: [],
      bio: "",
      email: "",
      phone: "",
      avatar: "",
      password: "1234",
      rating: 5,
      availability: true,
    });
    setOpenConsultantDialog(true);
  };

  const handleOpenEditDialog = async (consultant: any) => {
    setDialogMode("edit");
    setCurrentConsultant(consultant);

    try {
      // Gọi API để lấy thông tin chi tiết user
      const [code, userData, message] = await userService.getUserById(consultant.id);

      if (code === 200 && userData) {
        setFormData({
          username: userData.username || "",
          name: userData.fullname,
          title: userData.position || "",
          specialty: userData.majors || [],
          bio: `${userData.fullname} là một chuyên viên tư vấn có kinh nghiệm trong lĩnh vực ${userData.majors?.join(", ") || "tư vấn tâm lý"}.`,
          email: userData.email,
          phone: userData.phone,
          avatar: userData.avatar || "",
          password: "1234",
          rating: 4.8, // Default
          availability: true, // Default
        });

        // Set avatar preview nếu có
        if (userData.avatar) {
          setAvatarPreview(getAvatarUrl(userData.avatar));
        } else {
          setAvatarPreview(null);
        }
      } else {
        toast.error(message || "Không thể tải thông tin chuyên viên");
        return;
      }
    } catch (error) {
      console.error("Error loading consultant data:", error);
      toast.error("Có lỗi xảy ra khi tải thông tin chuyên viên");
      return;
    }

    setOpenConsultantDialog(true);
  };

  const handleCloseConsultantDialog = () => {
    setOpenConsultantDialog(false);
    setCurrentConsultant(null);
    setAvatarPreview(null);
    setAvatarFile(null);
  };

  // Handle avatar upload
  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFormChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRatingChange = (event: React.SyntheticEvent, newValue: number | null) => {
    setFormData((prev) => ({
      ...prev,
      rating: newValue || 5,
    }));
  };

  const handleAvailabilityChange = (event: SelectChangeEvent) => {
    setFormData((prev) => ({
      ...prev,
      availability: event.target.value === "true",
    }));
  };

  const handleSpecialtyChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value;
    setFormData((prev) => ({
      ...prev,
      specialty: typeof value === "string" ? [value] : value,
    }));
  };

  const handleSaveConsultant = async () => {
    // Validate form
    if (!formData.name || !formData.title || !formData.specialty.length || !formData.email || !formData.phone) {
      setSnackbar({
        open: true,
        message: "Vui lòng điền đầy đủ thông tin",
        severity: "error",
      });
      return;
    }

    // Validate username and password for add mode
    if (dialogMode === "add" && !formData.username) {
      setSnackbar({
        open: true,
        message: "Vui lòng nhập tên đăng nhập",
        severity: "error",
      });
      return;
    }

    if (dialogMode === "add" && !formData.password) {
      setSnackbar({
        open: true,
        message: "Vui lòng nhập mật khẩu",
        severity: "error",
      });
      return;
    }

    if (dialogMode === "add") {
      try {
        // Prepare data for creating consultant
        const userDTO = new UserDTO();
        userDTO.username = formData.username;
        userDTO.fullname = formData.name;
        userDTO.password = formData.password;
        userDTO.email = formData.email;
        userDTO.position = formData.title;
        userDTO.phone = formData.phone;
        userDTO.majors = formData.specialty;
        userDTO.role = "SPECIALIST";

        // Create consultant using UserService
        const [code, data, message] = await userService.createUser(userDTO, avatarFile);

        if (code === 200) {
          setSnackbar({
            open: true,
            message: "Thêm chuyên viên thành công",
            severity: "success",
          });
          handleCloseConsultantDialog();
          // Refresh the consultant list
          setUserSearch((prev) => ({
            ...prev,
            timer: Date.now(),
          }));
        } else {
          setSnackbar({
            open: true,
            message: message || "Có lỗi xảy ra khi thêm chuyên viên",
            severity: "error",
          });
        }
      } catch (error: any) {
        setSnackbar({
          open: true,
          message: "Lỗi kết nối: " + (error.message || "Không thể thêm chuyên viên"),
          severity: "error",
        });
      }
    } else {
      // Update consultant using API
      if (currentConsultant) {
        try {
          let avatarFileName = formData.avatar;

          // Upload avatar if file is selected
          if (avatarFile) {
            const [uploadCode, uploadData, uploadMessage] = await fileService.uploadFile(avatarFile);
            if (uploadCode === 200 && uploadData) {
              avatarFileName = uploadData;
            } else {
              toast.error(uploadMessage || "Không thể upload ảnh đại diện");
              return;
            }
          }

          // Prepare update data as UserDTO
          const updateData = {
            id: Number(currentConsultant.id),
            username: (currentConsultant as any).username || formData.name.toLowerCase().replace(/\s+/g, ""),
            fullname: formData.name,
            password: "1234", // Default password
            email: formData.email,
            avatar: avatarFileName,
            position: formData.title,
            phone: formData.phone,
            majors: formData.specialty,
            role: "SPECIALIST",
          };

          const [code, userData, message] = await userService.updateUser(Number(currentConsultant.id), updateData);

          if (code === 200) {
            toast.success("Cập nhật chuyên viên thành công");

            // Refresh data
            setUserSearch((prev) => ({
              ...prev,
              timer: Date.now(),
            }));

            setSnackbar({
              open: true,
              message: "Chuyên viên đã được cập nhật thành công",
              severity: "success",
            });
          } else {
            toast.error(message || "Không thể cập nhật chuyên viên");
            setSnackbar({
              open: true,
              message: message || "Không thể cập nhật chuyên viên",
              severity: "error",
            });
          }
        } catch (error: any) {
          console.error("Error updating consultant:", error);
          toast.error("Có lỗi xảy ra khi cập nhật chuyên viên");
          setSnackbar({
            open: true,
            message: "Có lỗi xảy ra khi cập nhật chuyên viên",
            severity: "error",
          });
        }
      }
    }

    handleCloseConsultantDialog();
  };

  // Handle delete consultant
  const handleOpenDeleteDialog = (consultant: any) => {
    setConsultantToDelete(consultant);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setConsultantToDelete(null);
  };

  const handleDeleteConsultant = async () => {
    if (consultantToDelete) {
      try {
        const [code, data, message] = await userService.deleteUser(consultantToDelete.id);

        if (code === 200) {
          toast.success("Xóa chuyên viên thành công");

          // Refresh data
          setUserSearch((prev) => ({
            ...prev,
            timer: Date.now(),
          }));

          setSnackbar({
            open: true,
            message: "Chuyên viên đã được xóa thành công",
            severity: "success",
          });
        } else {
          toast.error(message || "Không thể xóa chuyên viên");
          setSnackbar({
            open: true,
            message: message || "Không thể xóa chuyên viên",
            severity: "error",
          });
        }
      } catch (error: any) {
        console.error("Error deleting consultant:", error);
        toast.error("Có lỗi xảy ra khi xóa chuyên viên");
        setSnackbar({
          open: true,
          message: "Có lỗi xảy ra khi xóa chuyên viên",
          severity: "error",
        });
      }
    }

    handleCloseDeleteDialog();
  };

  // Handle snackbar close
  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({
      ...prev,
      open: false,
    }));
  };

  // Get specialty display text - now using majors from API
  const getSpecialtyDisplay = (specialty: string) => {
    // Return the specialty as is since API returns Vietnamese text
    return specialty;
  };

  return (
    <Container>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Quản lý chuyên viên tư vấn
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Quản lý tất cả chuyên viên tư vấn trong hệ thống
        </Typography>
      </Box>

      {/* Toolbar */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, alignItems: "center" }}>
          <TextField
            label="Tìm kiếm theo tên, email, số điện thoại..."
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={handleSearchChange}
            sx={{ flexGrow: 1, minWidth: "200px" }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                // Trigger immediate search on Enter
                if (searchTimeoutRef.current) {
                  clearTimeout(searchTimeoutRef.current);
                }
                setUserSearch((prev) => ({
                  ...prev,
                  keyword: searchTerm.trim() || undefined,
                  page: 1,
                  timer: Date.now(),
                }));
              }
            }}
          />

          <FormControl variant="outlined" size="small" sx={{ minWidth: "150px" }}>
            <InputLabel id="specialty-filter-label">Chuyên môn</InputLabel>
            <Select labelId="specialty-filter-label" id="specialty-filter" value={specialtyFilter} onChange={handleSpecialtyFilterChange} label="Chuyên môn">
              <MenuItem value="all">Tất cả</MenuItem>
              <MenuItem value="Nghiện">Nghiện</MenuItem>
              <MenuItem value="Thanh thiếu niên">Thanh thiếu niên</MenuItem>
              <MenuItem value="Gia đình">Gia đình</MenuItem>
              <MenuItem value="Giáo dục">Giáo dục</MenuItem>
              <MenuItem value="Sức khỏe tâm thần">Sức khỏe tâm thần</MenuItem>
            </Select>
          </FormControl>

          <Tooltip title="Đặt lại bộ lọc">
            <IconButton onClick={handleResetFilters}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>

          <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenAddDialog} sx={{ ml: "auto" }}>
            Thêm chuyên viên
          </Button>
        </Box>
      </Paper>

      {/* Consultants Table */}
      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <TableContainer sx={{ maxHeight: "calc(100vh - 300px)" }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Chuyên viên</TableCell>
                <TableCell>Chức danh</TableCell>
                <TableCell>Chuyên môn</TableCell>
                <TableCell>Liên hệ</TableCell>
                <TableCell align="center">Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                    <CircularProgress />
                    <Typography variant="body2" sx={{ mt: 2 }}>
                      Đang tải danh sách chuyên viên...
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : consultants.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                    <Typography variant="body2" color="text.secondary">
                      Không tìm thấy chuyên viên nào
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                consultants.map((consultant) => (
                  <TableRow hover key={consultant.id}>
                    <TableCell>{consultant.id}</TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Avatar src={consultant.avatar} alt={consultant.name} sx={{ mr: 2, width: 40, height: 40 }}>
                          {consultant.name?.charAt(0)?.toUpperCase()}
                        </Avatar>
                        {consultant.name}
                      </Box>
                    </TableCell>
                    <TableCell>{consultant.title}</TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                        {consultant.specialty.map((spec: string, index: number) => (
                          <Chip key={index} label={getSpecialtyDisplay(spec)} size="small" color="primary" variant="outlined" />
                        ))}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <EmailIcon fontSize="small" sx={{ mr: 1, color: "text.secondary" }} />
                          {consultant.email}
                        </Box>
                        <Box sx={{ display: "flex", alignItems: "center", mt: 0.5 }}>
                          <PhoneIcon fontSize="small" sx={{ mr: 1, color: "text.secondary" }} />
                          {consultant.phone}
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="Xem chi tiết">
                        <IconButton component={Link} to={`/consultants/${consultant.id}`} state={{ from: "admin" }} color="info">
                          <VisibilityIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Chỉnh sửa">
                        <IconButton onClick={() => handleOpenEditDialog(consultant)} color="primary">
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Xóa">
                        <IconButton onClick={() => handleOpenDeleteDialog(consultant)} color="error">
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={totalElements}
          rowsPerPage={userSearch.limit}
          page={userSearch.page - 1} // Convert back to 0-based for UI
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Số hàng mỗi trang:"
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} của ${count}`}
        />
      </Paper>

      {/* Add/Edit Consultant Dialog */}
      <Dialog open={openConsultantDialog} onClose={handleCloseConsultantDialog} maxWidth="md" fullWidth>
        <DialogTitle>{dialogMode === "add" ? "Thêm chuyên viên mới" : "Chỉnh sửa chuyên viên"}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
            <TextField name="name" label="Họ tên" fullWidth value={formData.name} onChange={handleFormChange} />

            {/* Username and Password fields - only show in add mode */}
            {dialogMode === "add" && (
              <Box sx={{ display: "flex", gap: 2 }}>
                <TextField name="username" label="Tên đăng nhập" fullWidth value={formData.username} onChange={handleFormChange} required helperText="Tên đăng nhập duy nhất cho chuyên viên" />
                <TextField name="password" label="Mật khẩu" type="password" fullWidth value={formData.password} onChange={handleFormChange} required helperText="Mật khẩu mặc định: 1234 (có thể thay đổi sau)" />
              </Box>
            )}

            <TextField name="title" label="Chức danh" fullWidth value={formData.title} onChange={handleFormChange} />

            <FormControl fullWidth>
              <InputLabel id="specialty-label">Chuyên môn</InputLabel>
              <Select
                labelId="specialty-label"
                id="specialty"
                multiple
                value={formData.specialty}
                onChange={handleSpecialtyChange}
                label="Chuyên môn"
                renderValue={(selected) => (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {(selected as string[]).map((value, index) => (
                      <Chip key={index} label={getSpecialtyDisplay(value)} />
                    ))}
                  </Box>
                )}
              >
                <MenuItem value="Nghiện">Nghiện</MenuItem>
                <MenuItem value="Thanh thiếu niên">Thanh thiếu niên</MenuItem>
                <MenuItem value="Gia đình">Gia đình</MenuItem>
                <MenuItem value="Giáo dục">Giáo dục</MenuItem>
                <MenuItem value="Sức khỏe tâm thần">Sức khỏe tâm thần</MenuItem>
              </Select>
            </FormControl>

            <TextField name="bio" label="Tiểu sử" fullWidth multiline rows={3} value={formData.bio} onChange={handleFormChange} />

            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
                name="email"
                label="Email"
                fullWidth
                value={formData.email}
                onChange={handleFormChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                name="phone"
                label="Số điện thoại"
                fullWidth
                value={formData.phone}
                onChange={handleFormChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PhoneIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            {/* Avatar Upload */}
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Ảnh đại diện
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Avatar src={avatarPreview || (formData.avatar ? getAvatarUrl(formData.avatar) : "")} sx={{ width: 80, height: 80 }} />
                <Box>
                  <input accept="image/*" style={{ display: "none" }} id="avatar-upload" type="file" onChange={handleAvatarChange} />
                  <label htmlFor="avatar-upload">
                    <Button variant="outlined" component="span">
                      Chọn ảnh
                    </Button>
                  </label>
                  {avatarFile && (
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      {avatarFile.name}
                    </Typography>
                  )}
                </Box>
              </Box>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConsultantDialog}>Hủy</Button>
          <Button onClick={handleSaveConsultant} variant="contained" color="primary">
            {dialogMode === "add" ? "Thêm" : "Lưu"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Xác nhận xóa</DialogTitle>
        <DialogContent>
          <Typography>Bạn có chắc chắn muốn xóa chuyên viên "{consultantToDelete?.name}" không?</Typography>
          <Typography variant="body2" color="error" sx={{ mt: 2 }}>
            Lưu ý: Hành động này không thể hoàn tác.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Hủy</Button>
          <Button onClick={handleDeleteConsultant} variant="contained" color="error">
            Xóa
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: "bottom", horizontal: "right" }}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default AdminConsultantsPage;
