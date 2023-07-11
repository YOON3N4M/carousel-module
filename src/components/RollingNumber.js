export default class RollingNumber {
   constructor(el) {
      this.el = el;
      this.isActive = false;
      this.spanHeight;
      this.isMobile;
      this.currentIsMobile;
      this.slideOptionAboutIndex = [2, 5, 10, 15, 22, 25];
      this.init();
      // 이 부분 false 면 숫자가 위로 돌아가고, true면 아래로 돌아감
      this.isToDown = false;
   }

   init() {
      this.setObserver();
      this.setTemplate();
      const initialSpan = document.querySelector(".roll-tail-text");
      //해당 부분도 따로 분리 예정
      this.el.style.height = `${initialSpan.offsetHeight}px`;
      this.el.style.minWidth = `${initialSpan.offsetWidth * this.el.dataset.value.length}px`;

      window.addEventListener("resize", () => this.onResizing());
   }

   setTemplate() {
      // prettier-ignore
      this.el.innerHTML += `<span class="roll-head-text">${this.el.dataset.headtext !== undefined ? this.el.dataset.headtext : ""}</span>`;
      this.el.innerHTML += `<span class="roll-tail-text">${this.el.dataset.tailtext}</span>`;
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
      observer.observe(this.el);
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
      } else {
         this.currentIsMobile = false;
      }
      this.init();
      this.whenViewportInit();
      this.isActive = false;
   }

   whenViewportInit() {
      const initialSpan = document.querySelector(".roll-tail-text");
      this.spanHeight = initialSpan.offsetHeight;

      //초기 0삭제
      this.el.innerHTML = "";
      this.setTemplate();
      this.setSlide(this.el);
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

         for (var i = 0; i <= this.slideOptionAboutIndex[idx]; i++) {
            let randomNumber = numArr[Math.floor(Math.random() * numArr.length)];
            randomNumArr.push(randomNumber);
         }

         this.isToDown ? randomNumArr.unshift(intItem) : randomNumArr.push(intItem);

         const slideContent = isDot
            ? `<span class="roll-dot">${item}</span>`
            : `<div data-value=${item} data-index=${idx} class="roll-slide">
                  ${randomNumArr.map(number => `<span class="roll-num">${number}</span>`).join("")}
               </div>`;

         //머릿말은 없어도 꼬릿말은 고정적으로 있기에 슬라이드는 꼬릿말의 앞쪽에 dom 생성
         el.lastChild.insertAdjacentHTML("beforebegin", `${slideContent}`);
      });

      setTimeout(() => {
         this.animate();
      }, 100);
   }

   animate() {
      const slideArr = [...document.querySelectorAll(".roll-slide")];

      slideArr.forEach(slide => {
         const numberIndex = parseInt(slide.dataset.index);
         const direction = this.isToDown ? `+` : `-`;

         slide.style.marginTop = `${direction}${
            (this.slideOptionAboutIndex[numberIndex] + 1) * this.spanHeight
         }px`;
      });
   }
}
