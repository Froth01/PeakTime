import { sendSocketMessage } from "./webSocket.js";

let currentUrl = null;
let startTime = 0;
let isTracking = false;

// 시간 저장 및 Chrome Storage에 누적
async function recordTime(url) {
    if (!isTracking || !url) return;

    const endTime = Date.now();
    const timeSpent = endTime - startTime;

    const getUrlList = await chrome.storage.local.get(['urlList']);
    const savedData = getUrlList.urlList || {};

    // URL 누적 시간 저장
    savedData[url] = (savedData[url] || 0) + Math.floor(timeSpent / 1000);

    await chrome.storage.local.set({ urlList: savedData });
    console.log(`URL: ${url}, 누적 사용 시간: ${savedData[url]}초`);
}

// 추적 중지 및 URL 리스트 삭제 (stop + quit 기능)
async function stopAndClearTracking() {
    if (isTracking && currentUrl) {
        await recordTime(currentUrl);
        console.log(`Tracking stopped for ${currentUrl}`);
    } 
    chrome.storage.local.get(['hikingId', 'savedTexts', 'savedTitle', 'urlList'], (data) => {
        const hikingId = data.hikingId;
        const savedTexts = data.savedTexts || "";
        const savedTitle = data.savedTitle || "메모명";
        const urlList = data.urlList || {};
    
        console.log("Hiking ID:", hikingId);
        console.log("Saved Texts:", savedTexts);
        console.log("Saved Title:", savedTitle);
        console.log("URL 리스트:", urlList);
    
        sendSocketMessage({
            action: "end",
            urlList: urlList,
            hikingId: hikingId,
            content: savedTexts,
            title: savedTitle
        });
    
        // 상태 초기화
        isTracking = false;
        currentUrl = null;
    
        // 로컬 스토리지 전체 삭제
        chrome.storage.local.clear(() => {
            console.log("모든 로컬 스토리지 데이터가 삭제되었습니다.");
            removeListeners();
        });
    });
    
    
}

// 이벤트 리스너 제거 함수
function removeListeners() {
    chrome.tabs.onUpdated.removeListener(handleTabUpdate);
    chrome.tabs.onActivated.removeListener(handleTabActivation);
    console.log("이벤트 리스너가 제거되었습니다.");
}

// 추적 시작 (특정 이벤트 발생 시)
function startTracking() {
    if (isTracking) return;

    currentUrl = null;
    startTime = Date.now();
    isTracking = true;
    console.log(`Tracking started`);

    // 이벤트 리스너 추가
    chrome.tabs.onUpdated.addListener(handleTabUpdate);
    chrome.tabs.onActivated.addListener(handleTabActivation);
}

// URL이 변경될 때마다 호출
function handleUrlChange(newUrl) {
    const urlObject = new URL(newUrl);
    const hostname = urlObject.hostname; // 도메인만 (예: example.com)
    const currentPath = urlObject.pathname; // 경로만 (예: /path/to/page)
    const fullUrl = hostname + currentPath;

    if (currentUrl !== fullUrl) {
        if (currentUrl) {
            recordTime(currentUrl); // 이전 URL의 시간 기록
        }
        currentUrl = fullUrl; // 새로운 URL 설정
        startTime = Date.now(); // 시작 시간 초기화
        console.log(`Tracking URL 변경: ${fullUrl}`);
    }

    chrome.storage.local.get({ websiteList: [] }, function (data) {
        const websiteList = data.websiteList || [];
        const shouldBlock = websiteList.some((urlPattern) => fullUrl.startsWith(urlPattern));
        console.log("Should block:", shouldBlock);

        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs[0]) {
                chrome.tabs.sendMessage(tabs[0].id, { action: "checkContentScript" }, (response) => {
                    if (chrome.runtime.lastError || !response) {
                        chrome.scripting.executeScript({
                            target: { tabId: tabs[0].id },
                            files: ['/js/contentScript.js']
                        }, () => {
                            if (shouldBlock) {
                                chrome.tabs.sendMessage(tabs[0].id, { action: "shutdown" });
                            }
                        });
                    } else if (shouldBlock) {
                        chrome.tabs.sendMessage(tabs[0].id, { action: "shutdown" });
                    }
                });
            }
        });
    });
}

// 탭 업데이트 이벤트 핸들러
function handleTabUpdate(tabId, changeInfo, tab) {
    if (changeInfo.status === 'complete' && tab.active) {
        handleUrlChange(tab.url);
    }
}

// 탭 활성화 이벤트 핸들러
function handleTabActivation(activeInfo) {
    getCurrentTabUrl((url) => {
        handleUrlChange(url);
    });
}

// 현재 활성화된 탭의 URL을 가져오기
function getCurrentTabUrl(callback) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs.length > 0) {
            callback(tabs[0].url);
        }
    });
}

export { startTracking, stopAndClearTracking };