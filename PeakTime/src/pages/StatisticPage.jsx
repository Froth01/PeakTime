// import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Title from "../components/common/Title";
import hikingsApi from "../api/hikingsApi";
import groupsApi from "../api/groupsApi";
import StatisticsReport from "../components/Statistics/StatisticsReport";
import { HiOutlinePresentationChartLine } from "react-icons/hi2";

function StatisticPage() {
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
      "09:30",
      "09:26",
      "09:28",
      "09:39",
      "09:38",
      "09:29",
      "09:36",
      "09:31",
      "09:37",
      "09:21",
      "09:31",
      "09:39",
      "09:26",
      "09:39",
      "09:24",
      "09:22",
      "09:30",
      "09:33",
      "09:24",
      "09:23",
      "09:25",
      "09:33",
      "09:26",
      "09:40",
      "09:31",
      "09:29",
      "09:24",
      "09:20",
      "09:21",
      "09:38",
      "09:35",
      "09:24",
      "09:26",
      "09:35",
      "09:32",
      "14:05",
      "14:05",
      "14:06",
      "14:00",
      "14:01",
      "14:15",
      "14:19",
      "14:20",
      "14:04",
      "14:15",
      "14:11",
      "14:01",
      "14:13",
      "14:17",
      "14:01",
      "14:05",
      "14:06",
      "14:02",
      "14:15",
      "14:13",
      "14:09",
      "14:20",
      "14:10",
      "14:14",
      "14:14",
      "14:00",
      "14:07",
      "14:01",
      "14:05",
      "14:11",
      "14:08",
      "14:11",
      "14:16",
      "14:18",
      "14:14",
      "09:05",
      "01:18",
      "10:14",
      "11:20",
      "05:35",
      "16:50",
      "05:57",
      "04:49",
      "23:21",
      "12:05",
      "08:18",
      "20:03",
      "23:25",
      "16:26",
      "13:42",
      "02:11",
      "08:00",
      "06:32",
      "06:39",
      "18:43",
      "13:49",
      "04:24",
      "23:04",
      "07:31",
      "10:27",
      "19:38",
      "12:03",
      "16:51",
      "10:10",
      "09:47",
    ],
    mostSiteList: [
      {
        usingTime: 296,
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
        .then((result) => {
          setGroupList(result.data.data.groupList);
        })
        .catch();
    }

    // 내 통계 조회
    getStatisticsAPI();
  }, []);

  return (
    <div className="h-[100vh] flex flex-col">
      <div className="left-[11vw] flex flex-col w-full h-full">
        <Title title={"통계"} />
        {/* <button onClick={goBack}>돌아가기</button> */}

        <div className="absolute bg-[#333333] bg-opacity-70 left-[11vw] top-[10vh] w-[86vw] h-[84vh] my-[3vh] rounded-lg flex flex-col p-5 text-white">
          {/* header 부분 */}
          <div className="grid grid-cols-3 items-center pb-3 mb-3 border-b">
            {/* 왼쪽 아이콘 */}
            <div className="text-[60px] font-bold flex justify-start">
              <HiOutlinePresentationChartLine />
            </div>

            {/* 가운데 제목 */}
            <div className="text-center text-[40px] font-bold">
              {getNickname(selectedUserId)} 의 통계
            </div>

            {/* 오른쪽 드롭다운 (root 사용자일 때만 표시) */}
            {user.isRoot && (
              <div className="flex justify-end space-x-3">
                <select
                  id="groupId"
                  name="groupId"
                  value={selectedGroupId ?? ""}
                  onChange={handleChangeGroupId}
                  className="w-[250px] p-2 bg-gray-800 text-white rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-[#03C777]"
                >
                  <option value="">{user?.nickname}</option>
                  <option disabled>==== 그룹 ====</option>
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
                  className="w-[250px] p-2 bg-gray-800 text-white rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-[#03C777]"
                  disabled={!selectedGroupId}
                >
                  {selectedGroupId ? (
                    groupList.find((group) => group.groupId === selectedGroupId)
                      ?.childList?.length > 0 ? (
                      <>
                        <option value="" disabled>
                          유저를 선택해주세요.
                        </option>

                        {groupList
                          .find((group) => group.groupId === selectedGroupId)
                          ?.childList.map((user) => (
                            <option key={user.userId} value={user.userId}>
                              {user.nickname}
                            </option>
                          ))}
                      </>
                    ) : (
                      <option disabled value="">
                        등록된 유저가 없습니다.
                      </option>
                    )
                  ) : (
                    <option disabled value="">
                      그룹을 선택해주세요.
                    </option>
                  )}
                </select>
              </div>
            )}
          </div>

          {/* 통계 */}
          {statisticsData && <StatisticsReport data={statisticsData} />}
        </div>
      </div>
    </div>
  );
}

export default StatisticPage;
