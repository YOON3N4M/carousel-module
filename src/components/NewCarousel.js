export default class NewCarousel {
  constructor(target) {
    this.target = target;
    this.slidingdX = 0;
    this.colorArr = ["green", "red", "blue", "orange", "purple"];
    this.activeIndex = 0;
    this.lastIndex = this.colorArr.length - 1;
    this.render();
    this.template();
  }

  template() {
    return `
    <ul style="transform: translateX(${
      this.slidingdX
    }px)" class="carousel-wrapper">
    ${this.colorArr
      .map((n, i) => `<li><div class=${this.colorArr[i]}></div></li>`)
      .join("")}
    </ul>
    <button data-direction="prev" class="prev"><</button>
    <button data-direction="next" class="next">></button>
    `;
  }

  render() {
    this.target.innerHTML = this.template();
    this.addEvent();
  }

  next(carouselWrapper) {
    if (this.activeIndex < this.lastIndex) {
      this.activeIndex++;
      console.log(this.activeIndex);
      carouselWrapper.style.transform = `translateX(-${
        100 * this.activeIndex
      }%)`;
    } else if (this.activeIndex === this.lastIndex) {
      this.activeIndex = 0;
      carouselWrapper.style.transform = `translateX(0%)`;
    }
    console.log(this.activeIndex, "rightClick");
  }

  prev(carouselWrapper) {
    if (this.activeIndex > 0) {
      this.activeIndex--;
      carouselWrapper.style.transform = `translateX(${
        -this.activeIndex * 100
      }%)`;
    } else if (this.activeIndex === 0) {
      this.activeIndex = this.lastIndex;
      carouselWrapper.style.transform = `translateX(${-this.lastIndex * 100}%)`;
    }
  }

  addEvent() {
    const carouselWrapper = this.target.querySelector(".carousel-wrapper");
    const prevBtn = this.target.querySelector(".prev");
    const nextBtn = this.target.querySelector(".next");

    prevBtn.addEventListener("click", () => {
      this.prev(carouselWrapper);
    });
    nextBtn.addEventListener("click", () => {
      this.next(carouselWrapper);
    });
  }
}
