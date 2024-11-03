package com.dinnertime.peaktime.domain.summary.entity;

import com.dinnertime.peaktime.domain.memo.entity.Memo;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
@Table(name="summaries")
public class Summary {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="summary_id")
    private Long summaryId;

    @Column(name="update_at", nullable = false)
    private LocalDateTime updateAt;

    @Column(name = "content", nullable = false)
    private String content;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="memo_id", nullable=false)
    private Memo memo;

    @Builder
    private Summary(LocalDateTime updateAt, String content, Memo memo) {
        this.updateAt = updateAt;
        this.content = content;
        this.memo = memo;
    }
}
