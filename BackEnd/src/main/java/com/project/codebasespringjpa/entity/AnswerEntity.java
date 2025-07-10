package com.project.codebasespringjpa.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "tbl_answer")
public class AnswerEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    String content;
    Boolean correct = false;

    @ManyToOne
    @JoinColumn(name = "question_id")
    QuestionEntity question;

    public AnswerEntity(String content, Boolean correct) {
        this.content = content;
        this.correct = correct;
    }
}
