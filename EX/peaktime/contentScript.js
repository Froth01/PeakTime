chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    if (msg.action === "START") {
        // body 내용 초기화
        document.body.innerHTML = ''; 
        document.head.innerHTML = 'Block WebSite';

        // 이미지 설정
        const imageUrl = chrome.runtime.getURL('static/image/image.png');

        // body에 직접 스타일 적용
        document.body.style.backgroundImage = `url('${imageUrl}')`; // 이미지 URL 설정
        document.body.style.backgroundSize = 'cover'; // 이미지가 화면 전체를 덮도록 설정
        document.body.style.backgroundRepeat = 'no-repeat'; // 이미지 반복 방지
        document.body.style.backgroundPosition = 'center center'; // 이미지가 중앙에 위치하도록 설정
        document.body.style.width = '100vw'; // 가로 크기 100%
        document.body.style.height = '100vh'; // 세로 크기 100%
        document.body.style.margin = '0'; // 여백 없애기
        document.body.style.overflow = 'hidden'; // 스크롤 방지
        document.body.style.pointerEvents = 'none'; // 클릭 등 상호작용 차단
        document.body.style.cursor = 'not-allowed'; // 금지된 커서 모양 표시

        // 응답 메시지
        sendResponse({ message: "Block WebSite" });
    }
    if (msg.action === "GET_SELECTED_TEXT") {
        //사용자가 드래그한 메시지 백그라운드로 보냄
        const selectedText = window.getSelection().toString();
        sendResponse({ text: selectedText || null });
    }
    return true;
});