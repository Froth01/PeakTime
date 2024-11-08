import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import PropTypes from "prop-types";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const StackedBarChart = ({ visitedSiteList, visitedProgramList }) => {
  // datasets
  const siteUsingTimes = visitedSiteList.map((site) =>
    (site.usingTime / 60).toFixed(1)
  );
  const programUsingTimes = visitedProgramList.map((program) =>
    (program.usingTime / 60).toFixed(1)
  );

  const colors = ["#FF6384", "#FFCE56", "#03C777", "#36A2EB", "#9966FF"];

  const data = {
    labels: ["사이트", "프로그램"],
    datasets: [
      ...visitedSiteList.map((site, idx) => ({
        label: `${site.name} 사용 시간`,
        data: [siteUsingTimes[idx], 0], // 사이트는 첫 번째 막대에 표시
        backgroundColor: colors[idx], // 최대 5개까지 자료를 가져옴
        stack: "Stack 0",
      })),
      ...visitedProgramList.map((program, idx) => ({
        label: `${program.name} 사용 시간`,
        data: [0, programUsingTimes[idx]], // 프로그램은 두 번째 막대에 표시
        backgroundColor: colors[idx],
        stack: "Stack 1",
      })),
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: false,
        // text: "가장 많이 사용한 사이트 및 프로그램",
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return `${context.dataset.label}: ${context.raw}분`;
          },
        },
      },
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
        title: {
          display: true,
          text: "사용 시간 (분)",
        },
      },
    },
  };

  return <Bar data={data} options={options} height={250} />;
};

StackedBarChart.propTypes = {
  visitedSiteList: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      usingTime: PropTypes.number.isRequired,
    })
  ).isRequired,
  visitedProgramList: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      usingTime: PropTypes.number.isRequired,
    })
  ).isRequired,
};

export default StackedBarChart;
