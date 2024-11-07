package com.dinnertime.peaktime.domain.user.repository;

import com.dinnertime.peaktime.domain.group.entity.QGroup;
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
    private final QUser user = QUser.user;
    private final QGroup group = QGroup.group;
    private final QUserGroup userGroup = QUserGroup.userGroup;

    @Override
    public Long updateIsDeleteByGroupId(Long groupId, Boolean isDelete) {
        return queryFactory
                .update(user)
                .set(user.isDelete, isDelete)
                .where(user.userId.in(
                        JPAExpressions
                                .select(userGroup.user.userId)
                                .from(userGroup)
                                .where(userGroup.group.groupId.eq(groupId))
                ))
                .execute();
    }

    @Override
    public Long updateIsDeleteByRootUserId(Long rootUserId) {
        return queryFactory
                .update(user)
                .set(user.isDelete, true)
                .where(user.userId.in(
                        JPAExpressions
                                .select(userGroup.user.userId)
                                .from(userGroup)
                                .where(userGroup.group.groupId.in(
                                        JPAExpressions
                                                .select(group.groupId)
                                                .from(group)
                                                .where(group.user.userId.eq(rootUserId)
                                                        .and(group.isDelete.eq(false)))
                                ))
                ))
                .execute();
    }

}
