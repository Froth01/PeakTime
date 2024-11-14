package com.dinnertime.peaktime.domain.memo.entity;

import com.dinnertime.peaktime.domain.memo.service.dto.request.SaveMemoRequestDto;
import com.dinnertime.peaktime.domain.summary.entity.Summary;
import com.dinnertime.peaktime.domain.user.entity.User;
import jakarta.persistence.*;
import lombok.*;

import java.nio.file.attribute.UserPrincipal;
import java.time.LocalDateTime;

@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
@Table(name="memos")
public class Memo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="memo_id")
    private Long memoId;

    @Column(name="title", nullable = false,length = 20)
    private String title;

    @Column(name="create_at", nullable = false)
    private LocalDateTime createAt;

    @Column(name = "content", columnDefinition = "TEXT", nullable = false)
    private String content;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="user_id", nullable = false)
    private User user;

    // 부모(메모)-자식(요약) 관계 처리(요약 자동 삭제 때문에)
    // 요약만 삭제할 경우 :
    // 메모를 삭제할 경우 : memo와 연결된 summary 역시 함께 삭제해야 하므로 cascaseType.REMOVE 처리해서 동반 삭제 진햄

    @OneToOne(mappedBy = "memo", cascade = CascadeType.REMOVE)
    private Summary summary;

    @Builder
    private Memo(String title, LocalDateTime createAt, String content, User user) {
        this.title = title;
        this.createAt = createAt;
        this.content = content;
        this.user = user;
    }

    public static Memo createMemo(SaveMemoRequestDto requestDto, User user){
        return Memo.builder()
                .title(requestDto.getTitle())
                .createAt(LocalDateTime.now())
                .content(requestDto.getContent())
                .user(user)
                .build();
    }

}
