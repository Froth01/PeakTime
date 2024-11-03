package com.dinnertime.peaktime.domain.memo.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QMemo is a Querydsl query type for Memo
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QMemo extends EntityPathBase<Memo> {

    private static final long serialVersionUID = -1670023461L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QMemo memo = new QMemo("memo");

    public final StringPath content = createString("content");

    public final DateTimePath<java.time.LocalDateTime> createAt = createDateTime("createAt", java.time.LocalDateTime.class);

    public final NumberPath<Long> memoId = createNumber("memoId", Long.class);

    public final com.dinnertime.peaktime.domain.summary.entity.QSummary summary;

    public final StringPath title = createString("title");

    public final com.dinnertime.peaktime.domain.user.entity.QUser user;

    public QMemo(String variable) {
        this(Memo.class, forVariable(variable), INITS);
    }

    public QMemo(Path<? extends Memo> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QMemo(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QMemo(PathMetadata metadata, PathInits inits) {
        this(Memo.class, metadata, inits);
    }

    public QMemo(Class<? extends Memo> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.summary = inits.isInitialized("summary") ? new com.dinnertime.peaktime.domain.summary.entity.QSummary(forProperty("summary"), inits.get("summary")) : null;
        this.user = inits.isInitialized("user") ? new com.dinnertime.peaktime.domain.user.entity.QUser(forProperty("user")) : null;
    }

}

