package com.project.codebasespringjpa.repository;

import com.project.codebasespringjpa.entity.SurveyEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ISurveyRepository extends JpaRepository<SurveyEntity, Long> {
    @Query("""
    select sv from SurveyEntity sv where sv.isDelete = false 
        and (:keyword is null or sv.name like concat('%', :keyword, '%')) 
        and (:type is null or sv.type = :type) 
    """)
    Page<SurveyEntity> findAll(
            @Param("keyword") String keyword,
            @Param("type") String type,
            Pageable pageable);
}
