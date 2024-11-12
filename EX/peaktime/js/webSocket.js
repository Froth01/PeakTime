import { startTracking, stopAndClearTracking } from "./tracking.js";

let socket;
const WEBSOCKET_URL = "ws://localhost:12345";
// const RECONNECT_INTERVAL_MINUTES = 1;
let reconnectAttempts = 0;
let socketConnected = false;

function connectWebSocket() {
  socket = new WebSocket(WEBSOCKET_URL);

  // WebSocket 연결 열림 이벤트
  socket.onopen = () => {
    console.log("WebSocket connected");
    reconnectAttempts = 0;
    console.log(reconnectAttempts);
  };

  // WebSocket 메시지 수신 이벤트
  socket.onmessage = (event) => {
    console.log("Message from server:", event.data);
    receivedSocketMessage(JSON.parse(event.data));
  };

  // WebSocket 오류 이벤트
  socket.onerror = (error) => {
    console.error("WebSocket error:", error);
    socket.close();
  };

  // WebSocket 연결 종료 이벤트
  socket.onclose = () => {
    console.log("WebSocket connection closed");
    socketConnected = false;
    retryConnect(); // 연결 종료 시 재연결 시도
  };
}

// WebSocket 재연결 시도 함수
function retryConnect() {
  reconnectAttempts += 1;
  const delay = Math.min(Math.pow(2, reconnectAttempts) * 1000, 4000); // 최대 지연 시간 30초

  console.log(`Reconnecting in ${delay / 1000} seconds...`);
  setTimeout(connectWebSocket, delay);
}

function receivedSocketMessage(data) {
  if (data.action === "start") {
    socketConnected = true;

    console.log("website", data.websiteList);

    //하이킹 시작시 웹사이트 리스트와 프리셋 아이디 저장하기
    chrome.storage.local.set({ websiteList: data.websiteList });
    chrome.storage.local.set({ presetId: data.presetId });
    chrome.storage.local.set({ hikingId: data.hikingId });
    chrome.storage.local.set({ role: data.role });

    startTracking();
  }
  if (data.action === "end") {
    console.log("end");
    socketConnected = false;

    stopAndClearTracking();
  }
}

//소켓으로 json 보내기
function sendSocketMessage(data) {
  console.log(data);
  socket.send(JSON.stringify(data));
}

// 초기 WebSocket 연결 설정
connectWebSocket();

function getConnectStatus() {
  return socketConnected;
}

export { receivedSocketMessage, getConnectStatus, sendSocketMessage };
