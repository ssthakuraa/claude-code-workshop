package com.company.hr.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "regions")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class HrRegion {

    @Id
    @Column(name = "region_id")
    private Integer regionId;

    @Column(name = "region_name", length = 25)
    private String regionName;
}
