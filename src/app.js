import NewCarousel from "./components/NewCarousel.js";
import { hyundai, last, palisade, third } from "./data/data.js";

const test = { a: 123 };

class App {
   constructor() {
      const hyundaiCarousel = document.querySelector(".hyundai");
      const palisadeCarousel = document.querySelector(".palisade");
      const thirdCarousel = document.querySelector(".third");
      const lastCarousel = document.querySelector(".last");
      const testCarousel = document.querySelector(".test");

      const hyundaiOption = {
         data: third,
         width: thirdCarousel.dataset.width,
         isResponsive: true,
         pcPartition: 2,
         qtyToSlidePc: 2,
         mobilePartition: 1,
         qtyToSlideMobile: 1,
      };

      const palisadeOption = {
         data: third,
         width: thirdCarousel.dataset.width,
         isResponsive: true,
         pcPartition: 5,
         mobilePartition: 3,
         qtyToSlide: 1,
      };

      const lastOption = {
         data: last,
         width: lastCarousel.dataset.width,
         isResponsive: true,
         pcPartition: 5,
         qtyToSlidePc: 1,
         mobilePartition: 4,
         qtyToSlideMobile: 2,
      };

      const testOption = {
         data: last,
         width: testCarousel.dataset.width,
         isResponsive: true,
         pcPartition: 5,
         qtyToSlidePc: 3,
         mobilePartition: 6,
         qtyToSlideMobile: 2,
      };
      /*NEwCarousel(타겟, 데이터, html의width값, 반응형 분할 여부, 파티션 갯수,pc 슬라이드 갯수(optional),모바일 슬라이드 갯수(optional))*/
      // new NewCarousel(hyundaiCarousel, hyundaiOption);
      //new NewCarousel(palisadeCarousel, palisade, palisadeCarousel.dataset.width, false, 1);

      // new NewCarousel(lastCarousel, lastOption);
      new NewCarousel(testCarousel, testOption);
      console.log(last.length);
   }
}

new App();
