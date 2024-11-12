package com.dinnertime.peaktime.domain.hiking.repository;

import com.dinnertime.peaktime.domain.hiking.service.dto.query.HikingCalendarDetailQueryDto;
import com.dinnertime.peaktime.domain.hiking.service.dto.query.HikingCalendarQueryDto;
import com.dinnertime.peaktime.domain.hiking.service.dto.query.HikingDetailQueryDto;
import com.dinnertime.peaktime.domain.hiking.service.dto.query.HikingStatisticQueryDto;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

public interface HikingRepositoryCustom {
    List<HikingCalendarQueryDto> getCalendar(Long userId);

    List<HikingCalendarDetailQueryDto> getCalendarByDate(LocalDate date, Long userId);

    HikingDetailQueryDto getHikingDetail(Long hikingId);

    HikingStatisticQueryDto getHikingStatistic(Long findUserId);

    HikingStatisticQueryDto getHikingStatistic();

    List<LocalDateTime> getStartTimeListByUserId(Long userId);

    Long getTotalBlockedCount(Long findUserId);
}
