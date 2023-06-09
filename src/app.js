import NewCarousel from "./components/NewCarousel.js";
import { hyundai, palisade } from "./data/data.js";

class App {
   constructor() {
      const hyundaiCarousel = document.querySelector(".hyundai");
      const palisadeCarousel = document.querySelector(".palisade");
      //NEwCarousel(타겟, 데이터, html의width값, 화면 분할 유무, 파티션 갯수 )
      new NewCarousel(hyundaiCarousel, hyundai, hyundaiCarousel.dataset.width, true, 2);
      new NewCarousel(palisadeCarousel, palisade, palisadeCarousel.dataset.width, false, 1);
   }
}

new App();
