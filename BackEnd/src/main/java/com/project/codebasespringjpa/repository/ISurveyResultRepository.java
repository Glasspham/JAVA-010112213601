package com.project.codebasespringjpa.repository;

import com.project.codebasespringjpa.entity.SurveyResultEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ISurveyResultRepository extends JpaRepository<SurveyResultEntity, Long> {
    @Query("""
            select sr from SurveyResultEntity sr where sr.survey.isDelete = false and sr.user.username = :username
            and (:surveyId is null or sr.survey.id = :surveyId)
            """)
    List<SurveyResultEntity> findAll(@Param("username") String username,
            @Param("surveyId") Long surveyId);
}
