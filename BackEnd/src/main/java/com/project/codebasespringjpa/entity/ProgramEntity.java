package com.project.codebasespringjpa.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "tbl_program")
public class ProgramEntity extends BaseEntity{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    String title;
    String image;
    String address;
    LocalDate date;
    LocalTime time;
    String status;
    Long capacity;
    String description;

    @ManyToMany(mappedBy = "programs")
    List<UserEntity> users;
}
