class CAROUSEL {
  constructor() {
    this.autoDrawingCarousels = []
    this.loadingImageCount = 0
    this.MIN_CAROUSEL_MOVE_DISTANCE = 15
    this.imagesLoadedList = []
    this.carouselItemIndex = []
    this.carouselCurrPosList = new Array()
    this.carouselFirstImageList = new Array()
    this.drawMobileCarouselHandler().then(() => {
      this.fullCarousels = document.querySelectorAll('.full-carousel, .list-carousel')
      this.carousels = document.querySelectorAll(
          '.el-carousel.el-carousel--horizontal, .el-carousel.el-carousel--horizontal.carousel-md'
      )
      if (this.fullCarousels) {
        this.makeCarousel()
        this.onCarouselImageLoad()
      }
    })
  }
  async drawMobileCarouselHandler() {
    this.drawExteriorMobileCarousel()
    this.drawColsPerViewMobileCarousel()
  }
  drawExteriorMobileCarousel() {
    const exteriorContAreas = document.querySelectorAll(`[data-js='carouselInMobile']`)

    for(let i = 0; i < exteriorContAreas.length; i++){
      const exteriorContArea = exteriorContAreas[i],
            exteriorArea = exteriorContArea.parentElement
      // 기본 html삽입
      exteriorArea.querySelector('.mob-carousel').innerHTML = `
        <div class="el-carousel el-carousel--horizontal carousel-md">
          <div class="el-carousel__container inner-box">
            <button type="button" class="el-carousel__arrow el-carousel__arrow--left"><i class="el-icon-arrow-left">
                <span class="sr-only">이전 슬라이드 이동</span>
              </i></button>
            <button type="button" class="el-carousel__arrow el-carousel__arrow--right"><i class="el-icon-arrow-right"><span class="sr-only">다음 슬라이드 이동</span></i></button>
            <div class="el-carousel__wrap">
            </div>
          </div>
        </div>
      `
      const carouselArea = exteriorArea.querySelector('.el-carousel__wrap')
      const images = exteriorArea.querySelectorAll('.exterior-popup .m-img'),
            titles = exteriorArea.querySelectorAll('.exterior-popup .descript strong'),
            textArea = exteriorArea.querySelectorAll('.exterior-popup .descript')
      let contHTML = ''
      // pc용 마크업 내 텍스트 값 캐러셀 아이템 마크업에 각각 삽입 후 적용
      for(let j = 0; j < images.length; j++){
        const active = j === 0 ? ' is-active is-animating' : '',
              desc = textArea[j] ? textArea[j].querySelector('p') : null,
              titleHTML = (titles[j] && titles[j].innerHTML) ? `<strong><span> ${titles[j].innerHTML} </span></strong>` : '',
              descHTML = (desc && desc.innerHTML) ? `<p><span>${desc.innerHTML}</span></p>` : ''
              
        contHTML += ` 
          <div class="el-carousel__item${active}" style="transform: translateX(0px) scale(1);">
            <img src="${images[j].attributes.src.value}" alt="${images[j].alt}" class="m-img">
            <div class="option-title">
              ${ titleHTML }
              ${ descHTML }
            </div>
          </div>
        `
      }
      carouselArea.innerHTML = contHTML
    }
  }
  drawColsPerViewMobileCarousel() {
    // colsPerView-{N1}-{N2}"
    //     : pc에서는 {N1}개씩 mo에서는 {N2}개씩 묶어주는 parent element 삽입 
    const colsPerViewAreas = document.querySelectorAll(`[data-js*='colsPerView']`)
    for(let i = 0; i < colsPerViewAreas.length; i++){
      const colsPerViewArea = colsPerViewAreas[i],
            carouselArea = colsPerViewArea.parentElement.parentElement,
            listCarousel = carouselArea.querySelector('.list-carousel, .full-carousel')
      // 모바일용 마크업 추가.
      carouselArea.innerHTML += listCarousel.outerHTML
      // 각 list carousel에 클래스명 삽입
      const listCarousels = carouselArea.querySelectorAll('.list-carousel, .full-carousel')
      listCarousels[0].classList.add('pc-carousel')
      listCarousels[1].classList.add('mob-carousel')

      // 마크업에 설정해놓은 옵션값
      const getColsPerViewData = (acc, data) => {
        if(data.includes('colsPerView')) acc = data
        return acc
      }
      const colsPerViewData = colsPerViewArea.dataset.js.split(' ').reduce(getColsPerViewData, '').split('-')
      for(const listCarousel of listCarousels){
        const carouselArea = listCarousel.querySelector('.el-carousel__wrap'),
              columns = listCarousel.querySelectorAll('.el-col'),
              isPcCarousel = listCarousel.attributes.class.value.includes('pc-carousel'),
              colsPerView = isPcCarousel ? colsPerViewData[1] : colsPerViewData[2],
              columnClassName = returnColumnClassName(colsPerView),
              slideNum = Math.ceil(columns.length / colsPerView)

        let columnHTMLArr = []        
        for(const column of columns){
          column.attributes.class.value = `el-col ${columnClassName}`
          columnHTMLArr.push(column.outerHTML)
        }        
        
        let carouselItemHTML = '',
            columnHTML = [[]]
        for(let i= 0; i < slideNum; i++){
          const active = i === 0 ? ' is-active is-animating' : ''
          columnHTML[i+1] = []
          for(let j = 0; j < colsPerView; j++){
            const nextColumn = columnHTML[0].length
            if(columns[nextColumn]) {
              columnHTML[0].push(columns[nextColumn].outerHTML)
              columnHTML[i+1].push(columns[nextColumn].outerHTML)
            }
          }
          carouselItemHTML += `
            <div class="el-carousel__item ${active}" style="transform: translateX(0px) scale(1);">
              <div class="el-row">
              ${columnHTML[i+1].join('')}
              </div>
            </div>
          `
        }
        carouselArea.innerHTML = carouselItemHTML
      }
    }
  }
  makeIndicators(carousel){
    const carouselOption = carousel.dataset.js
    if(carouselOption && carouselOption.includes('gallery')) return false

    const slideNum = carousel.querySelectorAll('.el-carousel__item').length

    //slide 갯수만큼 indicator list 마크업 생성
    let indicatorHTML = ''
    for(let i = 0; i < slideNum; i++){
      const active = i === this.carouselItemIndex[carousel.index] ? ' is-active' : ''
      indicatorHTML += `<li role="presentation" class="el-carousel__indicator el-carousel__indicator--horizontal ${active}"><button role="tab" class="el-carousel__button">${i + 1}</button></li>`
    }

    carousel.innerHTML += `      
      <ul role="tablist" class="el-carousel__indicators el-carousel__indicators--horizontal el-carousel__indicators--outside">
        ${indicatorHTML}
      </ul>
    `
  }
  onCarouselImageLoad() {
    for (const carousel of this.carousels) {
      const firstCarouselItem = carousel.querySelector('.el-carousel__item')
      firstCarouselItem.classList.add('is-active')
      const carouselImages = firstCarouselItem.querySelectorAll('img')
      let pcImageFinding = false
      let mobileImageFinding = false
      for (let j = 0; j < carouselImages.length; j++) {
        if (pcImageFinding && mobileImageFinding) {
          break
        }
        if (carouselImages[j].classList.contains('pc-img') && !pcImageFinding) {
          pcImageFinding = true
        } else if (carouselImages[j].classList.contains('m-img') && !mobileImageFinding) {
          mobileImageFinding = true
        } else {
          pcImageFinding = true
          mobileImageFinding = true
        }
        ((loadingImageCount) => {
          carouselImages[j].addEventListener(
              'load',
              (e) => {
                this.carouselImageLoaded(loadingImageCount)
              },
              false
          )
        })(this.loadingImageCount++)
        this.carouselFirstImageList.push(carouselImages[j])
      }
    }

    // this.carouselFirstImageList.forEach((carouselFirstImage, i) => {
    //   if (carouselFirstImage.complete) {
    //     this.carouselImageLoaded(i)
    //   } else {
    //     carouselFirstImage.addEventListener(
    //         'load',
    //         (e) => {
    //           this.carouselImageLoaded(i)
    //         },
    //         false
    //     )
    //   }
    // })
  }

