import NewCarousel from "./components/NewCarousel.js";
import { hyundai, palisade, third } from "./data/data.js";

class App {
   constructor() {
      const hyundaiCarousel = document.querySelector(".hyundai");
      const palisadeCarousel = document.querySelector(".palisade");
      const thirdCarousel = document.querySelector(".third");
      //NEwCarousel(타겟, 데이터, html의width값, 화면 분할 유무, 파티션 갯수,pc 슬라이드 갯수,모바일 슬라이드 갯수 )
      new NewCarousel(hyundaiCarousel, hyundai, hyundaiCarousel.dataset.width, true, 2);
      //new NewCarousel(palisadeCarousel, palisade, palisadeCarousel.dataset.width, false, 1);
      new NewCarousel(thirdCarousel, third, thirdCarousel.dataset.width, true, 1, 5, 3);
   }
}

new App();
