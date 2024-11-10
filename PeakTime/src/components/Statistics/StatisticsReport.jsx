import PropTypes from "prop-types";
import CircleChart from "./Chart/CircleChart";
import HorizontalBarChart from "./Chart/HorizontalBarChart";

const DataFormat = ({ title, data, unit, data2 = null, unit2 = null }) => {
  return (
    <div>
      <h2 className="">{title}</h2>
      <div className="flex">
        <div className="text-xl font-bold">{data}</div>
        <div className="">{unit}</div>

        {data2 && unit2 && (
          <>
            <div className="text-xl font-bold"> / {data2}</div>
            <div className="">{unit2}</div>
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
    <div>
      <div className="flex">
        <div>
          <div className="flex">
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
          </div>

          <div className="flex">
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
          </div>

          <div className="flex flex-col text-left">
            <DataFormat
              title={"가장 많이 접속한 사이트"}
              data={
                data.mostSiteList.length > 0 ? data.mostSiteList[0].name : ""
              }
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
        <CircleChart startTimeList={data.startTimeList} />
      </div>

      {/* 차트 */}
      <div className="flex">
        <div>
          <div className="text-xl font-bold text-left">
            가장 많이 접속한 사이트
          </div>
          <HorizontalBarChart listArray={data.mostSiteList} />
        </div>
        <div>
          <div className="text-xl font-bold text-left">
            가장 많이 사용한 프로그램
          </div>
          <HorizontalBarChart listArray={data.mostProgramList} />
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
