package com.dinnertime.peaktime.domain.user.service;

import com.dinnertime.peaktime.domain.group.entity.Group;
import com.dinnertime.peaktime.domain.group.repository.GroupRepository;
import com.dinnertime.peaktime.domain.user.entity.User;
import com.dinnertime.peaktime.domain.user.repository.UserRepository;
import com.dinnertime.peaktime.domain.user.service.dto.request.UpdateNicknameRequest;
import com.dinnertime.peaktime.domain.user.service.dto.request.UpdatePasswordRequest;
import com.dinnertime.peaktime.domain.user.service.dto.response.GetProfileResponse;
import com.dinnertime.peaktime.domain.usergroup.entity.UserGroup;
import com.dinnertime.peaktime.domain.usergroup.repository.UserGroupRepository;
import com.dinnertime.peaktime.global.auth.service.dto.security.UserPrincipal;
import com.dinnertime.peaktime.global.exception.CustomException;
import com.dinnertime.peaktime.global.exception.ErrorCode;
import com.dinnertime.peaktime.global.util.AuthUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserService {

    private final PasswordEncoder passwordEncoder;
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

    // 회원탈퇴
    @Transactional
    public void deleteUser(UserPrincipal userPrincipal) {
        // 1. root 계정에게 종속된 child 계정 전부 탈퇴처리
        userRepository.updateIsDeleteByRootUserId(userPrincipal.getUserId());
        // 2. 이어서 root 계정 탈퇴처리
        User user = userRepository.findByUserId(userPrincipal.getUserId())
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));
        user.deleteUser();
        userRepository.save(user);
        // 3. root 계정과 이 root 계정에 종속된 child 계정의 User PK를 추출하여 Redis에 저장된 Refresh Token 삭제하기 (고도화)
    }

    // 비밀번호 변경
    @Transactional
    public void updatePassword(UpdatePasswordRequest updatePasswordRequest, UserPrincipal userPrincipal) {
        // 1. 비밀번호 형식 검사
        if(!AuthUtil.checkFormatValidationPassword(updatePasswordRequest.getNewPassword())) {
            throw new CustomException(ErrorCode.INVALID_PASSWORD_FORMAT);
        }
        // 2. 비밀번호 일치 검사
        if(!updatePasswordRequest.getNewPassword().equals(updatePasswordRequest.getConfirmNewPassword())) {
            throw new CustomException(ErrorCode.NOT_EQUAL_PASSWORD);
        }
        // 3. 현재 유저 엔티티 불러오기
        User user = userRepository.findByUserId(userPrincipal.getUserId())
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));
        // 4. 비밀번호 중복 검사 (현재 유저의 비밀번호와 비교하기) -> matches 메서드는 첫 번째 인자로 평문 비밀번호 필요
        if(passwordEncoder.matches(updatePasswordRequest.getNewPassword(), user.getPassword())) {
            throw new CustomException(ErrorCode.DUPLICATED_PASSWORD);
        }
        // 5. 비밀번호 암호화
        String encodedPassword = passwordEncoder.encode(updatePasswordRequest.getNewPassword());
        // 6. 유저 엔티티에 새로운 비밀번호 집어넣기
        user.setPassword(encodedPassword);
        // 7. Save User
        userRepository.save(user);
    }

}
