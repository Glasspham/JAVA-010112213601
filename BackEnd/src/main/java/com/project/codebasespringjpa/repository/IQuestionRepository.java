package com.project.codebasespringjpa.repository;

import com.project.codebasespringjpa.entity.QuestionEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IQuestionRepository extends JpaRepository<QuestionEntity, Long> {
}
