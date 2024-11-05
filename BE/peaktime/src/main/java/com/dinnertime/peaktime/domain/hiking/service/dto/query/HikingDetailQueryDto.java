package com.dinnertime.peaktime.domain.hiking.service.dto.query;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@ToString
public class HikingDetailQueryDto {

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime startTime;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime endTime;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime realEndTime;

    private Integer blockedSiteCount;

    private Integer blockedProgramCount;

    @Setter
    private List<BlockInfo> visitedSiteList;

    @Setter
    private List<BlockInfo> visitedProgramList;
}