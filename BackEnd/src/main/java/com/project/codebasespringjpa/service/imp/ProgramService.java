package com.project.codebasespringjpa.service.imp;

import com.project.codebasespringjpa.dto.program.request.ProgramRequest;
import com.project.codebasespringjpa.dto.program.request.ProgramSearch;
import com.project.codebasespringjpa.dto.program.response.ProgramResponse;
import com.project.codebasespringjpa.entity.ProgramEntity;
import com.project.codebasespringjpa.exception.AppException;
import com.project.codebasespringjpa.exception.ErrorCode;
import com.project.codebasespringjpa.mapper.ProgramMapper;
import com.project.codebasespringjpa.repository.IProgramRepository;
import com.project.codebasespringjpa.service.interfaces.IProgramService;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import java.time.LocalTime;

@Slf4j
@Service
@Transactional
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ProgramService implements IProgramService {
    @Autowired
    IProgramRepository programRepository;
    @Autowired
    ProgramMapper programMapper;

    @Override
    public ProgramEntity findEntityById(Long id) {
        return programRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.COURSE_NOT_FOUND));
    }

    @Override
    public ProgramResponse create(ProgramRequest request) {
        ProgramEntity save = programRepository.save(programMapper.toEntity(request));
        log.info("save entity programe = " + save.toString());
        return programMapper.toResponse(save);
    }

    @Override
    public ProgramResponse update(Long id, ProgramRequest request) {
        LocalTime time = null;
        try {
            time = LocalTime.of(request.getHourse(), request.getMinus());
        }catch (Exception e){
            log.error("Can not get time in request program: " + e.getMessage());
        }

        ProgramEntity programUpdate = this.findEntityById(id);
        programUpdate.setTitle(request.getTitle());
        programUpdate.setAddress(request.getAddress());
        programUpdate.setDate(request.getDate());
        programUpdate.setTime(time);
        programUpdate.setStatus(request.getStatus());
        programUpdate.setCapacity(request.getCapacity());

        return programMapper.toResponse(programRepository.save(programUpdate));
    }

    @Override
    public ProgramResponse findByid(Long id) {
        ProgramEntity programFind = this.findEntityById(id);
        return programMapper.toResponse(programFind);
    }

    @Override
    public Page<ProgramResponse> findAll(Pageable pageable, ProgramSearch programSearch) {
        return programRepository.findAll(programSearch.getKeyword(), programSearch.getStatus(), programSearch.getDate(),
                pageable).map(it -> programMapper.toResponse(it));
    }

    @Override
    public void delete(Long id) {
        ProgramEntity programFind = this.findEntityById(id);
        programFind.setIsDelete(true);
        programRepository.save(programFind);
    }
}
