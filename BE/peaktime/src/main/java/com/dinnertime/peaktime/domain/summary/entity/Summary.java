package com.dinnertime.peaktime.domain.summary.entity;

import com.dinnertime.peaktime.domain.memo.entity.Memo;
import jakarta.persistence.*;
import lombok.*;

import java.util.Date;

@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
@Table(name="summaries")
@ToString
public class Summary {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="summary_id")
    private Long summaryId;

    @Column(name="update_at", nullable = false)
    private Date updateAt;

    @Column(name = "content", nullable = false)
    private String content;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="memo_id", nullable=false)
    private Memo memo;

    @Builder
    public Summary(Date updateAt, String content, Memo memo) {
        this.updateAt = updateAt;
        this.content = content;
        this.memo = memo;
    }
}
