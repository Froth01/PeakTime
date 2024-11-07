package com.dinnertime.peaktime.domain.user.service;

import com.dinnertime.peaktime.domain.user.entity.User;
import com.dinnertime.peaktime.domain.user.repository.UserRepository;
import com.dinnertime.peaktime.domain.user.service.dto.request.UpdateNicknameRequest;
import com.dinnertime.peaktime.domain.user.service.dto.response.GetProfileResponse;
import com.dinnertime.peaktime.global.auth.service.dto.security.UserPrincipal;
import com.dinnertime.peaktime.global.exception.CustomException;
import com.dinnertime.peaktime.global.exception.ErrorCode;
import com.dinnertime.peaktime.global.util.AuthUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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

    // 닉네임 변경
    @Transactional
    public void updateNickname(UpdateNicknameRequest updateNicknameRequest, UserPrincipal userPrincipal) {
        // 1. 닉네임 형식 검사
        if(!AuthUtil.checkFormatValidationNickname(updateNicknameRequest.getNickname())) {
            throw new CustomException(ErrorCode.INVALID_NICKNAME_FORMAT);
        }
        // 2. 유저 정보 불러오기
        User user = userRepository.findByUserId(userPrincipal.getUserId())
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));
        // 3. 현재 유저의 닉네임과 비교하기
        if(updateNicknameRequest.getNickname().equals(user.getNickname())) {
            throw new CustomException(ErrorCode.DUPLICATED_NICKNAME);
        }
        // 4. 유저 엔티티에 새로운 닉네임 집어넣기
        user.setNickname(updateNicknameRequest.getNickname());
        // 5. Save User
        userRepository.save(user);
    }

}
