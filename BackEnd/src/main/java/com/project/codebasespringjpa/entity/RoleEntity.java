package com.project.codebasespringjpa.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "tbl_role")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class RoleEntity {
    @Id
    @Column(name = "name", unique = true, nullable = false)
    String name;

    String description;

    @OneToMany(mappedBy = "role")
    List<UserEntity> users;

    public RoleEntity(String name){
        this.name = name;
    }
}
