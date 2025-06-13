package com.project.codebasespringjpa.configuration.init;

import com.project.codebasespringjpa.entity.RoleEntity;
import com.project.codebasespringjpa.entity.UserEntity;
import com.project.codebasespringjpa.enums.RoleEnum;
import com.project.codebasespringjpa.repository.IUserRepository;
import com.project.codebasespringjpa.service.interfaces.IRoleService;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;
import java.util.List;

@Slf4j
@Configuration
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ApplicationInitConfig {
    @Autowired
    IRoleService roleService;
    @Autowired
    IUserRepository userRepository;
    @Autowired
    PasswordEncoder passwordEncoder;

    @Bean
    ApplicationRunner applicationRunner() {
        return args -> {
            this.createRoles();
            this.createAccount();
        };
    }

    void createRoles() {
        List<String> roleList = RoleEnum.roleList();
        for (String roleName : roleList) {
            if (roleService.exitsByName(roleName) == false) {
                roleService.create(roleName);
            }
        }
    }

    void createAccount() {
        if (userRepository.count() == 0) {
            UserEntity userAdmin = new UserEntity("admin@gmail.com", "0123456789", "admin", "Quản trị viên", passwordEncoder.encode("1234"), "avatarAdmin", "Quản trị viên", new RoleEntity(RoleEnum.ADMIN.name()));
            UserEntity minhNguyenSpe = new UserEntity("minh.nguyen@example.com", "0901234567", "nguyenminh","Nguyễn Minh", passwordEncoder.encode("1234"), "avatarNguyenMinh.avif", "Tiến sĩ tâm lý học", new RoleEntity(RoleEnum.SPECIALIST.name()));
            UserEntity tranHuongSpe = new UserEntity("huong.tran@example.com", "0912345678", "tranhuong", "Trần Hương", passwordEncoder.encode("1234"), "avatarTranHuong.avif", "Thạc sĩ công tác xã hội", new RoleEntity(RoleEnum.SPECIALIST.name()));
            UserEntity phamTuanSpe = new UserEntity("tuan.pham@example.com", "0923456789", "phamtuan","Phạm Tuấn", passwordEncoder.encode("1234"), "avatarPhamTuan.avif", "Bác sĩ tâm thần học", new RoleEntity(RoleEnum.SPECIALIST.name()));
            UserEntity linhDoSpe = new UserEntity("linh.do@example.com", "0934567890", "dolinh","Đỗ Linh", passwordEncoder.encode("1234"), "avatarDoLinh.jpg", "Thạc sĩ tâm lý học giáo dục", new RoleEntity(RoleEnum.SPECIALIST.name()));
            UserEntity hungLeSpe = new UserEntity("hung.le@example.com", "0945678901", "lehung","Lê Hùng", passwordEncoder.encode("1234"), "avatarLeHung.avif", "Chuyên gia tư vấn tâm lý", new RoleEntity(RoleEnum.SPECIALIST.name()));
            UserEntity userVisitor = new UserEntity("user@gmail.com", "0123456789", "user","Nguyễn Văn A", passwordEncoder.encode("1234"), "avatarUser", "Người dùng", new RoleEntity(RoleEnum.USER.name()));
            userRepository.save(userAdmin);
            userRepository.save(minhNguyenSpe);
            userRepository.save(tranHuongSpe);
            userRepository.save(phamTuanSpe);
            userRepository.save(linhDoSpe);
            userRepository.save(hungLeSpe);
            userRepository.save(userVisitor);
        }
    }
}
