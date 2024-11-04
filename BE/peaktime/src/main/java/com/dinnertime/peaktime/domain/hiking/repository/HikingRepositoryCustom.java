package com.dinnertime.peaktime.domain.hiking.repository;

import com.dinnertime.peaktime.domain.hiking.service.dto.query.HikingCalendarDetailQueryDto;
import com.dinnertime.peaktime.domain.hiking.service.dto.query.HikingCalendarQueryDto;
import com.dinnertime.peaktime.domain.hiking.service.dto.query.HikingDetailQueryDto;
import com.dinnertime.peaktime.domain.hiking.service.dto.query.HikingStatisticQueryDto;
import com.dinnertime.peaktime.domain.hiking.service.dto.response.HikingStatisticResponseDto;
import com.dinnertime.peaktime.domain.user.entity.User;

import java.time.LocalDate;
import java.util.List;

public interface HikingRepositoryCustom {
    List<HikingCalendarQueryDto> getCalendar(User user);

    List<HikingCalendarDetailQueryDto> getCalendarByDate(LocalDate date, User user);

    HikingDetailQueryDto getHikingDetail(User user, Long hikingId);

    HikingStatisticQueryDto getHikingStatistic(User findUser);
}
