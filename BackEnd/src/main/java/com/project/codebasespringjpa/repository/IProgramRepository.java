package com.project.codebasespringjpa.repository;

import com.project.codebasespringjpa.entity.ProgramEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;

@Repository
public interface IProgramRepository extends JpaRepository<ProgramEntity, Long> {
    @Query("""
    select pq from ProgramEntity pq where pq.isDelete = false 
        and (:keyword is null or pq.title like concat('%', :keyword, '%'))  
        and (:status is null or pq.status = :status) 
        and (:date is null or pq.date = :date)        
    """)
    Page<ProgramEntity> findAll(
            @Param("keyword") String keyword,
            @Param("status") String status,
            @Param("date") LocalDate date,
            Pageable pageable);
}
