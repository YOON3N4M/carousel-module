export default class RollingNumber {
   constructor() {
      this.container = document.querySelector(".rolling-number-container");
      this.targetArr = [...document.querySelectorAll('[data-animation="rollingNumber"]')];
      //쉼표 적용을 위해 문자열로 변환
      this.isActive = false;
      this.spanHeight;
      this.isMobile;
      this.currentIsMobile;
      this.init();
   }

   init() {
      this.setObserver();
      this.targetArr.forEach(
         el =>
            (el.innerHTML += `<span>${el.dataset.headtext !== undefined ? el.dataset.headtext : ""}</span>`),
      );
      this.targetArr.forEach(target => (target.innerHTML = `<span class="num">0</span>`));
      this.targetArr.forEach(el => (el.innerHTML += `<span>${el.dataset.tailtext}</span>`));

      const initialNum = document.querySelector(".num");
      this.targetArr.forEach(t => (t.style.height = `${initialNum.offsetHeight}px`));
      window.addEventListener("resize", () => this.onResizing());
   }

   whenViewportInit() {
      //초기
      this.targetArr.forEach(target => (target.innerHTML = ""));
      this.targetArr.forEach(
         el =>
            (el.innerHTML += `<span>${el.dataset.headtext !== undefined ? el.dataset.headtext : ""}</span>`),
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

      replacedValueData.forEach((item, idx) => {
         const isDot = item == ",";
         const intItem = parseInt(item);
         const lastIndex = replacedValueData.length > 1 ? replacedValueData.length - 1 : undefined;
         const isLastIndex = idx == lastIndex ? true : false;
         console.log(isLastIndex);
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
                  : `<div data-value=${item} class="slide ${isLastIndex ? "last-index" : "remain-index"}">
                     ${
                        isLastIndex
                           ? `  ${slidesOfNum.map(num => `<span class="num">${num}</span>`).join("")}   
                     ${slidesOfNum.map(num => `<span class="num">${num}</span>`).join("")}      
                     ${slidesOfNum.map(num => `<span class="num">${num}</span>`).join("")}    `
                           : ` ${slidesOfNum.map(num => `<span class="num">${num}</span>`).join("")} `
                     }
                     

                     </div>`
            }
         </div>`;

         if (isDot) return;

         setTimeout(() => {
            this.animate();
         }, 0);
      });
   }
   animate() {
      const slideArr = [...document.querySelectorAll(".slide")];
      const lastSlideArr = slideArr.filter(div => div.className === "slide last-index");
      const remainSlideArr = slideArr.filter(div => div.className !== "slide last-index");

      remainSlideArr.forEach(slide =>
         parseInt(slide.dataset.value) === 0
            ? (slide.style.marginTop = `-${9 * this.spanHeight}px`)
            : (slide.style.marginTop = `-${parseInt(slide.dataset.value) * this.spanHeight}px`),
      );

      lastSlideArr.forEach(slide =>
         parseInt(slide.dataset.value) === 0
            ? (slide.style.marginTop = `-${29 * this.spanHeight}px`)
            : (slide.style.marginTop = `-${(parseInt(slide.dataset.value) * 3 + 2) * this.spanHeight}px`),
      );
   }

   onResizing() {
      const mediaQueryWidth = window.innerWidth;
      //리사이징 변경 감지
      if (mediaQueryWidth >= 769) {
         //pc
         this.isMobile = false;
      } else if (mediaQueryWidth < 769) {
         //mobile
         this.isMobile = true;
      }
      if (this.currentIsMobile !== this.isMobile) {
         this.changeDevice();
      }
   }

   changeDevice() {
      if (this.isMobile) {
         this.currentIsMobile = true;
         this.init();
         this.whenViewportInit();
      } else {
         this.currentIsMobile = false;
         this.init();
         this.whenViewportInit();
      }
   }

   /*
   animate() {
      const slideArr = [...document.querySelectorAll(".slide")];
   
      slideArr.forEach(slide =>
         parseInt(slide.dataset.value) === 0
            ? (slide.style.marginTop = `-${29 * this.spanHeight}px`)
            : (slide.style.marginTop = `-${(parseInt(slide.dataset.value) * 3 + 2) * this.spanHeight}px`),
      );
   }
   */
}
