import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { Chart, RadarController, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js';

Chart.register(RadarController, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

const CircleChartByChartJS = ({ startTimeList }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const totalMinutes = 12 * 60;
    const AMTimes = [];
    const PMTimes = [];

    // AM과 PM 시간대 분리
    startTimeList.forEach(time => {
      const [hour, minute] = time.split(":");
      const timeToMinutes = Number(hour) * 60 + Number(minute);
      timeToMinutes < totalMinutes ? AMTimes.push(timeToMinutes) : PMTimes.push(timeToMinutes);
    });

    // 1시간 단위로 라벨 설정 (레이블은 1시간마다 표시)
    const labels = Array.from({ length: 48 }, (_, i) => (i % 4 === 0 ? `${Math.floor(i / 4)}:00` : ""));

    // AM 및 PM 시간대 데이터: 15분 단위로 카운트
    const amData = Array(48).fill(0);
    const pmData = Array(48).fill(0);

    AMTimes.forEach(minutes => {
      const index = Math.floor(minutes / 15); // 15분 단위 인덱스
      amData[index] += 1;
    });

    PMTimes.forEach(minutes => {
      const index = Math.floor((minutes - totalMinutes) / 15); // PM 시간대의 15분 단위 인덱스
      pmData[index] += 1;
    });

    const chart = new Chart(canvasRef.current, {
      type: 'radar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'AM Time Tics',
            data: amData,
            backgroundColor: 'rgba(255, 69, 0, 0.2)',
            borderColor: '#FF4500',
            borderWidth: 2,
            pointBackgroundColor: '#FF4500'
          },
          {
            label: 'PM Time Tics',
            data: pmData,
            backgroundColor: 'rgba(52, 118, 208, 0.2)',
            borderColor: '#3476D0',
            borderWidth: 2,
            pointBackgroundColor: '#3476D0'
          }
        ]
      },
      options: {
        scales: {
          r: {
            beginAtZero: true,
            ticks: {
              stepSize: 1
            },
            grid: {
              color: '#ccc'
            },
            angleLines: {
              color: '#ccc'
            }
          }
        },
        plugins: {
          legend: {
            display: true,
            position: 'top'
          }
        }
      }
    });

    return () => {
      chart.destroy();
    };
  }, [startTimeList]);

  return <canvas ref={canvasRef} />;
};

CircleChartByChartJS.propTypes = {
  startTimeList: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default CircleChartByChartJS;
