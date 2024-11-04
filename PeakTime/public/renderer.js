document.addEventListener("hikingStart", () => {
  console.log("스타트 커스텀 이벤트 발생했고 잘 받아옴 이제 소켓어쩌구 할거임");
  window.electronAPI.sendWebSocketMessage(
    JSON.stringify({
      action: "start",
      websiteList: ["www.naver.com", "www.youtube.com"],
      role: "root",
      presetId: 1,
      hikingId: 1,
    })
  );
});

document.getElementById("end").onclick = () => {
  window.electronAPI.sendWebSocketMessage(JSON.stringify({ action: "end" }));
};

// WebSocket 메시지를 수신하고 id 요소 업데이트
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
  try {
    const parsedMessage = JSON.parse(decodedMessage);

    // 전체 객체를 문자열로 변환하여 URL 필드에 표시
    const url = document.getElementById("url");
    url.value = JSON.stringify(parsedMessage, null, 2); // 들여쓰기로 보기 쉽게 표시
  } catch (error) {
    console.error("Error parsing JSON:", error);
  }
});