  async carouselImageLoaded(indexOfImages) {
    this.imagesLoadedList[indexOfImages] = true
    this.checkAllImagesLoading().then(() => {
      this.resizeCarouselButtonHeight()
    })
  }

  async checkAllImagesLoading() {
    for (let i = 0; i < this.loadingImageCount; i++) {
      if (this.imagesLoadedList[i] !== 'undefined' || this.imagesLoadedList[i]) {
        return true
      }
    }
  }

  moveCarouselHandler(e, indexOfCarousel, moveDistance) {
    e.stopPropagation()
    this.focusCarouselContainer(indexOfCarousel)
    this.moveCarousel(moveDistance, indexOfCarousel)
    this.resizeCarouselButtonHeight()
  }

  moveCarouselIndicatorHandler(e, indexOfCarousel, moveDistance) {
    e.stopPropagation()
    this.focusCarouselContainer(indexOfCarousel)
    this.moveCarouselIndicator(moveDistance, indexOfCarousel)
    this.resizeCarouselButtonHeight()
  }

  moveCarouselTouchendHandler(e, indexOfCarousel) {
    const pageX = e.changedTouches[0].clientX

    if (Math.abs(this.carouselCurrPosList[indexOfCarousel] - pageX) >= this.MIN_CAROUSEL_MOVE_DISTANCE) {
      if (this.carouselCurrPosList[indexOfCarousel] - pageX > 0) {
        this.moveCarouselHandler(e, indexOfCarousel, 1)
      } else {
        this.moveCarouselHandler(e, indexOfCarousel, -1)
      }
    }
    this.carouselCurrPosList[indexOfCarousel] = e.changedTouches[0].clientX
  }

