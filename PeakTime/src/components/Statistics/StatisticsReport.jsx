import PropTypes from "prop-types";
import CircleChart from "./Chart/CircleChart";
import HorizontalBarChart from "./Chart/HorizontalBarChart";

const DataFormat = ({ title, data, unit, data2 = null, unit2 = null }) => {
  return (
    <div className="my-3 w-[100%]">
      <h2 className="text-[30px]">{title}</h2>
      <div className="flex justify-end items-end">
        <div className="text-[40px] font-bold mr-2">{data}</div>
        <div className="text-[30px]">{unit}</div>

        {data2 && unit2 && (
          <>
            <div className="text-[30px] mx-1">/</div>
            <div className="text-[40px] font-bold">{data2}</div>
            <div className="text-[30px]">{unit2}</div>
          </>
        )}
      </div>
    </div>
  );
};

const StatisticsReport = ({ data }) => {
  const rateToSuccess = (
    100 *
    (data.totalSuccessCount / data.totalHikingCount)
  ).toFixed(1);
  const avgHikingTime = (data.totalHikingTime / data.totalHikingCount).toFixed(
    1
  );
  const avgBlockedByHiking = (
    data.totalBlockedCount / data.totalHikingCount
  ).toFixed(1);
  const avgBlockedByHour = (
    data.totalBlockedCount /
    (data.totalHikingTime / 60)
  ).toFixed(1);

  return (
    <div className="flex w-[100%] h-[100%]">
      <div className="flex w-[40%] h-[100%] pr-4 border-r">
        <div className="flex grid grid-cols-2 w-full">
          <DataFormat
            title={"총 하이킹 시간"}
            data={data.totalHikingTime}
            unit={"분"}
          />
          <DataFormat
            title={"총 하이킹 횟수"}
            data={data.totalHikingCount}
            unit={"회"}
          />
          <DataFormat
            title={"성공 횟수 / 성공률"}
            data={data.totalSuccessCount}
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
            data={data.mostSiteList.length > 0 ? data.mostSiteList[0].name : ""}
            unit={""}
          />
          <DataFormat
            title={"가장 많이 사용한 프로그램"}
            data={
              data.mostProgramList.length > 0
                ? data.mostProgramList[0].name
                : ""
            }
            unit={""}
          />
        </div>
      </div>

      {/* 차트 */}
      <div className="flex w-[60%]">
        <div className="w-[48%] flex flex-col justify-center items-center">
          <div className="font-bold text-[30px] mb-[3vh]">시작 시간 분석</div>
          <CircleChart startTimeList={data.startTimeList} />
        </div>
        <div className="flex flex-col w-[52%] justify-around items-center pl-4 border-l">
          <div className="font-bold text-[30px] text-left">접속 통계 차트</div>
          <div className="flex flex-col items-center w-full">
            <div className="font-bold text-[30px] ">사이트</div>
            <HorizontalBarChart
              listArray={data.mostSiteList}
              ylabel={"사이트"}
            />
          </div>
          <div className="flex flex-col items-center w-full">
            <div className="font-bold text-[30px] ">프로그램</div>

            <HorizontalBarChart
              listArray={data.mostProgramList}
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

StatisticsReport.propTypes = {
  data: PropTypes.shape({
    nickname: PropTypes.string.isRequired,
    totalHikingTime: PropTypes.number.isRequired,
    totalHikingCount: PropTypes.number.isRequired,
    totalSuccessCount: PropTypes.number.isRequired,
    totalBlockedCount: PropTypes.number.isRequired,
    startTimeList: PropTypes.arrayOf(PropTypes.string).isRequired,
    mostSiteList: PropTypes.arrayOf(
      PropTypes.shape({
        usingTime: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
      })
    ).isRequired, // 객체 배열
    mostProgramList: PropTypes.arrayOf(
      PropTypes.shape({
        usingTime: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
      })
    ).isRequired, // 객체 배열
  }).isRequired,
};

export default StatisticsReport;
