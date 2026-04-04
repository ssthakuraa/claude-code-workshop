package com.company.hr.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "countries")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class HrCountry {

    @Id
    @Column(name = "country_id", length = 2)
    private String countryId;

    @Column(name = "country_name", length = 60)
    private String countryName;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "region_id")
    private HrRegion region;
}
