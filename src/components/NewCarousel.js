export default class NewCarousel {
   constructor(target, option) {
      this.target = target;
      this.option = option;
      this.immutableItemArr = this.option.data;
      this.itemArr = this.option.data;
      this.width = parseInt(this.option.width);
      this.isResponsive = this.option.isResponsive;
      //화면 분할 수를 partition으로 표현 / 이동하는 이미지 수를 slideCount로 표현
      this.partition;
      this.slideCount;
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
      this.itemWidth = this.width / this.partition;

      if (this.slideCount > 1) {
         // 전체 사진 개수 - (보여지는 이미지 개수 - 한번에 이동할 이미지 개수) = 이동에 실제 필요한 사진 개수...(?)
         const a = this.immutableItemArr.length - (this.partition - this.slideCount);
         // 이동에 필요한 이미지 개수 / 한번에 이동할 이미지 개수
         const b = a / this.slideCount;
         // 소수점을 일단 반 올림 한 뒤 -1
         const index = Math.ceil(b) - 1;

         this.lastIndex = index;
      } else {
         this.lastIndex = this.immutableItemArr.length - this.partition * this.slideCount;
      }

      //dot 갯수
      this.dotQtyArr = this.immutableItemArr.slice(0, this.lastIndex + 1);

      /*현재 사용하지 않는 메소드 주석처리
      this.reconstructionTemplate();*/

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

      prevBtn.addEventListener("click", () => this.prev());
      nextBtn.addEventListener("click", () => this.next());

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
      const emptyImages = this.calculateIsEmpty();

      slidingX = (100 / this.partition) * this.slideCount;
      //아마 여백을 줄이는 로직은 아래와 같을듯. 임시작성

      if (this.slideCount > 1 && emptyImages > 0) {
         if (this.activeIndex === this.lastIndex) {
            const a = slidingX;
            const b = slidingX * (this.activeIndex - 1); //마지막 인덱스 전 -x 값
            const c = b + a * (emptyImages / this.slideCount);
            console.log(emptyImages);
            slidingX = c / this.lastIndex;
         }
      }

      this.carouselWrapper.style.transform = `translateX(${-slidingX * this.activeIndex}%)`;
      this.controlIndicator();
   }

   calculateIsEmpty() {
      const x = this.immutableItemArr.length;
      const y = this.partition;
      const z = this.slideCount;
      //마지막 인덱스에서 비는 이미지의 개수 = n, 0이면 비지 않는 완전한 이미지
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
      console.log(dotArr);
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
         this.slideCount = this.option.deviceOption.pcSlideCount;
         this.partition = this.option.deviceOption.pcPartition;
      } else if (this.currentWidth < 769 && this.currentIsMobile === undefined) {
         //mobile
         this.currentIsMobile = true;
         this.isMobile = true;
         this.slideCount = this.option.deviceOption.mobileSlideCount;
         this.partition = this.option.deviceOption.mobilePartition;
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
            this.slideCount = this.option.deviceOption.mobileSlideCount;
            this.partition = this.option.deviceOption.mobilePartition;
            this.init();
         } else {
            this.currentIsMobile = false;
            this.slideCount = this.option.deviceOption.pcSlideCount;
            this.partition = this.option.deviceOption.pcPartition;
            this.init();
         }
      }
   }

   /* 브라우저 리사이징으로 기기 전환이 감지 되면 그에 맞는 템플릿으로 재구성
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
   */
}
