export default class OverlayImage {
   constructor(target) {
      this.target = target;
      this.handle = document.querySelector(".handle");
      this.leftBox = document.querySelector(".left-box");
      this.rightBox = document.querySelector(".right-box");
      this.isPress = false;
      this.prevPosX = 0;
      this.leftBoxWidth = 50;
      this.rightBoxWidth = 100 - this.leftBoxWidth;
      this.initialHandleOffsetLeft;
      this.init();
   }

   init() {
      this.addEvent();
      this.leftBox.style.width = `${this.leftBoxWidth}%`;
      this.rightBox.style.width = `${this.rightBoxWidth}%`;
      this.initialHandleOffsetLeft = this.handle.offsetLeft;
   }

   addEvent() {
      this.target.addEventListener("mousedown", e => this.start(e));
      this.target.addEventListener("mouseup", e => this.end());
      this.target.addEventListener("mousemove", e => this.onHandleMove(e));
   }

   start(e) {
      console.log("누름");
      console.log(this.initialHandleOffsetLeft);
      this.prevPosX = e.clientX;
      this.isPress = true;
   }

   onHandleMove(e) {
      if (this.isPress) {
         const posX = this.prevPosX - e.clientX;
         this.prevPosX = e.clientX;
         this.handle.style.left = this.handle.offsetLeft - posX + "px";
         this.changeBoxWidth();
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
