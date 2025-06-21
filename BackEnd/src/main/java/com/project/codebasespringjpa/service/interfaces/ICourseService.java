package com.project.codebasespringjpa.service.interfaces;

import com.project.codebasespringjpa.dto.course.request.CourseRequest;
import com.project.codebasespringjpa.dto.course.request.CourseSearch;
import com.project.codebasespringjpa.dto.course.response.CourseResponse;
import com.project.codebasespringjpa.entity.CourseEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ICourseService {
    CourseEntity findEntityById(Long id);
    CourseResponse create(CourseRequest request);
    CourseResponse update(Long id, CourseRequest request);
    CourseResponse findByid(Long id);
    Page<CourseResponse> findAll(Pageable pageable, CourseSearch courseSearch);
    void delete(Long id);
}
