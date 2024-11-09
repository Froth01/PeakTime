const DataFormat = (title, data, unit, data2 = null, unit2 = null) => {
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

const StatisticsReport = () => {
  //////////////////////////////////////
  // dummy data
  const data = {
    nickname: "test",
    totalHikingTime: 1520,
    totalHikingCount: 65,
    totalSuccessCount: 2,
    totalBlockedCount: 13,
    preferTimeZone: 10,
    mostSiteList: [
      {
        usingTime: 6760,
        name: "더미",
      },
      {
        usingTime: 40,
        name: "string",
      },
    ],
    mostProgramList: [
      {
        usingTime: 52,
        name: "chrome.exe",
      },
      {
        usingTime: 40,
        name: "string",
      },
      {
        usingTime: 14,
        name: "electron.exe",
      },
      {
        usingTime: 0,
        name: "Figma.exe",
      },
    ],
  };
  //////////////////////////////////////

  const {
    nickname,
    totalHikingTime,
    totalHikingCount,
    totalSuccessCount,
    totalBlockedCount,
    preferTimeZone,
    mostSiteList,
    mostProgramList,
  } = data;

  const rateToSuccess = (100 * (totalSuccessCount / totalHikingCount)).toFixed(
    1
  );
  const avgHikingTime = (totalHikingTime / totalHikingCount).toFixed(1);
  const avgBlockedByHiking = (totalBlockedCount / totalHikingCount).toFixed(1);
  const avgBlockedByHour = (totalBlockedCount / (totalHikingTime / 60)).toFixed(
    1
  );

  return (
    <div className="flex">
      <div>
        <div className="flex">
          <DataFormat
            title={"총 하이킹 시간"}
            data={totalHikingTime}
            unit={"분"}
          />
          <DataFormat
            title={"총 하이킹 횟수"}
            data={totalHikingCount}
            unit={"회"}
          />
          <DataFormat
            title={"성공 횟수 / 성공률"}
            data={totalSuccessCount}
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

        <div className="flex flex-col">
          <DataFormat
            title={"가장 많이 접속한 사이트"}
            data={mostSiteList.length > 0 ? mostSiteList[0].site : ""}
            unit={""}
          />
          <DataFormat
            title={"가장 많이 사용한 프로그램"}
            data={mostProgramList.length > 0 ? mostProgramList[0].program : ""}
            unit={""}
          />
        </div>
      </div>

      {/* 차트 */}
    </div>
  );
};

export default StatisticsReport;
