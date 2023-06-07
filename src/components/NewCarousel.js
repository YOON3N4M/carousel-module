export default class NewCarousel {
  constructor(target) {
    this.target = target;
    this.slidingdX = 0;
    this.itemArr = [
      {
        URL: "https://www.hyundai.com/static/images/model/sonata/23fl/mo/sonata_the_edge_highlights_design_m.jpg",
        description: "Design",
      },
      {
        URL: "https://www.hyundai.com/static/images/model/sonata/23fl/mo/sonata_the_edge_highlights_space_m.jpg",
        description: "space",
      },
      {
        URL: "https://www.hyundai.com/static/images/model/sonata/23fl/mo/sonata_the_edge_highlights_performance_m.jpg",
        description: "performance",
      },
      {
        URL: "https://www.hyundai.com/static/images/model/sonata/23fl/mo/sonata_the_edge_highlights_sonata_the_edge_m.jpg",
        description: "SONATA The Edge",
      },
      {
        URL: "https://www.hyundai.com/static/images/model/sonata/23fl/mo/sonata_the_edge_highlights_n_line_m.jpg",
        description: "N Line",
      },
    ];
    this.activeIndex = 0;
    this.lastIndex = this.itemArr.length - 1;
    this.activeDot = 0;
    this.render();
    this.template();
    this.controlIndicator(0);
  }

  template() {
    return `
    <ul style="transform: translateX(${
      this.slidingdX
    }px)" class="carousel-wrapper">
    ${this.itemArr
      .map(
        (item, index) =>
          `<li><div><sspan class="description">${item.description}</sspan><img class="item" src=${item.URL}/></div></li>`
      )
      .join("")}
    </ul>
    <div class="navigation">
    <button data-direction="prev" class="prev"><</button>
    <ul class="dot-indicator">
    ${this.itemArr.map(() => `<div class="dot"></div>`).join("")}
    </ul>
    <button data-direction="next" class="next">></button>
    </div>
   
   
 

    `;
  }

  render() {
    this.target.innerHTML = this.template();
    this.addEvent();
  }

  controlIndicator(direction) {
    const dotIndicator = this.target.querySelector(".dot-indicator");
    //배열 dotArr에 불필요한 첫번째, 마지막 요소가 존재함. 그러므로 사용할 인덱스는 1부터  this.lastIndex까지
    const fixedActiveDot = direction + 1;
    const dotArr = dotIndicator.childNodes;
    const dotToDelete = this.target.querySelector(".active");

    if (dotToDelete !== null) {
      dotToDelete.className = "dot";
    }

    dotArr[fixedActiveDot].className += " active";
  }

  next(carouselWrapper) {
    if (this.activeIndex < this.lastIndex) {
      this.activeIndex++;
      carouselWrapper.style.transform = `translateX(-${
        100 * this.activeIndex
      }%)`;
      this.activeDot++;
    } else if (this.activeIndex === this.lastIndex) {
      this.activeIndex = 0;
      this.activeDot = 0;
      carouselWrapper.style.transform = `translateX(0%)`;
    }

    this.controlIndicator(this.activeDot);
  }

  prev(carouselWrapper) {
    if (this.activeIndex > 0) {
      this.activeIndex--;
      carouselWrapper.style.transform = `translateX(${
        -this.activeIndex * 100
      }%)`;
      this.activeDot--;
    } else if (this.activeIndex === 0) {
      this.activeIndex = this.lastIndex;
      this.activeDot = this.lastIndex;
      carouselWrapper.style.transform = `translateX(${-this.lastIndex * 100}%)`;
    }

    this.controlIndicator(this.activeDot);
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
