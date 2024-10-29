package com.dinnertime.peaktime.domain.preset.service.dto.response;

import com.dinnertime.peaktime.domain.preset.entity.Preset;
import lombok.*;

import java.util.List;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class PresetResponseWrapperDto {

    private List<PresetResponseDto> presetList;

    @Builder
    private PresetResponseWrapperDto(List<PresetResponseDto> presetList){
        this.presetList = presetList;
    }

    public static PresetResponseWrapperDto buildPresetResponseDto(List<Preset> presets) {
        List<PresetResponseDto> responseDto = presets.stream()
                .map(PresetResponseDto::createPresetResponse)
                .toList();

        return PresetResponseWrapperDto.builder()
                .presetList(responseDto)
                .build();
    }

}
