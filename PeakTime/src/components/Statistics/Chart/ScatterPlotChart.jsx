import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { Chart, ScatterController, LinearScale, PointElement, Tooltip, Legend } from 'chart.js';

Chart.register(ScatterController, LinearScale, PointElement, Tooltip, Legend);

const ScatterPlotChart = ({ startTimeList }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const totalMinutes = 12 * 60;
    const AMTimes = [];
    const PMTimes = [];

    startTimeList.forEach(time => {
      const [hour, minute] = time.split(":");
      const timeToMinutes = Number(hour) * 60 + Number(minute);
      timeToMinutes < totalMinutes ? AMTimes.push(timeToMinutes) : PMTimes.push(timeToMinutes);
    });

    const amData = AMTimes.map(minutes => ({ x: minutes / 60, y: Math.random() * 5 + 5 }));
    const pmData = PMTimes.map(minutes => ({ x: (minutes - totalMinutes) / 60, y: -(Math.random() * 5 + 5) }));

    const chart = new Chart(canvasRef.current, {
      type: 'scatter',
      data: {
        datasets: [
          {
            label: 'AM Time Tics',
            data: amData,
            backgroundColor: '#FF4500',
          },
          {
            label: 'PM Time Tics',
            data: pmData,
            backgroundColor: '#3476D0',
          }
        ]
      },
      options: {
        scales: {
          x: {
            type: 'linear',
            position: 'bottom',
            title: {
              display: true,
              text: 'Time of Day (Hours)'
            }
          },
          y: {
            title: {
              display: true,
              text: 'Density'
            },
            ticks: {
              callback: value => Math.abs(value) // 양수로 보이게
            }
          }
        }
      }
    });

    return () => chart.destroy();
  }, [startTimeList]);

  return <canvas ref={canvasRef} />;
};

ScatterPlotChart.propTypes = {
  startTimeList: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default ScatterPlotChart;
