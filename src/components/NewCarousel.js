import Component from "../core/Component.js";

export default class NewCarousel extends Component {
  setup() {
    this.state = 0;
    this.colorArr = ["green", "red", "blue", "orange", "purple"];
  }

  template() {
    return `
    <ul style="transform: translateX(${this.state}px)" class="box-wrapper">
    ${this.colorArr
      .map((n, i) => `<li><div class=${this.colorArr[i]}></div></li>`)
      .join("")}
    </ul>
    <button data-direction="next" class="arrow"><</button>
    <button  data-direction="prev" class="arrow">></button>
    <h1>${this.state}</h1>
    `;
  }

  setEvent() {
    const lastIndex = this.colorArr.length - 1;
    const boxWidth = 300;
    // 좌로 이동
    this.target.querySelector(".nextIndex").addEventListener("click", () => {
      if (this.state !== 0) {
        this.state = this.state + boxWidth;
        this.target.querySelector(
          ".box-wrapper"
        ).style.transform = `translateX(${this.state}px)`;
      } else if (this.state === 0) {
        this.state = -lastIndex * boxWidth;
        this.target.querySelector(
          ".box-wrapper"
        ).style.transform = `translateX(${-lastIndex * boxWidth}px)`;
      }
    });
    // 우로 이동
    this.target
      .querySelector(".decreaseIndex")
      .addEventListener("click", () => {
        if (this.state !== -lastIndex * boxWidth) {
          this.state = this.state - boxWidth;
          this.target.querySelector(
            ".box-wrapper"
          ).style.transform = `translateX(${this.state}px)`;

          //가장 우측 컨텐츠가 보인 후 첫번째 컨텐츠로 이동
        } else if (this.state === -lastIndex * boxWidth) {
          this.state = 0;
          this.target.querySelector(".box-wrapper").style.transform =
            "translateX(0px)";
        }
      });
  }
}
