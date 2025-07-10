package com.project.codebasespringjpa.service.interfaces;

import com.project.codebasespringjpa.dto.survey.request.SurveyRequest;
import com.project.codebasespringjpa.dto.survey.request.SurveyResultRequest;
import com.project.codebasespringjpa.dto.survey.request.SurveySearch;
import com.project.codebasespringjpa.dto.survey.response.SurveyResponse;
import com.project.codebasespringjpa.dto.survey.response.SurveyResultResponse;
import com.project.codebasespringjpa.entity.SurveyEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;

public interface ISurveyService {
    SurveyEntity findEntityById(Long id);
    SurveyResponse create(SurveyRequest request);
    SurveyResponse update(Long id, SurveyRequest request);
    SurveyResponse findByid(Long id);
    Page<SurveyResponse> findAll(Pageable pageable, SurveySearch surveySearch);
    SurveyResultResponse mark(SurveyResultRequest request);
    List<SurveyResultResponse> findResultByUsernameAndSurvey(String username, Long idSurvey);
    void delete(Long id);
}