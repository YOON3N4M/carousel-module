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
         this.init();
      } else {
         this.currentIsMobile = false;
         this.init();
      }

      this.isActive = false;
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

   whenViewportInit() {
      //초기 0삭제
      this.targetArr.forEach(target => target.childNodes[0].remove());
      this.targetArr.forEach(el => {
         this.setSlide(el);
      });

      const numSpan = document.querySelector(".roll-num");
      this.spanHeight = numSpan.offsetHeight;
   }

   setSlide(el) {
      const valueData = el.dataset.value;
      //쉼표를 적용한 문자열의 배열
      const replacedValueData = valueData.replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",").split("");

      replacedValueData.forEach((item, idx) => {
         const isDot = item == "," || item == ".";
         const intItem = parseInt(item);
         const lastIndex = replacedValueData.length > 1 ? replacedValueData.length - 1 : undefined;
         const isLastIndex = idx == lastIndex ? true : false;
         let slidesOfNum = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];

         if (intItem !== 0) {
            slidesOfNum.push(intItem);
         }

         const slideContent = isDot
            ? `<span class="roll-dot">${item}</span>`
            : `<div data-value=${item} class="slide ${isLastIndex ? "last-index" : "remain-index"}">
             ${
                isLastIndex
                   ? `
               ${slidesOfNum.map(num => `<span class="roll-num">${num}</span>`).join("")}
               ${slidesOfNum.map(num => `<span class="roll-num">${num}</span>`).join("")}
               ${slidesOfNum.map(num => `<span class="roll-num">${num}</span>`).join("")}
             `
                   : `${slidesOfNum.map(num => `<span class="roll-num">${num}</span>`).join("")}
                   ${slidesOfNum.map(num => `<span class="roll-num">${num}</span>`).join("")}
                   `
             }
           </div>`;

         //머릿말은 없어도 꼬릿말은 고정적으로 있기에 슬라이드는 꼬릿말의 앞쪽에 dom 생성
         el.lastChild.insertAdjacentHTML(
            "beforebegin",
            `<div class="slide-wrapper ${item}">${slideContent}</div>`,
         );

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
            : (slide.style.marginTop = `-${21 * this.spanHeight}px`),
      );

      lastSlideArr.forEach(slide =>
         parseInt(slide.dataset.value) === 0
            ? (slide.style.marginTop = `-${29 * this.spanHeight}px`)
            : (slide.style.marginTop = `-${32 * this.spanHeight}px`),
      );
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
