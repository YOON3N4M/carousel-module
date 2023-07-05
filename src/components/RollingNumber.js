export default class RollingNumber {
   constructor() {
      this.container = document.querySelector(".rolling-number-container");
      this.targetArr = [...document.querySelectorAll('[data-animation="rollingNumber"]')];
      //쉼표 적용을 위해 문자열로 변환
      this.isActive = false;
      this.spanHeight;
      this.isMobile;
      this.currentIsMobile;
      this.slideOptionAboutIndex = [2, 5, 10, 15, 20];
      this.init();
      this.isUpDirection = false;
   }

   init() {
      this.setObserver();
      this.targetArr.forEach(
         el =>
            (el.innerHTML += `<span class="roll-head-text">
            ${el.dataset.headtext !== undefined ? el.dataset.headtext : ""}
            </span>`),
      );
      this.targetArr.forEach(target => (target.innerHTML = `<span class="roll-num">${0}</span>`));
      this.targetArr.forEach(
         el => (el.innerHTML += `<span class="roll-tail-text">${el.dataset.tailtext}</span>`),
      );
      const initialNumSpan = document.querySelector(".roll-num");
      this.targetArr.forEach(t => (t.style.height = `${initialNumSpan.offsetHeight}px`));
      this.targetArr.forEach(
         t => (t.style.minWidth = `${initialNumSpan.offsetWidth * t.dataset.value.length}px`),
      );
      window.addEventListener("resize", () => this.onResizing());
   }

   onResizing() {
      const mediaQueryWidth = window.innerWidth;
      console.log(mediaQueryWidth);
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
      } else {
         this.currentIsMobile = false;
      }
      this.init();
      this.whenViewportInit();
      this.isActive = false;
   }

   setObserver() {
      const observer = new IntersectionObserver(entry => {
         entry.forEach(entry => {
            if (entry.isIntersecting && !this.isActive) {
               setTimeout(() => {
                  this.isActive = true;
                  this.whenViewportInit();
               }, 10);
            }
         });
      });
      observer.observe(this.container);
   }

   whenViewportInit() {
      const numSpan = document.querySelector(".roll-num");
      this.spanHeight = numSpan.offsetHeight;

      //초기 0삭제
      this.targetArr.forEach(target => (target.innerHTML = ""));
      this.targetArr.forEach(
         el =>
            (el.innerHTML += `<span class="roll-head-text">
            ${el.dataset.headtext !== undefined ? el.dataset.headtext : ""}
            </span>`),
      );
      this.targetArr.forEach(
         el => (el.innerHTML += `<span class="roll-tail-text">${el.dataset.tailtext}</span>`),
      );

      this.targetArr.forEach(el => {
         this.setSlide(el);
      });
   }

   setSlide(el) {
      const valueData = el.dataset.value;
      //쉼표를 적용한 문자열의 배열
      const replacedValueData = valueData.replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",").split("");

      replacedValueData.forEach((item, idx) => {
         const isDot = item == "," || item == ".";
         const intItem = parseInt(item);

         let numArr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
         let randomNumArr = [];
         let slideNumArr = [];

         for (var i = 0; i <= this.slideOptionAboutIndex[idx]; i++) {
            let randomNumber = numArr[Math.floor(Math.random() * numArr.length)];
            randomNumArr.push(randomNumber);
         }

         this.isUpDirection ? randomNumArr.unshift(intItem) : randomNumArr.push(intItem);

         console.log(randomNumArr);
         // slideNumArr.push(intItem);

         /* 
         for (var it = idx + 1; it <= this.slideOptionAboutIndex[idx]; it++) {
            numTempArr.map(number => slideNumArr.push(number));
         }
         for (var i = intItem; i > intItem - 2; i--) {
            for (var it = idx + 1; it <= slideOptionAboutIndex[idx]; it++) {
               slideNumArr.push(i);
            }
    */

         const slideContent = isDot
            ? `<span class="roll-dot">${item}</span>`
            : `<div data-value=${item} data-index=${idx} class="slide">
                  ${randomNumArr.map(number => `<span class="roll-num">${number}</span>`).join("")}
               </div>`;

         //머릿말은 없어도 꼬릿말은 고정적으로 있기에 슬라이드는 꼬릿말의 앞쪽에 dom 생성
         el.lastChild.insertAdjacentHTML(
            "beforebegin",
            `<div class="slide-wrapper ${item}">${slideContent}</div>`,
         );

         if (isDot) return;
      });

      setTimeout(() => {
         this.animate();
      }, 100);
   }

   animate() {
      const slideArr = [...document.querySelectorAll(".slide")];

      slideArr.forEach((slide, i) => {
         const numberIndex = parseInt(slide.dataset.index);
         switch (numberIndex) {
            case 0:
               slide.style.marginTop = `${this.isUpDirection ? `+` : `-`}${
                  (this.slideOptionAboutIndex[0] + 1) * this.spanHeight
               }px`;
               break;
            case 1:
               slide.style.marginTop = `${this.isUpDirection ? `+` : `-`}${
                  (this.slideOptionAboutIndex[1] + 1) * this.spanHeight
               }px`;
               break;
            case 2:
               slide.style.marginTop = `${this.isUpDirection ? `+` : `-`}${
                  (this.slideOptionAboutIndex[2] + 1) * this.spanHeight
               }px`;
               break;
            case 3:
               slide.style.marginTop = `${this.isUpDirection ? `+` : `-`}${
                  (this.slideOptionAboutIndex[3] + 1) * this.spanHeight
               }px`;
               break;
            case 4:
               slide.style.marginTop = `${this.isUpDirection ? `+` : `-`}${
                  (this.slideOptionAboutIndex[4] + 1) * this.spanHeight
               }px`;
               break;
         }
      });

      /* 
      lastSlideArr.forEach(slide =>
         parseInt(slide.dataset.value) === 0
            ? (slide.style.marginTop = `-${1 * this.spanHeight}px`)
            : (slide.style.marginTop = `-${1 * this.spanHeight}px`),
      );
   */
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
