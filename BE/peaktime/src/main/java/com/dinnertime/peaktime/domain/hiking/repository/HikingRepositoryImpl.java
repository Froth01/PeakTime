package com.dinnertime.peaktime.domain.hiking.repository;

import com.dinnertime.peaktime.domain.hiking.entity.QCalendar;
import com.dinnertime.peaktime.domain.hiking.entity.QHiking;
import com.dinnertime.peaktime.domain.hiking.service.dto.query.HikingCalendarDetailQueryDto;
import com.dinnertime.peaktime.domain.hiking.service.dto.query.HikingCalendarQueryDto;
import com.dinnertime.peaktime.domain.user.entity.User;
import com.querydsl.core.types.Projections;
import com.querydsl.core.types.dsl.DateTemplate;
import com.querydsl.core.types.dsl.Expressions;
import com.querydsl.jpa.JPAExpressions;
import com.querydsl.jpa.JPQLQuery;
import com.querydsl.jpa.impl.JPAQuery;
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
    private final QCalendar calendar = QCalendar.calendar;
    private final JPAQueryFactory queryFactory;

// 날짜만 가져오기
    @Override
    public List<HikingCalendarQueryDto> getCalendar(User user) {
        //날짜별로 하이킹 횟수 조회
        return queryFactory.select(Projections.fields(
                HikingCalendarQueryDto.class,
                calendar.date.as("date"),
                        //없는 경우 0을 출력
                        Expressions.numberTemplate(Integer.class,
                                "COALESCE(FLOOR(SUM((EXTRACT(EPOCH FROM {0}) - EXTRACT(EPOCH FROM {1})) / 60)), 0)",
                                hiking.realEndTime, hiking.startTime
                        ).as("totalMinute")
                ))
                .from(calendar)
                .leftJoin(hiking)
                .on(
                            calendar.date.eq(Expressions.dateTemplate(Date.class, "DATE_TRUNC('day', {0})", hiking.startTime))
                                .and(hiking.user.eq(user))
                                .and(hiking.realEndTime.isNotNull())
                )
                .groupBy(calendar.date)
                .orderBy(calendar.date.asc())
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
                        hiking.realEndTime.isNotNull(),
                        Expressions.dateTemplate(LocalDate.class, "DATE({0})", hiking.startTime).eq(date)
                )
                .orderBy(hiking.startTime.asc())
                .fetch();
    }
}
