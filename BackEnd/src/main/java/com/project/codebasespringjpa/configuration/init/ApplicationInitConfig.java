package com.project.codebasespringjpa.configuration.init;

import com.project.codebasespringjpa.entity.MajorEntity;
import com.project.codebasespringjpa.entity.ObjectEntity;
import com.project.codebasespringjpa.entity.RoleEntity;
import com.project.codebasespringjpa.entity.UserEntity;
import com.project.codebasespringjpa.enums.RoleEnum;
import com.project.codebasespringjpa.repository.IMajorRepository;
import com.project.codebasespringjpa.repository.IObjectRepository;
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
import java.util.ArrayList;
import java.util.Arrays;
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
    @Autowired
    IMajorRepository majorRepository;
    @Autowired
    IObjectRepository objectRepository;

    @Bean
    ApplicationRunner applicationRunner() {
        return args -> {
            this.createRoles();
            this.createMajors();
            this.createAccount();
            this.createObject();
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

    void createMajors() {
        if (majorRepository.count() == 0) {
            List<String> majorEntityList = Arrays.asList("Thanh thiếu niên", "Nghiện", "Gia đình", "Sức khỏe tâm thần",
                    "Giáo dục");
            for (var it : majorEntityList) {
                MajorEntity major = new MajorEntity(it);
                majorRepository.save(major);
            }
        }
    }

    void createAccount() {
        if (userRepository.count() == 0) {
            UserEntity userAdmin = new UserEntity("admin@gmail.com", "0123456789", "admin", "Quản trị viên",
                    passwordEncoder.encode("1234"), "avatarAdmin", "Quản trị viên",
                    new RoleEntity(RoleEnum.ADMIN.name()), null);
            UserEntity minhNguyenSpe = new UserEntity("minh.nguyen@example.com", "0901234567", "nguyenminh",
                    "Nguyễn Minh", passwordEncoder.encode("1234"), "avatarNguyenMinh.avif", "Tiến sĩ tâm lý học",
                    new RoleEntity(RoleEnum.SPECIALIST.name()),
                    this.fromNames(Arrays.asList("Thanh thiếu niên", "Nghiện")));
            UserEntity tranHuongSpe = new UserEntity("huong.tran@example.com", "0912345678", "tranhuong", "Trần Hương",
                    passwordEncoder.encode("1234"), "avatarTranHuong.avif", "Thạc sĩ công tác xã hội",
                    new RoleEntity(RoleEnum.SPECIALIST.name()),
                    this.fromNames(Arrays.asList("Gia đình", "Sức khỏe tâm thần")));
            UserEntity phamTuanSpe = new UserEntity("tuan.pham@example.com", "0923456789", "phamtuan", "Phạm Tuấn",
                    passwordEncoder.encode("1234"), "avatarPhamTuan.avif", "Bác sĩ tâm thần học",
                    new RoleEntity(RoleEnum.SPECIALIST.name()),
                    this.fromNames(Arrays.asList("Sức khỏe tâm thần", "Nghiện")));
            UserEntity linhDoSpe = new UserEntity("linh.do@example.com", "0934567890", "dolinh", "Đỗ Linh",
                    passwordEncoder.encode("1234"), "avatarDoLinh.jpg", "Thạc sĩ tâm lý học giáo dục",
                    new RoleEntity(RoleEnum.SPECIALIST.name()),
                    this.fromNames(Arrays.asList("Giáo dục", "Thanh thiếu niên")));
            UserEntity hungLeSpe = new UserEntity("hung.le@example.com", "0945678901", "lehung", "Lê Hùng",
                    passwordEncoder.encode("1234"), "avatarLeHung.avif", "Chuyên gia tư vấn tâm lý",
                    new RoleEntity(RoleEnum.SPECIALIST.name()), this.fromNames(Arrays.asList("Gia đình", "Nghiện")));
            UserEntity userVisitor = new UserEntity("user@gmail.com", "0123456789", "user", "Nguyễn Văn A",
                    passwordEncoder.encode("1234"), "avatarUser", "Người dùng", new RoleEntity(RoleEnum.USER.name()),
                    null);

            userRepository.save(userAdmin);
            userRepository.save(minhNguyenSpe);
            userRepository.save(tranHuongSpe);
            userRepository.save(phamTuanSpe);
            userRepository.save(linhDoSpe);
            userRepository.save(hungLeSpe);
            userRepository.save(userVisitor);
        }
    }

    void createObject() {
        ObjectEntity obj1 = new ObjectEntity("Học sinh");
        ObjectEntity obj2 = new ObjectEntity("Giáo viên");
        ObjectEntity obj3 = new ObjectEntity("Phụ huynh");
        ObjectEntity obj4 = new ObjectEntity("Chung");
        if (objectRepository.count() == 0) {
            objectRepository.save(obj1);
            objectRepository.save(obj2);
            objectRepository.save(obj3);
            objectRepository.save(obj4);
        }
    }

    // ------------------private method
    private List<MajorEntity> fromNames(List<String> majors) {
        List<MajorEntity> majorEntityList = new ArrayList<>();
        for (String it : majors) {
            MajorEntity major = majorRepository.findByName(it);
            if (major != null)
                majorEntityList.add(major);
        }
        return majorEntityList;
    }
}
