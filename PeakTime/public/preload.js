const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  getBackUrl: () => ipcRenderer.invoke("getBackUrl"),
  sendWebSocketMessage: (message) =>
    ipcRenderer.send("websocket-message", message),
  onWebSocketMessage: (callback) =>
    ipcRenderer.on("websocket-message", (event, message) => callback(message)),
  //토큰 전달
  sendAccessToken: (token) => ipcRenderer.send("sendAccessToken", token),
  // 하이킹 종료시 정보 주고받기
  sendHikingInfo: (data) => {
    console.log("sendHikingInfo :", data);
    ipcRenderer.send("hikingInfo", data);
  },
  // 프로그램 차단 시작
  startBlockProgram: (data) => {
    ipcRenderer.send("start-block-program", data);
  },
<<<<<<< Updated upstream
  // 프로그램 차단 종료
  endBlockProgram: (data) => {
    ipcRenderer.send("end-block-program", data);
  },
  // 하이킹종료 프로세스 모두 완료시
  onAllDone: (callback) => {
    ipcRenderer.on("all-done", (event, data) => callback(data));
  },
=======

  endBlockProgram: () => {
    ipcRenderer.send("end-block-program");
  },

  onBlockHistory: (callback) => {
    ipcRenderer.on("blockHistoryResponse", (event, data) => {
      console.log("차단 히스토리 조회");
      callback(data);
    });
  },
  sendSaveMemo: (data) => {
    console.log("sendSaveMemo", data);
    ipcRenderer.send("save-memo", data);
  },
  onSaveMemo: (callback) => {
    ipcRenderer.on("save-memo-response", (data) => {
      console.log("onsavememo 콜백 전");
      console.log(data);
      callback(data);
    });
  },
>>>>>>> Stashed changes
});
