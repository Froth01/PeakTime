package com.dinnertime.peaktime.domain.content.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QContent is a Querydsl query type for Content
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QContent extends EntityPathBase<Content> {

    private static final long serialVersionUID = -161817363L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QContent content = new QContent("content");

    public final NumberPath<Long> contentId = createNumber("contentId", Long.class);

    public final com.dinnertime.peaktime.domain.hiking.entity.QHiking hiking;

    public final BooleanPath isBlocked = createBoolean("isBlocked");

    public final StringPath name = createString("name");

    public final StringPath type = createString("type");

    public final NumberPath<Integer> usingTime = createNumber("usingTime", Integer.class);

    public QContent(String variable) {
        this(Content.class, forVariable(variable), INITS);
    }

    public QContent(Path<? extends Content> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QContent(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QContent(PathMetadata metadata, PathInits inits) {
        this(Content.class, metadata, inits);
    }

    public QContent(Class<? extends Content> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.hiking = inits.isInitialized("hiking") ? new com.dinnertime.peaktime.domain.hiking.entity.QHiking(forProperty("hiking"), inits.get("hiking")) : null;
    }

}

