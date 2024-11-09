import * as d3 from "d3";
import PropTypes from "prop-types";
import { useEffect, useRef } from "react";

const CircleChart = ({ startTimeList }) => {
  const svgRef = useRef(null);

  useEffect(() => {
    const width = 400;
    const height = 400;
    const radius = 150;
    const totalMinutes = 12 * 60;

    const AMTimes = [];
    const PMTimes = [];
    startTimeList.forEach(time => {
      const [hour, minute] = time.split(":");
      const timeToMinutes = Number(hour) * 60 + Number(minute);

      timeToMinutes < totalMinutes ? AMTimes.push(timeToMinutes) : PMTimes.push(timeToMinutes);
    })

    const svg = d3.select(svgRef.current)
                  .attr("width", width)
                  .attr("height", height)
                  .append("g")
                  .attr("transform", `translate(${width / 2}, ${height / 2})`);

    // 원형 축
    svg.append("circle")
        .attr("r", radius)
        .attr("fill", "none")
        .attr("stroke", "#ccc");

    // 눈금
    const angleStep = (2 * Math.PI) / 12;
    for (let i = 0; i < 12; i++) {
      const angle = i * angleStep - Math.PI / 2;
      const x = Math.cos(angle) * (radius + 20);
      const y = Math.sin(angle) * (radius + 20);

      svg.append("text")
         .attr("x", x)
         .attr("y", y)
         .attr("text-anchor", "middle")
         .attr("alignment-baseline", "middle")
         .attr("font-size", "12px")
         .attr("fill", "#333")
         .text(i);
    }

    const calculateAngle = (minutes) => {
      const min = minutes < 720 ? minutes : minutes - totalMinutes;
      return (min / totalMinutes) * 2 * Math.PI - Math.PI / 2;
    }

    // AM 시간대 tic 표시
    AMTimes.forEach(time => {
      const angle = calculateAngle(time);
      const x1 = Math.cos(angle) * (radius - 10); // tic 시작 위치
      const y1 = Math.sin(angle) * (radius - 10);
      const x2 = Math.cos(angle) * (radius + 10); // tic 끝 위치
      const y2 = Math.sin(angle) * (radius + 10);

      svg.append("line")
         .attr("x1", x1)
         .attr("y1", y1)
         .attr("x2", x2)
         .attr("y2", y2)
         .attr("stroke", "#FF4500")
         .attr("stroke-width", 2)
         .attr("opacity", 0.3);
    });

    // PM 시간대 tic 표시
    PMTimes.forEach(time => {
      const angle = calculateAngle(time);
      const x1 = Math.cos(angle) * (radius - 10);
      const y1 = Math.sin(angle) * (radius - 10);
      const x2 = Math.cos(angle) * (radius + 10);
      const y2 = Math.sin(angle) * (radius + 10);

      svg.append("line")
         .attr("x1", x1)
         .attr("y1", y1)
         .attr("x2", x2)
         .attr("y2", y2)
         .attr("stroke", "#3476D0")
         .attr("stroke-width", 2)
         .attr("opacity", 0.3);
    });

    return () => {
      d3.select(svgRef.current).selectAll("*").remove();
    }
  }, [startTimeList]);
  
  return (
    <div className="border">
      <svg ref={svgRef} />
    </div>
  );
}

CircleChart.propTypes = {
  startTimeList: PropTypes.arrayOf(PropTypes.string).isRequired,
}

export default CircleChart;