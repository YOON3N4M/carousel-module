import NewCarousel from "./components/NewCarousel.js";
import OverlayImage from "./components/OverlayImage.js";
import { hyundai, last, palisade, third } from "./data/data.js";

const test = { a: 123 };

class App {
   constructor() {
      const testCarousel = document.querySelector(".test");
      const overlayImage = document.querySelector(".overlay-image-container");

      const testOption = {
         data: last,
         width: testCarousel.dataset.width,
         isResponsive: true,
         deviceOption: { pcSlidesPerView: 4, pcSlidesPerGroup: 3, mobileSlidesPerView: 5, mobileSlidesPerGroup: 4 },
      };

      //  new NewCarousel(testCarousel, testOption);
      new OverlayImage(overlayImage);
   }
}

new App();
