package com.project.codebasespringjpa.service.imp;

import com.project.codebasespringjpa.dto.answer.request.AnswerRequest;
import com.project.codebasespringjpa.dto.question.request.QuestionRequest;
import com.project.codebasespringjpa.dto.survey.request.SurveyRequest;
import com.project.codebasespringjpa.dto.survey.request.SurveyResultRequest;
import com.project.codebasespringjpa.dto.survey.request.SurveySearch;
import com.project.codebasespringjpa.dto.survey.response.SurveyResponse;
import com.project.codebasespringjpa.dto.survey.response.SurveyResultResponse;
import com.project.codebasespringjpa.entity.AnswerEntity;
import com.project.codebasespringjpa.entity.QuestionEntity;
import com.project.codebasespringjpa.entity.SurveyEntity;
import com.project.codebasespringjpa.entity.SurveyResultEntity;
import com.project.codebasespringjpa.exception.AppException;
import com.project.codebasespringjpa.exception.ErrorCode;
import com.project.codebasespringjpa.mapper.SurveyMapper;
import com.project.codebasespringjpa.mapper.SurveyResultMapper;
import com.project.codebasespringjpa.repository.IAnswerRepository;
import com.project.codebasespringjpa.repository.IQuestionRepository;
import com.project.codebasespringjpa.repository.ISurveyRepository;
import com.project.codebasespringjpa.repository.ISurveyResultRepository;
import com.project.codebasespringjpa.service.interfaces.ISurveyService;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import java.util.List;

@Slf4j
@Service
@Transactional
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SurveyService implements ISurveyService {
    @Autowired
    ISurveyRepository surveyRepository;
    @Autowired
    SurveyMapper surveyMapper;
    @Autowired
    IQuestionRepository questionRepository;
    @Autowired
    IAnswerRepository answerRepository;
    @Autowired
    SurveyResultMapper surveyResultMapper;
    @Autowired
    ISurveyResultRepository surveyResultRepository;

    @Override
    public SurveyEntity findEntityById(Long id) {
        return surveyRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.SURVEY_NOT_FOUND));
    }

    @Override
    public SurveyResponse create(SurveyRequest request) {
        // 1. ----Luu survey entity
        SurveyEntity surveyEntity = surveyMapper.toEntity(request);
        SurveyEntity surveySave = surveyRepository.save(surveyEntity);
        // 2. ---- luu question and answer
        try {
            for (QuestionRequest questionRequest : request.getQuestions()) {
                QuestionEntity question = QuestionEntity.builder()
                        .content(questionRequest.getContent())
                        .survey(surveySave)
                        .build();
                // -----save question
                QuestionEntity questionSave = questionRepository.save(question);
                // ---save answer
                if (questionRequest != null && questionRequest.getAnswers() != null) {
                    for (AnswerRequest answerRequest : questionRequest.getAnswers()) {
                        AnswerEntity answer = AnswerEntity.builder()
                                .content(answerRequest.getContent())
                                .correct(answerRequest.getCorrect())
                                .question(questionSave)
                                .build();
                        answerRepository.save(answer);
                    }
                }
            }
        } catch (Exception e) {
            log.error("Loi khi luu answer (survey service): " + e.getMessage());
        }
        return surveyMapper.toResponse(surveySave);
    }

    @Override
    public SurveyResponse update(Long id, SurveyRequest request) {
        SurveyEntity surveyFind = this.findEntityById(id);
        surveyFind.setName(request.getName());
        surveyFind.setType(request.getType());
        surveyFind.getQuestions().clear();
        SurveyEntity surveyUpdate = surveyRepository.save(surveyFind);
        // 2. ---- luu question and answer
        try {
            for (QuestionRequest questionRequest : request.getQuestions()) {
                QuestionEntity question = QuestionEntity.builder()
                        .content(questionRequest.getContent())
                        .survey(surveyUpdate)
                        .build();
                // -----save question
                QuestionEntity questionSave = questionRepository.save(question);
                // ---save answer
                if (questionRequest != null && questionRequest.getAnswers() != null) {
                    for (AnswerRequest answerRequest : questionRequest.getAnswers()) {
                        AnswerEntity answer = AnswerEntity.builder()
                                .content(answerRequest.getContent())
                                .correct(answerRequest.getCorrect())
                                .question(questionSave)
                                .build();
                        answerRepository.save(answer);
                    }
                }
            }
        } catch (Exception e) {
            log.error("Loi khi luu answer (survey service): " + e.getMessage());
        }
        return surveyMapper.toResponse(surveyUpdate);
    }

    @Override
    public SurveyResponse findByid(Long id) {
        SurveyEntity surveyFind = this.findEntityById(id);
        return surveyMapper.toResponse(surveyFind);
    }

    @Override
    public Page<SurveyResponse> findAll(Pageable pageable, SurveySearch surveySearch) {
        return surveyRepository.findAll(surveySearch.getKeyword(), surveySearch.getType(),
                pageable).map(it -> surveyMapper.toResponse(it));
    }

    @Override
    public SurveyResultResponse mark(SurveyResultRequest request) {
        SurveyResultEntity entity = surveyResultMapper.toEntity(request);
        return surveyResultMapper.toResponse(surveyResultRepository.save(entity));
    }

    @Override
    public List<SurveyResultResponse> findResultByUsernameAndSurvey(String username, Long idSurvey) {
        List<SurveyResultEntity> surveyResult = surveyResultRepository.findAll(username, idSurvey);
        return surveyResult.stream().map(it -> surveyResultMapper.toResponse(it)).toList();
    }

    @Override
    public void delete(Long id) {
        SurveyEntity surveyEntity = this.findEntityById(id);
        surveyEntity.setIsDelete(true);
        surveyRepository.save(surveyEntity);
    }
}