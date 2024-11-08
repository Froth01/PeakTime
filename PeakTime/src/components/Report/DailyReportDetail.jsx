import PropTypes from "prop-types";
import StackedBarChart from "./Chart/StackedBarChart";
import { useEffect, useState } from "react";

function DailyReportDetail({ hikingDetail }) {
  console.log(hikingDetail.visitedProgramList[0].name);

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

  const successToHiking =
    Math.abs(diffInMinutes(hikingDetail.endTime, hikingDetail.realEndTime)) < 1; // 성공, 실패 여부

  return (
    <div className="flex flex-col border w-full h-full p-4 overflow-auto">
      <div className="flex">
        <div className="flex flex-col">
          {/* 하이킹 시간, 넘어진 횟수, 성공 여부 */}
          <div className="flex">
            {/* 하이킹 시간 */}
            <h3 className="flex flex-col">하이킹 시간</h3>
            <div>
              {/* "OO / OO 분" */}
              {`${minutesExpression(
                hikingDetail.startTime,
                hikingDetail.endTime,
                hikingDetail.realEndTime
              )}`}
            </div>
          </div>
          <div className="flex">
            {/* 넘어진 횟수 */}
            <div className="flex flex-col">넘어진 횟수</div>
            <div>{`${
              hikingDetail.blockedSiteCount + hikingDetail.blockedProgramCount
            } 회`}</div>
          </div>
          {/* 성공 여부 */}
          <div
            className="text-white"
            style={{ backgroundColor: successToHiking ? "#03C777" : "#F40000" }}
          >
            {successToHiking ? "성공" : "실패"}
          </div>
          {/* 가장 많이 들른 사이트, 가장 많이 사용한 프로그램 */}
          <div>
            <h3>가장 많이 들른 사이트</h3>
            <div>{visitedSiteList?.[0]?.name || ""}</div>
          </div>
          <div>
            <h3>가장 많이 사용한 프로그램</h3>
            <div>{visitedProgramList?.[0]?.name || ""}</div>
          </div>
        </div>

        <div>
          {/* 그래프 */}
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
