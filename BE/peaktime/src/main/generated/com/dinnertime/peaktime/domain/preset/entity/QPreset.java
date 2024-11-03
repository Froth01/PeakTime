package com.dinnertime.peaktime.domain.preset.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QPreset is a Querydsl query type for Preset
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QPreset extends EntityPathBase<Preset> {

    private static final long serialVersionUID = 759262885L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QPreset preset = new QPreset("preset");

    public final ListPath<String, StringPath> blockProgramArray = this.<String, StringPath>createList("blockProgramArray", String.class, StringPath.class, PathInits.DIRECT2);

    public final ListPath<String, StringPath> blockWebsiteArray = this.<String, StringPath>createList("blockWebsiteArray", String.class, StringPath.class, PathInits.DIRECT2);

    public final NumberPath<Long> presetId = createNumber("presetId", Long.class);

    public final StringPath title = createString("title");

    public final com.dinnertime.peaktime.domain.user.entity.QUser user;

    public QPreset(String variable) {
        this(Preset.class, forVariable(variable), INITS);
    }

    public QPreset(Path<? extends Preset> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QPreset(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QPreset(PathMetadata metadata, PathInits inits) {
        this(Preset.class, metadata, inits);
    }

    public QPreset(Class<? extends Preset> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.user = inits.isInitialized("user") ? new com.dinnertime.peaktime.domain.user.entity.QUser(forProperty("user")) : null;
    }

}

