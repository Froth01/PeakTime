package com.dinnertime.peaktime.domain.preset.entity;

import com.dinnertime.peaktime.domain.preset.service.dto.request.SavePresetRequestDto;
import com.dinnertime.peaktime.domain.user.entity.User;
import io.hypersistence.utils.hibernate.type.json.JsonBinaryType;
import jakarta.persistence.*;
import lombok.*;

import org.hibernate.annotations.Type;

import java.util.Arrays;
import java.util.List;

@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
@Table(name = "presets")
@ToString
public class Preset {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="preset_id")
    private Long presetId; // bigint wrapper class Long과 연결시키기

    @Column(name ="title",nullable=false)
    private String title;

    @Type(JsonBinaryType.class)
    @Column(name="block_website_array",nullable=false, columnDefinition = "jsonb")
    private List<String> blockWebsiteArray;

    @Type(JsonBinaryType.class)
    @Column(name="block_program_array", nullable=false, columnDefinition = "jsonb")
    private List<String> blockProgramArray;

    @ManyToOne(fetch= FetchType.LAZY) // 지연 로딩
    @JoinColumn(name="user_id", nullable=false)
    private User user;

    @Builder
    private Preset(String title, List<String> blockWebsiteArray, List<String> blockProgramArray, User user) {
        this.title = title;
        this.blockWebsiteArray = blockWebsiteArray;
        this.blockProgramArray = blockProgramArray;
        this.user = user;
    }

    // 프리셋 생성
    public static Preset createPreset(SavePresetRequestDto requestDto, User user) {
        return Preset.builder()
                .title(requestDto.getTitle())
                .blockWebsiteArray(Arrays.asList(requestDto.getBlockSiteList()))
                .blockProgramArray(Arrays.asList(requestDto.getBlockProgramList()))
                .user(user)
                .build();
    }

}
