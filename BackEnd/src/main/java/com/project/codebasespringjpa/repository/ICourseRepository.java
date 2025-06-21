package com.project.codebasespringjpa.repository;

import com.project.codebasespringjpa.entity.CourseEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ICourseRepository extends JpaRepository<CourseEntity, Long> {
    @Query("""
    select cs from CourseEntity cs where cs.isDelete = false 
        and (:keyword is null or cs.name like concat('%', :keyword, '%'))  
        and (:object is null or exists (select 1 from cs.objects csoj where csoj.name = :object))  
        order by cs.createDate desc     
    """)
    Page<CourseEntity> findAll(
            @Param("keyword") String keyword,
            @Param("object") String object,
            Pageable pageable);

    @Query("select count (cs) from CourseEntity cs where cs.isDelete = false ")
    Long countCourseActive();
}
