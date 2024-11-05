package com.dinnertime.peaktime.domain.content.repository;

import com.dinnertime.peaktime.domain.content.entity.QContent;
import com.dinnertime.peaktime.domain.hiking.service.dto.query.BlockInfo;
import com.querydsl.core.types.Projections;
import com.querydsl.core.types.dsl.Expressions;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@RequiredArgsConstructor
public class ContentRepositoryImpl implements ContentRepositoryCustom {

    private final QContent content = QContent.content;
    private final JPAQueryFactory queryFactory;

    // "site"와 "program" 타입의 상위 5개 BlockInfo 리스트 가져오는 메서드
    @Override
    public List<BlockInfo> getTopBlockInfoList(String type, Long hikingId) {
        return queryFactory.select(Projections.fields(
                        BlockInfo.class,
                        content.usingTime.sum().as("usingTime"),
                        content.name.as("name")
                ))
                .from(content)
                .where(content.hiking.hikingId.eq(hikingId).and(content.type.eq(type)))
                .groupBy(content.name)
                .orderBy(content.usingTime.sum().desc())
                .limit(5)
                .fetch();
    }

    @Override
    public List<BlockInfo> getTopBlockInfoListByUserId(String type, Long userId) {
        return queryFactory.select(Projections.fields(
                        BlockInfo.class,
                        content.usingTime.sum().as("usingTime"),
                        content.name.as("name")
                ))
                .from(content)
                .where(content.hiking.user.userId.eq(userId)
                        .and(content.type.eq(type)))
                .groupBy(content.name)
                .orderBy(content.usingTime.sum().desc())
                .limit(5)
                .fetch();
    }

}
