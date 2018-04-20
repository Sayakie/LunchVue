/**
 * LunchVue Client Library v0.1.16 (https://github.com/Kurosnape/LunchVue)
 * Copyright 2018 LunchVue Authors
 * Licensed under MIT (https://github.com/Kurosnape/LunchVue/blob/master/LICENSE)
 */
class LunchVue {
  constructor() {
    this.initVariables()
    this.bindEvents()
  }

  /**
   * 런치뷰에서 사용할 모든 변수를 초기화합니다.
   * DOM을 다룰 변수는 앞에 $를 붙입니다.
   */
  initVariables() {
    this.date = new Date()
    this.time = this.date.getHours() <= 8 ? 'breakfast' : this.date.getHours() >= 9 && this.date.getHours() <= 14 ? 'lunch' : 'dinner'
    this.temp = {}
    this.temp.time = this.time
    this.temp.date = this.date
    this.meals = {}
    this.meals.current = null
    this.meals.next = null
    this.schoolId = null
    this.schoolName = null
    this.schoolDomain = null
    this.haveSchoolId = false
    this.haveSchoolMeals = false
    this.checkStorage()

    this.$header = $('.header-title h1')
    this.$schoolName = $('.footer-title .title')
    this.$schoolDate = $('.footer-meta .date')
    this.$prevBtn = $('.footer-meta .prev')
    this.$nextBtn = $('.footer-meta .next')
    this.$searchForm = $('#searchForm')
    this.$searchSchoolInput = $('#searchSchoolInput')
    this.$searchResult = $('#searchResult')
    this.$dateForm = $('#dateForm')
    this.$selectDateInput = $('#selectDateInput')
    this.$mealResult = $('#mealResult')
    this.$device = $('#device')
    this.$result = $('#mealResult')

    this.$list = $('.nav li')
    $(`.nav li[data-type=${ this.time }]`).addClass('active')  // better UX

    if (this.haveSchoolMeals && this.haveSchoolId) {
      this.$device.css('display', 'flex')
      this.$schoolName.html(this.schoolName)
      this.$schoolDate.html(this.calcDate(this.date))
      this.printMeals()
    } else if (this.haveSchoolId) {
      const query = {
        code: this.schoolId,
        name: this.schoolName,
        domain: this.schoolDomain
      }

      this.setSchoolAndFetchMeals(query)
    } else {
      this.appendSearchModal()
    }
  }

  /**
   * 클라이언트 로컬 저장소에 학교 코드, 이름, 도메인 그리고 이번 달 식단이 있는지 확인합니다.
   */
  checkStorage() {
    if (!!localStorage[`schoolId`]) {
      this.haveSchoolId = true
      this.schoolId = localStorage[`schoolId`]
      this.schoolName = localStorage[`schoolName`]
      this.schoolDomain = localStorage[`schoolDomain`]

      if (!!localStorage[`schoolMeals_${this.schoolId}_${this.zeroFill(this.date.getMonth() + 1)}`]) {
        this.haveSchoolMeals = true
        this.meals.current = JSON.parse(localStorage[`schoolMeals_${this.schoolId}_${this.zeroFill(this.date.getMonth() + 1)}`])
      }
    }
  }

  /**
   * 학교를 설정하고 서버에서 식단을 가져옵니다.
   * 
   * @param {object} query - 학교 코드와 이름, 도메인을 포함한 JSON 오브젝트
   */
  setSchoolAndFetchMeals(query) {
    this.schoolId = localStorage[`schoolId`] = query.code
    this.schoolName = localStorage[`schoolName`] = query.name
    this.schoolDomain = localStorage[`schoolDomain`] = query.domain
    this.$searchForm.modal('hide')
    this.fetch({
      domain: this.schoolDomain,
      code: this.schoolId
    }).done((data) => {
      localStorage[`schoolMeals_${this.schoolId}_${this.zeroFill(this.date.getMonth() + 1)}`] = JSON.stringify(data)
      this.initVariables()
      $( document ).trigger('preload-end')  // 지우지 마세요.
    })
  }

