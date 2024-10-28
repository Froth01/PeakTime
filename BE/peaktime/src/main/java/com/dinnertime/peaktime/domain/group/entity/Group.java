package com.dinnertime.peaktime.domain.group.entity;

import com.dinnertime.peaktime.domain.user.entity.User;
import jakarta.persistence.*;
import lombok.*;

@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
@Table(name = "groups")
public class Group {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "group_id")
    private Long groupId;

    @Column(name = "title", length = 32, nullable = false)
    private String title;

    @Column(name = "is_delete", nullable = false)
    private Boolean isDelete;

//    @OneToOne
//    @JoinColumn(name = "preset_id", nullable = false)
//    private Preset preset;

    @ManyToOne
    @JoinColumn(name = "root_user_id", nullable = false)
    private User user;
}
