package com.dinnertime.peaktime.domain.summary.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QSummary is a Querydsl query type for Summary
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QSummary extends EntityPathBase<Summary> {

    private static final long serialVersionUID = 332037453L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QSummary summary = new QSummary("summary");

    public final StringPath content = createString("content");

    public final com.dinnertime.peaktime.domain.memo.entity.QMemo memo;

    public final NumberPath<Long> summaryId = createNumber("summaryId", Long.class);

    public final DateTimePath<java.time.LocalDateTime> updateAt = createDateTime("updateAt", java.time.LocalDateTime.class);

    public QSummary(String variable) {
        this(Summary.class, forVariable(variable), INITS);
    }

    public QSummary(Path<? extends Summary> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QSummary(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QSummary(PathMetadata metadata, PathInits inits) {
        this(Summary.class, metadata, inits);
    }

    public QSummary(Class<? extends Summary> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.memo = inits.isInitialized("memo") ? new com.dinnertime.peaktime.domain.memo.entity.QMemo(forProperty("memo"), inits.get("memo")) : null;
    }

}