  /**
   * 서버에서 급식 식단표를 가져옵니다.
   * 
   * @param {object} options - 가져올 식단의 도메인과 학교 코드
   */
  fetch(options) {
    return $.ajax({
      type: 'POST',
      url: '/fetch',
      dataType: 'JSON',
      contentType: 'application/json',
      data: JSON.stringify(options),
      fail: () => {
        this.displayAlert('error', '서버와의 연결이 실패했습니다. 식단을 가져올 수 없습니다.')
      },
      always: () => {
        $( document ).trigger('preload-end')
      }
    })
  }

  /**
   * 학교 검색창을 띄웁니다. 입력창과 결과창의 내용을 지우고,
   * 검색할 학교를 바로 입력할 수 있도록 입력창에 포커싱을 합니다.
   */
  appendSearchModal() {
    this.$searchForm.modal('show')
    this.$searchSchoolInput.val('')
    this.$searchResult.html('')

    // FIXED. 검색창이 페이드-인 애니메이션 도중에는 포커싱이 되지 않으므로
    // 시간을 두고 포커싱을 합니다.
    setTimeout(() => {
      this.$searchSchoolInput.focus()
    }, 800)
  }

  /**
   * 날짜 선택창을 띄웁니다.
   */
  appendDateModal() {
    const form = `${ this.date.getFullYear() }-${ this.zeroFill(this.date.getMonth() + 1, 2) }`
    this.$selectDateInput.attr('min', `${ form }-01`)
    this.$selectDateInput.attr('max', `${ form }-${ new Date(this.date.getFullYear(), this.date.getMonth() + 1, 0).getDate() }`)
    this.$dateForm.modal('show')
  }

  /**
   * 검색폼을 서버에 전송합니다. 검색할 창과 동일한 전국의
   * 모든 학교 이름과 주소, 코드를 반환합니다.
   * 
   * @class LunchVue
   * @method searchSubmit
   */
  searchSubmit() {
    const similarySchoolName = this.$searchSchoolInput.val()

    $.ajax({
      type: 'GET',
      url: `/find/${similarySchoolName}`,
      dataType: 'JSON',
      success: (data) => {
        this.printSchoolList(data)
      },
      error: () => {
        this.displayAlert('error', '서버와 연결할 수 없습니다.')
      }
    })
  }

  /**
   * 학교 목록을 출력합니다.
   * 
   * @class LunchVue
   * @method printSchoolList
   * @param {object} data
   */
  printSchoolList(data) {
    const schoolList = []

    data.map(fragment => {
      fragment.map(pieces => {
        schoolList.push(
          `<li data-school=${JSON.stringify({code: pieces.code, name: pieces.name, domain: pieces.domain})}>
            <h1>${pieces.name}</h1>
            <p>${pieces.address}</p>
          </li>`
        )
      })
    })

    this.$searchResult.html(schoolList)
  }

  /**
   * 파싱되거나 저장소에서 불러온 식단을 출력합니다.
   * 
   * @class LunchVue
   * @method printMeals
   */
  printMeals(date = this.date.getDate() - 1, time = $('.nav li.active').data('type')) {
    const meals = !!this.meals.current[date][time]['food'] ? this.meals.current[date][time]['food'].join('<br>') : "식단이 없어요."

    this.$result.html(meals)
  }

  /**
   * 조식, 중식, 석식 메뉴를 다시 그립니다.
   */
  repaintNav($selector) {
    //const $selector = $(selector)

    this.$list.removeClass('active')
    $selector.addClass('active')
    this.printMeals(this.date.getDate() - 1, $selector.data('type'))
  }

