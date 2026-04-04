package com.company.hr.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "hr_roles")
@Getter @Setter @NoArgsConstructor
public class HrRole {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "role_id")
    private Integer roleId;

    @Column(name = "role_name", length = 30, nullable = false, unique = true)
    private String roleName;

    @Column(name = "description", length = 255)
    private String description;
}
