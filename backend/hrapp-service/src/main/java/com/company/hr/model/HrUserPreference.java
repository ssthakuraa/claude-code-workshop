package com.company.hr.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "hr_user_preferences")
@Getter @Setter @NoArgsConstructor
public class HrUserPreference {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "preference_id")
    private Integer preferenceId;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private HrUser user;

    @Column(name = "language_code", length = 10, nullable = false)
    private String languageCode = "en";

    @Column(name = "timezone", length = 50, nullable = false)
    private String timezone = "UTC";

    @Column(name = "date_format", length = 20, nullable = false)
    private String dateFormat = "YYYY-MM-DD";

    @Column(name = "currency_code", length = 3, nullable = false)
    private String currencyCode = "USD";

    @Column(name = "number_format", length = 20, nullable = false)
    private String numberFormat = "1,000.00";
}
