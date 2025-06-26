package com.project.codebasespringjpa.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Formula;
import java.time.LocalDate;
import java.time.LocalTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "tbl_appoiment")
public class AppointmentEntity extends BaseEntity{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    @Column(name = "user_id", unique = false)
    Long userId;

    @Column(name = "username")
    String username;

    @Column(name = "specialist_id", nullable = false)
    Long specialistId;

    @Column(name = "specialist_name")
    String specialistName;

    LocalDate date;

    LocalTime hours;

    Double duration;

    String status;

    @Formula("(SELECT u.is_delete FROM tbl_user u WHERE u.id = specialist_id)")
    private Boolean specialistDeleted;

    @Formula("(SELECT u.is_delete FROM tbl_user u WHERE u.id = user_id)")
    private Boolean userDeleted;
}
