package com.project.codebasespringjpa.repository;

import com.project.codebasespringjpa.entity.UserEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface IUserRepository extends JpaRepository<UserEntity, Long> {
    Optional<UserEntity> findByUsername(String username);

    @Query("""
    select us from UserEntity us where us.isDelete = false 
        and (:keyword is null or us.username like concat('%', :keyword, '%') or us.fullname like concat('%', :keyword, '%')) 
        and (:role is null or us.role.name = :role)   
        and (:major is null or exists (select 1 from us.majors usmj where usmj.name = :major))    
    """)
    Page<UserEntity> findAll(
            @Param("keyword") String keyword,
            @Param("role") String role,
            @Param("major") String major,
            Pageable pageable);
}
