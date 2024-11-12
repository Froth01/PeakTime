package com.dinnertime.peaktime.domain.hiking.entity;

import com.dinnertime.peaktime.domain.user.entity.User;
import io.hypersistence.utils.hibernate.type.json.JsonBinaryType;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Type;

import java.util.List;

@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "statistics")
@Getter
public class Statistic {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "statistic_id")
    private Long statisticId;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "total_hiking_time")
    private Integer totalHikingTime;

    @Column(name = "total_hiking_count")
    private Integer totalHikingCount;

    @Column(name = "total_success_count")
    private Integer totalSuccessCount;

    @Column(name = "total_block_count")
    private Integer totalBlockCount;

    @Type(JsonBinaryType.class)
    @Column(name="start_time_array", columnDefinition = "jsonb")
    private List<String> startTimeArray;

    @Type(JsonBinaryType.class)
    @Column(name = "most_site_array", columnDefinition = "jsonb")
    private List<StatisticContent> mostSiteArray;

    @Type(JsonBinaryType.class)
    @Column(name = "most_program_array",columnDefinition = "jsonb")
    private List<StatisticContent> mostProgramArray;

}
