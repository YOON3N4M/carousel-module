export default class RollingNumber {
   constructor(el) {
      // elements
      this.el = el
      this.slides = []
      // states
      this.rollingCounts = [2, 5, 10, 15, 22, 25]; // 숫자 자리수별 롤링 횟수
      this.numHeight = 0
      this.isMobile = null

      this.init();
   }

   init() {
      this.setTemplate();
      this.onResize()
      window.addEventListener("resize", () => this.resizeHandler());
   }

   setTemplate() {
      const { headtext, tailtext } = this.el.dataset

      this.el.innerHTML = `
         ${headtext ? `<span class="roll-head-text">${headtext}</span>` : ''}
         ${this.slideListHTML()}
         ${tailtext ? `<span class="roll-tail-text">${tailtext}</span>` : ''}
      `
   }

   slideListHTML() {
      const valueData = this.el.dataset.value;
      //쉼표를 적용한 문자열의 배열
      const replacedValueData = (valueData*1).toLocaleString().split("");
      return replacedValueData.map(this.slideHTML.bind(this)).join("")
   }

   slideHTML(value, idx) {
      // 점, 쉼표 체크
      if(isNaN(value*1)) {
         return `<span class="roll-dot">${value}</span>`
      }
      // 자리수별 롤링 횟수만큼 슬라이드 생성
      const slideNumbers = [value, ...this.randomNumArr(idx)]
      return `
         <div data-value=${value} data-index=${idx} class="roll-slide">
            ${slideNumbers.map(number => (
               `<span class="roll-num">${number}</span>`
            )).join("")}
         </div>
      `
   }

   randomNumArr(idx) {
      const randomNum = () => Math.floor(Math.random() * 10)
      const randomNumArr = new Array(this.rollingCounts[idx])
         .fill(null).map(() => randomNum())

      return randomNumArr
   }

   onResize() {
      this.setStatesAboutDom()
      this.setDomStyle()
      this.setScrollObserver()
   }
   
   setStatesAboutDom() {
      this.slides = [...this.el.querySelectorAll(".roll-slide")]
      this.numHeight = this.el.querySelector(".roll-num").offsetHeight
   }
   
   setDomStyle() {
      this.el.style = `height: ${this.numHeight}px;`
      this.slides.forEach((slide, i) => {
         slide.style = `
            transform: translateY(-${(this.numHeight / ((i+2) * 2))}px);
            transition: none;
         `
      })
   }

   setScrollObserver() {
      const observer = new IntersectionObserver(entry => {
         entry.forEach(entry => {
            if (!entry.isIntersecting) return

            setTimeout(() => {
               this.animate();
               observer.disconnect()
            }, 10);
         });
      });
      observer.observe(this.el);
   }

   resizeHandler() {
      const crrIsMobile = window.innerWidth <= 768
      if (crrIsMobile !== this.isMobile) {
         this.isMobile = crrIsMobile
         this.onResize()
      }
   }

   async animate() {
      this.slides.forEach(slide => {
         slide.style = `transform: translateY(calc(100% - ${this.numHeight}px));`
      })
   }
}