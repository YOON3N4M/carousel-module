/** newCaraousel(target, title) */
export default class NewCarousel {
   constructor(target, item, width) {
      this.target = target;
      this.itemArr = item;
      this.width = width;
      this.slidingdX = 0;
      this.activeIndex = 0;
      this.lastIndex = this.itemArr.length - 1;
      this.init();
   }

   init() {
      this.target.style.maxWidth = this.width;
      this.render();
      this.template();
      this.controlIndicator(0);
   }

   render() {
      this.target.innerHTML = this.template();
      this.addEvent();
   }

   template() {
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
         .join('')}
      </ul>
      <div class="navigation">
        <button data-direction="prev" class="prev arrow"><</button>
        <ul class="dot-indicator">
          ${this.itemArr.map(() => `<button class="dot"></button>`).join('')}
        </ul>
        <button data-direction="next" class="next arrow">></button>
      </div>
      `;
   }

   addEvent() {
      const carouselWrapper = this.target.querySelector('.carousel-wrapper');
      const prevBtn = this.target.querySelector('.prev');
      const nextBtn = this.target.querySelector('.next');

      prevBtn.addEventListener('click', () => {
         this.prev(carouselWrapper);
      });
      nextBtn.addEventListener('click', () => {
         this.next(carouselWrapper);
      });
   }

   controlIndicator() {
      const dotIndicator = this.target.querySelector('.dot-indicator');
      const dotArr = dotIndicator.children;
      const dotToDelete = this.target.querySelector('.active');

      if (dotToDelete !== null) {
         dotToDelete.className = 'dot';
      }
      dotArr[this.activeIndex].className += ' active';
   }

   next(carouselWrapper) {
      if (this.activeIndex < this.lastIndex) {
         this.activeIndex++;
         this.sliding(carouselWrapper, -100 * this.activeIndex);
      } else if (this.activeIndex === this.lastIndex) {
         this.activeIndex = 0;
         this.sliding(carouselWrapper, 0);
      }
   }

   prev(carouselWrapper) {
      if (this.activeIndex > 0) {
         this.activeIndex--;
         this.sliding(carouselWrapper, -this.activeIndex * 100);
      } else if (this.activeIndex === 0) {
         this.activeIndex = this.lastIndex;
         this.sliding(carouselWrapper, -this.lastIndex * 100);
      }
   }

   sliding(carouselWrapper, figure) {
      carouselWrapper.style.transform = `translateX(${figure}%)`;
      this.controlIndicator();
   }
}
