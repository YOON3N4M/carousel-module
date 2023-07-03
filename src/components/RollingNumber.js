export default class RollingNumber {
   constructor() {
      this.container = document.querySelector(".rolling-number-container");
      this.targetArr = [...document.querySelectorAll('[data-animation="rollingNumber"]')];
      //쉼표 적용을 위해 문자열로 변환
      this.isActive = false;
      this.spanHeight;
      this.rollingNumberDivArr;
      this.init();
   }

   init() {
      this.setObserver();
      this.targetArr.forEach(
         el => (el.innerHTML += `<span>${el.dataset.headtext !== undefined ? el.dataset.headtext : ""}</span>`),
      );
      this.targetArr.forEach(target => (target.innerHTML = `<span class="num">0</span>`));
      this.targetArr.forEach(el => (el.innerHTML += `<span>${el.dataset.tailtext}</span>`));
      const initialNum = document.querySelector(".num");
      this.targetArr.forEach(t => (t.style.height = `${initialNum.offsetHeight}px`));
   }

   whenViewportInit() {
      //초기
      this.targetArr.forEach(target => (target.innerHTML = ""));
      this.targetArr.forEach(
         el => (el.innerHTML += `<span>${el.dataset.headtext !== undefined ? el.dataset.headtext : ""}</span>`),
      );
      this.targetArr.forEach(el => this.setSlide(el));
      this.targetArr.forEach(el => (el.innerHTML += `<span>${el.dataset.tailtext}</span>`));
      const numSpan = document.querySelector(".num");
      this.spanHeight = numSpan.offsetHeight;
   }

   setObserver() {
      const observer = new IntersectionObserver(entry => {
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
      //쉼표를 적용한 문자열의 배열
      const replacedValueData = valueData.replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",").split("");

      replacedValueData.forEach(item => {
         const isDot = item == ",";
         const intItem = parseInt(item);
         let slidesOfNum = [];

         if (intItem === 0) {
            slidesOfNum = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
         } else {
            for (var i = 0; i <= intItem; i++) {
               slidesOfNum.push(i);
            }
         }

         el.innerHTML += `<div class="slide-wrapper ${item}">
            ${
               isDot
                  ? `<span class="roll-dot">,</span>`
                  : `<div data-value=${item} class="slide">
                     ${slidesOfNum.map(num => `<span class="num">${num}</span>`).join("")}                   
                     </div>`
            }
         </div>`;

         if (isDot) return;

         setTimeout(() => {
            console.log(item);
            this.animate();
         }, 0);
      });
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
