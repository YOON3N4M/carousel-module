export default class RollingNumber {
   constructor(el) {
      this.el = el;
      this.spanHeight;
      this.isMobile;
      this.currentIsMobile;
      this.slideOptionAboutIndex = [2, 5, 10, 15, 22, 25];
      this.init();
      // 이 부분 false 면 숫자가 위로 돌아가고, true면 아래로 돌아감
      this.isToDown = false;
      this.observer;
   }

   init() {
      this.setTemplate();
      this.setObserver();
      this.setDomStyle();
      window.addEventListener("resize", () => this.onResizing());
   }

   setObserver() {
      this.observer = new IntersectionObserver(entry => {
         entry.forEach(entry => {
            if (entry.isIntersecting) {
               setTimeout(() => {
                  this.whenViewportInit();
               }, 10);
            }
         });
      });
      this.observer.observe(this.el);
   }

   setTemplate() {
      // prettier-ignore
      const headTextEl = `<span class="roll-head-text">${this.el.dataset.headtext !== undefined ? this.el.dataset.headtext : ""}</span>`;
      const tailTextEl = `<span class="roll-tail-text">${this.el.dataset.tailtext}</span>`;
      this.el.insertAdjacentHTML("afterbegin", tailTextEl);
      //이 부분에 setSlide
      this.el.insertAdjacentHTML("afterbegin", headTextEl);
      this.setSlide(this.el);
   }

   slideListHTML() {}
   setDomStyle() {
      const initialSpan = document.querySelector(".roll-tail-text");
      //해당 부분도 따로 분리 예정
      this.el.style.height = `${initialSpan.offsetHeight}px`;
      this.el.style.minWidth = `${initialSpan.offsetWidth * this.el.dataset.value.length}px`;
      this.spanHeight = initialSpan.offsetHeight;
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

   whenViewportInit() {
      setTimeout(() => {
         this.animate();
      }, 100);
      //한번 실행한뒤 옵저버 제거
      this.observer.disconnect();
   }

   setSlide(el) {
      const valueData = el.dataset.value;
      //쉼표를 적용한 문자열의 배열
      console.log(parseInt(valueData));
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
