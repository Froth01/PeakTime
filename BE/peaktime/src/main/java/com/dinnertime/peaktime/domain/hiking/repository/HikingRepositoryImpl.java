package com.dinnertime.peaktime.domain.hiking.repository;

import com.dinnertime.peaktime.domain.hiking.entity.QHiking;
import com.dinnertime.peaktime.domain.hiking.service.dto.query.HikingCalendarDetailQueryDto;
import com.dinnertime.peaktime.domain.hiking.service.dto.query.HikingCalendarQueryDto;
import com.dinnertime.peaktime.domain.user.entity.User;
import com.querydsl.core.types.Projections;
import com.querydsl.core.types.dsl.DateTemplate;
import com.querydsl.core.types.dsl.Expressions;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.sql.Date;
import java.time.LocalDate;
import java.util.List;

@Repository
@RequiredArgsConstructor
public class HikingRepositoryImpl implements HikingRepositoryCustom {

    private final QHiking hiking = QHiking.hiking;
    private final JPAQueryFactory queryFactory;

// 날짜만 가져오기
    @Override
    public List<HikingCalendarQueryDto> getCalendar(User user) {
        // 날짜만 가져오기
        DateTemplate<Date> startDate = Expressions.dateTemplate(Date.class, "DATE({0})", hiking.startTime);

        //postgresql의 경우 date 타입만 존재하여 date로 반환
        //날짜별로 하이킹 횟수 조회
        return queryFactory.select(Projections.fields(
                        HikingCalendarQueryDto.class,
                        startDate.as("date"),
                        hiking.count().as("intensity")
                ))
                .from(hiking)
                .where(
                        Expressions.numberTemplate(Integer.class, "EXTRACT(YEAR FROM {0})", hiking.startTime).eq(LocalDate.now().getYear()),
                        Expressions.numberTemplate(Integer.class, "EXTRACT(MONTH FROM {0})", hiking.startTime).eq(LocalDate.now().getMonthValue()),
                        hiking.user.eq(user)
                )
                .groupBy(startDate)
                .fetch();
    }

    @Override
    public List<HikingCalendarDetailQueryDto> getCalendarByDate(LocalDate date, User user) {

        return queryFactory.select(Projections.fields(
                        HikingCalendarDetailQueryDto.class,
                        hiking.hikingId.as("hikingId"),
                        hiking.startTime.as("startTime"),
                        hiking.endTime.as("endTime"),
                        hiking.realEndTime.as("realEndTime")
                ))
                .from(hiking)
                .where(
                        hiking.user.eq(user),
                        Expressions.dateTemplate(LocalDate.class, "DATE({0})", hiking.startTime).eq(date)
                )
                .fetch();
    }
}
