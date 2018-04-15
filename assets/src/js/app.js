import 'babel-polyfill'
import LunchVue from './LunchVue'

$(() => {
  $.event.trigger('page-loaded')
  new LunchVue()
})

$( document ).on('page-loaded lunchvue-loaded', () => {
  $('#preloader').fadeOut(600)
})