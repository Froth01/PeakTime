package com.dinnertime.peaktime.domain.preset.service.dto.response;

import com.dinnertime.peaktime.domain.preset.entity.Preset;
import lombok.*;

import java.util.List;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@ToString
public class PresetWrapperResponseDto {

    private List<PresetResponseDto> presetList;

    @Builder
    private PresetWrapperResponseDto(List<PresetResponseDto> presetList){
        this.presetList = presetList;
    }

    public static PresetWrapperResponseDto buildPresetResponseDto(List<Preset> presets) {
        List<PresetResponseDto> responseDto = presets.stream()
                .map(PresetResponseDto::createPresetResponse)
                .toList();

        return PresetWrapperResponseDto.builder()
                .presetList(responseDto)
                .build();
    }

}
