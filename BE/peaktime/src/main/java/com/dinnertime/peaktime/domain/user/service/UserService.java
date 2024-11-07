package com.dinnertime.peaktime.domain.user.service;

import com.dinnertime.peaktime.domain.user.entity.User;
import com.dinnertime.peaktime.domain.user.repository.UserRepository;
import com.dinnertime.peaktime.domain.user.service.dto.response.GetProfileResponse;
import com.dinnertime.peaktime.global.auth.service.dto.security.UserPrincipal;
import com.dinnertime.peaktime.global.exception.CustomException;
import com.dinnertime.peaktime.global.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    // 프로필 조회
    public GetProfileResponse getProfile(UserPrincipal userPrincipal) {
        User user = userRepository.findByUserId(userPrincipal.getUserId())
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));
        return GetProfileResponse.createGetProfileResponse(user.getUserLoginId(), user.getNickname(), user.getEmail());
    }

}
