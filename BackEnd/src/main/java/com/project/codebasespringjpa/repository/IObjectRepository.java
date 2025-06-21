package com.project.codebasespringjpa.repository;

import com.project.codebasespringjpa.entity.ObjectEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IObjectRepository extends JpaRepository<ObjectEntity, Long> {
    ObjectEntity findByName(String name);
}
