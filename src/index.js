const init = () => {
  const imageContainers = document.querySelectorAll('.project-image-container');
  const viewportHeight = document.documentElement.clientHeight;

  imageContainers.forEach(imageContainer => {

    const imagePosY = imageContainer.offsetTop;

    if(imagePosY > viewportHeight) {
      imageContainer.classList.add('animated');

      let waypointHandler = new Waypoint({
        element: imageContainer,
        offset: '80%',
        handler: () => {
          imageContainer.classList.add('shown');
          waypointHandler.destroy();
        }
      });
    }
  });

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
      navigator.serviceWorker.register('/sw.js').then(function(registration) {
        // Registration was successful
        console.log('ServiceWorker registration successful with scope: ', registration.scope);
      }, function(err) {
        // registration failed :(
        console.log('ServiceWorker registration failed: ', err);
      });
    });
  }

}

const viewMoreProjects = function() {
  document.querySelector('.view-more').style.display = 'none';
  document.querySelector('.more-projects').classList.add('expand');
}

const navigateTo = function(id) {
  const fromTop = document.getElementById(id).offsetTop;
  const OFFSET = 50;
  scrollToY(fromTop - OFFSET, 300);
  return false;
}

const scrollToY = (scrollTargetY = 0, speed = 400) => {
  let scrollY = window.scrollY || document.documentElement.scrollTop,
    currentTime = 0,
    time = Math.max(.1, Math.min(Math.abs(scrollY - scrollTargetY) / speed, .8));

  const tick = () => {
    currentTime += 1 / 60;
    var p = currentTime / time;
    var t = Math.sin(p * (Math.PI / 2));

    if (p < 1) {
        window.requestAnimationFrame(tick);
        window.scrollTo(0, scrollY + ((scrollTargetY - scrollY) * t));
    } else {
        window.scrollTo(0, scrollTargetY);
    }
  }

  tick();
}

init();