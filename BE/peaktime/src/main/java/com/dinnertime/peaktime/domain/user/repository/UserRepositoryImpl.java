package com.dinnertime.peaktime.domain.user.repository;

import com.dinnertime.peaktime.domain.user.entity.QUser;
import com.dinnertime.peaktime.domain.usergroup.entity.QUserGroup;
import com.querydsl.jpa.JPAExpressions;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class UserRepositoryImpl implements UserRepositoryCustom {

    private final JPAQueryFactory queryFactory;

    @Override
    public Long updateIsDeleteByGroupId(Long groupId, Boolean isDelete) {
        return queryFactory
                .update(QUser.user)
                .set(QUser.user.isDelete, isDelete)
                .where(QUser.user.userId.in(
                        JPAExpressions
                                .select(QUserGroup.userGroup.user.userId)
                                .from(QUserGroup.userGroup)
                                .where(QUserGroup.userGroup.group.groupId.eq(groupId))
                ))
                .execute();
    }
}
