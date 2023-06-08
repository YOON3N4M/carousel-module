import NewCarousel from "./components/NewCarousel.js";
import { hyundai, palisade } from "./data/data.js";

class App {
   constructor() {
      const hyundaiCarousel = document.querySelector(".hyundai");
      const palisadeCarousel = document.querySelector(".palisade");

      new NewCarousel(hyundaiCarousel, hyundai, hyundaiCarousel.dataset.width, true);
      new NewCarousel(palisadeCarousel, palisade, palisadeCarousel.dataset.width, false);
   }
}

new App();
