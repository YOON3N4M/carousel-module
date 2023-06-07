import NewCarousel from "./components/NewCarousel.js";
import { hyundai, palisade } from "./data/data.js";

class App {
  constructor() {
    const hyundaiCarousel = document.querySelector(".hyundai");
    const palisadeCarousel = document.querySelector(".palisade");

    new NewCarousel(hyundaiCarousel, hyundai);
    new NewCarousel(palisadeCarousel, palisade);
  }
}

new App();
