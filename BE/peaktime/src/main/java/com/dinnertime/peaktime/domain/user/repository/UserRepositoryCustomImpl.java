package com.dinnertime.peaktime.domain.user.repository;

import com.dinnertime.peaktime.domain.group.entity.QGroup;
import com.dinnertime.peaktime.domain.user.entity.QUser;
import com.dinnertime.peaktime.domain.user.entity.User;
import com.dinnertime.peaktime.domain.usergroup.entity.QUserGroup;
import com.querydsl.jpa.JPAExpressions;
import com.querydsl.jpa.impl.JPAQueryFactory;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@RequiredArgsConstructor
public class UserRepositoryCustomImpl implements UserRepositoryCustom {

    private final JPAQueryFactory queryFactory;

    @PersistenceContext
    private EntityManager entityManager;

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
