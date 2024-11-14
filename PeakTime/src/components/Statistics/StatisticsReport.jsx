import PropTypes from "prop-types";
import CircleChart from "./Chart/CircleChart";
import HorizontalBarChart from "./Chart/HorizontalBarChart";
import { useStatisticsStore } from "../../stores/StatisticsStore";

const DataFormat = ({ title, data, unit, data2 = null, unit2 = null }) => {
  return (
    <div className="my-3 w-[100%]">
      <h2 className="text-[30px]">{title}</h2>
      <div className="flex justify-end items-end">
        <div className="text-[40px] font-bold mr-2">{data}</div>
        <div className="text-[30px]">{unit}</div>

        {data2 !== null && unit2 && (
          <>
            <div className="text-[30px] mx-2">/</div>
            <div className="text-[40px] font-bold mr-2">{data2}</div>
            <div className="text-[30px]">{unit2}</div>
          </>
        )}
      </div>
    </div>
  );
};

const StatisticsReport = () => {
  const { showStatistics } = useStatisticsStore();

  const rateToSuccess = showStatistics.totalHikingCount
    ? (
        100 *
        (showStatistics.totalSuccessCount / showStatistics.totalHikingCount)
      ).toFixed(1)
    : 0;
  const avgHikingTime = showStatistics.totalHikingCount
    ? (
        showStatistics.totalHikingTime / showStatistics.totalHikingCount
      ).toFixed(1)
    : 0;
  const avgBlockedByHiking = showStatistics.totalHikingCount
    ? (
        showStatistics.totalBlockedCount / showStatistics.totalHikingCount
      ).toFixed(1)
    : 0;
  const avgBlockedByHour = showStatistics.totalHikingTime
    ? (
        showStatistics.totalBlockedCount /
        (showStatistics.totalHikingTime / 60)
      ).toFixed(1)
    : 0;

  return (
    <div className="flex w-[100%] h-[100%]">
      <div className="flex w-[40%] h-[100%] pr-4 border-r">
        <div className="flex grid grid-cols-2 w-full">
          <DataFormat
            title={"총 하이킹 시간"}
            data={showStatistics.totalHikingTime}
            unit={"분"}
          />
          <DataFormat
            title={"총 하이킹 횟수"}
            data={showStatistics.totalHikingCount}
            unit={"회"}
          />
          <DataFormat
            title={"성공 횟수 / 성공률"}
            data={showStatistics.totalSuccessCount}
            unit={"회"}
            data2={rateToSuccess}
            unit2={"%"}
          />
          <DataFormat
            title={"하이킹 평균 시간"}
            data={avgHikingTime}
            unit={"분"}
          />
          <DataFormat
            title={"하이킹 평균 넘어짐"}
            data={avgBlockedByHiking}
            unit={"회"}
          />
          <DataFormat
            title={"단위 시간당 넘어짐"}
            data={avgBlockedByHour}
            unit={"회"}
          />
          <DataFormat
            title={"가장 많이 접속한 사이트"}
            data={
              showStatistics.mostSiteList.length > 0
                ? showStatistics.mostSiteList[0].name
                : "-"
            }
            unit={""}
          />
          <DataFormat
            title={"가장 많이 사용한 프로그램"}
            data={
              showStatistics.mostProgramList.length > 0
                ? showStatistics.mostProgramList[0].name
                : "-"
            }
            unit={""}
          />
        </div>
      </div>

      {/* 차트 */}
      <div className="flex w-[60%]">
        <div className="w-[48%] flex flex-col justify-center items-center">
          <div className="font-bold text-[30px] mb-[3vh]">시작 시간 분석</div>
          <CircleChart startTimeList={showStatistics.startTimeList} />
        </div>
        <div className="flex flex-col w-[52%] justify-around items-center pl-4 border-l">
          <div className="font-bold text-[30px] text-left">접속 통계 차트</div>
          <div className="flex flex-col items-center w-full">
            <div className="font-bold text-[30px]">사이트</div>
            <HorizontalBarChart
              listArray={showStatistics.mostSiteList}
              ylabel={"사이트"}
            />
          </div>
          <div className="flex flex-col items-center w-full">
            <div className="font-bold text-[30px]">프로그램</div>

            <HorizontalBarChart
              listArray={showStatistics.mostProgramList}
              ylabel={"프로그램"}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

DataFormat.propTypes = {
  title: PropTypes.string.isRequired,
  data: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  unit: PropTypes.string,
  data2: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  unit2: PropTypes.string,
};

export default StatisticsReport;
