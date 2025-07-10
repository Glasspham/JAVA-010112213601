package com.project.codebasespringjpa.controller;

import com.project.codebasespringjpa.dto.course.request.CourseRequest;
import com.project.codebasespringjpa.dto.course.request.CourseSearch;
import com.project.codebasespringjpa.dto.course.response.CourseResponse;
import com.project.codebasespringjpa.exception.ApiResponse;
import com.project.codebasespringjpa.service.interfaces.ICourseService;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@FieldDefaults(level = AccessLevel.PRIVATE)
@RequestMapping("/courses")
public class CourseController {
    @Autowired
    ICourseService courseService;

    @GetMapping("")
    ApiResponse<CourseResponse> findById(@RequestParam(name = "id") Long id) {
        return ApiResponse.<CourseResponse>builder()
                .data(courseService.findByid(id))
                .build();
    }

    @GetMapping("/find-all")
    ApiResponse<Page<CourseResponse>> findAll(@RequestParam(name = "page", defaultValue = "1") Integer page,
            @RequestParam(name = "limit", defaultValue = "5") Integer limit,
            @RequestParam(name = "keyword", required = false) String keyword,
            @RequestParam(name = "object", required = false) String object) {

        Pageable pageable = PageRequest.of(page - 1, limit);
        CourseSearch courseSearch = CourseSearch.builder()
                .keyword(keyword)
                .object(object)
                .build();

        return ApiResponse.<Page<CourseResponse>>builder()
                .data(courseService.findAll(pageable, courseSearch))
                .build();
    }

    @PostMapping("/create")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SPECIALIST')")
    ApiResponse<CourseResponse> create(@RequestBody CourseRequest request) {
        return ApiResponse.<CourseResponse>builder()
                .data(courseService.create(request))
                .build();
    }

    @PutMapping("/update/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SPECIALIST')")
    ApiResponse<CourseResponse> update(@PathVariable Long id, @RequestBody CourseRequest request) {
        return ApiResponse.<CourseResponse>builder()
                .data(courseService.update(id, request))
                .build();
    }

    @DeleteMapping("/delete/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SPECIALIST')")
    ApiResponse<String> delete(@PathVariable Long id) {
        courseService.delete(id);
        return ApiResponse.<String>builder()
                .data("Xóa thành công")
                .build();
    }
}
