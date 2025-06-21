package com.project.codebasespringjpa.mapper;

import com.project.codebasespringjpa.dto.course.request.CourseDetailRequest;
import com.project.codebasespringjpa.dto.course.response.CourseDetailResponse;
import com.project.codebasespringjpa.entity.CourseDetailEntity;
import com.project.codebasespringjpa.util.UtilConst;
import com.project.codebasespringjpa.util.UtilFile;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Component;

@Component
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CourseDetailMapper {

    public CourseDetailEntity toEntity(CourseDetailRequest request){
        return CourseDetailEntity.builder()
                .name(request.getName())
                .video(request.getVideo())
                .duration(request.getDuration())
                .objective(request.getObjective())
                .content(request.getContent())
                .build();
    }

    public CourseDetailResponse toResponse(CourseDetailEntity entity){
        String videoTmp = UtilConst.NO_IMAGE_DEFAULT;
        if(UtilFile.hasImage(entity.getVideo()))
            videoTmp = entity.getVideo();

        return CourseDetailResponse.builder()
                .id(entity.getId())
                .name(entity.getName())
                .video(videoTmp)
                .duration(entity.getDuration())
                .objective(entity.getObjective())
                .content(entity.getContent())
                .build();
    }
}
