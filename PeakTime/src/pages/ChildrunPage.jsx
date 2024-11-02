// 컴포넌트 임포트
import ChildList from "../components/Child/ChildList";
import AddChild from "../components/Child/AddChild";
import UpdateChild from "../components/Child/UpdateChild";
import AddGroup from "../components/Child/AddGroup";
import UpdateGroup from "../components/Child/UpdateGroup";
import { useState } from "react";

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

  return (
    <>
      <ChildList onChangeContent={onChangeContent} />
      {showNow === "addChild" && <AddChild onChangeContent={onChangeContent} />}
      {showNow === "updateChild" && (
        <UpdateChild childId={updateId} onChangeContent={onChangeContent} />
      )}
      {showNow === "addGroup" && <AddGroup onChangeContent={onChangeContent} />}
      {showNow === "updateGroup" && (
        <UpdateGroup groupId={updateId} onChangeContent={onChangeContent} />
      )}
    </>
  );
}

export default ChildPage;
