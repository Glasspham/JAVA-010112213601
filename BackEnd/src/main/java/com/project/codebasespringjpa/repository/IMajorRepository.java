package com.project.codebasespringjpa.repository;

import com.project.codebasespringjpa.entity.MajorEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IMajorRepository extends JpaRepository<MajorEntity, Long> {
    MajorEntity findByName(String name);
}
