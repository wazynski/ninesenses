'use strict';

var nine = {
  canScroll: true,
  duration: 1000,
  scrollContainer: document.getElementById('scroll'),
  scrollStart: 0,
  pages: document.querySelectorAll(".section"),
  currentPage: 0,
  scrollDirection: null,
  sticky: false
};

/* ==========================================================================
  nine.scrollSpy()
========================================================================== */

nine.scrollSpy = function () {
  var sections = {};
  var i = 0;

  Array.prototype.forEach.call(nine.pages, function (el, i) {
    sections[i] = {
      classes: el.className.replace('section', '').trim(),
      top: el.offsetTop
    };
  });

  nine.scrollContainer.addEventListener('scroll', function (event) {

    var scrollPosition = document.documentElement.scrollTop || nine.scrollContainer.scrollTop;

    for (i in sections) {
      if (sections[i].top <= scrollPosition) {

        // nine.currentPage = i;
        // nine.updateControls();

        // console.log(nine.pages[i]);

        // if (nine.pages[i] !== nine.pages[nine.currentPage]) {
        //   console.log('here');
        //   nine.currentPage = i;
        //   nine.updateControls();
        // }

        // console.log(nine.pages[nine.currentPage]);
        //console.log(sections[i]);

        if (sections[i].classes.includes('light')) {
          nine.changeHeaderClass('dark');
        } else {
          nine.changeHeaderClass('light');
        }
      }
    }
  });
};

/* ==========================================================================
  nine.chnageHeaderClass
   ========================================================================== */

nine.changeHeaderClass = function (className) {
  document.querySelector('.header').setAttribute('class', 'header ' + className);
};

/* ==========================================================================
  nine.animatation()
   ========================================================================== */

nine.animateLoad = function () {
  document.body.className = '';

  window.setTimeout(function () {
    var hidden = document.querySelectorAll(".hide-left");
    Array.prototype.forEach.call(hidden, function (el, i) {
      el.classList.remove('hide-left');
    });

    var hidden = document.querySelectorAll(".hide-down");
    Array.prototype.forEach.call(hidden, function (el, i) {
      el.classList.remove('hide-down');
    });
  }, 1000);
};

/* ==========================================================================
  nine.scrollTo()
  ========================================================================== */

nine.scrollTo = function (startLocation, endLocation) {
  nine.canScroll = false;

  // Calculate how far to scroll
  // var startLocation = viewStart;
  // var endLocation = pageStart;
  var distance = endLocation - startLocation;

  var runAnimation;

  // Set the animation variables to 0/undefined.
  var timeLapsed = 0;
  var percentage, position;

  var easing = function easing(progress) {
    return progress < 0.5 ? 4 * progress * progress * progress : (progress - 1) * (2 * progress - 2) * (2 * progress - 2) + 1; // acceleration until halfway, then deceleration
  };

  function stopAnimationIfRequired(pos) {
    if (pos == endLocation) {
      cancelAnimationFrame(runAnimation);
      nine.finishedScroll();
    }
  }

  var animate = function animate() {
    timeLapsed += 16;
    percentage = timeLapsed / nine.duration;
    if (percentage > 1) {
      percentage = 1;
      position = endLocation;
    } else {
      position = startLocation + distance * easing(percentage);
    }
    nine.scrollContainer.scrollTop = position;
    runAnimation = requestAnimationFrame(animate);
    stopAnimationIfRequired(position);
  };

  // Loop the animation function
  runAnimation = requestAnimationFrame(animate);
};

/* ==========================================================================
  nine.finishedScroll
   ========================================================================== */

nine.finishedScroll = function () {
  console.log('done');
  nine.canScroll = true;
  console.log(nine.canScroll);
  nine.scrollDirection = null;
};

/* ==========================================================================
  nine.scrollHandler()
  ========================================================================== */

