import { default as LunchVue } from 'LunchVue'

$(() => {
  $.event.trigger('page-loaded')
})

$( document ).on('page-loaded lunchvue-loaded', () => {
  $('#preloader').fadeOut(600)
})