export default class RollingNumber {
   constructor(target, number) {
      this.targetArr = [...document.querySelectorAll('div[data-animation="rollingNumber"]')];
      //쉼표 적용을 위해 문자열로 변환
      this.number = String(number);
      this.spanHeight;
      this.rollingNumberDivArr;
      this.speed = 20;
      this.delay = 0;
      this.init();
   }

   init() {
      this.targetArr.forEach(el => this.setSlide(el));
      const numSpan = document.querySelector(".num");
      this.spanHeight = numSpan.offsetHeight;
      console.log(this.spanHeight);
   }

   setSlide(el) {
      const valueData = el.dataset.value;
      const replacedValueData = valueData.replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",").split("");

      replacedValueData.forEach((item, idx) => {
         const isDot = item == ",";
         const text = item;
         const numSpaceArr = [];

         for (var i = 0; i <= parseInt(item); i++) {
            numSpaceArr.push(i);
         }

         el.innerHTML += `<div class="slide-wrapper ${item}-of-${valueData}">
         ${
            isDot
               ? ","
               : `<div class="slide">${numSpaceArr.map(num => `<span class="num">${num}</span>`).join("")}</div>`
         }
         </div>`;

         //  const wrapperEl = el.querySelector(`.22233`);
         // console.log(wrapperEl);

         /* 
         spanElement.innerHTML += `<span class="num ${classId}" data-text="${text}">
         ${numSpaceArr.map(i => `<span class="num-list">${i}</span>`)}
         </span>`;
         */
         /*
         setTimeout(() => {
            if (isDot) {
               const dotEl = document.querySelector(`.${classId}`).querySelector(".num-list");
               dotEl.style.transition = "margin";
               dotEl.style.marginTop = `-${300}px`;
               return;
            }
            this.animate(`.${classId}`);
         }, this.delay * i);

          */
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
