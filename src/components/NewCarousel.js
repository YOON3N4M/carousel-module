export default class NewCarousel {
   constructor(target, option) {
      this.target = target;
      this.immutableItemArr = option.data;
      this.itemArr = option.data;
      this.width = parseInt(option.width);
      this.isResponsive = option.isResponsive;
      //화면 분할 수를 partition으로 표현
      this.pcPartition = option.pcPartition;
      this.mobilePartition = option.mobilePartition;
      this.qtyToSlidePc = option.qtyToSlidePc;
      this.qtyToSlideMobile = option.qtyToSlideMobile;
      this.activeIndex = 0;
      this.lastIndex = this.itemArr.length - 1;
      this.carouselWrapper;
      this.carouselContainer;
      this.startX;
      this.endX;
      this.currentIsMobile;
      this.isMobile;
      this.target.style.maxWidth = this.width;
      this.currentWidth = window.outerWidth;
      this.itemWidth;
      this.dotQtyArr;
      this.isImperfection;
      this.isMobileInit();
      this.init();
   }

   init() {
      this.template();
      this.render();
      this.controlIndicator();
   }

   render() {
      this.target.innerHTML = this.template();
      this.carouselWrapper = this.target.querySelector(".carousel-wrapper");
      this.carouselContainer = this.target.querySelector(".carousel-container");
      this.carouselWrapper.style.width = `${this.width}vw`;
      this.target.style.width = `${this.width}vw`;
      this.addEvent();
   }

   template() {
      //dotQtyArr는 indicator의 인덱스를 위해 선언후 사용

      /* 
      여기서 this.activeIndex를 0으로 초기화 시켜주지 않으면 Mobile 버전에서 
      최대 인덱스까지 옮긴 후 PC버전으로 변경 됐을때 PC버전엔 없는 index라서 에러가 남
      때문에 Mobile, PC 간 전환이 이루어지면 this.activeIndex를 초기화
      */
      this.activeIndex = 0;

      if (this.isMobile) {
         this.itemWidth = this.width / this.mobilePartition;
         if (this.qtyToSlideMobile > 1) {
            const a = this.immutableItemArr.length - (this.mobilePartition - this.qtyToSlideMobile);
            const b = a / this.qtyToSlideMobile;
            const index = Math.ceil(b) - 1;

            this.lastIndex = index;
         } else {
            this.lastIndex = this.immutableItemArr.length - this.mobilePartition * this.qtyToSlideMobile;
         }
      } else {
         this.itemWidth = this.width / this.pcPartition;
         if (this.qtyToSlidePc > 1) {
            const a = this.immutableItemArr.length - (this.pcPartition - this.qtyToSlidePc);
            const b = a / this.qtyToSlidePc;
            const index = Math.ceil(b) - 1;

            this.lastIndex = index;
         } else {
            this.lastIndex = this.immutableItemArr.length - this.pcPartition * this.qtyToSlidePc;
         }
      }
      //dot 갯수
      this.dotQtyArr = this.immutableItemArr.slice(0, this.lastIndex + 1);
      console.log(this.dotQtyArr);
      //this.reconstructionTemplate();

      return `
      <ul style="transform: translateX(${this.activeIndex}px)" class="carousel-wrapper">
      ${this.itemArr
         .map(
            (item, index) =>
               `
            <li>
              <div>
                <span class="description">${item.description}</span>
                <img style="width: ${this.itemWidth}vw" class="item" src=${item.URL}/>
              </div>
            </li>
            `,
         )
         .join("")}
      </ul>
      <div class="navigation">
        <button data-direction="prev" class="prev arrow"><</button>
        <ul class="dot-indicator">
          ${this.dotQtyArr.map((n, i) => `<button data-index=${i} class="dot"></button>`).join("")}
        </ul>
        <button data-direction="next" class="next arrow">></button>
      </div>
      `;
   }

   addEvent() {
      const prevBtn = this.target.querySelector(".prev");
      const nextBtn = this.target.querySelector(".next");
      const dotBtnList = this.target.querySelectorAll(".dot");

      prevBtn.addEventListener("click", () => {
         this.prev();
      });
      nextBtn.addEventListener("click", () => {
         this.next();
      });

      for (var i = 0; i < dotBtnList.length; i++) {
         dotBtnList[i].addEventListener("click", event => this.onDotClick(event));
      }
      //스와이프 기능
      this.carouselWrapper.addEventListener("touchstart", event => this.touchStart(event));
      this.carouselWrapper.addEventListener("touchend", event => this.touchEnd(event));
      //반응형 (PC-mobile 캐러셀 전환)
      window.addEventListener("resize", () => this.onResizing());
   }

   next() {
      if (this.activeIndex < this.lastIndex) {
         this.activeIndex++;
         this.sliding();
      } else if (this.activeIndex === this.lastIndex) {
         this.activeIndex = 0;
         this.sliding();
      }
   }

   prev() {
      if (this.activeIndex > 0) {
         this.activeIndex--;
         this.sliding();
      } else if (this.activeIndex === 0) {
         this.activeIndex = this.lastIndex;
         this.sliding();
      }
   }

   sliding() {
      let slidingX;
      //이부분 qtyToSlide 수정한 거 적용 해야함
      if (this.isMobile) {
         slidingX = (100 / this.mobilePartition) * this.qtyToSlideMobile;
         //아마 여백을 줄이는 로직은 아래와 같을듯. 임시작성
         if (this.qtyToSlideMobile > 1) {
            const a = this.immutableItemArr.length % this.mobilePartition;
            const b = a - (this.mobilePartition - this.qtyToSlideMobile);
            const c = b / this.mobilePartition;
            if (this.activeIndex === 6) {
               console.log(c);
               // slidingX = 66;
            }
            console.log(slidingX);
         }
      } else {
         slidingX = (100 / this.pcPartition) * this.qtyToSlidePc;
      }
      this.carouselWrapper.style.transform = `translateX(${-slidingX * this.activeIndex}%)`;
      this.controlIndicator();
   }

   onDotClick(event) {
      const direction = event.target.dataset.index;

      this.activeIndex = parseInt(direction);
      this.sliding();
   }

   controlIndicator() {
      const dotIndicator = this.target.querySelector(".dot-indicator");
      const dotArr = dotIndicator.children;
      const dotToDelete = this.target.querySelector(".active");

      if (dotToDelete !== null) {
         dotToDelete.classList.remove("active");
      }

      dotArr[this.activeIndex].classList.add("active");
   }

   touchStart(event) {
      this.startX = event.changedTouches[0].pageX;
   }

   touchEnd(event) {
      this.endX = event.changedTouches[0].pageX;
      //터치가 끝날때 시작좌표, 끝좌표를 비교해서 방향감지
      if (this.startX > this.endX) {
         this.next();
      } else {
         this.prev();
      }
   }

   isMobileInit() {
      //크롬 개발자 도구에서 컨트롤 할 수 있는 값 기준
      this.currentWidth = window.outerWidth;

      //초기 실행
      if (this.currentWidth > 769 && this.currentIsMobile === undefined) {
         //pc
         this.currentIsMobile = false;
         this.isMobile = false;
      } else if (this.currentWidth < 769 && this.currentIsMobile === undefined) {
         //mobile
         this.currentIsMobile = true;
         this.isMobile = true;
      }
   }

   onResizing() {
      this.currentWidth = window.outerWidth;
      //리사이징 변경 감지
      if (this.currentWidth >= 769) {
         //pc
         this.isMobile = false;
      } else if (this.currentWidth < 769) {
         //mobile
         this.isMobile = true;
      }
      this.changeDevice();
   }

   changeDevice() {
      if (this.currentIsMobile !== this.isMobile) {
         if (this.isMobile) {
            this.currentIsMobile = true;
            this.init();
         } else {
            this.currentIsMobile = false;
            this.init();
         }
      }
   }
   //브라우저 리사이징으로 기기 전환이 감지 되면 그에 맞는 템플릿으로 재구성
   reconstructionTemplate() {
      if (this.isResponsive && this.isMobile === false) {
         //PC 버전
         //슬라이드의 크기
         this.itemWidth = this.width / this.partition;
         //인덱스
         const dotQty = Math.ceil(this.immutableItemArr.length / this.partition);
         this.dotQtyArr = this.itemArr.slice(0, dotQty);
         //if PC 버전의 슬라이드 갯수를 지정했다면
         if (this.pcSlideQty !== undefined) {
            this.itemArr = this.immutableItemArr.slice(0, this.pcSlideQty);
         }
         //파티션의 갯수가 2이상일때 계산된 숫자(dotQty)로 lastIndex 설정
         if (this.partition > 1) {
            this.lastIndex = this.dotQtyArr.length - 1;
         } else {
            this.lastIndex = this.itemArr.length - 1;
         }
      } else {
         //Mobile 버전
         this.itemWidth = this.width;
         //if Mobile 버전의 슬라이드 갯수를 지정했다면
         if (this.mobileSlideQty !== undefined) {
            this.itemArr = this.immutableItemArr.slice(0, this.mobileSlideQty);
         }
         this.dotQtyArr = this.itemArr;
         this.lastIndex = this.itemArr.length - 1;
      }
   }
}
