import Component from "../core/Component.js";

export default class NewCarousel extends Component {
  setup() {
    this.state = 0;
    this.arr = ["green", "red", "blue", "orange", "purple"];
  }

  template() {
    return `
    <ul style="transform: translateX(${this.state}px)" class="box-wrapper">
    ${this.arr
      .map((n, i) => `<li><div class=${this.arr[i]}></div></li>`)
      .join("")}
    </ul>
    <button class="increaseIndex"><</button>
    <button class="decreaseIndex">></button>
    <h1>${this.state}</h1>
    `;
  }

  setEvent() {
    const boxQty = this.arr.length - 1;
    const boxWidth = 300;

    this.target
      .querySelector(".increaseIndex")
      .addEventListener("click", () => {
        if (this.state !== 0) {
          this.state = this.state + boxWidth;
          this.target.querySelector(
            ".box-wrapper"
          ).style.transform = `translateX(${this.state}px)`;
        }
      });

    this.target
      .querySelector(".decreaseIndex")
      .addEventListener("click", () => {
        if (this.state !== -boxQty * boxWidth) {
          this.state = this.state - boxWidth;
          this.target.querySelector(
            ".box-wrapper"
          ).style.transform = `translateX(${this.state}px)`;
        } else if (this.state === -boxQty * boxWidth) {
          this.state = 0;
          this.target.querySelector(".box-wrapper").style.transform =
            "translateX(0px)";
        }
      });
  }
}
