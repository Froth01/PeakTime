import { app, BrowserWindow, ipcMain } from "electron";
import path from "path";
import url from "url";
import WebSocket, { WebSocketServer } from "ws";

const __dirname = path.resolve();

function createWindow() {
  // 일렉트론 크기
  const win = new BrowserWindow({
    width: 1366,
    height: 768,
    webPreferences: {
      preload: path.join(__dirname, "public", "preload.js"),
      contextIsolation: true,
      sandbox: true,
      enableRemoteModule: false,
    },
  });

  /*
   * ELECTRON_START_URL을 직접 제공할경우 해당 URL을 로드합니다.
   * 만일 URL을 따로 지정하지 않을경우 (프로덕션빌드) React 앱이
   * 빌드되는 build 폴더의 index.html 파일을 로드합니다.
   * */
  const startUrl =
    process.env.ELECTRON_START_URL ||
    url.format({
      pathname: path.join(__dirname, "/../build/index.html"),
      protocol: "file:",
      slashes: true,
    });

  /*
   * startUrl에 배정되는 url을 맨 위에서 생성한 BrowserWindow에서 실행시킵니다.
   * */
  win.loadURL(startUrl);
}

let wss;

ipcMain.on("websocket-message", (event, action) => {
  if (wss && wss.clients) {
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(action);
      }
    });
  }
});

app.whenReady().then(() => {
  createWindow();
  console.log(__dirname);
  // WebSocket 서버 생성
  const port = 12345;
  wss = new WebSocketServer({ port }, () => {
    console.log(`WebSocket server is running on port ${port}`);
  });

  // WebSocket 연결 처리
  wss.on("connection", (ws) => {
    console.log("New client connected");

    // 클라이언트로부터 메시지 수신
    ws.on("message", (message) => {
      console.log(`Received from client: ${message}`);
      BrowserWindow.getAllWindows().forEach((win) => {
        win.webContents.send("websocket-message", message);
      });
      // 클라이언트에게 응답 보내기
      ws.send(JSON.stringify({ website: "mashable.com" }));
    });

    // 클라이언트 연결 종료
    ws.on("close", () => {
      console.log("Client disconnected");
    });

    // 에러 처리
    ws.on("error", (err) => {
      console.error("WebSocket error:", err);
    });
  });

  wss.on("error", (err) => {
    console.error("WebSocket server error:", err);
  });
});
