package com.dinnertime.peaktime.domain.hiking.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QHiking is a Querydsl query type for Hiking
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QHiking extends EntityPathBase<Hiking> {

    private static final long serialVersionUID = 2044154199L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QHiking hiking = new QHiking("hiking");

    public final DateTimePath<java.time.LocalDateTime> endTime = createDateTime("endTime", java.time.LocalDateTime.class);

    public final NumberPath<Long> hikingId = createNumber("hikingId", Long.class);

    public final BooleanPath isSelf = createBoolean("isSelf");

    public final DateTimePath<java.time.LocalDateTime> realEndTime = createDateTime("realEndTime", java.time.LocalDateTime.class);

    public final DateTimePath<java.time.LocalDateTime> startTime = createDateTime("startTime", java.time.LocalDateTime.class);

    public final com.dinnertime.peaktime.domain.user.entity.QUser user;

    public QHiking(String variable) {
        this(Hiking.class, forVariable(variable), INITS);
    }

    public QHiking(Path<? extends Hiking> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QHiking(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QHiking(PathMetadata metadata, PathInits inits) {
        this(Hiking.class, metadata, inits);
    }

    public QHiking(Class<? extends Hiking> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.user = inits.isInitialized("user") ? new com.dinnertime.peaktime.domain.user.entity.QUser(forProperty("user")) : null;
    }

}

