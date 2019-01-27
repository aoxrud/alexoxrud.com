'use strict';

var init = function init() {
  var imageContainers = document.querySelectorAll('.project-image-container');
  var viewportHeight = document.documentElement.clientHeight;

  imageContainers.forEach(function (imageContainer) {

    var imagePosY = imageContainer.offsetTop;

    if (imagePosY > viewportHeight) {
      imageContainer.classList.add('animated');

      var waypointHandler = new Waypoint({
        element: imageContainer,
        offset: '80%',
        handler: function handler() {
          imageContainer.classList.add('shown');
          waypointHandler.destroy();
        }
      });
    }
  });

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('/sw.js').then(function (registration) {
        // Registration was successful
        console.log('ServiceWorker registration successful with scope: ', registration.scope);
      }, function (err) {
        // registration failed :(
        console.log('ServiceWorker registration failed: ', err);
      });
    });
  }
};

var viewMoreProjects = function viewMoreProjects() {
  document.querySelector('.view-more').style.display = 'none';
  document.querySelector('.more-projects').classList.add('expand');
};

var navigateTo = function navigateTo(id) {
  var fromTop = document.getElementById(id).offsetTop;
  var OFFSET = 50;
  scrollToY(fromTop - OFFSET, 300);
  return false;
};

var scrollToY = function scrollToY() {
  var scrollTargetY = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
  var speed = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 400;

  var scrollY = window.scrollY || document.documentElement.scrollTop,
      currentTime = 0,
      time = Math.max(.1, Math.min(Math.abs(scrollY - scrollTargetY) / speed, .8));

  var tick = function tick() {
    currentTime += 1 / 60;
    var p = currentTime / time;
    var t = Math.sin(p * (Math.PI / 2));

    if (p < 1) {
      window.requestAnimationFrame(tick);
      window.scrollTo(0, scrollY + (scrollTargetY - scrollY) * t);
    } else {
      window.scrollTo(0, scrollTargetY);
    }
  };

  tick();
};

init();