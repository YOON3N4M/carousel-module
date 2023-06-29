import NewCarousel from "./components/NewCarousel.js";
import OverlayImage from "./components/OverlayImage.js";
import RollingNumber from "./components/RollingNumber.js";
import { hyundai, last, palisade, third } from "./data/data.js";

const test = { a: 123 };

class App {
   constructor() {
      const testCarousel = document.querySelector(".test");
      const overlayImage = document.querySelector(".overlay-image-container");
      const rollingNumberContainer = document.querySelector(".rolling-number-container");

      const testOption = {
         data: last,
         width: testCarousel.dataset.width,
         isResponsive: true,
         deviceOption: { pcSlidesPerView: 4, pcSlidesPerGroup: 3, mobileSlidesPerView: 5, mobileSlidesPerGroup: 4 },
      };

      //  new NewCarousel(testCarousel, testOption);
      new OverlayImage(overlayImage);
      new RollingNumber(rollingNumberContainer, 321958601);
   }
}

new App();
