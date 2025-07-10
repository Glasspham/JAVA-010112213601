package com.project.codebasespringjpa.service.imp;

import com.project.codebasespringjpa.dto.program.request.ProgramRegisterRequest;
import com.project.codebasespringjpa.dto.program.request.ProgramRequest;
import com.project.codebasespringjpa.dto.program.request.ProgramSearch;
import com.project.codebasespringjpa.dto.program.response.ProgramResponse;
import com.project.codebasespringjpa.dto.user.response.UserResponse;
import com.project.codebasespringjpa.entity.ProgramEntity;
import com.project.codebasespringjpa.entity.UserEntity;
import com.project.codebasespringjpa.exception.AppException;
import com.project.codebasespringjpa.exception.ErrorCode;
import com.project.codebasespringjpa.mapper.ProgramMapper;
import com.project.codebasespringjpa.mapper.UserMapper;
import com.project.codebasespringjpa.repository.IProgramRepository;
import com.project.codebasespringjpa.repository.IUserRepository;
import com.project.codebasespringjpa.service.interfaces.IProgramService;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import java.time.LocalTime;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
@Transactional
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ProgramService implements IProgramService {
    @Autowired
    IProgramRepository programRepository;
    @Autowired
    ProgramMapper programMapper;
    @Autowired
    IUserRepository userRepository;
    @Autowired
    UserMapper userMapper;

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
        } catch (Exception e) {
            log.error("Can not get time in request program: " + e.getMessage());
        }
        ProgramEntity programUpdate = this.findEntityById(id);
        programUpdate.setTitle(request.getTitle());
        programUpdate.setAddress(request.getAddress());
        programUpdate.setDate(request.getDate());
        programUpdate.setTime(time);
        programUpdate.setStatus(request.getStatus());
        programUpdate.setCapacity(request.getCapacity());
        programUpdate.setDescription(request.getDescription());
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
    public void registerProgram(ProgramRegisterRequest request) {
        UserEntity user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        ProgramEntity programEntity = this.findEntityById(request.getProgramId());
        if (programEntity.getUsers().size() >= programEntity.getCapacity())
            throw new AppException(ErrorCode.CAPACITY_FULL);
        user.getPrograms().add(programEntity);
        userRepository.save(user);
    }

    @Override
    public Boolean isRegister(ProgramRegisterRequest request) {
        UserEntity user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        ProgramEntity programEntity = this.findEntityById(request.getProgramId());
        return user.getPrograms().contains(programEntity);
    }

    @Override
    public List<UserResponse> listUserRegister(Long idProgram) {
        ProgramEntity programEntity = this.findEntityById(idProgram);
        List<UserResponse> userResponses = new ArrayList<>();
        if (programEntity.getUsers() != null) {
            List<UserEntity> userEntities = programEntity.getUsers();
            for (UserEntity it : userEntities) {
                if (it.getIsDelete() == false)
                    userResponses.add(userMapper.toResponse(it));
            }
        }
        return userResponses;
    }

    @Override
    public List<ProgramResponse> listProgramRegister(String username) {
        UserEntity userEntity = userRepository.findByUsername(username)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        List<ProgramResponse> programResponses = new ArrayList<>();
        if (userEntity.getPrograms() != null) {
            for (var it : userEntity.getPrograms())
                if (it.getIsDelete() == false)
                    programResponses.add(programMapper.toResponse(it));
        }
        return programResponses;
    }

    @Override
    public void delete(Long id) {
        ProgramEntity programFind = this.findEntityById(id);
        programFind.setIsDelete(true);
        programRepository.save(programFind);
    }
}