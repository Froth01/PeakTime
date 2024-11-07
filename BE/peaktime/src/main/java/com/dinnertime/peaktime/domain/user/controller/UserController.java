package com.dinnertime.peaktime.domain.user.controller;

import com.dinnertime.peaktime.global.auth.service.dto.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {

    // 프로필 조회
    @GetMapping("")
    public ResponseEntity<?> getProfile(@AuthenticationPrincipal UserPrincipal userPrincipal) {

    }

}
