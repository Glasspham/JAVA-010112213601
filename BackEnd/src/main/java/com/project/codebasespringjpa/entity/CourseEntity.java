package com.project.codebasespringjpa.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Formula;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "tbl_course")
public class CourseEntity extends BaseEntity{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    String name;
    String description;
    String image;

    @Formula("(SELECT SUM(cd.duration) FROM tbl_course_detail cd WHERE cd.course_id = id AND cd.is_delete = false)")
    Double duration;


    @ManyToMany
    @JoinTable(
            name = "tbl_course_object",
            joinColumns = @JoinColumn(name = "course_id"),
            inverseJoinColumns = @JoinColumn(name = "object_id")
    )
    List<ObjectEntity> objects;

    @OneToMany(mappedBy = "course")
    List<CourseDetailEntity> courseDetail;
}
