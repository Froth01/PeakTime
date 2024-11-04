package com.dinnertime.peaktime.domain.hiking.service.dto.response;

import com.dinnertime.peaktime.domain.hiking.service.dto.query.BlockInfo;
import com.dinnertime.peaktime.domain.hiking.service.dto.query.HikingStatisticQueryDto;
import com.dinnertime.peaktime.domain.user.entity.User;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@NoArgsConstructor
public class HikingStatisticResponseDto {

    private String nickname;

    private int totalHikingTime;

    private Long totalHikingCount;

    private int totalSuccessCount;

    private int totalBlockedCount;

    private int preferTimeZone;

    private List<BlockInfo> mostSiteList;

    private List<BlockInfo> mostProgramList;

    @Builder
    private HikingStatisticResponseDto(String nickname, int totalHikingTime, Long totalHikingCount, int totalSuccessCount, int totalBlockedCount, int preferTimeZone, List<BlockInfo> mostSiteList, List<BlockInfo> mostProgramList) {
        this.nickname = nickname;
        this.totalHikingTime = totalHikingTime;
        this.totalHikingCount = totalHikingCount;
        this.totalSuccessCount = totalSuccessCount;
        this.totalBlockedCount = totalBlockedCount;
        this.preferTimeZone = preferTimeZone;
        this.mostSiteList = mostSiteList;
        this.mostProgramList = mostProgramList;
    }

    public static HikingStatisticResponseDto createHikingStatisticResponseDto(HikingStatisticQueryDto hikingStatisticQueryDto, String nickname) {
        return HikingStatisticResponseDto.builder()
                .nickname(nickname)
                .totalHikingTime(hikingStatisticQueryDto.getTotalHikingTime())
                .totalHikingCount(hikingStatisticQueryDto.getTotalHikingCount())
                .totalSuccessCount(hikingStatisticQueryDto.getTotalHikingSuccessCount())
                .totalBlockedCount(hikingStatisticQueryDto.getTotalBlockedCount())
                .preferTimeZone(hikingStatisticQueryDto.getPreferTimeZone())
                .mostSiteList(hikingStatisticQueryDto.getMostSiteList())
                .mostProgramList(hikingStatisticQueryDto.getMostProgramList())
                .build();
    }
}