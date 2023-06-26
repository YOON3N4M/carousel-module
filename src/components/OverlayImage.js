export default class OverlayImage {
   constructor(target) {
      this.target = target;
      this.handle = document.querySelector(".handle");
      this.handleWidth = this.handle.offsetWidth;
      this.leftBox = document.querySelector(".left-box");
      this.rightBox = document.querySelector(".right-box");
      this.isPress = false;
      this.prevPosX = 0;
      this.handleLeftValuePercent;
      this.init();
   }

   init() {
      this.addEvent();
      this.leftBox.style.width = `${50}%`;
      this.rightBox.style.width = `${50}%`;
      /* 
      transform이 아닌 margin값을 음수로 핸들 위치를 조정하면 이벤트에 버그가 생김
      해당 값은 핸들 요소의 width 값 반을 음수로 자동으로 할당 되도록 변경
      ex) 핸들 50px => translateX(-25px)
      */
      this.handle.style.transform = `translateX(-${this.handleWidth / 2}px)`;
   }

   addEvent() {
      this.handle.addEventListener("mousedown", e => this.start(e));
      this.target.addEventListener("mouseup", () => this.end());
      this.target.addEventListener("mousemove", e => this.onHandleMove(e));
   }

   start(e) {
      this.prevPosX = e.clientX;
      this.isPress = true;
   }

   onHandleMove(e) {
      let timer;
      if (!this.isPress) return;
      if (timer) return;

      this.timer = setTimeout(() => {
         timer = null;
         const posX = this.prevPosX - e.clientX;
         this.prevPosX = e.clientX;
         this.handleLeftValuePercent = ((this.handle.offsetLeft - posX) / this.target.offsetWidth) * 100;
         //이 아래 줄을 퍼센트로 바꿔야하나ㅏ? 여길 퍼센트로 바꾸면 해결 될듯
         this.handle.style.left = `${this.handleLeftValuePercent}%`;
         this.changeBoxWidth();
      }, 10);
   }

   end() {
      this.isPress = false;
   }

   changeBoxWidth() {
      this.leftBox.style.width = `${this.handleLeftValuePercent}%`;
      this.rightBox.style.width = `${100 - this.handleLeftValuePercent}%`;
   }
}
