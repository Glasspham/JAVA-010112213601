package com.project.codebasespringjpa.controller;

import com.project.codebasespringjpa.dto.program.request.ProgramRequest;
import com.project.codebasespringjpa.dto.program.request.ProgramSearch;
import com.project.codebasespringjpa.dto.program.response.ProgramResponse;
import com.project.codebasespringjpa.exception.ApiResponse;
import com.project.codebasespringjpa.service.interfaces.IProgramService;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;

@Slf4j
@RestController
@FieldDefaults(level = AccessLevel.PRIVATE)
@RequestMapping("/programs")
public class ProgramController {
    @Autowired
    IProgramService programService;

    @GetMapping("")
    ApiResponse<ProgramResponse> findById(@RequestParam(name = "id") Long id) {
        return ApiResponse.<ProgramResponse>builder()
                .data(programService.findByid(id))
                .build();
    }

    @GetMapping("/find-all")
    ApiResponse<Page<ProgramResponse>> findAll(@RequestParam(name = "page", defaultValue = "1") Integer page,
                                              @RequestParam(name = "limit", defaultValue = "5") Integer limit,
                                              @RequestParam(name = "keyword", required = false) String keyword,
                                               @RequestParam(name = "status", required = false) String status,
                                               @RequestParam(name = "date", required = false) LocalDate date){

        Pageable pageable = PageRequest.of(page-1, limit);
        ProgramSearch programSearch = ProgramSearch.builder()
                .keyword(keyword)
                .status(status)
                .date(date)
                .build();

        return ApiResponse.<Page<ProgramResponse>>builder()
                .data(programService.findAll(pageable, programSearch))
                .build();
    }

    @PostMapping("/create")
    ApiResponse<ProgramResponse> create(@RequestBody ProgramRequest request) {
        log.error("create program controller ...");
        return ApiResponse.<ProgramResponse>builder()
                .data(programService.create(request))
                .build();
    }

    @PutMapping("/update/{id}")
    ApiResponse<ProgramResponse> update(
            @PathVariable Long id,
            @RequestBody ProgramRequest request) {
        return ApiResponse.<ProgramResponse>builder()
                .data(programService.update(id, request))
                .build();
    }

    @DeleteMapping("/delete/{id}")
    ApiResponse<String> delete(
            @PathVariable Long id) {

        programService.delete(id);

        return ApiResponse.<String>builder()
                .data("Xóa thành công")
                .build();
    }
}
