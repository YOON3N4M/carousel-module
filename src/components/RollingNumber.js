export default class RollingNumber {
   constructor(target, number) {
      this.container = document.querySelector(".rolling-number-container");
      this.targetArr = [...document.querySelectorAll('div[data-animation="rollingNumber"]')];
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
   }

   whenViewportInit() {
      this.targetArr.forEach(target => (target.innerHTML = ""));
      this.targetArr.forEach(el => this.setSlide(el));
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
         const text = item;
         const numSpaceArr = [];

         for (var i = 0; i <= parseInt(item); i++) {
            numSpaceArr.push(i);
         }

         el.innerHTML += `<div class="slide-wrapper ${item}">
         ${
            isDot
               ? `<span class="roll-dot">,</span>`
               : `<div data-value=${item} class="slide">${numSpaceArr
                    .map(num => `<span class="num">${num}</span>`)
                    .join("")}}</div>`
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
         }, this.delay * i);
      }, 100);
   }

   animate(item) {
      const number = parseInt(item);
      const slideArr = [...document.querySelectorAll(".slide")];

      slideArr.forEach(slide => (slide.style.marginTop = `-${parseInt(slide.dataset.value) * this.spanHeight}px`));
   }
}
