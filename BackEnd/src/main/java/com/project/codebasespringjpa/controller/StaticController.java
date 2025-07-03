package com.project.codebasespringjpa.controller;

import com.project.codebasespringjpa.dto.statics.ProgramLocationResponse;
import com.project.codebasespringjpa.dto.statics.StaticProgramResponse;
import com.project.codebasespringjpa.dto.statics.DashboardResponse;
import com.project.codebasespringjpa.exception.ApiResponse;
import com.project.codebasespringjpa.service.interfaces.IStaticService;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

@RestController
@FieldDefaults(level = AccessLevel.PRIVATE)
@RequestMapping("/static")
public class StaticController {
    @Autowired
    IStaticService staticService;

    @GetMapping("/dashboard")
    ApiResponse<DashboardResponse> getDashboard(){
        return ApiResponse.<DashboardResponse>builder()
                .data(staticService.getDashboard())
                .build();
    }

    @GetMapping("/static-year")
    ApiResponse<List<StaticProgramResponse>> getProgramByYear(@RequestParam(name = "year") Integer year){
        return ApiResponse.<List<StaticProgramResponse>>builder()
                .data(staticService.getStaticProgram(year))
                .build();
    }

    @GetMapping("/static-location-year")
    ApiResponse<List<ProgramLocationResponse>> getLocationByYear(@RequestParam(name = "year") Integer year){
        return ApiResponse.<List<ProgramLocationResponse>>builder()
                .data(staticService.getCountLocation(year))
                .build();
    }
}
