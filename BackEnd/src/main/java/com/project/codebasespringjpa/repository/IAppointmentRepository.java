package com.project.codebasespringjpa.repository;

import com.project.codebasespringjpa.entity.AppointmentEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;

@Repository
public interface IAppointmentRepository extends JpaRepository<AppointmentEntity, Long> {
    @Query("""
    select ap from AppointmentEntity ap where (1=1)  
        and (:username is null or ap.username = :username) 
        and (:specialistName is  null or ap.specialistName = :specialistName)   
        and (:keyword is null 
            or ap.username like concat('%', :keyword, '%')
            or ap.specialistName like concat('%', :keyword, '%') 
            ) 
        and (:status is null or ap.status = :status) 
        and (ap.specialistDeleted = false ) 
        and (ap.userDeleted = false ) 
        and (:date is null or ap.date = :date) 
    """)
    Page<AppointmentEntity> findAll(
            @Param("username") String username,
            @Param("specialistName") String specialistName,
            @Param("keyword") String keyword,
            @Param("status") String status,
            @Param("date") LocalDate date,
            Pageable pageable);
}
