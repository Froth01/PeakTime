package com.dinnertime.peaktime.global.auth.service;

import com.dinnertime.peaktime.domain.preset.entity.Preset;
import com.dinnertime.peaktime.domain.preset.repository.PresetRepository;
import com.dinnertime.peaktime.domain.user.entity.User;
import com.dinnertime.peaktime.domain.user.repository.UserRepository;
import com.dinnertime.peaktime.global.auth.service.dto.request.SignupRequest;
import com.dinnertime.peaktime.global.exception.CustomException;
import com.dinnertime.peaktime.global.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.ClassPathResource;
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
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;
    private final PresetRepository presetRepository;

    @Transactional
    public void signup(SignupRequest signupRequest) {
        // 1-1. 아이디 형식 검사
        if(!this.checkFormatValidationUserLoginId(signupRequest.getUserLoginId())) {
            throw new CustomException(ErrorCode.INVALID_USER_LOGIN_ID_FORMAT);
        }
        // 1-2. 아이디 소문자로 변환
        String userLoginId = this.convertUpperToLower(signupRequest.getUserLoginId());
        // 1-3. 아이디 중복 검사
        if(this.checkDuplicateUserLoginId(userLoginId)) {
            throw new CustomException(ErrorCode.DUPLICATED_USER_LOGIN_ID);
        }
        // 2-1. 비밀번호 형식 검사
        if(!this.checkFormatValidationPassword(signupRequest.getPassword())) {
            throw new CustomException(ErrorCode.INVALID_PASSWORD_FORMAT);
        }
        // 2-2. 비밀번호 일치 검사
        if(!signupRequest.getPassword().equals(signupRequest.getConfirmPassword())) {
            throw new CustomException(ErrorCode.NOT_EQUAL_PASSWORD);
        }
        // 2-3. 비밀번호 암호화
        String encodedPassword = passwordEncoder.encode(signupRequest.getPassword());
        // 3-1. 닉네임 형식 검사
        if(!this.checkFormatValidationNickname(signupRequest.getNickname())) {
            throw new CustomException(ErrorCode.INVALID_NICKNAME_FORMAT);
        }
        // 3-2. 닉네임 소문자로 변환
        String nickname = this.convertUpperToLower(signupRequest.getNickname());
        // 4-1. 이메일 형식 검사
        if(!this.checkFormatValidationEmail(signupRequest.getEmail())) {
            throw new CustomException(ErrorCode.INVALID_EMAIL_FORMAT);
        }
        // 4-2. 이메일 소문자로 변환
        String email = this.convertUpperToLower(signupRequest.getEmail());
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

    // 아이디 형식 검사 (형식에 맞으면 true, 형식에 맞지 않으면 false)
    private boolean checkFormatValidationUserLoginId(String userLoginId) {
        // 정규식: 영문과 숫자로 이루어진 5자 이상 15자 이하의 문자열
        String regex = "^[a-zA-Z0-9]{5,15}$";
        return userLoginId.matches(regex);
    }

    // 영문 대문자를 영문 소문자로 변환
    private String convertUpperToLower(String input) {
        return input.toLowerCase();
    }

    // 아이디 중복 검사 (유저 로그인 아이디로 검사. 이미 존재하면 true 반환)
    private boolean checkDuplicateUserLoginId(String userLoginId) {
        return userRepository.findByUserLoginId(userLoginId).isPresent();
    }

    // 비밀번호 형식 검사 (형식에 맞으면 true, 형식에 맞지 않으면 false)
    private boolean checkFormatValidationPassword(String password) {
        // 정규식 : 영문 대문자, 영문 소문자, 숫자, 특수문자(모든 특수문자로 확장하여 허용)를 각각 포함하여 최소 8자 이상 -> 영문 대문자, 영문 소문자, 숫자, 특수문자를 제외한 문자는 false 처리.
        String pattern = "^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)(?=.*[!@#$%^&*()_+\\-\\[\\]{};':\"\\\\|,.<>\\/?])[A-Za-z\\d!@#$%^&*()_+\\-\\[\\]{};':\"\\\\|,.<>\\/?]{8,}$";
        // Pattern 및 Matcher를 사용해 정규식 검증
        Pattern compiledPattern = Pattern.compile(pattern);
        Matcher matcher = compiledPattern.matcher(password);
        // 정규식 패턴에 일치하면 true 반환, 아니면 false 반환
        return matcher.matches();
    }

    // 닉네임 형식 검사 (형식에 맞으면 true, 형식에 맞지 않으면 false)
    private boolean checkFormatValidationNickname(String nickname) {
        // 정규식: 한글, 영문 대소문자, 숫자로 이루어진 2자 이상 8자 이하의 문자열
        String regex = "^[a-zA-Z0-9가-힣]{2,8}$";
        return nickname.matches(regex);
    }

    // 이메일 형식 검사 (형식에 맞으면 true, 형식에 맞지 않으면 false)
    private boolean checkFormatValidationEmail(String email) {
        String regex = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$";
        return email.matches(regex);
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