  makeCarousel() {
    for (let i = 0; i < this.carousels.length; i++) {
      const carousel = this.carousels[i]
      if (carousel) {
        this.carouselItemIndex[i] = 0

        //옵션별 자동 마크업 생성 
        const indicatorsCheck = carousel.querySelector('.el-carousel__indicators')
        !indicatorsCheck && this.makeIndicators(carousel)

        const leftButton = carousel.querySelector('.el-carousel__arrow.el-carousel__arrow--left')
        
        if (leftButton) {
          leftButton.addEventListener(
              'click',
              (e) => this.moveCarouselHandler(e, i, -1),
              false
          )
        }

        const rightButton = carousel.querySelector('.el-carousel__arrow.el-carousel__arrow--right')
        if (rightButton) {
          rightButton.addEventListener(
              'click',
              (e) => this.moveCarouselHandler(e, i, 1),
              false
          )
        }
        if(this.fullCarousels[i]) {
          const indicators = this.fullCarousels[i].querySelectorAll('.el-carousel__indicators li')
          for (let j = 0; j < indicators.length; j++) {
            if (indicators[j]) {
              indicators[j].addEventListener(
                  'click',
                  (e) => this.moveCarouselIndicatorHandler(e, i, j),
                  false
              )
            }
          }
        }
        const carouselContainer = carousel.querySelector('.el-carousel__container')
        carouselContainer.addEventListener('touchstart', (e) => {
          // e.preventDefault()
          this.carouselCurrPosList[i] = e.touches[0].clientX
          carouselContainer.addEventListener(
              'touchmove',
              (e) => {
                // add image animation
              },
              false
          )
        }, false)
        carouselContainer.addEventListener(
            'touchend',
            (e) => this.moveCarouselTouchendHandler(e, i),
            false)
        this.showCarousel(0, i)
      }
    }
  }

  focusCarouselContainer(indexOfCurrentCarousel) {
    const currentCarousel = this.carousels[indexOfCurrentCarousel]
    currentCarousel.focus()
  }

  showCarousel(n, indexOfCurrentCarousel) {
    const currentCarousel = this.carousels[indexOfCurrentCarousel]
    const carouselItems = currentCarousel.querySelectorAll(
        '.el-carousel__item, el-carousel__item.is-active.is-animating'
    )
    const beforeCarouselItemIndex = this.carouselItemIndex[indexOfCurrentCarousel]
    let afterCarouselItemIndex = this.carouselItemIndex[indexOfCurrentCarousel] + n
    if (afterCarouselItemIndex > carouselItems.length - 1) {
      afterCarouselItemIndex = 0
    } else if (afterCarouselItemIndex < 0) {
      afterCarouselItemIndex = carouselItems.length - 1
    }
    this.carouselItemIndex[indexOfCurrentCarousel] = afterCarouselItemIndex
    carouselItems[beforeCarouselItemIndex].classList.remove('is-active')
    carouselItems[beforeCarouselItemIndex].classList.remove('is-animating')

    carouselItems[afterCarouselItemIndex].classList.add('is-active')
    carouselItems[afterCarouselItemIndex].classList.add('is-animating')

    const carouselIndicatorList = currentCarousel.querySelectorAll(
        'li.el-carousel__indicator.el-carousel__indicator--horizontal.is-active, li.el-carousel__indicator.el-carousel__indicator--horizontal'
    )
    if (carouselIndicatorList.length > 0) {
      carouselIndicatorList[beforeCarouselItemIndex].classList.remove('is-active')
      carouselIndicatorList[afterCarouselItemIndex].classList.add('is-active')
    }

    const carouselOptionTitles = currentCarousel.querySelectorAll('.option-title')
    if (carouselOptionTitles.length > 0) {
      carouselOptionTitles[beforeCarouselItemIndex].classList.remove('is-active')
      carouselOptionTitles[afterCarouselItemIndex].classList.add('is-active')
    }
  }

