package com.project.codebasespringjpa.repository;

import com.project.codebasespringjpa.entity.AnswerEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IAnswerRepository extends JpaRepository<AnswerEntity, Long> {
}
