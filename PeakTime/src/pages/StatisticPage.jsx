// import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import hikingsApi from "../api/hikingsApi";
import groupsApi from "../api/groupsApi";
import StatisticsReport from "../components/Statistics/StatisticsReport";

function StatisticPage() {
  // // 라우팅 설정
  // const navigate = useNavigate();

  // // 뒤로가기
  // const goBack = () => {
  //   navigate(-1);
  // };

  // root인지 sub인지 파악
  const user = JSON.parse(localStorage.getItem("user"));

  // 선택한 user의 userId
  // 디폴트 값은 자기 자신의 userId
  const [selectedUserId, setSelectedUserId] = useState("");

  // groupList에서 선택한 group 정보
  const [selectedGroupId, setSelectedGroupId] = useState("");

  // group 정보
  const [groupList, setGroupList] = useState([]);

  // API 요청을 통해 받은 통계 데이터
  const [statisticsData, setStatisticsData] = useState({
    nickname: "test",
    totalHikingTime: 1520,
    totalHikingCount: 65,
    totalSuccessCount: 2,
    totalBlockedCount: 13,
    startTimeList: [
      "09:30", "09:26", "09:28", "09:39", "09:38", "09:29", "09:36", "09:31", "09:37", "09:21",
      "09:31", "09:39", "09:26", "09:39", "09:24", "09:22", "09:30", "09:33", "09:24", "09:23",
      "09:25", "09:33", "09:26", "09:40", "09:31", "09:29", "09:24", "09:20", "09:21", "09:38",
      "09:35", "09:24", "09:26", "09:35", "09:32", "14:05", "14:05", "14:06", "14:00", "14:01",
      "14:15", "14:19", "14:20", "14:04", "14:15", "14:11", "14:01", "14:13", "14:17", "14:01",
      "14:05", "14:06", "14:02", "14:15", "14:13", "14:09", "14:20", "14:10", "14:14", "14:14",
      "14:00", "14:07", "14:01", "14:05", "14:11", "14:08", "14:11", "14:16", "14:18", "14:14",
      "09:05", "01:18", "10:14", "11:20", "05:35", "16:50", "05:57", "04:49", "23:21", "12:05",
      "08:18", "20:03", "23:25", "16:26", "13:42", "02:11", "08:00", "06:32", "06:39", "18:43",
      "13:49", "04:24", "23:04", "07:31", "10:27", "19:38", "12:03", "16:51", "10:10", "09:47"
    ],
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
  });

  const handleChangeGroupId = (e) => {
    const value = e.target.value ? parseInt(e.target.value, 10) : "";
    setSelectedGroupId(value);
  };

  const handleChangeSubUserId = (e) => {
    const value = e.target.value ? parseInt(e.target.value, 10) : "";
    setSelectedUserId(value);
  };

  // 통계 조회 API
  const getStatisticsAPI = (userId = null) => {
    const url = `/statistics`;
    const params = userId ? { userId } : {};

    // hikingsApi
    //   .get(url, { params })
    //   .then((res) => setStatisticsData(res.data.data))
    //   .catch();
  };

  const getNickname = (userId = null) => {
    return userId
      ? groupList
          .find((group) => group.groupId === selectedGroupId)
          .find((subUser) => subUser.userId === userId).nickname
      : user.nickname;
  };

  useEffect(() => {
    // 그룹 조회
    if (user.isRoot) {
      groupsApi
        .get("")
        .then((result) => setGroupList(result.data.data.groupList))
        .catch();
    }

    // 내 통계 조회
    getStatisticsAPI();
  }, []);

  return (
    <div className="absolute left-[10vw] flex flex-col items-center w-full h-full">
      <div className="text-xl">StatisticPage</div>
      {/* <button onClick={goBack}>돌아가기</button> */}

      <div className="flex justify-between px-5">
        {/* title */}
        <div className="text-xl">통계: {getNickname(selectedUserId)}</div>

        {/* group, subuser 선택 부분, root user만 사용 가능 */}
        {user.isRoot && (
          <div>
            <select
              id="groupId"
              name="groupId"
              value={selectedGroupId ?? ""}
              onChange={handleChangeGroupId}
            >
              <option value="">{user.nickname}</option>
              <option disabled>========</option>
              {groupList?.map((group) => (
                <option key={group.groupId} value={group.groupId}>
                  {group.groupTitle}
                </option>
              ))}
            </select>

            <select
              id="subUserId"
              name="subUserId"
              value={selectedUserId ?? ""}
              onChange={handleChangeSubUserId}
              disabled={!selectedGroupId}
            >
              {!selectedGroupId ? (
                <option disabled value="">
                  ========
                </option>
              ) : (
                (
                  groupList.find((group) => group.groupId === selectedGroupId)
                    ?.childList || []
                ).map((user) => (
                  <option key={user.userId} value={user.userId}>
                    {user.nickname}
                  </option>
                ))
              )}
            </select>
          </div>
        )}
      </div>

      {/* 통계 */}
      {statisticsData && <StatisticsReport data={statisticsData} />}
    </div>
  );
}

export default StatisticPage;
