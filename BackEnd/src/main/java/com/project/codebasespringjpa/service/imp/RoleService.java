package com.project.codebasespringjpa.service.imp;

import com.project.codebasespringjpa.entity.RoleEntity;
import com.project.codebasespringjpa.repository.IRoleRepository;
import com.project.codebasespringjpa.service.interfaces.IRoleService;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
@Transactional
@FieldDefaults(level = AccessLevel.PRIVATE)
public class RoleService implements IRoleService {
    @Autowired
    private IRoleRepository roleRepository;

    @Override
    public boolean exitsByName(String name) {
        return roleRepository.existsByName(name);
    }

    @Override
    public void create(String name) {
        RoleEntity entity = RoleEntity.builder()
                .name(name)
                .build();
        roleRepository.save(entity);
    }
}