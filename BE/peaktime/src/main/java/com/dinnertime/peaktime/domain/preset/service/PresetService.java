package com.dinnertime.peaktime.domain.preset.service;

import com.dinnertime.peaktime.domain.preset.entity.Preset;
import com.dinnertime.peaktime.domain.preset.repository.PresetRepository;
import com.dinnertime.peaktime.domain.preset.service.dto.request.SavePresetRequestDto;
import com.dinnertime.peaktime.domain.preset.service.dto.response.PresetResponseWrapperDto;
import com.dinnertime.peaktime.domain.user.entity.User;
import com.dinnertime.peaktime.domain.user.repository.UserRepository;
import com.dinnertime.peaktime.global.exception.CustomException;
import com.dinnertime.peaktime.global.exception.ErrorCode;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.nio.file.attribute.UserPrincipal;
import java.util.List;

@Slf4j
@RequiredArgsConstructor
@Service
public class PresetService {

    // preset CRUD 처리
    private final PresetRepository presetRepository;
    private final UserRepository userRepository;

    // preset 생성
    @Transactional
    public void createPreset(UserPrincipal userPrincipal, SavePresetRequestDto requestDto) {

        //임시로 1로 고정시키기 추후 수정 userPrincipal.getUserId());
        User user = userRepository.findByUserId(1).
                orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        // userId = 1로 임의 설정
        Preset preset = Preset.createPreset(requestDto, user);

        presetRepository.save(preset);
    }

    // preset 조회
    @Transactional
    public PresetResponseWrapperDto getPresets(UserPrincipal userPrincipal) {

        // userPrincipal.getUserId()
        User user = userRepository.findByUserId(1)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        List<Preset> presets = presetRepository.findAllByUser(user);

        PresetResponseWrapperDto responseDto = PresetResponseWrapperDto.buildPresetResponseDto(presets);


        // userId를 뺀 나머지 데이터 Wrapper해서 적용
        return responseDto;
    }

}
