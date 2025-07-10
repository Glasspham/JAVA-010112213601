package com.project.codebasespringjpa.service.imp;

import com.project.codebasespringjpa.dto.statics.ProgramLocationResponse;
import com.project.codebasespringjpa.dto.statics.StaticProgramResponse;
import com.project.codebasespringjpa.dto.statics.DashboardResponse;
import com.project.codebasespringjpa.entity.ProgramEntity;
import com.project.codebasespringjpa.repository.ICourseRepository;
import com.project.codebasespringjpa.repository.IProgramRepository;
import com.project.codebasespringjpa.repository.IUserRepository;
import com.project.codebasespringjpa.service.interfaces.*;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Transactional
@FieldDefaults(level = AccessLevel.PRIVATE)
public class StaticService implements IStaticService {
    @Autowired
    IUserRepository userRepository;
    @Autowired
    ICourseRepository courseRepository;
    @Autowired
    IProgramRepository programRepository;

    @Override
    public DashboardResponse getDashboard() {
        return DashboardResponse.builder()
                .cntUser(userRepository.cntUserActice())
                .cntSpecialist(userRepository.cntSpecialistActive())
                .cntCourse(courseRepository.countCourseActive())
                .cntProgram(programRepository.countProgramActive())
                .build();
    }

    @Override
    public List<StaticProgramResponse> getStaticProgram(int year) {
        List<StaticProgramResponse> result = new ArrayList<>();
        for (int i = 1; i <= 12; i++) {
            List<ProgramEntity> programs = programRepository.findByMonthAndYear(i, year);
            if (programs != null) {
                Integer register = 0;
                for (var it : programs) {
                    if (it.getUsers() != null)
                        register += it.getUsers().size();
                }
                StaticProgramResponse response = StaticProgramResponse.builder()
                        .cntProgram(programs.size())
                        .cntRegister(register)
                        .build();
                result.add(response);
            }
        }
        return result;
    }

    @Override
    public List<ProgramLocationResponse> getCountLocation(int year) {
        List<ProgramLocationResponse> result = new ArrayList<>();
        List<ProgramEntity> programs = programRepository.findByYear(year);
        if (programs != null && !programs.isEmpty()) {
            // Dùng Map để nhóm theo address và đếm
            Map<String, Long> locationCountMap = programs.stream()
                    .filter(p -> p.getDate() != null && p.getDate().getYear() == year)
                    .collect(Collectors.groupingBy(
                            ProgramEntity::getAddress,
                            Collectors.counting()));
            // Chuyển thành response
            for (Map.Entry<String, Long> entry : locationCountMap.entrySet()) {
                ProgramLocationResponse response = new ProgramLocationResponse();
                response.setLocation(entry.getKey());
                response.setCount(entry.getValue().intValue());
                result.add(response);
            }
        }
        return result;
    }
}