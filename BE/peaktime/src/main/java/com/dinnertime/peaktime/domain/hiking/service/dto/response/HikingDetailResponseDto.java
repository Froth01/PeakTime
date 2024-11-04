package com.dinnertime.peaktime.domain.hiking.service.dto.response;

import com.dinnertime.peaktime.domain.hiking.service.dto.query.BlockInfo;
import com.dinnertime.peaktime.domain.hiking.service.dto.query.HikingDetailQueryDto;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;
import lombok.extern.slf4j.Slf4j;

import java.time.LocalDateTime;
import java.util.List;

@ToString
@Slf4j
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class HikingDetailResponseDto {
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime startTime;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime endTime;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime realEndTime;

    private int blockedSiteCount;

    private int blockedProgramCount;

    private List<BlockInfo> visitedSiteList;

    private List<BlockInfo> visitedProgramList;

    @Builder
    private HikingDetailResponseDto(LocalDateTime startTime, LocalDateTime endTime, LocalDateTime realEndTime, int blockedSiteCount, int blockedProgramCount, List<BlockInfo> visitedSiteList, List<BlockInfo> visitedProgramList) {
        this.startTime = startTime;
        this.endTime = endTime;
        this.realEndTime = realEndTime;
        this.blockedSiteCount = blockedSiteCount;
        this.blockedProgramCount = blockedProgramCount;
        this.visitedSiteList = visitedSiteList;
        this.visitedProgramList = visitedProgramList;
    }

    public static HikingDetailResponseDto createHikingDetailResponseDto(HikingDetailQueryDto hikingDetailQueryDto) {

        return HikingDetailResponseDto.builder()
                .startTime(hikingDetailQueryDto.getStartTime())
                .endTime(hikingDetailQueryDto.getEndTime())
                .realEndTime(hikingDetailQueryDto.getRealEndTime())
                .blockedSiteCount(hikingDetailQueryDto.getBlockedSiteCount())
                .blockedProgramCount(hikingDetailQueryDto.getBlockedProgramCount())
                .visitedSiteList(hikingDetailQueryDto.getVisitedSiteList())
                .visitedProgramList(hikingDetailQueryDto.getVisitedProgramList())
                .build();
    }
}