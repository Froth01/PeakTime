package com.dinnertime.peaktime.global.auth.service;

import com.dinnertime.peaktime.domain.preset.entity.Preset;
import com.dinnertime.peaktime.domain.preset.repository.PresetRepository;
import com.dinnertime.peaktime.domain.user.entity.User;
import com.dinnertime.peaktime.domain.user.repository.UserRepository;
import com.dinnertime.peaktime.domain.usergroup.entity.UserGroup;
import com.dinnertime.peaktime.domain.usergroup.repository.UserGroupRepository;
import com.dinnertime.peaktime.global.auth.service.dto.request.LoginRequest;
import com.dinnertime.peaktime.global.auth.service.dto.request.SignupRequest;
import com.dinnertime.peaktime.global.auth.service.dto.response.IsDuplicatedResponse;
import com.dinnertime.peaktime.global.auth.service.dto.response.LoginResponse;
import com.dinnertime.peaktime.global.auth.service.dto.security.UserPrincipal;
import com.dinnertime.peaktime.global.exception.CustomException;
import com.dinnertime.peaktime.global.exception.ErrorCode;
import com.dinnertime.peaktime.global.util.AuthUtil;
import com.dinnertime.peaktime.global.util.RedisService;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.ClassPathResource;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final RedisService redisService;
    private final UserRepository userRepository;
    private final PresetRepository presetRepository;
    private final UserGroupRepository userGroupRepository;

    // 회원가입
    @Transactional
    public void signup(SignupRequest signupRequest) {
        // 1-1. 아이디 형식 검사
        if(!AuthUtil.checkFormatValidationUserLoginId(signupRequest.getUserLoginId())) {
            throw new CustomException(ErrorCode.INVALID_USER_LOGIN_ID_FORMAT);
        }
        // 1-2. 아이디 소문자로 변환
        String userLoginId = AuthUtil.convertUpperToLower(signupRequest.getUserLoginId());
        // 1-3. 아이디 중복 검사
        if(this.checkDuplicateUserLoginId(userLoginId)) {
            throw new CustomException(ErrorCode.DUPLICATED_USER_LOGIN_ID);
        }
        // 2-1. 비밀번호 형식 검사
        if(!AuthUtil.checkFormatValidationPassword(signupRequest.getPassword())) {
            throw new CustomException(ErrorCode.INVALID_PASSWORD_FORMAT);
        }
        // 2-2. 비밀번호 일치 검사
        if(!signupRequest.getPassword().equals(signupRequest.getConfirmPassword())) {
            throw new CustomException(ErrorCode.NOT_EQUAL_PASSWORD);
        }
        // 2-3. 비밀번호 암호화
        String encodedPassword = passwordEncoder.encode(signupRequest.getPassword());
        // 3-1. 닉네임 형식 검사
        if(!AuthUtil.checkFormatValidationNickname(signupRequest.getNickname())) {
            throw new CustomException(ErrorCode.INVALID_NICKNAME_FORMAT);
        }
        // 3-2. 닉네임 소문자로 변환
        String nickname = AuthUtil.convertUpperToLower(signupRequest.getNickname());
        // 4-1. 이메일 형식 검사
        if(!AuthUtil.checkFormatValidationEmail(signupRequest.getEmail())) {
            throw new CustomException(ErrorCode.INVALID_EMAIL_FORMAT);
        }
        // 4-2. 이메일 소문자로 변환
        String email = AuthUtil.convertUpperToLower(signupRequest.getEmail());
        // 4-3. 이메일 중복 검사
        if(this.checkDuplicateEmail(email)) {
            throw new CustomException(ErrorCode.DUPLICATED_EMAIL);
        }
        // 5. Create User Entity
        User user = User.createRootUser(
                userLoginId,
                encodedPassword,
                nickname,
                email
        );
        // 6. Save User
        userRepository.save(user);
        // 7. Create Block Website Array For Default Preset
        List<String> blockWebsiteList = this.loadWebsitesFromFile("src/main/resources/DistractionsWebsites.txt");
        // 8. Create Default Preset
        Preset preset = Preset.createDefaultPreset(blockWebsiteList, user);
        // 9. Save Preset
        presetRepository.save(preset);
    }

    // 유저 로그인 아이디 중복 조회
    public IsDuplicatedResponse isDuplicatedUserLoginId(String userLoginId) {
        // 1. 아이디 형식 검사
        if(!AuthUtil.checkFormatValidationUserLoginId(userLoginId)) {
            throw new CustomException(ErrorCode.INVALID_USER_LOGIN_ID_FORMAT);
        }
        // 2. 아이디 중복 검사
        boolean isDuplicated = this.checkDuplicateUserLoginId(userLoginId);
        return IsDuplicatedResponse.createIsDuplicatedResponse(isDuplicated);
    }

    // 이메일 중복 조회
    public IsDuplicatedResponse isDuplicatedEmail(String email) {
        // 1. 이메일 형식 검사
        if(!AuthUtil.checkFormatValidationEmail(email)) {
            throw new CustomException(ErrorCode.INVALID_EMAIL_FORMAT);
        }
        // 2. 이메일 중복 검사
        boolean isDuplicated = this.checkDuplicateEmail(email);
        return IsDuplicatedResponse.createIsDuplicatedResponse(isDuplicated);
    }

    // 로그인
    @Transactional
    public LoginResponse login(LoginRequest loginRequest, HttpServletResponse httpServletResponse) {
        // 1. loadUserByUsername 메서드 호출
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getUserLoginId(),
                        loginRequest.getPassword()
                )
        );
        // 2. 현재 SecurityContextHolder의 Authentication의 Principal 불러오기
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        // 3. 해당 유저가 회원탈퇴 처리가 되었는지 확인
        if(userPrincipal.getIsDelete()) {
            throw new CustomException(ErrorCode.INVALID_LOGIN_PROCESS);
        }
        // 4. PK와 Authority 정보를 추출하여 JWT 생성
        String accessToken = jwtService.createAccessToken(userPrincipal.getUserId(), userPrincipal.getAuthority());
        String refreshToken = jwtService.createRefreshToken(userPrincipal.getUserId(), userPrincipal.getAuthority());
        // 5. Refresh Token을 Redis에 저장
        redisService.saveRefreshToken(userPrincipal.getUserId(), refreshToken);
        // 6. Refresh Token을 Cookie에 담아서 클라이언트에게 전송
        jwtService.addRefreshTokenToCookie(httpServletResponse, refreshToken);
        // 7. LoginResponse 객체 생성하여 반환
        User user = userRepository.findByUserId(userPrincipal.getUserId())
                .orElseThrow(() -> new CustomException(ErrorCode.INVALID_LOGIN_PROCESS));
        Optional<UserGroup> userGroup = userGroupRepository.findByUser(user);
        if(userGroup.isPresent()) {
            return LoginResponse.createLoginResponse(accessToken, user.getIsRoot(), userGroup.get().getGroup().getGroupId(), user.getNickname());
        }
        return LoginResponse.createLoginResponse(accessToken, user.getIsRoot(), null, user.getNickname());
    }

    // 아이디 중복 검사 (유저 로그인 아이디로 검사. 이미 존재하면 true 반환)
    private boolean checkDuplicateUserLoginId(String userLoginId) {
        return userRepository.findByUserLoginId(userLoginId).isPresent();
    }

    // 이메일 중복 검사 (이메일 주소로 검사. 이미 존재하면 true 반환)
    private boolean checkDuplicateEmail(String email) {
        return userRepository.findByEmail(email).isPresent();
    }

    // 경로로 파일을 참조하여 차단 웹사이트 목록 List로 반환
    private List<String> loadWebsitesFromFile(String filePath) {
        try {
            Path path = Paths.get(filePath);
            return Files.readAllLines(path);
        } catch (IOException e) {
            throw new CustomException(ErrorCode.FILE_NOT_FOUND);
        }
    }

}
