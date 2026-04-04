package com.company.hr.controller;

import com.company.hr.common.response.HrApiResponse;
import com.company.hr.dto.request.HrLoginRequest;
import com.company.hr.dto.response.HrLoginResponse;
import com.company.hr.service.HrAuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/app/hr/api/v1/auth")
@RequiredArgsConstructor
public class HrAuthController {

    private final HrAuthService authService;

    @PostMapping("/login")
    public ResponseEntity<HrApiResponse<HrLoginResponse>> login(@Valid @RequestBody HrLoginRequest request) {
        return ResponseEntity.ok(HrApiResponse.success(authService.authenticate(request)));
    }

    @PostMapping("/refresh")
    public ResponseEntity<HrApiResponse<HrLoginResponse>> refresh(@RequestHeader("X-Refresh-Token") String refreshToken) {
        return ResponseEntity.ok(HrApiResponse.success(authService.refreshToken(refreshToken)));
    }

    @PostMapping("/logout")
    public ResponseEntity<HrApiResponse<Void>> logout() {
        // Stateless JWT — client discards token. Server-side blacklist can be added later.
        return ResponseEntity.ok(HrApiResponse.success(null, "Logged out successfully"));
    }
}
