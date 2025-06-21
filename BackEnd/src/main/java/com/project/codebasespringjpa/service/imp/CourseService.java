package com.project.codebasespringjpa.service.imp;

import com.project.codebasespringjpa.dto.course.request.CourseDetailRequest;
import com.project.codebasespringjpa.dto.course.request.CourseRequest;
import com.project.codebasespringjpa.dto.course.request.CourseSearch;
import com.project.codebasespringjpa.dto.course.response.CourseResponse;
import com.project.codebasespringjpa.entity.CourseEntity;
import com.project.codebasespringjpa.entity.ObjectEntity;
import com.project.codebasespringjpa.exception.AppException;
import com.project.codebasespringjpa.exception.ErrorCode;
import com.project.codebasespringjpa.mapper.CourseMapper;
import com.project.codebasespringjpa.repository.ICourseRepository;
import com.project.codebasespringjpa.service.interfaces.ICourseDetailService;
import com.project.codebasespringjpa.service.interfaces.ICourseService;
import com.project.codebasespringjpa.repository.IObjectRepository;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import java.util.ArrayList;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@Transactional
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CourseService implements ICourseService {
    @Autowired
    ICourseRepository courseRepository;
    @Autowired
    CourseMapper courseMapper;
    @Autowired
    IObjectRepository objectRepository;
    @Autowired
    ICourseDetailService courseDetailService;

    @Override
    public CourseEntity findEntityById(Long id) {
        return courseRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.COURSE_NOT_FOUND));
    }

    @Override
    public CourseResponse create(CourseRequest request) {
        CourseEntity save = courseRepository.save(courseMapper.toEntity(request));

        if(request != null && request.getCourseDetail() != null){
            for (CourseDetailRequest courseDetailRequest: request.getCourseDetail()){
                courseDetailService.create(save.getId(), courseDetailRequest);
            }
        }

        return courseMapper.toResponse(save);
    }

    @Override
    public CourseResponse update(Long id, CourseRequest request) {
        List<ObjectEntity> objectEntities = new ArrayList<>();

        try {
            for (var it: request.getObjects()){
                ObjectEntity object = objectRepository.findByName(it);
                if(object != null){
                    objectEntities.add(object);
                }
            }
        }catch (Exception e){
            log.error("Loi convert object entity - course mapper: ", e.getMessage());
        }

        CourseEntity courseUpdate = this.findEntityById(id);
        courseUpdate.setName(request.getName());
        courseUpdate.setDescription(request.getDescription());
        courseUpdate.setImage(request.getImage());
        courseUpdate.setObjects(objectEntities);

        if(request != null && request.getCourseDetail() != null){
            for (CourseDetailRequest courseDetailRequest: request.getCourseDetail()){
                if(courseDetailRequest.getId() != null)
                    courseDetailService.update(courseDetailRequest.getId(), courseDetailRequest);
                else
                    courseDetailService.create(courseUpdate.getId(), courseDetailRequest);
            }
        }

        return courseMapper.toResponse(courseRepository.save(courseUpdate));
    }

    @Override
    public CourseResponse findByid(Long id) {
        CourseEntity courseFind = this.findEntityById(id);
        return courseMapper.toResponse(courseFind);
    }

    @Override
    public Page<CourseResponse> findAll(Pageable pageable, CourseSearch courseSearch) {
        return courseRepository.findAll(courseSearch.getKeyword(), courseSearch.getObject(),
                pageable).map(it -> courseMapper.toResponse(it));
    }

    @Override
    public void delete(Long id) {
        CourseEntity courseFind = this.findEntityById(id);
        courseFind.setIsDelete(true);
        courseRepository.save(courseFind);
    }
}
