package com.project.codebasespringjpa.controller;

import com.project.codebasespringjpa.dto.appointment.request.AppointmentRequest;
import com.project.codebasespringjpa.dto.appointment.request.AppointmentSearch;
import com.project.codebasespringjpa.dto.appointment.request.StatusRequest;
import com.project.codebasespringjpa.dto.appointment.response.AppointmentResponse;
import com.project.codebasespringjpa.exception.ApiResponse;
import com.project.codebasespringjpa.service.interfaces.IAppointmentService;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;

@RestController
@FieldDefaults(level = AccessLevel.PRIVATE)
@RequestMapping("/appoinments")
public class AppoinmentController {
    @Autowired
    IAppointmentService appointmentService;

    @GetMapping("")
    ApiResponse<AppointmentResponse> findById(@RequestParam(name = "id") Long id) {
        return ApiResponse.<AppointmentResponse>builder()
                .data(appointmentService.findByid(id))
                .build();
    }

    @GetMapping("/find-all")
    ApiResponse<Page<AppointmentResponse>> findAll(@RequestParam(name = "page", defaultValue = "1") Integer page,
                                                   @RequestParam(name = "limit", defaultValue = "5") Integer limit,
                                                   @RequestParam(name = "username", required = false) String username,
                                                   @RequestParam(name = "specialistName", required = false) String specialistName,
                                                   @RequestParam(name = "keyword", required = false) String keyword,
                                                   @RequestParam(name = "status", required = false) String status,
                                                   @RequestParam(name = "date", required = false) LocalDate date) {

        Pageable pageable = PageRequest.of(page - 1, limit);
        AppointmentSearch appointmentSearch = AppointmentSearch.builder()
                .username(username)
                .specialistName(specialistName)
                .keyword(keyword)
                .status(status)
                .date(date)
                .build();

        return ApiResponse.<Page<AppointmentResponse>>builder()
                .data(appointmentService.findAll(pageable, appointmentSearch))
                .build();
    }

    @PostMapping("/create")
    ApiResponse<AppointmentResponse> create(@RequestBody AppointmentRequest request) {
        return ApiResponse.<AppointmentResponse>builder()
                .data(appointmentService.create(request))
                .build();
    }

    @PutMapping("/update/{id}")
    ApiResponse<AppointmentResponse> update(@PathVariable Long id, @RequestBody AppointmentRequest request) {
        return ApiResponse.<AppointmentResponse>builder()
                .data(appointmentService.update(id, request))
                .build();
    }

    @DeleteMapping("/delete/{id}")
    ApiResponse<String> delete(@PathVariable Long id) {
        appointmentService.delete(id);
        return ApiResponse.<String>builder()
                .data("Xóa thành công")
                .build();
    }

    @PutMapping("/change-status/{id}")
    ApiResponse<AppointmentResponse> changeStatus(@PathVariable Long id, @RequestBody StatusRequest request){
        return ApiResponse.<AppointmentResponse>builder()
                .data(appointmentService.changeStatus(id, request))
                .build();
    }
}
