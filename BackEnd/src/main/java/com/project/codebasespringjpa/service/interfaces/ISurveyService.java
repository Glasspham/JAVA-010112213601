package com.project.codebasespringjpa.service.interfaces;

import com.project.codebasespringjpa.dto.survey.request.SurveyRequest;
import com.project.codebasespringjpa.dto.survey.request.SurveySearch;
import com.project.codebasespringjpa.dto.survey.response.SurveyResponse;
import com.project.codebasespringjpa.entity.SurveyEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ISurveyService {
    SurveyEntity findEntityById(Long id);
    SurveyResponse create(SurveyRequest request);
    SurveyResponse update(Long id, SurveyRequest request);
    SurveyResponse findByid(Long id);
    Page<SurveyResponse> findAll(Pageable pageable, SurveySearch surveySearch);
    void delete(Long id);
}