  /**
   * 
   */
  automaticRepaintNav() {
    const $finder = $('.nav li.active').next()

    if (!$finder.length) {
      this.$list.removeClass('active')
      $(`.nav li[data-type='breakfast']`).addClass('active')
      this.$nextBtn.click()
    }

    this.repaintNav($finder)
  }

  /**
   * 날짜를 계산하는 함수 헬퍼입니다.
   * 
   * @class LunchVue
   * @method calcDate
   * @param {object} date - UTC 날짜
   * @return {string} 계산된 날짜를 변환합니다.
   * @example "2018. 04. 16"
   */
  calcDate(date) {
    return `${date.getFullYear()}. ${this.zeroFill(date.getMonth() + 1, 2)}. ${this.zeroFill(date.getDate(), 2)}`
  }

  /**
   * 여백을 채워주는 함수 헬퍼입니다.
   * 
   * @class LunchVue
   * @method zeroFill
   * @param {number} number - 앞에 여백으로 채울 숫자
   * @param {number} pad - 채울 칸 수
   * @return {numberic?} 
   * @example zeroFill(72, 4) returns "0072"
   */
  zeroFill(number, pad = 2) {
    const proxy = '0'.repeat(pad - 1)
    return (proxy + number).substr(-pad)
  }

  /**
   * 메시지를 표시합니다. 디버그 모드에서는 로그도 출력합니다.
   * 
   * @class LunchVue
   * @method displayAlert
   * @param {string} type - 출력할 타입
   * @param {string} message - 표시할 메시지
   */
  displayAlert(type, message) {
    console.log(message)
  }

  /**
   * 요소의 이벤트를 바인딩합니다.
   * 
   * @class LunchVue
   * @method bindEvents
   */
  bindEvents() {
    // Hacks for execute functions
    const _this = this

    this.$searchForm.bind('submit', (e) => {
      this.searchSubmit()
      e.preventDefault()
    })

    this.$header.bind('click', () => {
      this.appendSearchModal()
    })

    this.$schoolName.bind('click', () => {
      this.appendSearchModal()
    })

    this.$schoolDate.bind('click', () => {
      this.appendDateModal()
    })

    this.$prevBtn.bind('click', () => {
      this.temp.date.setDate(this.temp.date.getDate() - 1)
      this.$schoolDate.html(this.calcDate(this.date))
      this.printMeals(this.temp.date.getDate() - 1)
    })

    this.$nextBtn.bind('click', () => {
      this.temp.date.setDate(this.temp.date.getDate() + 1)
      this.$schoolDate.html(this.calcDate(this.date))
      this.printMeals(this.temp.date.getDate() - 1)
    })

    $('.nav li').bind('click', function() {
      $('.nav li').removeClass('active')
      $(this).addClass('active')
      _this.printMeals(_this.date.getDate() - 1, $(this).data('type'))
    })

    $( document ).bind('keydown', (e) => {
      let $finder = null

      switch (e.keyCode) {
        case 9:  // 탭 키
          // Too many bugs exists
          // this.automaticRepaintNav()
          break
        case 27:  // 엔터 키
          this.appendSearchModal()
          break
        case 38:  // Arrow up 키
          this.$nextBtn.click()
          break
        case 40:  // Arrow down 키
          this.$prevBtn.click()
          break
        case 37:  // Arrow left 키
          $finder = $('.nav li.active').prev()

          if (!$finder.length) {
            return
          }

          this.repaintNav($finder)
          break
        case 39:  // Arrow right 키
          $finder = $('.nav li.active').next()

          if (!$finder.length) {
            return
          }
          
          this.repaintNav($finder)
          break
        default:
          break
      }
    })

    // 동적으로 생성된 엘리먼트는 이와 같은 방법으로 바인딩해야 합니다.
    // 수정하지 마세요 ─ * DO NOT TOUCH IT *
    $( document ).on('click', '#searchResult li', function() {
      $( document ).trigger('preload-begin')
      _this.setSchoolAndFetchMeals($(this).data('school'))
    })
  }
}

export default LunchVue