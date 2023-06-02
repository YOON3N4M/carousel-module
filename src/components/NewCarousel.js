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
    <ul id="slide"  style="left:${index}px">
    ${numArr.map((n, i) => `<li><div id=${colorArr[i]}></div></li>`).join("")}
    </ul>
    <button id="left"><</button>
    <button id="right">></button>
    `;
  }

  setEvent() {
    let index = this.state;
    let maxIndex = this.arr.length - 1;
    const boxWidth = 300;
    this.target.querySelector("#right").addEventListener("click", () => {
      if (index !== -maxIndex * boxWidth) {
        this.setState(index - boxWidth);
      }
    });
    this.target.querySelector("#left").addEventListener("click", () => {
      if (index !== 0) {
        this.setState(index + boxWidth);
      }
    });
  }
}
