export default class NewCarousel {
   constructor(target, option) {
      this.target = target;
      this.option = option;
      this.dataArr = this.option.data;
      this.containerWidth = parseInt(this.option.width);
      this.isResponsive = this.option.isResponsive;
      this.slidesPerView;
      this.slidesPerGroup;
      this.activeIndex = 0;
      this.lastIndex = this.dataArr.length - 1;
      this.slideWrapper;
      this.carouselContainer;
      this.startX;
      this.endX;
      this.currentIsMobile;
      this.isMobile;
      this.target.style.maxWidth = this.containerWidth;
      this.currentWidth = window.outerWidth;
      this.slideWidth;
      this.dotArr;
      this.deviceInit();
      this.setLastIndex();
      this.init();
   }

   init() {
      this.activeIndex = 0;
      this.template();
      this.render();
      this.controlIndicator();
   }

   render() {
      this.target.innerHTML = this.template();
      this.slideWrapper = this.target.querySelector(".slide-wrapper");
      this.carouselContainer = this.target.querySelector(".carousel-container");
      this.slideWrapper.style.width = `${this.containerWidth}vw`;
      this.target.style.width = `${this.containerWidth}vw`;
      this.addEvent();
   }

   template() {
      this.slideWidth = this.containerWidth / this.slidesPerView;

      /*현재 사용하지 않는 메소드 주석처리
      this.reconstructionTemplate();*/

      const dotButtons = this.dotArr.map((n, i) => `<button data-index=${i} class="dot"></button>`).join("");
      const slideItems = this.dataArr
         .map(
            item =>
               `
         <li>
           <div>
             <span class="description">${item.description}</span>
             <img style="width: ${this.slideWidth}vw" class="item" src=${item.URL}/>
           </div>
         </li>
         `,
         )
         .join("");

      return `
      <ul style="transform: translateX(${this.activeIndex}px)" class="slide-wrapper">
      ${slideItems}
      </ul>
     
      <div class="navigation">
        <button data-direction="prev" class="prev arrow"><</button>
        <ul class="dot-indicator">
         ${dotButtons}
        </ul>
        <button data-direction="next" class="next arrow">></button>
      </div>
      `;
   }

   setLastIndex() {
      if (this.slidesPerGroup > 1) {
         // 전체 사진 개수 - (보여지는 이미지 개수 - 한번에 이동할 이미지 개수) = 이동에 실제 필요한 사진 개수...(?)
         const a = this.dataArr.length - (this.slidesPerView - this.slidesPerGroup);
         // 이동에 필요한 이미지 개수 / 한번에 이동할 이미지 개수
         const b = a / this.slidesPerGroup;
         // 소수점을 일단 반 올림 한 뒤 -1
         const index = Math.ceil(b) - 1;

         this.lastIndex = index;
      } else {
         this.lastIndex = this.dataArr.length - this.slidesPerView * this.slidesPerGroup;
      }

      //dot 갯수
      this.dotArr = this.dataArr.slice(0, this.lastIndex + 1);
   }

   addEvent() {
      const prevBtn = this.target.querySelector(".prev");
      const nextBtn = this.target.querySelector(".next");
      const dotBtnList = this.target.querySelectorAll(".dot");

      prevBtn.addEventListener("click", () => this.prev());
      nextBtn.addEventListener("click", () => this.next());

      for (var i = 0; i < dotBtnList.length; i++) {
         dotBtnList[i].addEventListener("click", event => this.onDotClick(event));
      }
      //스와이프 기능
      this.slideWrapper.addEventListener("touchstart", event => this.touchStart(event));
      this.slideWrapper.addEventListener("touchend", event => this.touchEnd(event));
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
      const emptyImages = this.calculateEmptyImages();

      slidingX = (100 / this.slidesPerView) * this.slidesPerGroup;

      if (this.slidesPerGroup > 1 && emptyImages > 0) {
         if (this.activeIndex === this.lastIndex) {
            const a = slidingX;
            const b = slidingX * (this.activeIndex - 1); //마지막 인덱스 전 -x 값
            const c = b + a * (emptyImages / this.slidesPerGroup);

            slidingX = c / this.lastIndex;
         }
      }

      this.slideWrapper.style.transform = `translateX(${-slidingX * this.activeIndex}%)`;
      this.controlIndicator();
   }

   calculateEmptyImages() {
      const x = this.dataArr.length;
      const y = this.slidesPerView;
      const z = this.slidesPerGroup;
      //마지막 인덱스에서 비는 이미지의 개수 = n, 0이면 빈 이미지가 없는 완전한 슬라이드 뷰
      const n = (y - (x % z)) % z;

      return n;
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

   deviceInit() {
      //크롬 개발자 도구에서 컨트롤 할 수 있는 값 기준
      this.currentWidth = window.outerWidth;

      //초기 실행
      if (this.currentWidth > 769 && this.currentIsMobile === undefined) {
         //pc
         this.currentIsMobile = false;
         this.isMobile = false;
         this.setDeviceOption();
      } else if (this.currentWidth < 769 && this.currentIsMobile === undefined) {
         //mobile
         this.currentIsMobile = true;
         this.isMobile = true;
         this.setDeviceOption();
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

      if (this.currentIsMobile !== this.isMobile) {
         this.changeDevice();
      }
   }

   changeDevice() {
      if (this.isMobile) {
         this.currentIsMobile = true;
         this.setDeviceOption();
         this.init();
      } else {
         this.currentIsMobile = false;
         this.setDeviceOption();
         this.init();
      }
   }

   setDeviceOption() {
      if (this.isMobile) {
         this.slidesPerGroup = this.option.deviceOption.mobileSlidesPerGroup;
         this.slidesPerView = this.option.deviceOption.mobileSlidesPerView;
      } else {
         this.slidesPerGroup = this.option.deviceOption.pcSlidesPerGroup;
         this.slidesPerView = this.option.deviceOption.pcSlidesPerView;
      }
   }
   /* 브라우저 리사이징으로 기기 전환이 감지 되면 그에 맞는 템플릿으로 재구성
   reconstructionTemplate() {
      if (this.isResponsive && this.isMobile === false) {
         //PC 버전
         //슬라이드의 크기
         this.slideWidth = this.containerWidth / this.partition;
         //인덱스
         const dotQty = Math.ceil(this.dataArr.length / this.partition);
         this.dotArr = this.dataArr.slice(0, dotQty);
         //if PC 버전의 슬라이드 갯수를 지정했다면
         if (this.pcSlideQty !== undefined) {
            this.dataArr = this.dataArr.slice(0, this.pcSlideQty);
         }
         //파티션의 갯수가 2이상일때 계산된 숫자(dotQty)로 lastIndex 설정
         if (this.partition > 1) {
            this.lastIndex = this.dotArr.length - 1;
         } else {
            this.lastIndex = this.dataArr.length - 1;
         }
      } else {
         //Mobile 버전
         this.slideWidth = this.containerWidth;
         //if Mobile 버전의 슬라이드 갯수를 지정했다면
         if (this.mobileSlideQty !== undefined) {
            this.dataArr = this.dataArr.slice(0, this.mobileSlideQty);
         }
         this.dotArr = this.dataArr;
         this.lastIndex = this.dataArr.length - 1;
      }
   }
   */
}
