package com.dinnertime.peaktime.domain.hiking.service.dto.query;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

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

/*
		    "startTime": "2024-10-19 14:30:00",
		    "endTime": "2024-10-19 15:30:00",
		    "realEndTime": "2024-10-19 15:30:00",
		    "blockedSiteCount": 3,
		    "blockedProgramCount": 1,
		    "visitedSiteList": [
				    "www.naver.com",
				    "www.naver.com",
				    "www.naver.com"
		    ]
		    "visitedProgram": [
				    "계산기",
				    "계산기",
				    "계산기",
				    "계산기",
				    "계산기"
				]

 */