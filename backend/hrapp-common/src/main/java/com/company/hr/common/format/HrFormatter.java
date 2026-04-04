package com.company.hr.common.format;

import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.text.NumberFormat;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Currency;
import java.util.Locale;

/**
 * Locale-aware formatting utilities for currency, dates, and names.
 */
@Component
public class HrFormatter {

    private static final DateTimeFormatter ISO_DATE = DateTimeFormatter.ISO_LOCAL_DATE;
    private static final DateTimeFormatter DISPLAY_DATE = DateTimeFormatter.ofPattern("dd MMM yyyy");

    /**
     * Format a salary amount with the given currency code and locale.
     * e.g., formatSalary(new BigDecimal("75000"), "USD", Locale.US) → "$75,000.00"
     */
    public String formatSalary(BigDecimal amount, String currencyCode, Locale locale) {
        if (amount == null) return "—";
        try {
            NumberFormat fmt = NumberFormat.getCurrencyInstance(locale);
            fmt.setCurrency(Currency.getInstance(currencyCode));
            return fmt.format(amount);
        } catch (Exception e) {
            return amount.toPlainString();
        }
    }

    /**
     * Format a date for display.
     * e.g., 2024-03-15 → "15 Mar 2024"
     */
    public String formatDate(LocalDate date, Locale locale) {
        if (date == null) return "—";
        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("dd MMM yyyy", locale);
        return date.format(fmt);
    }

    /**
     * Format a date as ISO (for API responses).
     */
    public String formatDateIso(LocalDate date) {
        if (date == null) return null;
        return date.format(ISO_DATE);
    }

    /**
     * Format employee full name: "Last, First" or "First Last" depending on locale convention.
     */
    public String formatFullName(String firstName, String lastName) {
        if (firstName == null && lastName == null) return "—";
        if (firstName == null) return lastName;
        if (lastName == null) return firstName;
        return firstName + " " + lastName;
    }

    /**
     * Format initials from first and last name.
     * e.g., "John", "Doe" → "JD"
     */
    public String formatInitials(String firstName, String lastName) {
        StringBuilder sb = new StringBuilder();
        if (firstName != null && !firstName.isEmpty()) sb.append(firstName.charAt(0));
        if (lastName != null && !lastName.isEmpty()) sb.append(lastName.charAt(0));
        return sb.toString().toUpperCase();
    }

    /**
     * Mask an email address for display.
     * e.g., "john.doe@example.com" → "j***.d**@example.com"
     */
    public String maskEmail(String email) {
        if (email == null || !email.contains("@")) return "****";
        String[] parts = email.split("@");
        String local = parts[0];
        String masked = local.length() > 1
                ? local.charAt(0) + "*".repeat(local.length() - 1)
                : "*";
        return masked + "@" + parts[1];
    }

    /**
     * Mask a phone number, showing only last 4 digits.
     * e.g., "+1-650-555-0142" → "***-***-0142"
     */
    public String maskPhone(String phone) {
        if (phone == null || phone.length() < 4) return "****";
        String digits = phone.replaceAll("[^0-9]", "");
        String last4 = digits.substring(Math.max(0, digits.length() - 4));
        return "***-***-" + last4;
    }
}