// Constructor cannot be ES6 arrow
nine.scrollHandler = function (pageId) {
  var page = document.getElementById(pageId);
  var pageStart = page.offsetTop;
  nine.canScroll = true;
  var timeout = null;

  window.addEventListener('wheel', function (event) {
    nine.scrollStart = nine.scrollContainer.scrollTop;

    // console.log(nine.scrollStart);

    if (timeout !== null) {
      console.log('timout in progress');
      event.preventDefault();
      return false;
    }

    if (nine.canScroll) {
      timeout = setTimeout(function () {
        timeout = null;
      }, nine.duration * 1.5);

      var pageHeight = page.scrollHeight;
      var pageStopPortion = pageHeight / 2;
      var viewHeight = window.innerHeight;

      var viewEnd = nine.scrollStart + viewHeight;
      var pageStartPart = viewEnd - pageStart;
      var pageEndPart = pageStart + pageHeight - nine.scrollStart;

      var canJumpDown = pageStartPart >= 0;
      var stopJumpDown = pageStartPart > pageStopPortion;

      var canJumpUp = pageEndPart >= 0;
      var stopJumpUp = pageEndPart > pageStopPortion;

      var scrollingForward = event.deltaY > 0;

      if (scrollingForward && canJumpDown && !stopJumpDown || !scrollingForward && canJumpUp && !stopJumpUp) {
        event.preventDefault();
        nine.scrollTo(nine.scrollStart, pageStart);
      }
    } else {
      event.preventDefault();
    }
  });
};

/* ==========================================================================
  nine.scrollToPage()
   ========================================================================== */

nine.scrollToPage = function (pageID) {
  // Get current scroll location and where the page starts
  nine.scrollStart = nine.scrollContainer.scrollTop;

  var pageStart;

  if (nine.scrollDirection === "up" && nine.sticky === true) {
    pageStart = document.getElementById(pageID).offsetTop - document.getElementById(pageID).offsetHeight;
  } else {
    pageStart = document.getElementById(pageID).offsetTop;
  }

  nine.scrollTo(nine.scrollStart, pageStart);
};

/* ==========================================================================
  nine.keyboardNav()
   ========================================================================== */

nine.keyboardNav = function () {
  document.onkeydown = function (event) {
    if (!event) {
      event = window.event;
    }

    var code = event.keyCode;

    if (event.charCode && code == 0) {
      code = event.charCode;
    }

    switch (code) {
      case 38:
        // Up
        event.preventDefault();
        nine.prevPage();
        break;
      case 40:
        // Down
        event.preventDefault();
        nine.nextPage();
        break;
    }
  };
};

/* ==========================================================================
  nine.nextPage()
   ========================================================================== */

nine.nextPage = function () {
  if (nine.currentPage + 1 < nine.pages.length && nine.canScroll) {
    nine.scrollDirection = 'down';
    var nextPage = nine.pages[nine.currentPage + 1].id;
    nine.currentPage += 1;

    nine.scrollToPage(nextPage);
    nine.updateControls();
    return true;
  }
  return false;
};

/* ==========================================================================
  nine.prevPage()
   ========================================================================== */

nine.prevPage = function () {
  if (nine.currentPage - 1 >= 0 && nine.canScroll) {
    nine.scrollDirection = 'up';
    var prevPage = nine.pages[nine.currentPage - 1].id;
    nine.currentPage -= 1;

    nine.scrollToPage(prevPage);
    nine.updateControls();
    return true;
  }
  return false;
};

/* ==========================================================================
  nine.controls()
   ========================================================================== */

nine.controls = function () {
  Array.prototype.forEach.call(nine.pages, function (el) {
    document.querySelector('.dots').appendChild(document.createElement('li'));
  });

  document.querySelector('.dots li').classList.add('active');

  document.querySelector('.next').addEventListener('click', function () {
    return nine.nextPage();
  });
  document.querySelector('.prev').addEventListener('click', function () {
    return nine.prevPage();
  });

  nine.updateControls();
};

nine.updateControls = function () {
  document.querySelector('.dots li.active').classList.remove('active');
  document.querySelectorAll('.dots li')[nine.currentPage].classList.add('active');

  document.querySelector('.next').classList.remove('disabled');
  document.querySelector('.prev').classList.remove('disabled');

  if (nine.currentPage == 0) {
    document.querySelector('.prev').classList.add('disabled');
  }

  if (nine.currentPage == nine.pages.length - 1) {
    document.querySelector('.next').classList.add('disabled');
  }
};

nine.checkSticky = function () {
  var el = document.createElement('a'),
      mStyle = el.style;
  mStyle.cssText = "position:sticky;position:-webkit-sticky;position:-ms-sticky;";
  return mStyle.position.indexOf('sticky') !== -1;
};

/* ==========================================================================
  Document Load
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function () {
  nine.scrollSpy();
  nine.sticky = nine.checkSticky();

  // Array.prototype.forEach.call(nine.pages, function(el) {
  //   new nine.scrollHandler(el.id);
  // });

  nine.keyboardNav();
  nine.controls();
});

/* ==========================================================================
  Window Load
   ========================================================================== */

window.onload = function () {
  nine.animateLoad();
};

// TODO: previous button doesnt get height right on last slide

//# sourceMappingURL=main-min.js.map