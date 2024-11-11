import PropTypes from "prop-types";

function ChildList({ onChangeContent, groupList }) {
  const handleChangeContent = (content, id) => {
    onChangeContent(content, id);
  };

  // 창 변경
  const handleAddGroup = () => {
    handleChangeContent("addGroup", null);
  };

  const handleAddChild = () => {
    handleChangeContent("addChild", null);
  };

  return (
    <div
      className="absolute left-[10vw] w-[21vw] h-[100vh] flex flex-col justify-start items-start p-5"
      style={{ backgroundColor: "#66AADF" }}
    >
      <h2 className="self-start mb-3 text-white font-bold">그룹 목록</h2>
      <div className="flex flex-col bg-white w-[18vw] h-[70vh] overflow-y-auto rounded-lg">
        {groupList.map((group, index) => (
          <div key={index} className="flex flex-col">
            <button
              onClick={() => handleChangeContent("updateGroup", group.groupId)}
              className="text-left font-bold ml-2"
            >
              {group.groupTitle}
            </button>
            {group.childList.map((child, childIndex) => (
              <div key={childIndex} className="flex items-center ml-4">
                <button
                  onClick={() =>
                    handleChangeContent("updateChild", child.userId)
                  }
                  className="text-left"
                >
                  └ {child.nickname}
                </button>
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="self-start mt-3">
        {groupList.length < 5 ? (
          <>
            <button onClick={handleAddGroup} className="text-white font-bold">
              +그룹 추가
            </button>
            <span className="px-4" />
          </>
        ) : null}
        <button onClick={handleAddChild} className="text-white font-bold">
          +계정 추가
        </button>
      </div>
    </div>
  );
}

// props validation 추가
ChildList.propTypes = {
  onChangeContent: PropTypes.func.isRequired,
  groupList: PropTypes.arrayOf(
    PropTypes.shape({
      groupId: PropTypes.number.isRequired,
      groupTitle: PropTypes.string.isRequired,
      childList: PropTypes.arrayOf(
        PropTypes.shape({
          userId: PropTypes.number.isRequired,
          userLoginId: PropTypes.string.isRequired,
          nickname: PropTypes.string.isRequired,
        })
      ).isRequired,
    })
  ).isRequired,
};

export default ChildList;
