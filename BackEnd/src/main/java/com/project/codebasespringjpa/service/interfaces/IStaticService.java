package com.project.codebasespringjpa.service.interfaces;

import com.project.codebasespringjpa.dto.statics.ProgramLocationResponse;
import com.project.codebasespringjpa.dto.statics.StaticProgramResponse;
import com.project.codebasespringjpa.dto.statics.DashboardResponse;
import java.util.List;

public interface IStaticService {
    DashboardResponse getDashboard();
    List<StaticProgramResponse> getStaticProgram(int year);
    List<ProgramLocationResponse> getCountLocation(int year);
}
