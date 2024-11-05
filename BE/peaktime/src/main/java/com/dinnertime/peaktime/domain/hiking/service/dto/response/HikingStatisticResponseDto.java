package com.dinnertime.peaktime.domain.hiking.service.dto.response;

import com.dinnertime.peaktime.domain.hiking.service.dto.query.BlockInfo;
import com.dinnertime.peaktime.domain.hiking.service.dto.query.HikingStatisticQueryDto;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@NoArgsConstructor
public class HikingStatisticResponseDto {

    private String nickname;

    private Integer totalHikingTime;

    private Long totalHikingCount;

    private Integer totalSuccessCount;

    private Integer totalBlockedCount;

    private int preferTimeZone;

    private List<BlockInfo> mostSiteList;

    private List<BlockInfo> mostProgramList;

    @Builder
    private HikingStatisticResponseDto(String nickname, Integer totalHikingTime, Long totalHikingCount, Integer totalSuccessCount, Integer totalBlockedCount, int preferTimeZone, List<BlockInfo> mostSiteList, List<BlockInfo> mostProgramList) {
        this.nickname = nickname;
        this.totalHikingTime = totalHikingTime;
        this.totalHikingCount = totalHikingCount;
        this.totalSuccessCount = totalSuccessCount;
        this.totalBlockedCount = totalBlockedCount;
        this.preferTimeZone = preferTimeZone;
        this.mostSiteList = mostSiteList;
        this.mostProgramList = mostProgramList;
    }

    public static HikingStatisticResponseDto createHikingStatisticResponseDto(HikingStatisticQueryDto hikingStatisticQueryDto, Integer totalBlockedCount, String nickname, List<BlockInfo> mostSiteList, List<BlockInfo> mostProgramList, int preferTimeZone) {
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
}