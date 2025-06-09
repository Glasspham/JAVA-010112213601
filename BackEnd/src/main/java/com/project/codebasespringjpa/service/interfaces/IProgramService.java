package com.project.codebasespringjpa.service.interfaces;

import com.project.codebasespringjpa.dto.program.request.ProgramRequest;
import com.project.codebasespringjpa.dto.program.request.ProgramSearch;
import com.project.codebasespringjpa.dto.program.response.ProgramResponse;
import com.project.codebasespringjpa.entity.ProgramEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface IProgramService {
    ProgramEntity findEntityById(Long id);
    ProgramResponse create(ProgramRequest request);
    ProgramResponse findByid(Long id);
    Page<ProgramResponse> findAll(Pageable pageable, ProgramSearch programSearch);
}
