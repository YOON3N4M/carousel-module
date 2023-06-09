/** newCaraousel(target, title) */
export default class NewCarousel {
   constructor(target, item, width, isResponsive, partition) {
      this.target = target;
      this.itemArr = item;
      this.width = width;
      this.isResponsive = isResponsive;
      //화면 분할 수를 partition으로 표현
      this.partition = partition;
      this.activeIndex = 0;
      this.lastIndex = this.itemArr.length - 1;
      this.carouselWrapper;
      this.carouselContainer;
      this.startX;
      this.endX;
      this.currentIsMobile;
      this.isMobile;
      this.target.style.maxWidth = this.width;
      this.checkIsMobile();
      this.carouselContainerWidth = this.target.offsetWidth;
      this.init();
   }

   init() {
      this.template();
      this.render();
      this.controlIndicator();
   }

   render() {
      this.target.innerHTML = this.template();
      this.carouselWrapper = this.target.querySelector(".carousel-wrapper");
      this.carouselContainer = this.target.querySelector(".carousel-container");
      this.carouselWrapper.style.width = `${this.width}vw`;
      this.target.style.width = `${this.width}vw`;
      this.addEvent();
   }

   template() {
      // const carouselContainerWidth = this.target.offsetWidth;
      let itemWidth;
      let fixedArr;

      if (this.isResponsive && this.isMobile === false) {
         itemWidth = this.width / this.partition;
         const dotQty = Math.ceil(this.itemArr.length / this.partition);
         fixedArr = this.itemArr.slice(0, dotQty);
         this.lastIndex = fixedArr.length - 1;
      } else {
         itemWidth = this.width;
         fixedArr = this.itemArr;
         this.lastIndex = this.itemArr.length - 1;
      }

      return `
      <ul style="transform: translateX(${this.activeIndex}px)" class="carousel-wrapper">
      ${this.itemArr
         .map(
            (item, index) =>
               `
            <li>
              <div>
                <span class="description">${item.description}</span>
                <img style="width: ${itemWidth}vw" class="item" src=${item.URL}/>
              </div>
            </li>
            `,
         )
         .join("")}
      </ul>
      <div class="navigation">
        <button data-direction="prev" class="prev arrow"><</button>
        <ul class="dot-indicator">
          ${fixedArr.map((n, i) => `<button data-index=${i} class="dot"></button>`).join("")}
        </ul>
        <button data-direction="next" class="next arrow">></button>
      </div>
      `;
   }

   addEvent() {
      const prevBtn = this.target.querySelector(".prev");
      const nextBtn = this.target.querySelector(".next");
      const dotBtnList = this.target.querySelectorAll(".dot");

      prevBtn.addEventListener("click", () => {
         this.prev();
      });
      nextBtn.addEventListener("click", () => {
         this.next();
      });

      for (var i = 0; i < dotBtnList.length; i++) {
         dotBtnList[i].addEventListener("click", event => this.onDotClick(event));
      }
      //스와이프 기능
      this.carouselWrapper.addEventListener("touchstart", event => this.touchStart(event));
      this.carouselWrapper.addEventListener("touchend", event => this.touchEnd(event));
      //반응형
      window.addEventListener("resize", () => {
         this.checkIsMobile();
      });
   }

   next() {
      if (this.activeIndex < this.lastIndex) {
         this.activeIndex++;
         this.sliding();
      } else if (this.activeIndex === this.lastIndex) {
         this.activeIndex = 0;
         this.sliding();
      }
   }

   prev() {
      if (this.activeIndex > 0) {
         this.activeIndex--;
         this.sliding();
      } else if (this.activeIndex === 0) {
         this.activeIndex = this.lastIndex;
         this.sliding();
      }
   }

   sliding() {
      this.carouselWrapper.style.transform = `translateX(${-100 * this.activeIndex}%)`;
      this.controlIndicator();
   }

   onDotClick(event) {
      const direction = event.target.dataset.index;

      this.activeIndex = parseInt(direction);
      this.sliding();
   }

   controlIndicator() {
      const dotIndicator = this.target.querySelector(".dot-indicator");
      const dotArr = dotIndicator.children;
      const dotToDelete = this.target.querySelector(".active");

      if (dotToDelete !== null) {
         dotToDelete.className = "dot";
      }

      dotArr[this.activeIndex].className += " active";
   }

   touchStart(event) {
      this.startX = event.changedTouches[0].pageX;
   }

   touchEnd(event) {
      this.endX = event.changedTouches[0].pageX;
      //터치가 끝날때 시작좌표, 끝좌표를 비교해서 방향감지
      if (this.startX > this.endX) {
         this.next();
      } else {
         this.prev();
      }
   }

   checkIsMobile() {
      const currentWidth = window.outerWidth;
      this.carouselContainerWidth = this.target.offsetWidth;
      console.log(this.carouselContainerWidth);
      //초기 실행
      if (currentWidth > 769 && this.currentIsMobile === undefined) {
         //pc
         this.currentIsMobile = false;
         console.log(this.currentIsMobile, "현재 PC상태 입니다.");
      } else if (currentWidth < 769 && this.currentIsMobile === undefined) {
         //mobile
         this.currentIsMobile = true;
         console.log(this.currentIsMobile, "현재 모바일상태 입니다.");
      }

      //변경 감지
      if (currentWidth >= 769) {
         //pc
         this.isMobile = false;
      } else if (currentWidth < 769) {
         //mobile
         this.isMobile = true;
      }

      this.changeDevice();
   }

   changeDevice() {
      if (this.currentIsMobile !== this.isMobile) {
         if (this.isMobile) {
            console.log("모바일로 변환");
            this.currentIsMobile = true;
            this.init();
         } else {
            console.log("PC로 변환");
            this.currentIsMobile = false;
            this.init();
         }
      }
   }
}
