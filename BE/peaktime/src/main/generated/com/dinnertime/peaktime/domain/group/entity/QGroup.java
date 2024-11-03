package com.dinnertime.peaktime.domain.group.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QGroup is a Querydsl query type for Group
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QGroup extends EntityPathBase<Group> {

    private static final long serialVersionUID = 1284955693L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QGroup group = new QGroup("group1");

    public final NumberPath<Long> groupId = createNumber("groupId", Long.class);

    public final BooleanPath isDelete = createBoolean("isDelete");

    public final com.dinnertime.peaktime.domain.preset.entity.QPreset preset;

    public final StringPath title = createString("title");

    public final com.dinnertime.peaktime.domain.user.entity.QUser user;

    public QGroup(String variable) {
        this(Group.class, forVariable(variable), INITS);
    }

    public QGroup(Path<? extends Group> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QGroup(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QGroup(PathMetadata metadata, PathInits inits) {
        this(Group.class, metadata, inits);
    }

    public QGroup(Class<? extends Group> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.preset = inits.isInitialized("preset") ? new com.dinnertime.peaktime.domain.preset.entity.QPreset(forProperty("preset"), inits.get("preset")) : null;
        this.user = inits.isInitialized("user") ? new com.dinnertime.peaktime.domain.user.entity.QUser(forProperty("user")) : null;
    }

}

