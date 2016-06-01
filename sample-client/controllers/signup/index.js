require(['jquery', 'moment'], function ($, moment) {
  document.querySelector('body').innerHTML = 'You are visiting signup page, and signup.js\'s dependencies are loaded, which is jquery and moment';
  $('body').append('<br /><a href="/">To Home</a>');
  $('body').append('<br /><a href="/detail">To Detail Page</a>');
});
