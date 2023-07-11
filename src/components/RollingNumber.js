export default class RollingNumber {
   constructor(el) {
      this.el = el;
      this.spanHeight;
      this.isMobile = null;
      this.slideOptionAboutIndex = [2, 5, 10, 15, 22, 25];
      this.init();
      this.observer;
      this.sliderArr;
      // 이 부분 false 면 숫자가 위로 돌아가고, true면 아래로 돌아감
      this.isToDown = false;
   }

   init() {
      this.setTemplate();
      this.setObserver();
      this.setDomStyle();
      window.addEventListener("resize", () => this.resizeHandler());
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
      const HTMLTemp = `
            <span class="roll-head-text">
               ${this.el.dataset.headtext || ""}
            </span> 
               ${this.setSlide()}
            <span class="roll-tail-text">
               ${this.el.dataset.tailtext}
            </span>
             `

      this.el.insertAdjacentHTML("afterbegin", HTMLTemp);
      this.sliderArr = [...document.querySelectorAll(".roll-slide")];
   }

   setSlide() {
      const valueData = this.el.dataset.value;
      let slideHTMLTemp = "";
      //쉼표를 적용한 문자열의 배열
      const replacedValueData = valueData.replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",").split("");
      replacedValueData.forEach((item, idx) => {
         const isDot = item == "," || item == ".";
         const intItem = parseInt(item);
         const randomNumArr = [];

         for (var i = 0; i <= this.slideOptionAboutIndex[idx]; i++) {
            let randomNumber = Math.floor(Math.random() * 10);
            randomNumArr.push(randomNumber);
         }

         this.isToDown ? randomNumArr.unshift(intItem) : randomNumArr.push(intItem);

         const slideContent = isDot
            ? 
            `<span class="roll-dot">
              ${item}
            </span>`
            : 
            `<div data-value="${item}" data-index="${idx}" class="roll-slide">
                  ${
                     randomNumArr.map((number) =>
                      `<span class="roll-num">${number}</span>`).join("")
                  }
            </div>`;
         //머릿말은 없어도 꼬릿말은 고정적으로 있기에 슬라이드는 꼬릿말의 앞쪽에 dom 생성
         // this.el.lastChild.insertAdjacentHTML("beforebegin", `${slideContent}`);
         slideHTMLTemp += slideContent
      });

      return slideHTMLTemp
   }

   setDomStyle() {
      const initialSpan = document.querySelector(".roll-tail-text");
      this.spanHeight = initialSpan.offsetHeight;
      this.el.style.height = `${this.spanHeight}px`;
      //.el.style.minWidth = `${this.spanWidth * this.el.dataset.value.length}px`;
   }

   resizeHandler() {
      const crrIsMobile = window.innerWidth <= 769;

      if (crrIsMobile !== this.isMobile) {
         this.isMobile = crrIsMobile;
         this.whenChangeDevice();
      }
   }

   whenChangeDevice() {
      this.setDomStyle();
      this.sliderArr.forEach(
         slide => (
            slide.style = `
            transition: none; 
            transform : translateY(${0}px);
            `
         ),
      );

      // slideArr.forEach(slide => (slide.style.transition = `transform 2.5s ease`));
      this.setObserver();
   }

   whenViewportInit() {
      setTimeout(() => {
         this.animate();
      }, 100);
      //한번 실행한뒤 옵저버 제거
      this.observer.disconnect();
   }

   animate() {
      this.sliderArr.forEach(slide => {
         const numberIndex = parseInt(slide.dataset.index);
         const direction = this.isToDown ? `+` : `-`;
         slide.style = `
         transition: transform 2.5s ease;
         transform: translateY(
            ${direction}${((this.slideOptionAboutIndex[numberIndex] + 1) * this.spanHeight) / 2
         }px);
         `
      });
   }
}
