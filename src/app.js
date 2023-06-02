import NewCarousel from "./components/NewCarousel.js";

class App {
  constructor() {
    const app = document.querySelector("#carousel-container");

    new NewCarousel(app);
  }
}

new App();
