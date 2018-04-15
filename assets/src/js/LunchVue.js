/**
 * LunchVue Client Library v0.1.10 (https://github.com/Kurosnape/LunchVue/)
 * Copyright 2018 LunchVue Authors
 * Licensed under MIT (https://github.com/Kurosnape/LunchVue/blob/master/LICENSE)
 */
class LunchVue {
  constructor() {
    this.initVariables()
    this.loadVariables()
    this.isHaveStorage()
    this.loadAddition()
    this.bindEvents()
  }

  /**
   * Initialize the variables.
   * 
   * @class LunchVue
   * @method initVariables
   */
  initVariables() {
    this.schoolId = null
    this.schoolName = null
    this.meals = null
    this.now = null
    this.date = null
    this.$device = null
    this.$school = null
    this.$date = null
    this.$searchSchool = null
    this.haveStorage = false
  }

  /**
   * Insert the values in the initialized variables.
   * 
   * @class LunchVue
   * @method loadVariables
   */
  loadVariables() {
    this.now = new Date()
    this.$header = $('.header-title')
    this.$device = $('footer')
    this.$school = $('.footer-title .title')
    this.$date = $('.footer-meta .date')
    this.$searchSchool = $('#searchSchool')
    this.$searchSchoolFocusing = $('#schoolName')
    this.$searchResult = $('#searchResult')
    this.$resultList = $('.school-list')
  }

  /**
   * Initiate additional functions, variables.
   * 
   * @class LunchVue
   * @method loadAddition
   */
  loadAddition() {
    if (this.haveStorage) {
      this.schoolId = localStorage.schoolId
      this.schoolName = localStorage.schoolName
      this.meals = JSON.parse(localStorage.meals)

      this.$device.css('display', 'flex')
      this.$school.html(this.schoolName)
      this.$date.html(`${this.now.getFullYear()}. ${this.now.getMonth() + 1}. ${this.now.getDate()}`)
      this.drawTable()
      $(document).trigger('preload-end')
    } else {
      this.appendSearchModal()
    }
  }

  /**
   * Verify that the storage has a value.
   * 
   * @class LunchVue
   * @method isHaveStorage
   */
  isHaveStorage() {
    if (!!localStorage.isHave) {
      this.haveStorage = true
    } else {
      this.haveStorage = false
    }
  }

  /**
   * Append the school search form.
   * 
   * @class LunchVue
   * @method appendSearchModal
   */
  appendSearchModal() {
    this.$searchSchool.modal('show')
    this.$searchSchoolFocusing.val('').focus()
    this.$searchResult.html('')
  }

  /**
   * Apeend school lists.
   * 
   * @class LunchVue
   * @method drawSchoolList
   * @param {data} object - A bundle of school objects to show
   */
  drawSchoolList(data) {
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
   * Draw school meals table.
   * 
   * @class LunchVue
   * @method drawTable
   */
  drawTable(date = this.now.getDate() - 1) {
    const now = this.now.getHours() <= 8 ? 'breakfast' : this.now.getHours() >= 9 && this.now.getHours() <= 14 ? 'lunch' : 'dinner'
    $('#result').html(!!this.meals[date][now]['food'] ? this.meals[date][now]['food'] : "식단이 없어요.")
  }

  /**
   * Set school
   * 
   * @class LunchVue
   * @method setSchool
   * @param {query} object - The JSON object, including school code and name
   */
  setSchool(query) {
    localStorage.isHave = true
    localStorage.schoolId = query.code
    localStorage.schoolName = query.name
    localStorage.schoolDomain = query.domain
    this.haveStorage = true
    this.$searchSchool.modal('hide')
    this.getMeals()
  }

  /**
   * Get meals
   * 
   * @class LunchVue
   * @method getMeals
   */
  getMeals() {
    $.ajax({
      type: 'POST',
      url: `/get`,
      dataType: 'JSON',
      contentType: 'application/json',
      data: JSON.stringify({
        domain: localStorage.schoolDomain,
        code: localStorage.schoolId
      }),
      success: (data) => {
        localStorage.meals = JSON.stringify(data)
      },
      complete: () => {
        this.loadAddition()
      },
      error: () => {
        this.displayAlert('error', '서버와 연결을 실패했습니다. 식단을 가져올 수 없습니다.')
      }
    })
  }

  /**
   * 
   * 
   * @class LunchVue
   * @method displayAlert
   */
  displayAlert(type, message) {
    if (type === 'error') {
      console.error(message)
    } else {
      console.log(message)
    }
  }

  /**
   * Bind the events.
   * 
   * @class LunchVue
   * @method bindEvents
   */
  bindEvents() {
    const self = this
    this.$searchSchool.bind('submit', (e) => {
      const school = this.$searchSchoolFocusing.val()
      this.$searchResult.html('<p>불러오는 중입니다. 잠시만 기다려주세요!</p>').show()

      $.ajax({
        type: 'GET',
        url: `/find/${school}`,
        dataType: 'JSON',
        success: (data) => {
          this.drawSchoolList(data)
        },
        error: () => {
          this.$searchResult.html('<p>서버와 연결할 수 없습니다.</p>').show().fadeOut( 1200 )
        }
      })
      e.preventDefault()
    })
    this.$header.bind('click', () => {
      this.appendSearchModal()
    })
    this.$school.bind('click', () => {
      this.appendSearchModal()
    })

    // The dynamically created elements bind events in a different way.
    $(document).on('click', '#searchResult li', function() {
      const data = $(this).data('school')
      self.setSchool(data)
      $(document).trigger('preload-begin')
    })
  }
}

export default LunchVue