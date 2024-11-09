package com.dinnertime.peaktime.domain.hiking.service.dto.response;

import com.dinnertime.peaktime.domain.hiking.service.dto.query.UsingInfo;
import com.dinnertime.peaktime.domain.hiking.service.dto.query.HikingStatisticQueryDto;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class HikingStatisticResponseDto {

    private String nickname;

    private Integer totalHikingTime;

    private Long totalHikingCount;

    private Integer totalSuccessCount;

    private Long totalBlockedCount;

    private int preferTimeZone;

    private List<UsingInfo> mostSiteList;

    private List<UsingInfo> mostProgramList;

    @Builder
    private HikingStatisticResponseDto(String nickname, Integer totalHikingTime, Long totalHikingCount, Integer totalSuccessCount, Long totalBlockedCount, int preferTimeZone, List<UsingInfo> mostSiteList, List<UsingInfo> mostProgramList) {
        this.nickname = nickname;
        this.totalHikingTime = totalHikingTime;
        this.totalHikingCount = totalHikingCount;
        this.totalSuccessCount = totalSuccessCount;
        this.totalBlockedCount = totalBlockedCount;
        this.preferTimeZone = preferTimeZone;
        this.mostSiteList = mostSiteList;
        this.mostProgramList = mostProgramList;
    }

    public static HikingStatisticResponseDto createHikingStatisticResponseDto(HikingStatisticQueryDto hikingStatisticQueryDto, Long totalBlockedCount, String nickname, List<UsingInfo> mostSiteList, List<UsingInfo> mostProgramList, int preferTimeZone) {
        return HikingStatisticResponseDto.builder()
                .nickname(nickname)
                .totalHikingTime(hikingStatisticQueryDto.getTotalHikingTime())
                .totalHikingCount(hikingStatisticQueryDto.getTotalHikingCount())
                .totalSuccessCount(hikingStatisticQueryDto.getTotalHikingSuccessCount())
                .totalBlockedCount(totalBlockedCount)
                .preferTimeZone(preferTimeZone)
                .mostSiteList(mostSiteList)
                .mostProgramList(mostProgramList)
                .build();
    }

    public static HikingStatisticResponseDto createNoHiking(String nickname) {
        return HikingStatisticResponseDto.builder()
                .nickname(nickname)
                .totalHikingTime(0)
                .totalHikingCount(0L)
                .totalSuccessCount(0)
                .totalBlockedCount(0L)
                .preferTimeZone(-1)
                .mostSiteList(null)
                .mostProgramList(null)
                .build();
    }
}