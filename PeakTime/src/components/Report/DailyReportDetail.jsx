import PropTypes from "prop-types";
import StackedBarChart from "./Chart/StackedBarChart";
import { useEffect, useState } from "react";

function DailyReportDetail({ hikingDetail }) {
  const [visitedSiteList, setVisitedSiteList] = useState([]);
  const [visitedProgramList, setVisitedProgramList] = useState([]);

  useEffect(() => {
    setVisitedSiteList(hikingDetail.visitedSiteList);
    setVisitedProgramList(hikingDetail.visitedProgramList);
  }, [hikingDetail]);

  // endtime - starttime 분 단위 계산
  const diffInMinutes = (startTime, endTime) => {
    return Math.round((new Date(endTime) - new Date(startTime)) / (1000 * 60));
  };

  const minutesExpression = (startTime, endTime, realEndTime) => {
    return `${diffInMinutes(startTime, realEndTime)} / ${diffInMinutes(
      startTime,
      endTime
    )}`;
  };

  // 성공, 실패 여부
  const successToHiking =
    Math.abs(
      diffInMinutes(hikingDetail.endTime, hikingDetail.realEndTime) < 1
    ) || hikingDetail.realEndTime > hikingDetail.endTime;

  return (
    <div className="flex flex-col items-center border w-full h-full p-4 overflow-auto">
      <div className="flex">
        <div className="flex flex-col">
          {/* 하이킹 시간, 넘어진 횟수, 성공 여부 */}
          <div className="flex mb-5">
            <div className="flex flex-col mr-5">
              {/* 하이킹 시간 */}
              <h3 className="flex flex-col text-xl font-bold">하이킹 시간</h3>
              <div>
                {/* "OO / OO 분" */}
                {`${minutesExpression(
                  hikingDetail.startTime,
                  hikingDetail.endTime,
                  hikingDetail.realEndTime
                )} 분`}
              </div>
            </div>
            <div className="flex flex-col mr-5">
              {/* 넘어진 횟수 */}
              <div className="flex flex-col text-xl font-bold">넘어진 횟수</div>
              <div>{`${
                hikingDetail.blockedSiteCount + hikingDetail.blockedProgramCount
              } 회`}</div>
            </div>
            {/* 성공 여부 */}
            <div
              className="text-white rounded-full flex items-center justify-center"
              style={{
                backgroundColor: successToHiking ? "#03C777" : "#F40000",
              }}
            >
              {successToHiking ? "성공" : "실패"}
            </div>
          </div>

          {/* 가장 많이 들른 사이트, 가장 많이 사용한 프로그램 */}
          <div className="mb-5">
            <h3 className="flex flex-col text-xl font-bold">
              가장 많이 들른 사이트
            </h3>
            <div>{visitedSiteList?.[0]?.name || ""}</div>
          </div>
          <div>
            <h3 className="flex flex-col text-xl font-bold">
              가장 많이 사용한 프로그램
            </h3>
            <div>{visitedProgramList?.[0]?.name || ""}</div>
          </div>
        </div>

        <div className="mx-5">
          {/* 그래프 */}
          <h3 className="flex flex-col text-xl font-bold mb-5">
            가장 많이 사용한 사이트와 프로그램
          </h3>
          <StackedBarChart
            visitedSiteList={hikingDetail.visitedSiteList}
            visitedProgramList={hikingDetail.visitedProgramList}
          />
        </div>
      </div>
    </div>
  );
}

DailyReportDetail.propTypes = {
  hikingDetail: PropTypes.object.isRequired,
};

export default DailyReportDetail;
