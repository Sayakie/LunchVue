import 'babel-polyfill'
import LunchVue from './LunchVue'

$(() => {
  'use strict'
  $(document).trigger('page-loaded')
  new LunchVue()
})

$( document )
  .on('preload-begin', () => {
    $('#preloader').show()
  })
  .on('page-loaded', () => {
    $('#preloader').fadeOut(1200)
  })
  .on('preload-end', () => {
    $('#preloader').delay(400).fadeOut(1000)
  })