  moveCarousel(n, indexOfCurrentCarousel) {
    this.showCarousel(n, indexOfCurrentCarousel)
  }

  moveCarouselIndicator(n, indexOfCurrentCarousel) {
    const beforeCarouselItemIndex = this.carouselItemIndex[indexOfCurrentCarousel]
    this.showCarousel(n - beforeCarouselItemIndex, indexOfCurrentCarousel)
  }

  resizeCarouselButtonHeight() {
    for (let i = 0; i < this.carousels.length; i++) {
      const carousel = this.carousels[i]
      if (carousel) {
        const activeCarouselItem = carousel.querySelector('.el-carousel__item.is-active')
        const activeCarouselItemThumb = activeCarouselItem.querySelector('.thumb')
        const carouselItemThumb = activeCarouselItem.querySelector('.thumb.carousel_thumb')
        if (activeCarouselItemThumb && !carouselItemThumb) {
          continue
        }
        const tempHeight = 10
        const activeCarouselItemOffsetHeight = activeCarouselItem.offsetHeight + tempHeight
        carousel.querySelector('.el-carousel__container').style.height = activeCarouselItemOffsetHeight + 'px'
        if (this.fullCarousels[i] && this.fullCarousels[i].classList.contains('mob-carousel')) {
          const arrowButtons = carousel.querySelectorAll('button.el-carousel__arrow')
          const carouselImages = activeCarouselItem.querySelectorAll('img:not(.pc-img)')
          if (carouselImages[0]) {
            const imageOffsetHeight = carouselImages[0].offsetHeight
            // console.log('imageOffsetHeight :: ' + imageOffsetHeight)
            const positionTop = imageOffsetHeight / 2 + 'px'
            for (let j = 0; j < arrowButtons.length; j++) {
              arrowButtons[j].style.top = positionTop
            }
          }
        }
      }
    }
  }

  removeEventListeners() {
    if(!this.carousels) return false
    for (let i = 0; i < this.carousels.length; i++) {
      const carousel = this.carousels[i]
      if (carousel) {
        const leftButton = carousel.querySelector('.el-carousel__arrow.el-carousel__arrow--left')
        const rightButton = carousel.querySelector('.el-carousel__arrow.el-carousel__arrow--right')
        if (leftButton) {
          leftButton.removeEventListener(
              'click',
              (e) => this.moveCarouselHandler(e, i, -1),
              false
          )
        }

        if (rightButton) {
          rightButton.removeEventListener(
              'click',
              (e) => this.moveCarouselHandler(e, i, 1),
              false
          )
        }
        if(this.fullCarousels[i]) {
          const indicators = this.fullCarousels[i].querySelectorAll('.el-carousel__indicators li')
          for (let j = 0; j < indicators.length; j++) {
            if (indicators[j]) {
              indicators[j].removeEventListener(
                  'click',
                  (e) => this.moveCarouselIndicatorHandler(),
                  false
              )
            }
          }
        }
        const carouselContainer = carousel.querySelector('.el-carousel__container')
        carouselContainer.removeEventListener('touchstart', (e) => {
          // e.preventDefault()
          this.carouselCurrPosList[i] = e.touches[0].clientX
          carouselContainer.addEventListener(
              'touchmove',
              (e) => {
                // add image animation
              },
              false
          )
        }, false)
        carouselContainer.removeEventListener(
            'touchend',
            (e) => this.moveCarouselTouchendHandler(e, i),
            false)
      }
    }
    this.carouselFirstImageList.forEach((carouselFirstImage, i) => {
      carouselFirstImage.removeEventListener(
          'load',
          (e) => {
            this.carouselImageLoaded(i)
          },
          false
      )
    })
  }
}
function returnColumnClassName(colsPerView){  
  let colName = null
  switch (Number(colsPerView)) {
    case 1:
      colName = null
      break
    case 2:
      colName = 'el-col-12'
      break
    case 3:
      colName = 'el-col-8'
      break
    case 4:
      colName = 'el-col-6'
      break
    case 6:
      colName = 'el-col-4'
      break
  }
  return colName
}
export default CAROUSEL
