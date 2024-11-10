import * as d3 from "d3";
import PropTypes from "prop-types";
import { useEffect, useRef } from "react";

const CircleChart = ({ startTimeList }) => {
  const svgRef = useRef(null);

  const timeInterval = 1;
  const numberOfTimeUnit = 60 / timeInterval;
  const val = 5; // 기준 값

  useEffect(() => {
    const width = 300;
    const height = 350; // 범례 공간 포함한 높이 설정
    const radius = 100;
    const totalMinutes = 12 * 60;

    // 각 시간대의 사용 횟수를 카운트
    const usageCount = Array(24 * numberOfTimeUnit).fill(0);
    startTimeList.forEach((time) => {
      const [hour, minute] = time.split(":");
      const timeToMinutes = Number(hour) * 60 + Number(minute);
      const index = Math.floor(timeToMinutes / timeInterval);
      usageCount[index] += 1; // 해당 시간대 사용 횟수 증가
    });

    const maxCount = Math.max(...usageCount); // count의 최대값을 계산

    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2}, ${height / 2 - 25})`); // 차트 중앙으로 이동

    // 툴팁 div 생성
    const tooltip = d3
      .select("body")
      .append("div")
      .style("position", "absolute")
      .style("background", "#fff")
      .style("border", "1px solid #ccc")
      .style("padding", "5px")
      .style("border-radius", "5px")
      .style("pointer-events", "none")
      .style("visibility", "hidden");

    // 항상 5개의 grid가 나타나도록 설정
    const numGrids = 5;
    for (let i = 1; i <= numGrids; i++) {
      const gridRadius = (radius / numGrids) * i;
      svg
        .append("circle")
        .attr("r", gridRadius)
        .attr("fill", "none")
        .attr("stroke", "#e0e0e0")
        .attr("stroke-dasharray", "2,2");
    }

    // 눈금
    const angleStep = (2 * Math.PI) / 12;
    for (let i = 0; i < 12; i++) {
      const angle = i * angleStep - Math.PI / 2;
      const x = Math.cos(angle) * (radius + 20);
      const y = Math.sin(angle) * (radius + 20);

      svg
        .append("text")
        .attr("x", x)
        .attr("y", y)
        .attr("text-anchor", "middle")
        .attr("alignment-baseline", "middle")
        .attr("fill", "#333")
        .text(i === 0 ? 12 : i); // 12시 방향 표시
    }

    // 방사형 1시간 단위 선 표시
    for (let i = 0; i < 12; i++) {
      const angle = i * angleStep - Math.PI / 2;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;

      svg
        .append("line")
        .attr("x1", 0)
        .attr("y1", 0)
        .attr("x2", x)
        .attr("y2", y)
        .attr("stroke", "#e0e0e0")
        .attr("stroke-width", 1)
        .attr("stroke-dasharray", "2,2");
    }

    // AM/PM 시간대 각도 계산 함수
    const calculateAngle = (minutes) => {
      const min = minutes % totalMinutes; // AM과 PM을 12시간 기준으로 맞춤
      return (min / totalMinutes) * 2 * Math.PI - Math.PI / 2;
    };

    // AM 및 PM 시간대 tic 표시
    usageCount.forEach((count, idx) => {
      if (count > 0) {
        const timeMinutes = idx * timeInterval;
        const angle = calculateAngle(timeMinutes);

        // innerRadius 계산: val을 기준으로 조건에 따라 조절
        const outerRadius = radius;
        const innerRadius =
          maxCount <= val
            ? radius - (radius * count) / val
            : radius - (radius * count) / maxCount;

        const x1 = Math.cos(angle) * outerRadius;
        const y1 = Math.sin(angle) * outerRadius;
        const x2 = Math.cos(angle) * innerRadius;
        const y2 = Math.sin(angle) * innerRadius;

        // 초기 위치를 바깥쪽으로 설정 후 중심으로 이동하는 애니메이션 적용
        svg
          .append("line")
          .attr("x1", x1)
          .attr("y1", y1)
          .attr("x2", x1) // 초기 x2 위치는 바깥쪽
          .attr("y2", y1) // 초기 y2 위치는 바깥쪽
          .attr("stroke", timeMinutes < totalMinutes ? "#FF4500" : "#3476D0") // AM과 PM 색상 구분
          .attr("stroke-width", 2)
          .attr("opacity", 0.5)
          .on("mouseover", function (event) {
            tooltip
              .style("visibility", "visible")
              .text(
                `${timeMinutes < totalMinutes ? "AM" : "PM"} ${String(
                  Math.floor((timeMinutes % totalMinutes) / 60)
                ).padStart(2, "0")}:${String(timeMinutes % 60).padStart(
                  2,
                  "0"
                )}, 사용 횟수: ${count}`
              );
          })
          .on("mousemove", function (event) {
            tooltip
              .style("top", `${event.pageY - 10}px`)
              .style("left", `${event.pageX + 10}px`);
          })
          .on("mouseout", function () {
            tooltip.style("visibility", "hidden");
          })
          .transition()
          .duration(1000) // 애니메이션 지속 시간
          .attr("x2", x2) // 최종 위치를 중심 쪽으로 이동
          .attr("y2", y2);
      }
    });

    // 범례 추가
    const legend = d3
      .select(svgRef.current)
      .append("g")
      .attr("transform", `translate(${width / 2}, ${height - 40})`); // 범례 위치 조정

    legend
      .append("rect")
      .attr("x", 0)
      .attr("y", 0)
      .attr("width", 12)
      .attr("height", 12)
      .attr("fill", "#FF4500");

    legend
      .append("text")
      .attr("x", 18)
      .attr("y", 10)
      .text("오전")
      .attr("fill", "#333");

    legend
      .append("rect")
      .attr("x", 60)
      .attr("y", 0)
      .attr("width", 12)
      .attr("height", 12)
      .attr("fill", "#3476D0");

    legend
      .append("text")
      .attr("x", 78)
      .attr("y", 10)
      .text("오후")
      .attr("fill", "#333");

    return () => {
      d3.select(svgRef.current).selectAll("*").remove();
      tooltip.remove();
    };
  }, [startTimeList]);

  return <svg ref={svgRef} className="text-base font-bold" />;
};

CircleChart.propTypes = {
  startTimeList: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default CircleChart;
