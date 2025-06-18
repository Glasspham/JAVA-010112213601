package com.project.codebasespringjpa.mapper;

import com.project.codebasespringjpa.dto.program.request.ProgramRequest;
import com.project.codebasespringjpa.dto.program.response.ProgramResponse;
import com.project.codebasespringjpa.entity.ProgramEntity;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import java.time.LocalTime;

@Slf4j
@Component
public class ProgramMapper {
    public ProgramEntity toEntity(ProgramRequest request){
        LocalTime time = null;
        try {
            time = LocalTime.of(request.getHourse(), request.getMinus());
        }catch (Exception e){
            log.error("Can not get time in request program: " + e.getMessage());
        }
        return ProgramEntity.builder()
                .title(request.getTitle())
                .address(request.getAddress())
                .date(request.getDate())
                .time(time)
                .status(request.getStatus())
                .capacity(request.getCapacity())
                .build();
    }

    public ProgramResponse toResponse(ProgramEntity entity){
        Long count = 0L;
        if(entity.getUsers() != null){
            count = entity.getUsers().stream().count();
        }

        return ProgramResponse.builder()
                .id(entity.getId())
                .title(entity.getTitle())
                .address(entity.getAddress())
                .date(entity.getDate())
                .time(entity.getTime())
                .status(entity.getStatus())
                .capacity(entity.getCapacity())
                .countParticipant(count)
                .build();
    }
}
