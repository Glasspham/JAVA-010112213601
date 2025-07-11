import React, { useState, useEffect } from "react";
import { Container, Typography, Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, Button, IconButton, Tooltip, Dialog, DialogTitle, DialogContent, DialogActions, TextField, InputAdornment, Avatar, List, ListItem, ListItemAvatar, ListItemText, Divider } from "@mui/material";
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Search as SearchIcon, Refresh as RefreshIcon, Event as EventIcon, LocationOn as LocationIcon, People as PeopleIcon, Email as EmailIcon, Phone as PhoneIcon } from "@mui/icons-material";
import { getImageUrl, getAvatarUrl, handleImageError } from "../../utils/imageUtils";
import { Program } from "../../types/program";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { toast } from "react-toastify";
import { ProgramService } from "../../services/ProgramService";
import { ProgramDTO } from "../../dto/ProgramDTO";
import { ProgramSearch } from "../../dto/ProgramSearch";
import Swal from "sweetalert2";

const AdminProgramsPage: React.FC = () => {
  // State for programs data
  const [programs, setPrograms] = useState<Program[]>([]);
  const [filteredPrograms, setFilteredPrograms] = useState<Program[]>([]);

  // NEW STATE FOR API CALLS
  const _programService = new ProgramService();
  const [programSearch, setProgramSearch] = useState(new ProgramSearch());
  const [listProgram, setListProgram] = useState<any[]>([]); // Using any[] for now, will map to Program[]
  const [totalPage, setTotalPage] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  // State for pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(programSearch.limit);

  // State for search and filter
  const [searchTerm, setSearchTerm] = useState(programSearch.keyword || "");
  const [dateFilter, setDateFilter] = useState<Date | null>(programSearch.date ? new Date(programSearch.date) : null);

  // State for program dialog
  const [openProgramDialog, setOpenProgramDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState<"add" | "edit">("add");
  const [currentProgram, setCurrentProgram] = useState<Program | null>(null);
  const [formData, setFormData] = useState({
    id: 0,
    title: "",
    description: "",
    location: "",
    date: new Date(),
    time: "09:00",
    duration: 120,
    capacity: 50,
    registrations: 0,
    image: "",
  });

  // State for image upload
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  // Add new states for registrations dialog
  const [openRegistrationsDialog, setOpenRegistrationsDialog] = useState(false);
  const [selectedProgramForRegistrations, setSelectedProgramForRegistrations] = useState<Program | null>(null);
  const [registrationsList, setRegistrationsList] = useState<any[]>([]);

  // Helper function to map API response to UI's Program interface
  const mapApiResponseToProgram = (apiData: any): Program => {
    // Xử lý an toàn cho date và time
    let programDate: Date;
    try {
      // API trả về date dạng "2025-06-21" và time dạng "00:00:00"
      const dateStr = apiData.date || new Date().toISOString().split("T")[0];
      const timeStr = apiData.time || "00:00:00";

      const [year, month, day] = dateStr.split("-").map(Number);
      const [hour, minute] = timeStr.split(":").map(Number);

      programDate = new Date(year, month - 1, day, hour, minute);

      // Kiểm tra tính hợp lệ của date
      if (isNaN(programDate.getTime())) {
        console.warn("Invalid date detected, using current date");
        programDate = new Date();
      }
    } catch (error) {
      console.error("Error creating date:", error);
      programDate = new Date();
    }

    return {
      id: apiData.id.toString(),
      title: apiData.title,
      description: apiData.description || "",
      location: apiData.address,
      date: programDate,
      duration: 120, // Default duration
      capacity: apiData.capacity,
      registrations: apiData.users ? apiData.users.length : 0,
      image: apiData.image || "",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  };

  // Helper function to map UI's formData to ProgramDTO for API calls
  const mapFormDataToProgramDTO = (data: typeof formData): ProgramDTO => {
    const programDTO = new ProgramDTO();
    programDTO.id = data.id;
    programDTO.title = data.title;
    programDTO.description = data.description;
    programDTO.image = data.image;
    programDTO.address = data.location; // Map location to address
    programDTO.date = format(data.date, "yyyy-MM-dd"); // Format date to YYYY-MM-DD
    programDTO.hourse = parseInt(data.time.split(":")[0]);
    programDTO.minus = parseInt(data.time.split(":")[1]);
    programDTO.capacity = data.capacity;
    return programDTO;
  };

  // Load programs data from API
  useEffect(() => {
    const findAllPrograms = async () => {
      try {
        const [code, pageData, message] = await _programService.findAll(programSearch);
        if (code === 200 && pageData && pageData.content) {
          const mappedPrograms = pageData.content.map((apiData: any) => mapApiResponseToProgram(apiData));
          setListProgram(mappedPrograms); // Keep raw mapped list for display
          setPrograms(mappedPrograms); // Update main programs state
          setFilteredPrograms(mappedPrograms); // Update filtered programs state directly
          setTotalPage(pageData.totalPages);
          setTotalElements(pageData.totalElements);
        } else {
          toast.error(`Lỗi khi tải dữ liệu chương trình: ${message}`);
        }
      } catch (error: any) {
        toast.error(`Lỗi kết nối khi tải dữ liệu chương trình: ${error.message}`);
      }
    };

    findAllPrograms();
  }, [programSearch.timer, programSearch.page, programSearch.limit]); // Trigger on timer, page, or limit change

  // Existing useEffect for filtering - this will now primarily work on `programs` (the mapped data)
  useEffect(() => {
    let result = [...programs]; // Use the full list from API

    // Apply search filter
    if (searchTerm) {
      result = result.filter(
        (program) =>
          program.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          program.description.toLowerCase().includes(searchTerm.toLowerCase()) || // description is empty now, might not work as intended
          program.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply date filter
    if (dateFilter) {
      const filterDate = new Date(dateFilter);
      result = result.filter((program) => {
        const programDate = new Date(program.date);
        return programDate.getDate() === filterDate.getDate() && programDate.getMonth() === filterDate.getMonth() && programDate.getFullYear() === filterDate.getFullYear();
      });
    }

    setFilteredPrograms(result);
  }, [searchTerm, dateFilter, programs]); // programs is now updated by API call

  // Handle pagination changes
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage); // MUI uses 0-indexed
    setProgramSearch((prev) => ({
      ...prev,
      page: newPage + 1, // API uses 1-indexed
      timer: Date.now(), // Trigger useEffect
    }));
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newLimit = parseInt(event.target.value, 10);
    setRowsPerPage(newLimit);
    setPage(0); // Reset to first page
    setProgramSearch((prev) => ({
      ...prev,
      limit: newLimit,
      page: 1, // API uses 1-indexed
      timer: Date.now(), // Trigger useEffect
    }));
  };

  // Handle search and filter changes - call api
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setProgramSearch((prev) => ({
      ...prev,
      keyword: event.target.value,
      page: 1, // Reset page on new search
      timer: Date.now(),
    }));
  };

  const handleDateFilterChange = (date: Date | null) => {
    setDateFilter(date);
    setProgramSearch((prev) => ({
      ...prev,
      date: date ? format(date, "yyyy-MM-dd") : null,
      page: 1, // Reset page on new filter
      timer: Date.now(),
    }));
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setDateFilter(null);
    setProgramSearch((prev) => ({
      ...prev,
      keyword: null,
      date: null,
      page: 1, // Reset page
      timer: Date.now(),
    }));
  };

  // Handle program dialog
  const handleOpenAddDialog = () => {
    setDialogMode("add");
    setFormData({
      id: 0,
      title: "",
      description: "",
      location: "",
      date: new Date(),
      time: "09:00",
      duration: 120,
      capacity: 0,
      registrations: 0,
      image: "",
    });
    setSelectedImageFile(null);
    setImagePreview("");
    setOpenProgramDialog(true);
  };

  const handleOpenEditDialog = (program: Program) => {
    setDialogMode("edit");
    setCurrentProgram(program);

    // Retrieve full DTO data to fill form if needed, or rely on existing Program data
    // Assuming Program object has enough data for editing (e.g. date, time extracted from date object)
    const programDate = new Date(program.date);
    const programTime = format(programDate, "HH:mm"); // Format date object back to HH:mm string

    setFormData({
      id: parseInt(program.id), // Convert string ID back to number for DTO
      title: program.title,
      description: program.description,
      location: program.location,
      date: programDate,
      time: programTime,
      duration: program.duration,
      capacity: program.capacity,
      registrations: program.registrations,
      image: program.image || "",
    });

    // Set image preview for existing program
    setSelectedImageFile(null);
    if (program.image) {
      setImagePreview(getImageUrl(program.image));
    } else {
      setImagePreview("");
    }

    setOpenProgramDialog(true);
  };

  const handleCloseProgramDialog = () => {
    setOpenProgramDialog(false);
    setCurrentProgram(null);
    setSelectedImageFile(null);
    setImagePreview("");
  };

  const handleFormChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDateChange = (date: Date | null) => {
    if (date) {
      setFormData((prev) => ({
        ...prev,
        date,
      }));
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProgram = async () => {
    if (!formData.title || !formData.location || !formData.date || !formData.time || formData.capacity <= 0) {
      toast.error("Vui lòng điền đầy đủ thông tin bắt buộc và sức chứa phải lớn hơn 0.");
      return;
    }

    try {
      const programDTO = mapFormDataToProgramDTO(formData);
      let code, data, message;

      if (dialogMode === "add") {
        [code, data, message] = await _programService.createProgram(programDTO, selectedImageFile || undefined);
      } else {
        [code, data, message] = await _programService.updateProgram(programDTO.id, programDTO, selectedImageFile || undefined);
      }

      if (code === 200) {
        toast.success(message || `Chương trình đã được ${dialogMode === "add" ? "thêm" : "cập nhật"} thành công!`);
        handleCloseProgramDialog();
        // Trigger a refresh of the program list
        setProgramSearch((prev) => ({
          ...prev,
          timer: Date.now(),
        }));
      } else {
        toast.error(message || `Đã có lỗi xảy ra khi ${dialogMode === "add" ? "thêm" : "cập nhật"} chương trình.`);
      }
    } catch (error: any) {
      toast.error(`Lỗi kết nối: ${error.message}`);
    }
  };

  const handleDeleteProgram = async (program: Program) => {
    const result = await Swal.fire({
      title: `Xác nhận xóa?`,
      text: `Bạn có chắc muốn xóa chương trình "${program.title}" không?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
    });

    if (result.isConfirmed) {
      try {
        const [code, data, message] = await _programService.deleteProgram(parseInt(program.id));

        if (code === 200) {
          await Swal.fire({
            icon: "success",
            title: "Đã xóa!",
            text: `Chương trình "${program.title}" đã được xóa.`,
            timer: 2000,
            showConfirmButton: false,
          });

          // Trigger a refresh of the program list
          setProgramSearch((prev) => ({
            ...prev,
            timer: Date.now(),
          }));
        } else {
          toast.error(message || "Đã có lỗi xảy ra khi xóa chương trình.");
        }
      } catch (error: any) {
        console.error("Lỗi khi xóa:", error);
        Swal.fire({
          icon: "error",
          title: "Lỗi",
          text: "Không thể xóa chương trình. Vui lòng thử lại sau.",
        });
      }
    }
  };

  const handleOpenRegistrationsDialog = async (program: Program) => {
    setSelectedProgramForRegistrations(program);
    try {
      const [code, data, message] = await _programService.getRegisteredUsers(parseInt(program.id));
      if (code === 200 && data) {
        setRegistrationsList(data);
      } else {
        toast.error(message || "Không thể tải danh sách đăng ký");
      }
    } catch (error: any) {
      toast.error(`Lỗi khi tải danh sách đăng ký: ${error.message}`);
    }
    setOpenRegistrationsDialog(true);
  };

  const handleCloseRegistrationsDialog = () => {
    setOpenRegistrationsDialog(false);
    setSelectedProgramForRegistrations(null);
    setRegistrationsList([]);
  };

  return (
    <Container>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Quản lý chương trình
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Quản lý tất cả chương trình trong hệ thống
        </Typography>
      </Box>

      {/* Toolbar */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, alignItems: "center" }}>
          <TextField
            label="Tìm kiếm"
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
          />

          <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={vi}>
            <DatePicker label="Lọc theo ngày" value={dateFilter} onChange={handleDateFilterChange} format="dd/MM/yyyy" slotProps={{ textField: { size: "small" } }} />
          </LocalizationProvider>

          <Tooltip title="Đặt lại bộ lọc">
            <IconButton onClick={handleResetFilters}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>

          <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenAddDialog}>
            Thêm chương trình
          </Button>
        </Box>
      </Paper>

      {/* Programs Table */}
      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <TableContainer>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>STT</TableCell>
                <TableCell>Tiêu đề</TableCell>
                <TableCell>Địa điểm</TableCell>
                <TableCell>Ngày</TableCell>
                <TableCell>Thời gian</TableCell>
                <TableCell>Sức chứa</TableCell>
                <TableCell>Đã đăng ký</TableCell>
                <TableCell align="center">Hành động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {programs.length > 0 ? (
                programs.map((program, index) => (
                  <TableRow hover key={program.id}>
                    <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                    <TableCell>
                      <Typography variant="body1" fontWeight="medium">
                        {program.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ fontSize: "0.8rem" }}>
                        {program.description ? program.description.substring(0, 50) + "..." : "Không có mô tả"}
                      </Typography>
                    </TableCell>
                    <TableCell>{program.location}</TableCell>
                    <TableCell>{format(new Date(program.date), "dd/MM/yyyy")}</TableCell>
                    <TableCell>{format(new Date(program.date), "HH:mm")}</TableCell>
                    <TableCell>{program.capacity}</TableCell>
                    <TableCell>{program.registrations}</TableCell>
                    <TableCell align="center">
                      <Tooltip title="Xem danh sách đăng ký">
                        <IconButton onClick={() => handleOpenRegistrationsDialog(program)} color="info">
                          <PeopleIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Chỉnh sửa">
                        <IconButton onClick={() => handleOpenEditDialog(program)} color="primary">
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Xóa">
                        <IconButton onClick={() => handleDeleteProgram(program)} color="error">
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    <Typography variant="body2" color="text.secondary">
                      Không có chương trình nào được tìm thấy.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination rowsPerPageOptions={[5, 10, 25, 50]} component="div" count={totalElements} rowsPerPage={rowsPerPage} page={page} onPageChange={handleChangePage} onRowsPerPageChange={handleChangeRowsPerPage} labelRowsPerPage="Số hàng mỗi trang:" labelDisplayedRows={({ from, to, count }) => `${from}-${to} của ${count}`} />
      </Paper>

      {/* Program Dialog (Add/Edit) */}
      <Dialog open={openProgramDialog} onClose={handleCloseProgramDialog} maxWidth="md" fullWidth>
        <DialogTitle>{dialogMode === "add" ? "Thêm Chương trình mới" : "Chỉnh sửa Chương trình"}</DialogTitle>
        <DialogContent dividers>
          <TextField autoFocus margin="dense" name="title" label="Tiêu đề chương trình" type="text" fullWidth variant="outlined" value={formData.title} onChange={handleFormChange} sx={{ mb: 2 }} required />
          <TextField
            margin="dense"
            name="location" // Mapped to address in DTO
            label="Địa điểm"
            type="text"
            fullWidth
            variant="outlined"
            value={formData.location}
            onChange={handleFormChange}
            sx={{ mb: 2 }}
            required
          />
          <Box sx={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 2, mb: 2 }}>
            <Box>
              <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={vi}>
                <DatePicker label="Ngày diễn ra" value={formData.date} onChange={handleDateChange} format="dd/MM/yyyy" sx={{ width: "100%" }} />
              </LocalizationProvider>
            </Box>
            <Box>
              <TextField
                margin="dense"
                name="time"
                label="Thời gian (HH:mm)"
                type="time"
                fullWidth
                variant="outlined"
                value={formData.time}
                onChange={handleFormChange}
                InputLabelProps={{
                  shrink: true,
                }}
                inputProps={{
                  step: 300, // 5 minute intervals
                }}
                required
              />
            </Box>
          </Box>
          <TextField margin="dense" name="capacity" label="Sức chứa" type="number" fullWidth variant="outlined" value={formData.capacity} onChange={handleFormChange} sx={{ mb: 2 }} required inputProps={{ min: 0 }} />

          <TextField
            margin="dense"
            name="description"
            label="Mô tả chương trình"
            type="text"
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            value={formData.description}
            onChange={handleFormChange}
            sx={{ mb: 2 }}
            // Not required for API, but for UI it can be
          />
          {/* Image Upload */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Ảnh chương trình
            </Typography>
            <input accept="image/*" style={{ display: "none" }} id="image-upload" type="file" onChange={handleImageChange} />
            <label htmlFor="image-upload">
              <Button variant="outlined" component="span" sx={{ mb: 1 }}>
                Chọn ảnh
              </Button>
            </label>
            {imagePreview && (
              <Box sx={{ mt: 1 }}>
                <img
                  src={imagePreview}
                  alt="Preview"
                  style={{
                    maxWidth: "200px",
                    maxHeight: "150px",
                    objectFit: "cover",
                    borderRadius: "4px",
                  }}
                />
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseProgramDialog}>Hủy</Button>
          <Button onClick={handleSaveProgram} variant="contained" color="primary">
            {dialogMode === "add" ? "Thêm" : "Cập nhật"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Registrations Dialog */}
      <Dialog open={openRegistrationsDialog} onClose={handleCloseRegistrationsDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box>
            <Typography component="span">Danh sách đăng ký: {selectedProgramForRegistrations?.title}</Typography>
            <Box sx={{ mt: 1 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                <LocationIcon fontSize="small" color="action" />
                <Typography variant="subtitle1" component="span" color="text.secondary">
                  {selectedProgramForRegistrations?.location}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <EventIcon fontSize="small" color="action" />
                <Typography variant="subtitle2" component="span" color="text.secondary">
                  {selectedProgramForRegistrations?.date ? format(new Date(selectedProgramForRegistrations.date), "dd/MM/yyyy HH:mm") : ""}
                </Typography>
              </Box>
            </Box>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          <List>
            {registrationsList.length > 0 ? (
              registrationsList.map((registration, index) => (
                <React.Fragment key={registration.id || index}>
                  <ListItem alignItems="flex-start">
                    <ListItemAvatar>
                      <Avatar src={getAvatarUrl(registration.avatar)} alt={registration.fullname} sx={{ mr: 2, width: 40, height: 40 }} onError={handleImageError}>
                        {registration.fullname?.charAt(0)?.toUpperCase() || "?"}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={registration.fullname}
                      secondaryTypographyProps={{ component: "div" }}
                      secondary={
                        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mt: 0.5 }}>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                            <EmailIcon fontSize="small" color="action" />
                            <Typography variant="body2" color="text.secondary" component="span">
                              {registration.email}
                            </Typography>
                          </Box>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                            <PhoneIcon fontSize="small" color="action" />
                            <Typography variant="body2" color="text.secondary" component="span">
                              {registration.phone}
                            </Typography>
                          </Box>
                        </Box>
                      }
                    />
                  </ListItem>
                  {index < registrationsList.length - 1 && <Divider variant="inset" component="li" />}
                </React.Fragment>
              ))
            ) : (
              <ListItem>
                <ListItemText
                  primary={
                    <Typography variant="body1" align="center" color="text.secondary">
                      Chưa có người đăng ký tham gia chương trình này.
                    </Typography>
                  }
                />
              </ListItem>
            )}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseRegistrationsDialog}>Đóng</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminProgramsPage;
