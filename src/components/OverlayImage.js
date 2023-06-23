export default class OverlayImage {
   constructor(target) {
      this.target = target;
      this.handle = document.querySelector(".handle");
      this.handleWidth = this.handle.offsetWidth;
      this.leftBox = document.querySelector(".left-box");
      this.rightBox = document.querySelector(".right-box");
      this.isPress = false;
      this.prevPosX = 0;
      this.leftBoxWidth = 50;
      this.rightBoxWidth = 100 - this.leftBoxWidth;
      this.initialHandleOffsetLeft;
      this.timer;
      this.init();
   }

   init() {
      this.addEvent();
      this.leftBox.style.width = `${this.leftBoxWidth}%`;
      this.rightBox.style.width = `${this.rightBoxWidth}%`;
      this.initialHandleOffsetLeft = this.handle.offsetLeft;
      /* 
      transform이 아닌 margin값을 음수로 핸들 위치를 조정하면 이벤트에 에러가 생김
      해당 값은 핸들 요소의 width 값 반을 음수로 자동으로 할당 되도록 변경
      ex) 핸들 50px => translateX(-25px)
      */
      this.handle.style.transform = `translateX(-${this.handleWidth / 2}px)`;
   }

   addEvent() {
      this.target.addEventListener("mousedown", e => this.start(e));
      this.target.addEventListener("mouseup", e => this.end());
      this.target.addEventListener("mousemove", e => this.onHandleMove(e));
   }

   start(e) {
      console.log(this);
      console.log(this.initialHandleOffsetLeft);
      this.prevPosX = e.clientX;
      this.isPress = true;
   }

   onHandleMove(e) {
      if (this.isPress) {
         if (!this.timer) {
            this.timer = setTimeout(() => {
               this.timer = null;
               const posX = this.prevPosX - e.clientX;
               this.prevPosX = e.clientX;
               this.handle.style.left = this.handle.offsetLeft - posX + "px";
               this.changeBoxWidth();
            }, 10);
         }
      }
   }

   changeBoxWidth() {
      const x = this.initialHandleOffsetLeft;
      const y = this.handle.offsetLeft;
      const percentageChange = (y / x) * 100;
      const halfOfPercentage = (100 - percentageChange) / 2;
      const changedLeftBoxWidth = 50 - halfOfPercentage;

      this.leftBox.style.width = `${50 - halfOfPercentage}%`;
      this.rightBox.style.width = `${100 - changedLeftBoxWidth}%`;
   }

   end() {
      this.isPress = false;
   }
}
