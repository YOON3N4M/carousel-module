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
      this.startX;
      this.endX;
      this.init();
   }

   init() {
      this.target.style.maxWidth = this.width;
      this.render();
      this.template();
      this.controlIndicator();
   }

   render() {
      this.target.innerHTML = this.template();
      this.carouselWrapper = this.target.querySelector(".carousel-wrapper");
      this.addEvent();
   }

   template() {
      const browserWidth = document.body.scrollWidth;
      const carouselContainerWidth = this.target.offsetWidth;
      let itemWidth;
      let fixedArr;

      if (this.isResponsive && browserWidth >= 769) {
         itemWidth = carouselContainerWidth / this.partition;
         const dotQty = Math.ceil(this.itemArr.length / this.partition);
         fixedArr = this.itemArr.slice(0, dotQty);
         this.lastIndex = fixedArr.length - 1;
      } else {
         itemWidth = carouselContainerWidth;
         fixedArr = this.itemArr;
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
                <img style="width: ${itemWidth}px" class="item" src=${item.URL}/>
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
}
