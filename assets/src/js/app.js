$(() => {
  $.event.trigger('page-loaded')
})

$( document ).on('page-loaded', () => {
  $('#preloader').addClass('loaded').delay(600).hide()
})