package com.project.codebasespringjpa.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "tbl_user")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserEntity extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    @Column(name = "username", unique = true)
    String username;

    String fullname;
    String password;
    @Column(name = "email")
    String email;

    String avatar;
    String position;
    String phone;

    @ManyToOne
    @JoinColumn(name = "role_id")
    RoleEntity role;

    public UserEntity(String email, String phone, String username, String fullname, String password, String avatar, String position, RoleEntity roleEntity) {
        this.email = email;
        this.phone = phone;
        this.username = username;
        this.fullname = fullname;
        this.password = password;
        this.avatar = avatar;
        this.position = position;
        this.role = roleEntity;
    }
}
