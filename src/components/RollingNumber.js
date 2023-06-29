export default class RollingNumber {
   constructor(target, number) {
      this.target = target;
      //쉼표 적용을 위해 문자열로 변환
      this.number = String(number);
      this.speed = 20;
      this.delay = 0;
      this.init();
   }
   init() {
      //숫자 내 쉼표
      const num = this.number.replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",").split("");
      num.forEach((item, i) => {
         const isDot = item == ",";
         const classId = isDot ? `num-idx-${i}-point` : `num-idx-${i}-${item}`;
         const text = item;

         this.target.innerHTML += `<span class="num ${classId}" data-text="${text}">
         <span class="num-list">0 1 2 3 4 5 6 7 8 9 ,</span>
         </span>`;

         setTimeout(() => {
            if (isDot) {
               const dotEl = document.querySelector(`.${classId}`).querySelector(".num-list");
               dotEl.style.transition = "margin";
               dotEl.style.marginTop = `-${300}px`;
               return;
            }
            this.animate(`.${classId}`);
         }, this.delay * i);
      });
   }
   render() {}

   animate(digit) {
      const el = this.target.querySelector(digit);
      const numList = el.querySelector(".num-list");
      const dataText = el.getAttribute("data-text");
      const dataNum = parseInt(dataText);
      const pos = dataText == "," ? 10 : dataText;
      let n = 0;
      const numInterval = setInterval(() => {
         numList.style.marginTop = `-${n * 30}px`;
         if (n >= 10) {
            clearInterval(numInterval);
            numList.style.marginTop = `-${pos * 30}px`;
         }
         n++;
      }, this.speed * dataNum);
   }
}
