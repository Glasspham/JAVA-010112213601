package com.project.codebasespringjpa.repository;

import com.project.codebasespringjpa.entity.CourseDetailEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ICourseDetailRepository extends JpaRepository<CourseDetailEntity, Long> {}