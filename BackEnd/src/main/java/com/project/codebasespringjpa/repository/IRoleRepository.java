package com.project.codebasespringjpa.repository;

import com.project.codebasespringjpa.entity.RoleEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface IRoleRepository extends JpaRepository<RoleEntity, Long> {
    boolean existsByName(String name);

    Optional<RoleEntity> findByName(String name);
}
