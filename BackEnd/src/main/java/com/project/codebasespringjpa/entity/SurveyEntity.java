package com.project.codebasespringjpa.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "tbl_survey")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SurveyEntity extends BaseEntity{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    String name;
    String type;

    @OneToMany(mappedBy = "survey", cascade = CascadeType.ALL, orphanRemoval = true)
    List<QuestionEntity> questions;

    @OneToMany(mappedBy = "survey")
    List<SurveyResultEntity> surveyResult;
}
