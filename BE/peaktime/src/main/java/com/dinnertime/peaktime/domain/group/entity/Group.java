package com.dinnertime.peaktime.domain.group.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@Setter
@Table(name = "groups")
public class Group {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "group_id")
    private Long groupId;

    @Column(name = "title", length = 32, nullable = false)
    private String title;

    @Column(name = "is_delete", nullable = false)
    private boolean isDelete;

//    @ManyToOne
//    @JoinColumn(name = "preset_id", nullable = false)
//    private Preset preset;
//
//    @ManyToOne
//    @JoinColumn(name = "root_user_id", nullable = false, unique = true)
//    private User user;
}
