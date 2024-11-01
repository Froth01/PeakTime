package com.dinnertime.peaktime.domain.hiking.repository;

import com.dinnertime.peaktime.domain.hiking.entity.QHiking;
import com.dinnertime.peaktime.domain.hiking.service.dto.query.HikingCalendarQueryDto;
import com.querydsl.core.types.Projections;
import com.querydsl.core.types.dsl.DatePath;
import com.querydsl.core.types.dsl.DateTemplate;
import com.querydsl.core.types.dsl.Expressions;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
@RequiredArgsConstructor
public class HikingRepositoryImpl implements HikingRepositoryCustom {

    private final QHiking hiking = QHiking.hiking;
    private final JPAQueryFactory queryFactory;

    @Override
    public List<HikingCalendarQueryDto> getCalendar() {
        int currentYear = LocalDate.now().getYear();
        int currentMonth = LocalDate.now().getMonthValue();


        DateTemplate<LocalDate> startDate = Expressions.dateTemplate(LocalDate.class, "DATE({0})", hiking.startTime);

        return queryFactory.select(Projections.fields(
                HikingCalendarQueryDto.class,
                        startDate.as("date"),
                        startDate.count().as("intensity")
                ))
                .from(hiking)
                .where(
                        hiking.startTime.year().eq(currentYear),
                        hiking.startTime.month().eq(currentMonth)
                )
                .groupBy(startDate)
                .fetch();
    }
}
