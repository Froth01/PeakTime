package com.dinnertime.peaktime.domain.preset.service;

import com.dinnertime.peaktime.domain.preset.entity.Preset;
import com.dinnertime.peaktime.domain.preset.repository.PresetRepository;
import com.dinnertime.peaktime.domain.preset.service.dto.request.SavePresetRequestDto;
import com.dinnertime.peaktime.domain.user.entity.User;
import com.dinnertime.peaktime.domain.user.repository.UserRepository;
import com.dinnertime.peaktime.domain.user.service.UserService;
import com.dinnertime.peaktime.global.exception.CustomException;
import com.dinnertime.peaktime.global.exception.ErrorCode;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.nio.file.attribute.UserPrincipal;
import java.util.Arrays;
import java.util.List;

@Slf4j
@RequiredArgsConstructor
@Service
public class PresetService {

    // preset CRUD 처리
    private final PresetRepository presetRepository;
    private final UserRepository userRepository;

    @Transactional
    public void createPreset(UserPrincipal userPrincipal, SavePresetRequestDto requestDto) {

        //임시로 1로 고정시키기 추후 수정 userPrincipal.getUserId());
        User user = userRepository.findByUserId(1).
                orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        // userId = 1로 임의 설정
        Preset preset = Preset.createPreset(requestDto, user);

        presetRepository.save(preset);
    }

}
