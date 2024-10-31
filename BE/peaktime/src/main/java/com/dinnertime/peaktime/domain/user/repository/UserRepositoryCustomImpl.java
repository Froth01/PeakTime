package com.dinnertime.peaktime.domain.user.repository;

import com.dinnertime.peaktime.domain.group.entity.QGroup;
import com.dinnertime.peaktime.domain.user.entity.QUser;
import com.dinnertime.peaktime.domain.user.entity.User;
import com.dinnertime.peaktime.domain.usergroup.entity.QUserGroup;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@RequiredArgsConstructor
public class UserRepositoryCustomImpl implements UserRepositoryCustom {

    private final JPAQueryFactory queryFactory;

    @Override
    public List<User> findAllByGroupIdAndIsDelete(Long groupId, Boolean isDelete) {
        return queryFactory
                .select(QUser.user)
                .from(QUser.user)
                .join(QUserGroup.userGroup)
                .on(QUser.user.userId.eq(QUserGroup.userGroup.user.userId))
                .join(QGroup.group)
                .on(QUserGroup.userGroup.group.groupId.eq(QGroup.group.groupId))
                .where(QGroup.group.groupId.eq(groupId).and(QUser.user.isDelete.eq(isDelete)))
                .fetch();
    }
}
