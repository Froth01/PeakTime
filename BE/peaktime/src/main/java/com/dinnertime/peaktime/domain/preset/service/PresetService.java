package com.dinnertime.peaktime.domain.preset.service;

import com.dinnertime.peaktime.domain.preset.entity.Preset;
import com.dinnertime.peaktime.domain.preset.repository.PresetRepository;
import com.dinnertime.peaktime.domain.preset.service.dto.request.SavePresetRequestDto;
import com.dinnertime.peaktime.domain.user.entity.User;
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
    private final UserService userService;

    @Transactional
    // 프리셋 생성된 것을 sql에 저장
    public Preset savePreset(String title, List<String> blockWebsiteArray, List<String> blockProgramArray, User user){
        Preset preset = Preset.createPreset(title, blockWebsiteArray, blockProgramArray, user);
        presetRepository.save(preset);
        return preset;
    }

    @Transactional
    public void createPreset(UserPrincipal userPrincipal, SavePresetRequestDto requestDto) {

        // 프리셋 타이틀 2~6자
        validatePresetTitleLength(requestDto.getTitle());

        //임시로 1로 고정시키기 추후 수정 userPrincipal.getUserId());
        User user = userService.getUserById(1); //userPrincipal.getUserId());

        // userId = 1로 임의 설정

        List<String> blockWebsiteList = Arrays.asList(requestDto.getBlockSiteList());
        List<String> blockProgramList = Arrays.asList(requestDto.getBlockProgramList());

        savePreset(requestDto.getTitle(), blockWebsiteList, blockProgramList, user);

    }

    // 타이틀 유효성 메소드
    private void validatePresetTitleLength(String title) {
        if(title.length() < 2 || title.length() > 6){
            throw new CustomException(ErrorCode.INVALID_PRESET_TITLE_LENGTH);
        }
    }


}
