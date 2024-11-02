function Timer() {
  return (
    <>
      <style>
        {`
  .timer {
    /* 색 지정 */
    background: -webkit-linear-gradient(left, #eee 50%, red 50%);
    border-radius: 100%;
    position: relative;
    /* 타이머 크기 */
    height: 100%;
    width: 100%;
    /* 애니메이션 */
    animation-name: time;
    animation-duration: 20s;
    animation-timing-function: linear;
    animation-iteration-count: infinite;
}
.mask {
    border-radius: 100% 0 0 100% / 50% 0 0 50%;
    height: 100%;
    left: 0;
    position: absolute;
    top: 0;
    width: 50%;
   
    animation-name: mask;
    animation-duration: 20s;
    animation-timing-function: linear;
    animation-iteration-count: infinite;
    /* Animation time and number of steps (halved) */
    -webkit-transform-origin: 100% 50%;
}
@-webkit-keyframes time {
    100% {
        -webkit-transform: rotate(360deg);
    }
}
@-webkit-keyframes mask {
    0% {
        background: red;
        /* Background colour */
        -webkit-transform: rotate(0deg);
    }
    50% {
        background: red;
        /* Background colour */
        -webkit-transform: rotate(-180deg);
    }
    50.01% {
        background: #eee;
        /* Foreground colour */
        -webkit-transform: rotate(0deg);
    }
    100% {
        background: #eee;
        /* Foreground colour */
        -webkit-transform: rotate(-180deg);
    }
}`}
      </style>
      <div className="absolute w-[30%] h-[100%] right-0 bg-green-200 bg-opacity-50 flex flex-col items-center">
        <div className="w-[40vh] h-[40vh] relative">
          <div className="timer overflow-hidden">
            <div className="mask"></div>
          </div>
          <div className="absolute top-[50%] left-[50%] translate-x-[-50%] remain">
            59:50
          </div>
        </div>
      </div>
    </>
  );
}

export default Timer;
