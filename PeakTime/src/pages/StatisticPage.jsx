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
  const [statisticsData, setStatisticsData] = useState({});

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

    hikingsApi
      .get(url, { params })
      .then((res) => setStatisticsData(res.data.data))
      .catch();
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
    <>
      <div>StatisticPage</div>
      {/* <button onClick={goBack}>돌아가기</button> */}

      {/* title */}
      <h2>통계: {getNickname(selectedUserId)}</h2>

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

      {/* 통계 */}
      <StatisticsReport />
    </>
  );
}

export default StatisticPage;
