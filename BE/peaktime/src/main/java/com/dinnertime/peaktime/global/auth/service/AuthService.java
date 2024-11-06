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
import com.dinnertime.peaktime.global.auth.service.dto.response.ReissueResponse;
import com.dinnertime.peaktime.global.auth.service.dto.security.UserPrincipal;
import com.dinnertime.peaktime.global.exception.CustomException;
import com.dinnertime.peaktime.global.exception.ErrorCode;
import com.dinnertime.peaktime.global.util.AuthUtil;
import com.dinnertime.peaktime.global.util.RedisService;
import jakarta.servlet.http.HttpServletRequest;
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

import java.io.*;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

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
        List<String> blockWebsiteList;
        try (InputStream inputStream = getClass().getClassLoader().getResourceAsStream("DistractionsWebsites.txt")) {
            if (inputStream == null) {
                throw new CustomException(ErrorCode.FILE_NOT_FOUND);
            }
            blockWebsiteList = new BufferedReader(new InputStreamReader(inputStream))
                    .lines()
                    .collect(Collectors.toList());
        } catch (IOException e) {
            throw new CustomException(ErrorCode.FILE_NOT_FOUND);
        }

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
    @Transactional(readOnly = true)
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
        // 3. PK와 Authority 정보를 추출하여 JWT 생성
        String accessToken = jwtService.createAccessToken(userPrincipal.getUserId(), userPrincipal.getAuthority());
        String refreshToken = jwtService.createRefreshToken(userPrincipal.getUserId(), userPrincipal.getAuthority());
        // 4. Refresh Token을 Redis에 저장
        redisService.saveRefreshToken(userPrincipal.getUserId(), refreshToken);
        // 5. Refresh Token을 Cookie에 담아서 클라이언트에게 전송
        jwtService.addRefreshTokenToCookie(httpServletResponse, refreshToken);
        // 6. LoginResponse 객체 생성하여 반환
        User user = userRepository.findByUserId(userPrincipal.getUserId())
                .orElseThrow(() -> new CustomException(ErrorCode.INVALID_LOGIN_PROCESS));
        if(user.getIsRoot()) {
            return LoginResponse.createLoginResponse(accessToken, true, null, user.getNickname());
        }
        UserGroup userGroup = userGroupRepository.findByUser_UserId(user.getUserId())
                .orElseThrow(() -> new CustomException(ErrorCode.INVALID_LOGIN_PROCESS));
        return LoginResponse.createLoginResponse(accessToken, false, userGroup.getGroup().getGroupId(), user.getNickname());
    }

    // Reissue JWT
    @Transactional
    public ReissueResponse reissue(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse) {
        // 1. 클라이언트의 요청에 담긴 쿠키에서 Refresh Token 꺼내깅 ㅎ
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
