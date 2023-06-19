import NewCarousel from "./components/NewCarousel.js";
import { hyundai, last, palisade, third } from "./data/data.js";

const test = { a: 123 };

class App {
   constructor() {
      const testCarousel = document.querySelector(".test");

      const testOption = {
         data: last,
         width: testCarousel.dataset.width,
         isResponsive: true,
         deviceOption: { pcSlidesPerView: 3, pcSlidesPerGroup: 2, mobileSlidesPerView: 5, mobileSlidesPerGroup: 2 },
      };

      new NewCarousel(testCarousel, testOption);
   }
}

new App();
