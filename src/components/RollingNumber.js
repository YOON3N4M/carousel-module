export default class RollingNumber {
   constructor(target, number) {
      this.container = document.querySelector(".rolling-number-container");
      this.targetArr = [...document.querySelectorAll('[data-animation="rollingNumber"]')];
      //쉼표 적용을 위해 문자열로 변환
      this.isActive = false;
      this.spanHeight;
      this.rollingNumberDivArr;
      this.setObserver();
      this.init();
      // 이 아래로는 지워도 될듯
      this.number = String(number);
      this.speed = 200;
      this.delay = 0;
   }

   init() {
      this.targetArr.forEach(target => (target.innerHTML = `<span class="num">0</span>`));
      const initialNum = document.querySelector(".num");

      // this.targetArr.forEach(t => (t.style.width = `${t.dataset.value.length * initialNum.offsetWidth}px`));
      this.targetArr.forEach(t => (t.style.height = `${initialNum.offsetHeight}px`));
      console.log(initialNum.offsetHeight);
      console.log(this.targetArr[0].dataset.value.length);
   }

   whenViewportInit() {
      this.targetArr.forEach(target => (target.innerHTML = ""));
      this.targetArr.forEach(el => (el.innerHTML += `<span>${el.dataset.headtext}</span>`));
      this.targetArr.forEach(el => this.setSlide(el));
      this.targetArr.forEach(el => (el.innerHTML += `<span>${el.dataset.tailtext}</span>`));
      const numSpan = document.querySelector(".num");
      this.spanHeight = numSpan.offsetHeight;
   }

   setObserver() {
      const observer = new IntersectionObserver((entry, observer) => {
         entry.forEach(entry => {
            if (entry.isIntersecting && !this.isActive) {
               setTimeout(() => {
                  this.isActive = true;
                  this.whenViewportInit();
               }, 50);
            }
         });
      });
      observer.observe(this.container);
   }

   setSlide(el) {
      const valueData = el.dataset.value;
      const replacedValueData = valueData.replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",").split("");

      replacedValueData.forEach((item, idx) => {
         const isDot = item == ",";
         const intItem = parseInt(item);
         let numSpaceArr = [];

         if (intItem === 0) {
            numSpaceArr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
         } else {
            for (var i = 0; i <= intItem; i++) {
               numSpaceArr.push(i);
            }
         }

         el.innerHTML += `<div class="slide-wrapper ${item}">
         ${
            isDot
               ? `<span class="roll-dot">,</span>`
               : `<div data-value=${item} class="slide">${numSpaceArr
                    .map(num => `<span class="num">${num}</span>`)
                    .join("")}</div>`
         }
         </div>`;

         //  const wrapperEl = el.querySelector(`.22233`);
         // console.log(wrapperEl);
         /* 
         spanElement.innerHTML += `<span class="num ${classId}" data-text="${text}">
         ${numSpaceArr.map(i => `<span class="num-list">${i}</span>`)}
         </span>`;
         */
         if (isDot) return;

         setTimeout(() => {
            this.animate(item);
         }, 0);
      }, 100);
   }

   animate() {
      const slideArr = [...document.querySelectorAll(".slide")];

      slideArr.forEach(slide =>
         parseInt(slide.dataset.value) === 0
            ? (slide.style.marginTop = `-${9 * this.spanHeight}px`)
            : (slide.style.marginTop = `-${parseInt(slide.dataset.value) * this.spanHeight}px`),
      );
   }
}
