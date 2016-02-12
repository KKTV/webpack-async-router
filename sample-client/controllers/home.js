require(['jquery'], function ($) {
  document.querySelector('body').innerHTML = 'You are visiting home page, and home.js\'s dependencies are loaded, which is jquery';

  $('body').append('<br /><a href="/signup">To Signup Page</a>');
  $('body').append('<br /><a href="/detail">To Detail Page</a>');
});
