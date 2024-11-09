import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { Chart, BarController, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js';

Chart.register(BarController, CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const HorizontalBarChart = ({ startTimeList }) => {
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

    // 15분 단위 x축 레이블 생성 (0:00 ~ 11:45까지 15분 간격)
    const labels = Array.from({ length: 48 }, (_, i) => `${Math.floor(i / 4)}:${(i % 4) * 15}`.padStart(4, '0').padEnd(5, '0'));

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
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: '오전',
            data: amData,
            backgroundColor: 'rgba(255, 69, 0, 0.6)',
            borderColor: '#FF4500',
            borderWidth: 0,
          },
          {
            label: '오후',
            data: pmData.map(value => -value), // PM 데이터는 음수로 변환하여 아래쪽에 표시
            backgroundColor: 'rgba(52, 118, 208, 0.6)',
            borderColor: '#3476D0',
            borderWidth: 0,
          }
        ]
      },
      options: {
        scales: {
          x: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Time of Day (15-minute intervals)'
            }
          },
          y: {
            beginAtZero: true,
            suggestedMin: -Math.max(...pmData), // PM 데이터가 아래로 표시되도록 최소값 설정
            title: {
              display: true,
              text: 'Tic Count'
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

HorizontalBarChart.propTypes = {
  startTimeList: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default HorizontalBarChart;
