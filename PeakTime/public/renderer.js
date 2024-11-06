//하이킹 시작
document.addEventListener("hikingStart", () => {
  console.log("스타트 커스텀 이벤트 발생했고 잘 받아옴 이제 소켓어쩌구 할거임");
  window.electronAPI.sendWebSocketMessage(
    JSON.stringify({
      action: "start",
      websiteList: ["www.naver.com"],
      role: "root",
      presetId: 1,
      hikingId: 1,
    })
  );
});

//하이킹 종료
document.addEventListener("hikingEnd", () => {
  console.log("하이킹 끝");
  window.electronAPI.sendWebSocketMessage(
    JSON.stringify({
      action: "end",
    })
  );
});

let parsedMessage = null;
let isReceived = false;

// WebSocket 메시지를 수신하고 메시지 파싱만 담당
window.electronAPI.onWebSocketMessage((message) => {
  // 바이트 배열인지 확인하고 디코딩 처리
  let decodedMessage;

  if (message instanceof Uint8Array) {
    // Uint8Array를 문자열로 변환
    decodedMessage = new TextDecoder().decode(message);
  } else {
    // 이미 문자열 형태로 전달된 경우
    decodedMessage = message;
  }

  // JSON 파싱
  parsedMessage = JSON.parse(decodedMessage);
  isReceived = true;
});

// 상태를 구독하여 처리하는 함수
function checkMessageStatus() {
  if (isReceived) {
    // 메시지가 수신되었을 때 처리
    handleParsedMessage(parsedMessage);

    // 처리 후 상태 초기화
    isReceived = false; // 상태 초기화
  }
}

// 상태를 주기적으로 체크하는 타이머 (불필요하면 없애도 됩니다)
setInterval(checkMessageStatus, 100); // 100ms마다 상태 체크

// 메시지 처리 함수
function handleParsedMessage(parsedMessage) {
  console.log("메시지 처리 함수 실행 :", parsedMessage);
  if (parsedMessage.action === "end") {
    // sendHikingInfo 호출을 분리한 처리로 이동
    window.electronAPI.sendHikingInfo(parsedMessage);
  }
}
// 메모 쓰기
// try {
//   // 전체 객체를 문자열로 변환하여 URL 필드에 표시
//   const url = document.getElementById("url");
//   url.value = JSON.stringify(parsedMessage, null, 2); // 들여쓰기로 보기 쉽게 표시
// } catch (error) {
//   console.error("Error parsing JSON:", error);
// }
