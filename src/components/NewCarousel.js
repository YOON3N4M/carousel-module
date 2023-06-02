import Component from "../core/Component.js";

export default class NewCarousel extends Component {
  setup() {
    this.state = 0;
    this.arr = [1, 2, 3, 4, 5];
  }

  template() {
    const numArr = this.arr;
    const colorArr = ["green", "red", "blue", "orange", "purple"];
    let index = this.state;
    return `
    <ul style="left:${this.state}" id="slide">
    ${numArr.map((n, i) => `<li><div id=${colorArr[i]}></div></li>`).join("")}
    </ul>
    <button id="left"><</button>
    <button id="right">></button>
    <h1>${this.state}</h1>
    `;
  }

  setEvent() {
    let maxIndex = this.arr.length - 1;
    const boxWidth = 300;

    this.target.querySelector("#left").addEventListener("click", () => {
      if (this.state !== 0) {
        console.log(this.state);
        this.state = this.state + boxWidth;
        this.target.querySelector("#slide").style.left = `${this.state}px`;
      }
    });

    this.target.querySelector("#right").addEventListener("click", () => {
      if (this.state !== -maxIndex * boxWidth) {
        console.log(this.state);
        this.state = this.state - boxWidth;
        this.target.querySelector("#slide").style.left = `${this.state}px`;
      } else if (this.state === -maxIndex * boxWidth) {
        this.state = 0;
        this.target.querySelector("#slide").style.left = "0px";
      }
    });
  }
}
