package com.project.codebasespringjpa.entity;

import com.project.codebasespringjpa.configuration.security.UserDetailsImpl;
import jakarta.persistence.Column;
import jakarta.persistence.MappedSuperclass;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import java.time.LocalDateTime;

@MappedSuperclass
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BaseEntity {
    @Column(name = "create_date")
    LocalDateTime createDate;

    @Column(name = "create_by")
    String createBy;

    @Column(name = "update_date")
    LocalDateTime updateDate;

    @Column(name = "update_by")
    String updateBy;

    @Column(name = "is_delete")
    Boolean isDelete = false;

    @PrePersist
    public void prePersit() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            if (userDetails instanceof UserDetailsImpl) {
                this.createBy = ((UserDetailsImpl) userDetails).getUser().getEmail();
                this.updateBy = ((UserDetailsImpl) userDetails).getUser().getEmail();
            }
        } catch (Exception e) {
            this.createBy = "Unknow User";
            this.updateBy = "Unknow User";
        }
        this.createDate = LocalDateTime.now();
        this.updateDate = LocalDateTime.now();
    }

    @PreUpdate
    public void preUpdate() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            if (userDetails instanceof UserDetailsImpl) {
                this.updateBy = ((UserDetailsImpl) userDetails).getUser().getEmail();
            }
        } catch (Exception e) {
            this.updateBy = "Unknow User";
        }
        this.updateDate = LocalDateTime.now();
    }
}
