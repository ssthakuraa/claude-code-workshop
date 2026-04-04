package com.company.hr.security;

import com.company.hr.model.HrUser;
import com.company.hr.repository.HrUserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class HrUserDetailsService implements UserDetailsService {

    private final HrUserRepository userRepository;

    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        HrUser user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));

        List<String> roles = user.getRoles().stream()
                .map(role -> role.getRoleName())
                .collect(Collectors.toList());

        return new HrUserDetails(
                user.getUsername(),
                user.getPasswordHash(),
                user.isActive(),
                user.getEmployee() != null ? user.getEmployee().getEmployeeId() : null,
                roles
        );
    }
}
