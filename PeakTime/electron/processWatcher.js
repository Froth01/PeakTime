import { spawn } from "child_process";
import { activeWindow }  from "active-win";


// 차단할 프로세스 목록과 주기
const interval = 2000;

let blockProcesses = { "Figma.exe": 0 };
let processHistory;
let runningCheckProcesses;
let runngingGetActiveProgram;

// 실행 중인 프로세스 목록을 가져오는 함수
function getRunningProcesses(callback) {
    const processMonitor = spawn("tasklist");

    let output = "";

    processMonitor.stdout.on("data", (data) => {
        output += data.toString();
    });

    processMonitor.on("close", () => {
        const processList = [];
        const lines = output.split("\n");
        lines.forEach(line => {
            const processName = line.trim().split(/\s+/)[0];
            if (processName && processName.endsWith(".exe")) {
                processList.push(processName);
            }
        });
        callback(new Set(processList));
    });
}

// 특정 프로세스를 종료하는 함수
function terminateProcess(processName) {
    const processKiller = spawn("taskkill", ["/IM", processName, "/F"]);

    processKiller.stdout.on("data", (data) => {
        //console.log(`Process terminated: ${data}`);
    });

    processKiller.stderr.on("data", (data) => {
        console.error(`Error terminating process: ${data}`);
    });

    processKiller.on("close", (code) => {
        if (code === 0) {
            console.log(`Successfully terminated process: ${processName}`);
        } else {
            console.log(`Failed to terminate process: ${processName} with exit code ${code}`);
        }
    });
}

// 차단된 프로세스를 주기적으로 확인하고 종료하는 함수
function checkProcesses() {
    getRunningProcesses((currentProcesses) => {
        currentProcesses.forEach(processName => {
            if (blockProcesses[processName] !== undefined) {
                processHistory[processName] = 0;
                terminateProcess(processName);
            }
        });
    });
}

// 활성 창 정보를 가져오는 함수
async function getActiveProgram() {
    const window = await activeWindow();

    if (window) {
        const path = window.owner.path;
        if(!path.startsWith("C:\\Windows")){
            const name = path.split("\\").at(-1);
            if(processHistory[name] == undefined){
                processHistory[name] = 0;
            }

            if(blockProcesses[name] == undefined){
                processHistory[name] += 2;
            }
            
        }
        
    } else {
        console.log("No active window detected.");
    }
}

export function startWatcher(processes){
    // 차단 프로세스 설정
    blockProcesses = processes;
    processHistory = {}; 
    runngingGetActiveProgram = setInterval(getActiveProgram, interval);
    runningCheckProcesses = setInterval(checkProcesses, interval);
}

export function endWatcher(){
    clearInterval(runningCheckProcesses);
    clearInterval(runngingGetActiveProgram);

    const response = [];
    for(let key in processHistory){
        response.push({
            "contentName" : key,
            "contentType" : "program",
            "usingTime" : processHistory[key],
            "isBlockContent" : processHistory[key] == 0
        });
    }

    console.log(response);
    return response;
}
