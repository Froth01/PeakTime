const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  sendWebSocketMessage: (message) =>
    ipcRenderer.send("websocket-message", message),
  onWebSocketMessage: (callback) =>
    ipcRenderer.on("websocket-message", (event, message) => callback(message)),
  // 하이킹 종료시 정보 주고받기
  sendHikingInfo: (data) => {
    console.log("sendHikingInfo :", data);
    ipcRenderer.send("hikingInfo", data);
  },
  onHikingInfo: (callback) =>
    ipcRenderer.on("hikingInfoResponse", (event, data) => {
      console.log("onHikingInfo 발동 : ", data);
      callback(data);
    }),
});
