package com.dinnertime.peaktime.domain.user.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;


/**
 * QUser is a Querydsl query type for User
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QUser extends EntityPathBase<User> {

    private static final long serialVersionUID = 1336070781L;

    public static final QUser user = new QUser("user");

    public final StringPath email = createString("email");

    public final BooleanPath isDelete = createBoolean("isDelete");

    public final BooleanPath isRoot = createBoolean("isRoot");

    public final StringPath nickname = createString("nickname");

    public final StringPath password = createString("password");

    public final NumberPath<Long> userId = createNumber("userId", Long.class);

    public final StringPath userLoginId = createString("userLoginId");

    public QUser(String variable) {
        super(User.class, forVariable(variable));
    }

    public QUser(Path<? extends User> path) {
        super(path.getType(), path.getMetadata());
    }

    public QUser(PathMetadata metadata) {
        super(User.class, metadata);
    }

}

