package com.project.codebasespringjpa.service.interfaces;

import com.project.codebasespringjpa.dto.course.request.CourseDetailRequest;
import com.project.codebasespringjpa.dto.course.response.CourseDetailResponse;
import com.project.codebasespringjpa.entity.CourseDetailEntity;

public interface ICourseDetailService {
    CourseDetailEntity findEntityById(Long id);
    CourseDetailResponse create(Long idCourse, CourseDetailRequest request);
    CourseDetailResponse update(Long id, CourseDetailRequest request);
    void delete(Long id);
}