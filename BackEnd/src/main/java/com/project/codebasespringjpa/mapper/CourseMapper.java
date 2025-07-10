package com.project.codebasespringjpa.mapper;

import com.project.codebasespringjpa.dto.course.request.CourseRequest;
import com.project.codebasespringjpa.dto.course.response.CourseDetailResponse;
import com.project.codebasespringjpa.dto.course.response.CourseResponse;
import com.project.codebasespringjpa.entity.CourseDetailEntity;
import com.project.codebasespringjpa.entity.CourseEntity;
import com.project.codebasespringjpa.entity.ObjectEntity;
import com.project.codebasespringjpa.repository.IObjectRepository;
import com.project.codebasespringjpa.util.UtilConst;
import com.project.codebasespringjpa.util.UtilFile;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@Component
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CourseMapper {
    @Autowired
    IObjectRepository objectRepository;
    @Autowired
    CourseDetailMapper courseDetailMapper;

    public CourseEntity toEntity(CourseRequest request) {
        List<ObjectEntity> objectEntities = new ArrayList<>();
        try {
            for (var it : request.getObjects()) {
                ObjectEntity object = objectRepository.findByName(it);
                if (object != null) {
                    objectEntities.add(object);
                }
            }
        } catch (Exception e) {
            log.error("Loi convert object entity - course mapper: ", e.getMessage());
        }
        return CourseEntity.builder()
                .name(request.getName())
                .description(request.getDescription())
                .image(request.getImage())
                .objects(objectEntities)
                .build();
    }

    public CourseResponse toResponse(CourseEntity entity) {
        List<String> objects = new ArrayList<>();
        List<String> sallybus = new ArrayList<>();
        List<CourseDetailResponse> courseDetailResponses = new ArrayList<>();
        if (entity != null && entity.getObjects() != null) {
            for (ObjectEntity object : entity.getObjects()) {
                objects.add(object.getName());
            }
        }
        if (entity != null && entity.getCourseDetail() != null) {
            for (CourseDetailEntity courseDetail : entity.getCourseDetail()) {
                if (courseDetail.getIsDelete() == false) {
                    courseDetailResponses.add(courseDetailMapper.toResponse(courseDetail));
                    sallybus.add(courseDetail.getName());
                }
            }
        }
        String imageTmp = UtilConst.NO_IMAGE_DEFAULT;
        if (UtilFile.hasImage(entity.getImage()))
            imageTmp = entity.getImage();
        return CourseResponse.builder()
                .id(entity.getId())
                .name(entity.getName())
                .description(entity.getDescription())
                .duration(entity.getDuration())
                .image(imageTmp)
                .createDate(entity.getCreateDate().toLocalDate())
                .updateDate(entity.getUpdateDate().toLocalDate())
                .objects(objects)
                .courseDetail(courseDetailResponses)
                .build();
    }
}
