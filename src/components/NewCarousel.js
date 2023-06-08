/** newCaraousel(target, title) */
export default class NewCarousel {
   constructor(target, item, width) {
      this.target = target;
      this.itemArr = item;
      this.width = width;
      this.slidingdX = 0;
      this.activeIndex = 0;
      this.lastIndex = this.itemArr.length - 1;
      this.carouselWrapper;
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
      this.addEvent();
      this.carouselWrapper = this.target.querySelector(".carousel-wrapper");
   }

   template() {
      console.log(this.width);
      return `
      <ul style="transform: translateX(${this.slidingdX}px)" class="carousel-wrapper">
      ${this.itemArr
         .map(
            (item, index) =>
               `
            <li>
              <div>
                <span class="description">${item.description}</span>
                <img style="width: ${this.width}" class="item" src=${item.URL}/>
              </div>
            </li>
            `,
         )
         .join("")}
      </ul>
      <div class="navigation">
        <button data-direction="prev" class="prev arrow"><</button>
        <ul class="dot-indicator">
          ${this.itemArr.map((n, i) => `<button data-index=${i} class="dot"></button>`).join("")}
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
   }

   next() {
      if (this.activeIndex < this.lastIndex) {
         this.activeIndex++;
         this.sliding(-100 * this.activeIndex);
      } else if (this.activeIndex === this.lastIndex) {
         this.activeIndex = 0;
         this.sliding(0);
      }
   }

   prev() {
      if (this.activeIndex > 0) {
         this.activeIndex--;
         this.sliding(-this.activeIndex * 100);
      } else if (this.activeIndex === 0) {
         this.activeIndex = this.lastIndex;
         this.sliding(-this.lastIndex * 100);
      }
   }

   onDotClick(event) {
      const direction = event.target.dataset.index;
      this.activeIndex = parseInt(direction);
      this.sliding(-direction * 100);
   }

   sliding(figure) {
      this.carouselWrapper.style.transform = `translateX(${figure}%)`;
      this.controlIndicator();
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
}
