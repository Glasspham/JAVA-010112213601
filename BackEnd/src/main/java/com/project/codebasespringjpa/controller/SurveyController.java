package com.project.codebasespringjpa.controller;

import com.project.codebasespringjpa.dto.survey.request.SurveyRequest;
import com.project.codebasespringjpa.dto.survey.request.SurveyResultRequest;
import com.project.codebasespringjpa.dto.survey.request.SurveySearch;
import com.project.codebasespringjpa.dto.survey.response.SurveyResponse;
import com.project.codebasespringjpa.dto.survey.response.SurveyResultResponse;
import com.project.codebasespringjpa.exception.ApiResponse;
import com.project.codebasespringjpa.service.interfaces.ISurveyService;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@FieldDefaults(level = AccessLevel.PRIVATE)
@RequestMapping("/survey")
public class SurveyController {
    @Autowired
    ISurveyService surveyService;

    @GetMapping("")
    ApiResponse<SurveyResponse> findById(@RequestParam(name = "id") Long id) {
        return ApiResponse.<SurveyResponse>builder()
                .data(surveyService.findByid(id))
                .build();
    }

    @GetMapping("/find-all")
    ApiResponse<Page<SurveyResponse>> findAll(@RequestParam(name = "page", defaultValue = "1") Integer page,
            @RequestParam(name = "limit", defaultValue = "5") Integer limit,
            @RequestParam(name = "keyword", required = false) String keyword,
            @RequestParam(name = "type", required = false) String type) {

        Pageable pageable = PageRequest.of(page - 1, limit);
        SurveySearch surveySearch = SurveySearch.builder()
                .keyword(keyword)
                .type(type)
                .build();

        return ApiResponse.<Page<SurveyResponse>>builder()
                .data(surveyService.findAll(pageable, surveySearch))
                .build();
    }

    @PostMapping("/create")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SPECIALIST')")
    ApiResponse<SurveyResponse> create(@RequestBody SurveyRequest request) {
        return ApiResponse.<SurveyResponse>builder()
                .data(surveyService.create(request))
                .build();
    }

    @PutMapping("/update/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SPECIALIST')")
    ApiResponse<SurveyResponse> update(@PathVariable Long id, @RequestBody SurveyRequest request) {
        return ApiResponse.<SurveyResponse>builder()
                .data(surveyService.update(id, request))
                .build();
    }

    @DeleteMapping("/delete/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SPECIALIST')")
    ApiResponse<String> delete(@PathVariable Long id) {
        surveyService.delete(id);
        return ApiResponse.<String>builder()
                .data("Xóa thành công")
                .build();
    }

    @PostMapping("/mark")
    ApiResponse<SurveyResultResponse> mark(@RequestBody SurveyResultRequest request) {
        return ApiResponse.<SurveyResultResponse>builder()
                .data(surveyService.mark(request))
                .build();
    }

    @GetMapping("/list-mark")
    ApiResponse<List<SurveyResultResponse>> findAll(@RequestParam(name = "username") String username,
            @RequestParam(name = "idSurvey", required = false) Long idSurvey) {
        return ApiResponse.<List<SurveyResultResponse>>builder()
                .data(surveyService.findResultByUsernameAndSurvey(username, idSurvey))
                .build();
    }
}
