package com.dinnertime.peaktime.global.auth.service;

import com.dinnertime.peaktime.domain.group.entity.Group;
import com.dinnertime.peaktime.domain.group.repository.GroupRepository;
import com.dinnertime.peaktime.domain.preset.entity.Preset;
import com.dinnertime.peaktime.domain.preset.repository.PresetRepository;
import com.dinnertime.peaktime.domain.user.entity.User;
import com.dinnertime.peaktime.domain.user.repository.UserRepository;
import com.dinnertime.peaktime.domain.user.service.dto.request.SendCodeRequest;
import com.dinnertime.peaktime.domain.usergroup.entity.UserGroup;
import com.dinnertime.peaktime.domain.usergroup.repository.UserGroupRepository;
import com.dinnertime.peaktime.global.auth.service.dto.request.LoginRequest;
import com.dinnertime.peaktime.global.auth.service.dto.request.LogoutRequest;
import com.dinnertime.peaktime.global.auth.service.dto.request.SignupRequest;
import com.dinnertime.peaktime.global.auth.service.dto.response.IsDuplicatedResponse;
import com.dinnertime.peaktime.global.auth.service.dto.response.LoginResponse;
import com.dinnertime.peaktime.global.auth.service.dto.response.ReissueResponse;
import com.dinnertime.peaktime.global.auth.service.dto.security.UserPrincipal;
import com.dinnertime.peaktime.global.exception.CustomException;
import com.dinnertime.peaktime.global.exception.ErrorCode;
import com.dinnertime.peaktime.global.util.AuthUtil;
import com.dinnertime.peaktime.global.util.EmailService;
import com.dinnertime.peaktime.global.util.RedisService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.ClassPathResource;
import org.springframework.data.redis.RedisConnectionFailureException;
import org.springframework.retry.annotation.Backoff;
import org.springframework.retry.annotation.Recover;
import org.springframework.retry.annotation.Retryable;
import org.springframework.scheduling.annotation.Async;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.io.*;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.security.SecureRandom;
import java.util.ArrayList;
import java.util.Date;
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
    private final EmailService emailService;
    private final UserRepository userRepository;
    private final PresetRepository presetRepository;
    private final GroupRepository groupRepository;
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
        // 1. 클라이언트의 요청에서 Refresh Token 추출하기
        String refreshToken = jwtService.extractRefreshToken(httpServletRequest);
        // 2. Refresh Token 유효성 검증 (위변조, 만료 등) -> 유효하지 않으면 401 예외 던지기
        if((!StringUtils.hasText(refreshToken)) || (!jwtService.validateToken(refreshToken))) {
            throw new CustomException(ErrorCode.UNAUTHORIZED);
        }
        // 3. Redis에 존재하는 Refresh Token과 일치하는지 확인하기 -> 일치하지 않으면 401 예외 던지기
        long userId = jwtService.getUserId(refreshToken);
        String redisRefreshToken = redisService.getRefreshToken(userId);
        if(!refreshToken.equals(redisRefreshToken)) {
            throw new CustomException(ErrorCode.UNAUTHORIZED);
        }
        // 4. 새 Access Token과 새 Refresh Token을 생성하기 위한 정보를 기존 Refresh Token에서 추출하기 (userId, Authority, 만료시간)
        String authority = jwtService.getAuthority(refreshToken);
        Date expirationTime = jwtService.getExpirationTime(refreshToken);
        // 5. 새 Access Token과 새 Refresh Token 생성
        String newAccessToken = jwtService.createAccessToken(userId, authority);
        String newRefreshToken = jwtService.createRefreshTokenWithExp(userId, authority, expirationTime);
        // 6. 새 Refresh Token을 Redis에 저장 (기존 Refresh Token 반드시 덮어쓰기)
        redisService.saveRefreshToken(userId, newRefreshToken);
        // 7. 새 Refresh Token을 Cookie에 담아서 클라이언트에게 전송
        jwtService.addRefreshTokenToCookie(httpServletResponse, newRefreshToken);
        // 8. ReissueResponse 객체 생성하여 반환 (새 Access Token을 Response Body에 담아서 클라이언트에게 전송)
        return ReissueResponse.createReissueResponse(newAccessToken);
    }

    // 로그아웃
    @Transactional
    public void logout(LogoutRequest logoutRequest, UserPrincipal userPrincipal, HttpServletResponse httpServletResponse) {
        // 1. 클라이언트의 요청에서 rootUserPassword 추출하기
        String rootUserPassword = logoutRequest.getRootUserPassword();
        // 2. DB에 존재하는 비밀번호와 비교하기 위해 암호화 진행
        String encodedRootUserPassword = passwordEncoder.encode(rootUserPassword);
        // 3. DB에서 비밀번호 가져오기
        String rootUserPasswordOnDatabase = this.getRootUserPasswordOnDatabase(userPrincipal);
        // 4. 비밀번호 비교하기
        if(!encodedRootUserPassword.equals(rootUserPasswordOnDatabase)) {
            throw new CustomException(ErrorCode.INVALID_ROOT_PASSWORD);
        }
        // 5. Redis에서 해당 유저의 Refresh Token 삭제
        redisService.removeRefreshToken(userPrincipal.getUserId());
        // 6. 클라이언트의 Refresh Token 삭제
        jwtService.letRefreshTokenRemoved(httpServletResponse);
    }

    // 인증 코드 전송
    @Async
    @Retryable(retryFor = { CustomException.class, RedisConnectionFailureException.class }, backoff = @Backoff(delay = 1500))
    public void sendCode(SendCodeRequest sendCodeRequest) {
        // 1. 인증 코드 생성
        String code = this.generateCode();
        // 2. 클라이언트에게 받은 이메일 주소로 인증 코드 보내기
        emailService.sendCode(sendCodeRequest.getEmail(), code);
        // 3. Redis에 Key가 emailCode라는 prefix와 이메일 주소로 이루어져 있고, Value가 랜덤 인증 코드인 정보를 저장하기
        redisService.saveEmailCode(sendCodeRequest.getEmail(), code);
    }

    // @Retryable의 기본 시도 횟수 3회 실패 시 실행되는 메서드
    @Recover
    public void recover() {
        throw new CustomException(ErrorCode.FAILED_SEND_EMAIL);
    }

    // 아이디 중복 검사 (유저 로그인 아이디로 검사. 이미 존재하면 true 반환)
    private boolean checkDuplicateUserLoginId(String userLoginId) {
        return userRepository.findByUserLoginId(userLoginId).isPresent();
    }

    // 이메일 중복 검사 (이메일 주소로 검사. 이미 존재하면 true 반환)
    private boolean checkDuplicateEmail(String email) {
        return userRepository.findByEmail(email).isPresent();
    }

    // 데이터베이스에 존재하는 루트 계정 비밀번호 가져오기
    private String getRootUserPasswordOnDatabase(UserPrincipal userPrincipal) {
        if(userPrincipal.getAuthority().equals("child")) {
            UserGroup userGroup = userGroupRepository.findByUser_UserId(userPrincipal.getUserId())
                    .orElseThrow(() -> new CustomException(ErrorCode.DO_NOT_HAVE_USERGROUP));
            Group group = groupRepository.findByGroupId(userGroup.getGroup().getGroupId())
                    .orElseThrow(() -> new CustomException(ErrorCode.DO_NOT_HAVE_GROUP));
            return group.getUser().getPassword();
        }
        User user = userRepository.findByUserId(userPrincipal.getUserId())
                .orElseThrow(() -> new CustomException(ErrorCode.DO_NOT_HAVE_USER));
        return user.getPassword();
    }

    // 인증 코드 생성
    private String generateCode() {
        SecureRandom secureRandom = new SecureRandom();
        StringBuilder sb = new StringBuilder(6);
        for(int i = 0; i < 6; i++) {
            sb.append(secureRandom.nextInt(10));
        }
        return sb.toString();
    }

}
