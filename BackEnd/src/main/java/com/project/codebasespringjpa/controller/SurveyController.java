package com.project.codebasespringjpa.controller;

import com.project.codebasespringjpa.dto.survey.request.SurveyRequest;
import com.project.codebasespringjpa.dto.survey.request.SurveySearch;
import com.project.codebasespringjpa.dto.survey.response.SurveyResponse;
import com.project.codebasespringjpa.exception.ApiResponse;
import com.project.codebasespringjpa.service.interfaces.ISurveyService;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

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
        ApiResponse<SurveyResponse> create(@RequestBody SurveyRequest request) {
                return ApiResponse.<SurveyResponse>builder()
                                .data(surveyService.create(request))
                                .build();
        }

        @PutMapping("/update/{id}")
        ApiResponse<SurveyResponse> update(@PathVariable Long id, @RequestBody SurveyRequest request) {
                return ApiResponse.<SurveyResponse>builder()
                                .data(surveyService.update(id, request))
                                .build();
        }

        @DeleteMapping("/delete/{id}")
        ApiResponse<String> delete(@PathVariable Long id) {
                surveyService.delete(id);
                return ApiResponse.<String>builder()
                                .data("Xóa thành công")
                                .build();
        }
}
