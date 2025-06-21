package com.project.codebasespringjpa.service.imp;

import com.project.codebasespringjpa.dto.course.request.CourseDetailRequest;
import com.project.codebasespringjpa.dto.course.response.CourseDetailResponse;
import com.project.codebasespringjpa.entity.CourseDetailEntity;
import com.project.codebasespringjpa.entity.CourseEntity;
import com.project.codebasespringjpa.exception.AppException;
import com.project.codebasespringjpa.exception.ErrorCode;
import com.project.codebasespringjpa.mapper.CourseDetailMapper;
import com.project.codebasespringjpa.repository.ICourseDetailRepository;
import com.project.codebasespringjpa.service.interfaces.ICourseDetailService;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
@Transactional
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CourseDetailService implements ICourseDetailService {
    @Autowired
    ICourseDetailRepository courseDetailRepository;
    @Autowired
    CourseDetailMapper courseDetailMapper;

    @Override
    public CourseDetailEntity findEntityById(Long id) {
        return courseDetailRepository.findById(id).orElseThrow(
                () -> new AppException(ErrorCode.COURSE_DETAIL_NOT_FOUND)
        );
    }

    @Override
    public CourseDetailResponse create(Long idCourse, CourseDetailRequest request) {
        CourseDetailEntity courseDetail = courseDetailMapper.toEntity(request);
        CourseEntity course = CourseEntity.builder()
                .id(idCourse)
                .build();

        courseDetail.setCourse(course);
        return courseDetailMapper.toResponse(courseDetailRepository.save(courseDetail));
    }

    @Override
    public CourseDetailResponse update(Long id, CourseDetailRequest request) {
        CourseDetailEntity courseDetail = this.findEntityById(id);

        courseDetail.setVideo(request.getVideo());
        courseDetail.setDuration(request.getDuration());
        courseDetail.setObjective(request.getObjective());
        courseDetail.setContent(request.getContent());

        return courseDetailMapper.toResponse(courseDetailRepository.save(courseDetail));
    }

    @Override
    public void delete(Long id) {
        CourseDetailEntity courseDetail = this.findEntityById(id);
        courseDetail.setIsDelete(true);

        courseDetailRepository.save(courseDetail);
    }
}
