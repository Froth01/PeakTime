// 컴포넌트 임포트
import ChildList from "../components/Child/ChildList";
import AddChild from "../components/Child/AddChild";
import UpdateChild from "../components/Child/UpdateChild";
import AddGroup from "../components/Child/AddGroup";
import UpdateGroup from "../components/Child/UpdateGroup";
import { useState, useEffect } from "react";
import groupsApi from "../api/groupsApi";

function ChildPage() {
  // 현재 창 변수
  const [showNow, setShowNow] = useState(null);
  // 손볼 그룹이나 계정 id
  const [updateId, setUpdateId] = useState(null);
  // 보여주는 창이 변할 때
  const onChangeContent = (content, id = null) => {
    setShowNow(content);
    if (id) {
      setUpdateId(id);
    }
    console.log(showNow);
  };

  // 그룹 리스트 > 차일드 리스트
  const [groupList, setGroupList] = useState([]);

  const onChangeGroupList = (group) => {
    setGroupList(group);
  };

  // 페이지 진입 시 그룹 전체 조회 API 호출
  useEffect(() => {
    groupsApi
      .get("")
      .then((result) => setGroupList(result.data.data.groupList))
      .catch((err) => console.log(err));
  }, []);

  return (
    <>
      <ChildList onChangeContent={onChangeContent} groupList={groupList} />
      {showNow === "addChild" && (
        <AddChild
          onChangeContent={onChangeContent}
          onChangeGroupList={onChangeGroupList}
          groupList={groupList}
        />
      )}
      {showNow === "updateChild" && (
        <UpdateChild childId={updateId} onChangeContent={onChangeContent} />
      )}
      {showNow === "addGroup" && (
        <AddGroup
          onChangeContent={onChangeContent}
          onChangeGroupList={onChangeGroupList}
        />
      )}
      {showNow === "updateGroup" && (
        <UpdateGroup
          groupId={updateId}
          onChangeContent={onChangeContent}
          onChangeGroupList={onChangeGroupList}
        />
      )}
    </>
  );
}

export default ChildPage;
