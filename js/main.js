/* ==========================================================================
  Namespace
   ========================================================================== */

const nine = {
  fullscreen: false,
  currentPageIndex: null,
  currentPage: null,
  canScroll: true,
  scrollDuration: 750,
  scrollContainer: document.getElementById('fullpage'),
  pages: document.querySelectorAll('.section'),
  scrollDirection: null,
  prevTime: new Date().getTime(),
  scrollHistory: [],
  fullScreenWidthEnableFrom: 768,
  fullScreenHeightEnableFrom: 928,
  supports3d: false,
  isTouchDevice: navigator.userAgent.match(/(iPhone|iPod|iPad|Android|playbook|silk|BlackBerry|BB10|Windows Phone|Tizen|Bada|webOS|IEMobile|Opera Mini)/),
  isTouch: (('ontouchstart' in window) || (navigator.msMaxTouchPoints > 0) || (navigator.maxTouchPoints)),
  touchStartY: 0,
  touchEndY: 0
};

/* ==========================================================================
  Support Checks & Enablers
   ========================================================================== */

/**
* support3d - Checks for browser support of 3d transforms
*
* @returns {boolean}
*
* http://stackoverflow.com/questions/5661671/detecting-transform-translate3d-support
*/
nine.support3d = () => {
  const el = document.createElement('p');
  let has3d;
  const transforms = {
    webkitTransform: '-webkit-transform',
    OTransform: '-o-transform',
    msTransform: '-ms-transform',
    MozTransform: '-moz-transform',
    transform: 'transform'
  };

  // Add it to the body to get the computed style.
  document.body.insertBefore(el, null);

  for (const t in transforms) {
    if (el.style[t] !== undefined) {
      el.style[t] = 'translate3d(1px,1px,1px)';
      has3d = window.getComputedStyle(el).getPropertyValue(transforms[t]);
    }
  }

  document.body.removeChild(el);

  return (has3d !== undefined && has3d.length > 0 && has3d !== 'none');
};

/**
 * checkFullscreen - Checks if window height is greater than any section.
 *
 * @returns {boolean}
 */
nine.checkFullscreen = () => {
  // let fullscreen = true;
  //
  // // Remove any exisiting translates as this will affect height.
  // nine.scrollContainer.removeAttribute('style');
  // document.querySelector('.portrait').removeAttribute('style');
  //
  // const windowHeight = nine.windowSize().h;
  // const windowWidth = nine.windowSize().w;
  //
  // if (windowWidth >= nine.fullScreenEnableFrom) {
  //   // If any section is longer the window height disable fullscreen
  //   nine.pages.forEach(el => {
  //     if (el.offsetHeight > windowHeight) {
  //       fullscreen = false;
  //     }
  //   });
  // } else {
  //   fullscreen = false;
  // }
  //
  // return fullscreen;
  //
  //
  const windowHeight = nine.windowSize().h;
  const windowWidth = nine.windowSize().w;

  document.querySelector('.dim').innerHTML = windowWidth + ' ' + windowHeight;
  console.log(windowWidth + ' ' + windowHeight);

  if (windowHeight >= nine.fullScreenHeightEnableFrom && windowWidth >= nine.fullScreenWidthEnableFrom) {
    return true;
  }

  return false;
};

/**
 * enableFullscreen - Adds CSS classes required for fullscreen supports3
 */
nine.enableFullscreen = () => {
  if (nine.checkFullscreen()) {
    nine.fullscreen = true;
    nine.addClass(document.body, 'fullscreen');

    if (nine.supports3d === false) {
      nine.addClass(document.body, 'no-css3');
    }

    const windowHeight = nine.windowSize().h + 'px';

    nine.pages.forEach(el => {
      console.log(el);
      // nine.css(el, {
      //   height: windowHeight
      // });

      el.style.height = windowHeight;

      console.log(el);
    });
  } else {
    nine.fullscreen = false;
    nine.removeClass(document.body, 'fullscreen');
    nine.removeClass(document.body, 'no-css3');
  }
};

/* ==========================================================================
  Animations
   ========================================================================== */

/**
 * changeHeaderClass - Replaces current header classes with new className
 *                     for color chnage animation
 * @param {String} className Name of class to be added to header element
 */
nine.changeHeaderClass = className => {
  document.querySelector('.header').setAttribute('class', `header ${className}`);
};

/**
 * [animateLoad description]
 * @returns {[type]}
 */
nine.animateLoad = () => {
  window.setTimeout(() => {
    document.body.classList.add('faded-in');
    nine.masonaryHeight();

    window.setTimeout(() => {
      let hidden = document.querySelectorAll('.hide-left');
      Array.prototype.forEach.call(hidden, el => {
        el.classList.remove('hide-left');
      });

      hidden = document.querySelectorAll('.hide-right');
      Array.prototype.forEach.call(hidden, el => {
        el.classList.remove('hide-right');
      });

      hidden = document.querySelectorAll('.background-hide');
      Array.prototype.forEach.call(hidden, el => {
        el.classList.remove('background-hide');
      });
    }, 1000);
  }, 1000);
};

// nine.animatePortrait = () => {
//   const portrait = document.querySelector('.portrait .faded');
//
//   if (portrait) {
//     nine.scrollContainer.addEventListener('scroll', () => {
//       nine.portraitChange();
//     });
//   }
// };
//
// nine.portraitChange = () => {
//   const page = document.getElementById('about');
//   let offsetTop = page.offsetTop;
//   let startPoint = 0.98;
//
//   const portrait = document.querySelector('.portrait .faded');
//   const scrollPosition = document.documentElement.scrollTop || nine.scrollContainer.scrollTop;
//
//   if (nine.windowSize().w > 1280) {
//     startPoint = 0.5;
//   } else if (nine.windowSize().w < 1024) {
//     offsetTop = page.offsetHeight + document.getElementById('intro').offsetHeight - portrait.offsetHeight;
//   }
//
//   if (scrollPosition > offsetTop * startPoint) {
//     if (portrait.style.opacity === 0) {
//       portrait.style.opacity = 1;
//     }
//   } else if (portrait.style.opacity === 1) {
//     portrait.style.opacity = 0;
//   }
// };

/**
 * pageTransisition - Chnages background color, fades out body and redirects to href
 * @param {String} href
 * @param {String} bg Background color
 */
nine.pageTransisition = (href, bg) => {
  if (!bg) {
    bg = '#E6E6E4';
  }

  document.body.style.backgroundColor = bg;
  document.body.classList.add('faded-out');

  setTimeout(() => {
    window.location.href = href;
  }, 600);
};

/**
 * animateLinks - Gets all anchor elements and adds a call to pageTransisition() on click
 */
nine.animateLinks = () => {
  const anchorElements = document.getElementsByTagName('a');
  Array.prototype.forEach.call(anchorElements, el => {
    el.onclick = () => {
      nine.pageTransisition(this.href, el.getAttribute('data-bg'));
      return false;
    };
  });
};

/**
 * masonaryHeight - Calculates the correct height of the masonary element
 *                  for flex-box based masonary
 */
nine.masonaryHeight = () => {
  const masonary = document.querySelector('.masonary');
  let lheight = 0;
  let rheight = 0;

  if (masonary) {
    if (nine.windowSize().w >= 1024) {
      const lblocks = document.querySelectorAll('.block.left');
      const rblocks = document.querySelectorAll('.block.right');

      Array.prototype.forEach.call(lblocks, el => {
        lheight += el.offsetHeight;
      });

      Array.prototype.forEach.call(rblocks, el => {
        rheight += el.offsetHeight;
      });

      let height;

      if (lheight >= rheight) {
        height = lheight;
      } else {
        height = rheight + 200;
      }

      height += 1;
      masonary.style.height = height + 'px';
    } else {
      masonary.style.height = 'auto';
    }
  }
};

/* ==========================================================================
  Fullscreen
   ========================================================================== */

/**
 * fullscreenMode - Setups fullscreen slideshow
 * @param   {Boolean} debounced Has be called after being debounced?
 */
nine.fullscreenMode = debounced => {
  if (nine.checkFullscreen() && nine.fullscreen === false) {
    nine.enableFullscreen();
    nine.hashChangeLisener();
    nine.addFullscreenNav();
    nine.addKeyboardNav();
    nine.addScrollInput();
    nine.setCurrentPage();
    nine.detectswipe('fullpage', nine.handleSwipe);
  } else if (nine.checkFullscreen() === false && nine.fullscreen === true) { // Used to be on but now can't be so disable
    nine.enableFullscreen(); // Will toggle off due to failing test
    nine.removeFullscreenNav();
    nine.removeKeyboardNav();
    nine.removeScrollInput();
  }

  if (debounced) {
    nine.resetPosition();
  } else {
    const fullscreenModeDebounced = nine.debounce(() => {
      nine.fullscreenMode(true);
    }, 250);
    window.addEventListener('resize', fullscreenModeDebounced);
  }
};

/* ==========================================================================
   Scrolling
   ========================================================================== */

/**
 * setCurrentPage - Based on hash sets the fullscreen slideshow to the correct page.
 */
nine.setCurrentPage = () => {
  const section = nine.getHash();

  if (section) {
    const element = document.getElementById(section);

    if (element) {
      nine.updateCurrent(element);
      nine.scrollStart(element); // Simulate start of scroll to set all calsses correctly.
      nine.scrollToSection(element.id, 0); // Make sure we are definley at the correct section.
    }
  } else {
    nine.updateCurrent(document.querySelectorAll('.section')[0]);
  }
};

/**
 * updateHash - Adds a hash to url
 * @param {String} url The value the hash should be updated to.
 */
nine.updateHash = url => {
  window.location.hash = url;
};

/**
 * hashChangeLisener - Adds event listeners for hash change calling hashChangeHandler()
 */
nine.hashChangeLisener = () => {
  if (document.addEventListener) {
    window.addEventListener('hashchange', nine.hashChangeHandler, false); // IE9, Chrome, Safari, Oper
  } else {
    window.attachEvent('onhashchange', nine.hashChangeHandler); // IE 6/7/8
  }
};

/**
 * hashChangeHandler - Processes hash changes
 */
nine.hashChangeHandler = () => {
  const section = nine.getHash();

  if (section && section !== nine.currentPage) {
    nine.scrollToSection(section);
  }
};

/**
 * scrollToSection - Scorlls slideshow to the section
 * @param {String}  elementId Id of the element to be scrolled to
 */
nine.scrollToSection = (elementId, duration) => {
  const element = document.getElementById(elementId);

  if (element === null) {
    return;
  }

  if (duration === null || duration === undefined) {
    duration = nine.scrollDuration;
  }

  const newIndex = nine.getSectionIndex(element);

  if (newIndex > nine.currentPageIndex) {
    nine.scrollDirection = 'down';
  } else if (newIndex < nine.currentPageIndex) {
    nine.scrollDirection = 'up';
  }

  const destiny = element.offsetTop;

  if (nine.supports3d) {
    nine.translateScroll(destiny, element, duration);
  } else {
    nine.animateScroll(destiny, element, duration);
  }
};

/**
 * translateScroll - Scroll Page using CSS3 transform and translate
 * @param {Integer} endLocation The location to scroll to in pixels
 * @param {Object}  element     The element we are scrolling to
 * @param {Integer} duration    How long in ms should we take to scroll
 */
nine.translateScroll = (endLocation, element, duration) => {
  const translate3d = 'translate3d(0px, -' + endLocation + 'px, 0px)';

  if (duration > 0) {
    const transition = 'all ' + duration + 'ms ease';

    nine.removeClass(nine.scrollContainer, 'notransition');

    nine.css(nine.scrollContainer, {
      '-webkit-transition': transition,
      transition
    });

    nine.css(document.querySelector('.portrait'), {
      '-webkit-transition': transition,
      transition
    });
  } else {
    nine.addClass(nine.scrollContainer, 'notransition');
  }

  nine.scrollStart(element);
  nine.canScroll = false;

  nine.translatePortrait(endLocation, duration);
  nine.setTransforms(nine.scrollContainer, translate3d);

  setTimeout(() => {
    nine.canScroll = true;
    nine.scrollEnd(element);
  }, duration);

  // Syncronously removing the class after the animation has been applied.
  setTimeout(() => {
    nine.removeClass(nine.scrollContainer, 'notransition');
  }, 10);
};

/**
 * translatePortrait - Move the portrait element along with the translate so it appears fixed.
 * @param   {Integer} endLocation The location to scroll to in pixels
 */
nine.translatePortrait = endLocation => {
  const portrait = document.querySelector('.portrait');
  if (nine.windowSize().w >= 1024) {
    if (navigator.userAgent.toLowerCase().indexOf('firefox') > -1) {
      const top = endLocation + 'px';
      nine.css(portrait, {top});
    } else {
      const portraitPosition = 'translate3d(0px, ' + endLocation + 'px, 0px)';
      nine.setTransforms(portrait, portraitPosition);
    }
  } else {
    document.querySelector('.portrait').removeAttribute('style');
  }
};

/**
 * animateScroll - Scroll page with a jQuery-like scroll animation
 * @param {Integer} endLocation The location to scroll to in pixels
 * @param {Object}  element     The element we are scrolling to
 * @param {Integer} duration    How long in ms should we take to scroll
 */
nine.animateScroll = (endLocation, element, duration) => {
  nine.canScroll = false;

  if (endLocation === null) {
    return;
  }

  const startLocation = nine.getScrolledPosition();

  if (duration === null) {
    duration = nine.scrollDuration;
  }

  // Calculate how far to scroll
  const distance = endLocation - startLocation;

  let runAnimation;

  // Set the animation variables to 0/undefined.
  let timeLapsed = 0;
  let percentage;
  let position;
  const easing = function (progress) {
    return progress < 0.5 ? 4 * progress * progress * progress : ((progress - 1) * ((2 * progress) - 2) * ((2 * progress) - 2)) + 1; // Acceleration until halfway, then deceleration
  };

  function stopAnimationIfRequired(pos) {
    if (pos === endLocation) {
      window.cancelAnimationFrame(runAnimation);
      finishedScroll();
    }
  }

  function finishedScroll() {
    // Remove active status from all
    nine.canScroll = true;
    nine.scrollDirection = null;
    nine.scrollEnd(element);
  }

  const animate = function () {
    timeLapsed += 16;
    percentage = timeLapsed / duration;
    if (percentage > 1) {
      percentage = 1;
      position = endLocation;
    } else {
      position = (startLocation + distance) * easing(percentage);
    }
    nine.scrollContainer.scrollTop = position;
    runAnimation = window.requestAnimationFrame(animate);
    stopAnimationIfRequired(position);
  };

  nine.scrollStart(element);

  // Loop the animation function
  runAnimation = window.requestAnimationFrame(animate);
};

/**
 * scrollStart - Called at scroll start and setups css classes for active sections, headers, etc
 * @param {Object} element Element we are scrolling to
 */
nine.scrollStart = element => {
  // Change header class - duration is same as slide duration for natural feel.
  if (element.classList.value.includes('light')) {
    nine.changeHeaderClass('dark');
  } else {
    nine.changeHeaderClass('light');
  }

  // Change menu colours dependent on slide
  const header = document.querySelector('.header');
  if (element.id === 'services') {
    nine.addClass(header, 'menu-alt');
  } else {
    nine.removeClass(header, 'menu-alt');
  }

  // Delay until part way through scroll to chnages make feel smooth.
  setTimeout(() => {
    // Remove other active classes
    const activePages = document.querySelector('.section.active');
    if (activePages) {
      nine.removeClass(activePages, 'active');
      nine.removeClass(document.body, activePages.id + '-active');
    }
    nine.addClass(element, 'active');
    nine.updateControls(nine.getSectionIndex(element));
  }, nine.scrollDuration * 0.33);
};

 /**
  * scrollEnd - Called at scroll end aupdates hash, current page, controls, etc.
  * @param {Object} element Element we are scrolling to
  */
nine.scrollEnd = element => {
  if (element === null) {
    return;
  } // No element

  // Update to new state.
  nine.updateHash(element.id);
  nine.updateCurrent(element);
  nine.addClass(document.body, element.id + '-active');
  nine.updateControls();
};

/**
 * updateCurrent - Updates globals to current values
 * @param {Object} element Element we are scrolling to
 */
nine.updateCurrent = element => {
  nine.currentPage = element.id;
  nine.currentPageIndex = nine.getSectionIndex(element);
};

/**
 * getScrolledPosition - Get the current Scroll position of the browser
 * @returns {Integer} ScrollTop in pixels
 */
nine.getScrolledPosition = () => {
  return document.documentElement.scrollTop || nine.scrollContainer.scrollTop;
};

/**
 * resetPosition - Resets fullscreen to correct position after browser resize event
 */
nine.resetPosition = () => {
  if (nine.fullscreen === true) {
    let section;

    if (nine.currentPage === null) {
      section = document.querySelectorAll('.sections')[0];
      nine.currentPage = section.id;
      nine.currentPageIndex = 0;
    } else {
      section = document.getElementById(nine.currentPage);
    }

    const destiny = section.offsetTop;

    if (nine.supports3d) {
      nine.translateScroll(destiny, section, 0);
    } else {
      nine.animateScroll(destiny, section, 0);
    }
  }
};

/* ==========================================================================
   Controls
   ==========================================================================

/**
 * addFullscreenNav - adds dots and next & prev controls to site with event handlers
 */
nine.addFullscreenNav = () => {
  const controls = document.querySelector('.controls');

  if (controls) {
    controls.classList.add('on');

    const nav = document.querySelector('.dots');

    if (nav) {
      Array.prototype.forEach.call(nine.pages, (el, i) => {
        const dot = document.createElement('li');
        dot.setAttribute('data-page', i);
        nav.appendChild(dot);
        dot.addEventListener('click', element => nine.dotClick(element));
      });

      document.querySelector('.dots li').classList.add('active');

      document.querySelector('.next').addEventListener('click', nine.arrowNextClickHandler);
      document.querySelector('.prev').addEventListener('click', nine.arrowPrevClickHandler);

      nine.updateControls();
    }
  }
};

/**
 * removeFullscreenNav - remove dots and next & prev controls to site and event handlers
 */
nine.removeFullscreenNav = () => {
  const controls = document.querySelector('.controls');

  if (controls) {
    controls.classList.remove('on');

    const nav = document.querySelector('.dots');
    const dots = document.querySelectorAll('.dots li');

    if (nav && dots) {
      Array.prototype.forEach.call(dots, el => {
        el.parentNode.removeChild(el);
      });

      document.querySelector('.next').removeEventListener('click', nine.arrowNextClickHandler);
      document.querySelector('.prev').removeEventListener('click', nine.arrowPrevClickHandler);
    }
  }
};

/**
 * arrowNextClickHandler
 */
nine.arrowNextClickHandler = () => {
  nine.nextPage();
};

/**
 * arrowPrevClickHandler
 */
nine.arrowPrevClickHandler = () => {
  nine.prevPage();
};

/**
 * dotClick - Handler for dot clicks
 * @param   {Object} element
 * @param   {Boolean} repeat True if called recurvisley
 */
nine.dotClick = (element, repeat) => {
  if (repeat === null) {
    repeat = false;
  }

  document.querySelector('.dots li.active').classList.remove('active');
  const newPageIndex = element.target.getAttribute('data-page');
  document.querySelectorAll('.dots li')[newPageIndex].classList.add('active');

  const section = nine.pages[newPageIndex].id;

  if (nine.canScroll) {
    nine.scrollToSection(section);
  } else if (repeat === false) {
    // Is currently scrolling. Try again after duration.
    setTimeout(() => {
      nine.dotClick(element, true);
    }, nine.scrollDuration);
  }
};

/**
 * updateControls - Update controls to new values
 * @param   {Integer} newIndex Index of the new slide in slides array
 */
nine.updateControls = newIndex => {
  if (newIndex === undefined) {
    newIndex = null;
  }

  if (newIndex === null && nine.currentPageIndex === null) {
    newIndex = 0;
  } else if (newIndex === null && nine.currentPageIndex !== null) {
    newIndex = nine.currentPageIndex;
  }

  const active = document.querySelector('.dots li.active');

  if (active) {
    document.querySelector('.dots li.active').classList.remove('active');
  }

  document.querySelectorAll('.dots li')[newIndex].classList.add('active');

  document.querySelector('.next').classList.remove('disabled');
  document.querySelector('.prev').classList.remove('disabled');

  if (newIndex === 0) {
    document.querySelector('.prev').classList.add('disabled');
  }

  if (newIndex === nine.pages.length - 1) {
    document.querySelector('.next').classList.add('disabled');
  }
};

/**
 * nextPage - Navigates to next page
 * @param   {Boolean} repeat True if called recurvisley
 */
nine.nextPage = repeat => {
  if (repeat === null) {
    repeat = false;
  }

  if (nine.currentPageIndex + 1 < nine.pages.length && nine.canScroll) {
    const nextPage = nine.pages[nine.currentPageIndex + 1].id;
    nine.scrollToSection(nextPage);
    return true;
  } else if (nine.currentPageIndex + 1 < nine.pages.length && repeat === false) {
    setTimeout(() => {
      nine.nextPage(true);
    }, nine.scrollDuration);
  }
  return false;
};

/**
 * prevPage - Navigates to prev page
 * @param   {Boolean} repeat True if called recurvisley
 */
nine.prevPage = repeat => {
  if (repeat === null) {
    repeat = false;
  }

  if (nine.currentPageIndex - 1 >= 0 && nine.canScroll) {
    const prevPage = nine.pages[nine.currentPageIndex - 1].id;
    nine.scrollToSection(prevPage);
    return true;
  } else if (nine.currentPageIndex - 1 >= 0 && repeat === false) {
    setTimeout(() => {
      nine.prevPage(true);
    }, nine.scrollDuration);
  }
  return false;
};

/* ==========================================================================
  Inputs
  ========================================================================== */

/**
 * addKeyboardNav - Allow for buttons presses to navigate fullscreen slideshow
 */
nine.addKeyboardNav = () => {
  document.onkeydown = function (event) {
    if (!event) {
      event = window.event;
    }

    let code = event.keyCode;

    if (event.charCode && code === 0) {
      code = event.charCode;
    }

    switch (code) {
      case 38: // Up
        event.preventDefault();
        nine.prevPage();
        break;
      case 40: // Down
        event.preventDefault();
        nine.nextPage();
        break;
      case 32: // Space
        event.preventDefault();
        nine.nextPage();
        break;
      case 33: // Page up
        event.preventDefault();
        nine.prevPage();
        break;
      case 34: // Page down
        event.preventDefault();
        nine.nextPage();
        break;
      default:
    }
  };
};

/**
 * removeKeyboardNav - removes key press event handlers
 */
nine.removeKeyboardNav = () => {
  document.onkeydown = null;
};

/**
 * addScrollInput - Handle scroll input to naviagte to slides
 */
nine.addScrollInput = () => {
  const wrapper = window;

  if (wrapper.addEventListener) {
    wrapper.addEventListener('mousewheel', nine.mouseWheelHandler, false); // Ie9, chrome, safari, opera use mousewheel

    wrapper.addEventListener('wheel', nine.mouseWheelHandler, false); // firefox
  } else {
    wrapper.attachEvent('onmousewheel', nine.mouseWheelHandler); // IE 6/7/8 not really supported anyway
  }
};

/**
 * removeScrollInput - Remove scroll handling
 */
nine.removeScrollInput = () => {
  const wrapper = window;

  if (wrapper.addEventListener) {
    wrapper.removeEventListener('mousewheel', nine.mouseWheelHandler, false); // Ie9, chrome, safari, opera use mousewheel

    wrapper.removeEventListener('wheel', nine.mouseWheelHandler, false); // Firefox
  } else {
    wrapper.detachEvent('onmousewheel', nine.mouseWheelHandler); // IE 6/7/8 not really supported anyway
  }
};

/**
 * mouseWheelHandler - Process wheel events to scroll to next or prev section
 * @param   {Object} e Scroll event
 * Line 1099: https://github.com/alvarotrigo/fullPage.js/blob/master/pure%20javascript%20(Alpha)/javascript.fullPage.js
 * https://www.sitepoint.com/html5-javascript-mouse-wheel/
 */
nine.mouseWheelHandler = e => {
  nine.preventDefault(e); // Prevent normall scrolling

  const curTime = new Date().getTime();

  // Cross-browser wheel delta
  e = window.event || e || e.originalEvent;

  const value = e.wheelDelta || -e.deltaY || -e.detail;
  const delta = Math.max(-1, Math.min(1, value));

  // Limiting the array to 150 (lets not waist memory!)
  if (nine.scrollHistory.length > 149) {
    nine.scrollHistory.shift(); // Rmeoves first element
  }

  // Keeping record of the previous scrollings
  nine.scrollHistory.push(Math.abs(value));

  const timeDiff = curTime - nine.prevTime;
  nine.prevTime = curTime;

  // Haven't they scrolled in a while?
  // (enough to be consider a different scrolling action to scroll another section)
  if (timeDiff > 200) {
    // Emptying the array, we dont care about old scrollings for our averages
    nine.scrollHistory = [];
  }

  function getAverage(elements, number) {
    let sum = 0;

    // Taking `number` elements from the end to make the average, if there are not enought, 1
    const lastElements = elements.slice(Math.max(elements.length - number, 1));

    for (let i = 0; i < lastElements.length; i++) {
      sum += lastElements[i];
    }
    return Math.ceil(sum / number);
  }

  if (nine.canScroll) {
    const averageEnd = getAverage(nine.scrollHistory, 10);
    const averageMiddle = getAverage(nine.scrollHistory, 70);
    const isAccelerating = averageEnd >= averageMiddle;

    if (isAccelerating) {
      if (delta < 0) { // Scrolling down?
        nine.scrolling('down');
      } else { // Scrolling up?
        nine.scrolling('up');
      }
    }
  }

  return false;
};

/**
 * scrolling - Calls prevPage() or nextPage() depending on scroll direction type
 * @param   {String} type
 */
nine.scrolling = type => {
  if (type === 'down') {
    nine.nextPage();
  } else {
    nine.prevPage();
  }
};

/* ==========================================================================
   Helpers
   ==========================================================================

/**
 * getHash - gets current hash value
 */
nine.getHash = () => {
  const value = window.location.hash.replace('#', '').split('/');
  return value[0];
};

/**
 * addClass
 * @param {Object} element
 * @param {String} className
 */
nine.addClass = (element, className) => {
  if (element && !nine.hasClass(element, className)) {
    element.classList.add(className);
  }
};

 /**
  * removeClass
  * @param {Object} element
  * @param {String} className
  */
nine.removeClass = (element, className) => {
  if (element && nine.hasClass(element, className)) {
    element.classList.remove(className);
  }
};

/**
 * hasClass - Checks if element has class
 * @param   {Object}  element
 * @param   {String}  className
 * @returns {Boolean}
 */
nine.hasClass = (element, className) => {
  return element.classList.contains(className);
};

/**
 * getSectionIndex - Get the index of an element in the slides array
 * @param   {Object} element
 * @returns {Integer}
 */
nine.getSectionIndex = element => {
  let index;

  Array.prototype.forEach.call(nine.pages, (el, i) => {
    if (el === element) {
      index = i;
    }
  });

  return index;
};

/**
 * windowSize - Reliably gets window sizes
 * @param   {Object} w The window to use.
 * @returns {Object} {w: width, h: height}
 */
nine.windowSize = w => {
  // Use the specified window or the current window if no argument
  w = w || window;

  // This works for all browsers except IE8 and before
  if (w.innerWidth !== null) {
    return {w: w.innerWidth, h: w.innerHeight};
  }

  // For IE (or any browser) in Standards mode
  const d = w.document;
  if (document.compatMode === 'CSS1Compat') {
    return {w: d.documentElement.clientWidth,
      h: d.documentElement.clientHeight};
  }

  // For browsers in Quirks mode
  return {w: d.body.clientWidth, h: d.body.clientHeight};
};

/**
 * debounce - Debounces actions be with a timer.
 * @param   {Object}  func      Function to be called
 * @param   {Integer} wait      How long to wasit until call
 * @param   {Boolean} immediate Call it immediately?
 */
nine.debounce = (func, wait, immediate) => {
  let timeout;
  return function () {
    const context = this;
    const args = arguments;
    const later = function () {
      timeout = null;
      if (!immediate) {
        func.apply(context, args);
      }
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) {
      func.apply(context, args);
    }
  };
};

/**
 * preventDefault
 * @param   {Object} event
 */
nine.preventDefault = event => {
  if (event.preventDefault) {
    event.preventDefault();
  } else {
    event.returnValue = false;
  }
};

/**
 * setTransforms - adds CSS treansform to an element
 * @param {Object} element
 * @param {String} translate3d
 */
nine.setTransforms = (element, translate3d) => {
  nine.css(element, {
    '-webkit-transform': translate3d,
    '-moz-transform': translate3d,
    '-ms-transform': translate3d,
    transform: translate3d
  });
};

/**
 * css - add CSS to an element
 * @param {Object} el
 * @param {Object} props
 */
nine.css = (el, props) => {
  let key;
  for (key in props) {
    if (Object.prototype.hasOwnProperty.call(props, key)) {
      if (key !== null) {
        el.style[key] = props[key];
      }
    }
  }
  return el;
};

/* ==========================================================================
  Document Load
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  nine.supports3d = nine.support3d();

  nine.masonaryHeight();
  nine.animateLinks();

  window.addEventListener('resize', () => {
    nine.masonaryHeight();
  });

  nine.fullscreenMode();
});

/* ==========================================================================
  Window Load
   ========================================================================== */

window.onload = () => {
  nine.animateLoad();
  nine.masonaryHeight();
};

/* ==========================================================================
    Polyfils
   ========================================================================== */

if (!String.prototype.includes) {
  String.prototype.includes = function (search, start) {
    if (typeof start !== 'number') {
      start = 0;
    }

    if (start + search.length > this.length) {
      return false;
    }

    return this.indexOf(search, start) !== -1;
  };
}

/**
 * [detectswipe description]
 * @param   {[type]} el   [description]
 * @param   {[type]} func [description]
 * @returns {[type]}
 *
 * https://stackoverflow.com/questions/15084675/how-to-implement-swipe-gestures-for-mobile-devices
 */
nine.detectswipe = (el, func) => {
  const swipeDetection = {};
  swipeDetection.sX = 0;
  swipeDetection.sY = 0;
  swipeDetection.eX = 0;
  swipeDetection.eY = 0;
  const minX = 30;  // min x swipe for horizontal swipe
  const maxX = 30;  // max x difference for vertical swipe
  const minY = 50;  // min y swipe for vertical swipe
  const maxY = 60;  // max y difference for horizontal swipe
  let direc = '';
  const element = document.getElementById(el);
  element.addEventListener('touchstart', e => {
    const t = e.touches[0];
    swipeDetection.sX = t.screenX;
    swipeDetection.sY = t.screenY;
  }, false);
  element.addEventListener('touchmove', e => {
    if (nine.fullscreen) {
      nine.preventDefault(e);
    }
    const t = e.touches[0];
    swipeDetection.eX = t.screenX;
    swipeDetection.eY = t.screenY;
  }, false);
  element.addEventListener('touchend', () => {
    // horizontal detection else if vertical detection
    if ((((swipeDetection.eX - minX > swipeDetection.sX) || (swipeDetection.eX + minX < swipeDetection.sX)) && ((swipeDetection.eY < swipeDetection.sY + maxY) && (swipeDetection.sY > swipeDetection.eY - maxY) && (swipeDetection.eX > 0)))) {
      if (swipeDetection.eX > swipeDetection.sX) {
        direc = 'r';
        console.log('r');
      } else {
        direc = 'l';
        console.log('l');
      }
    } else if ((((swipeDetection.eY - minY > swipeDetection.sY) || (swipeDetection.eY + minY < swipeDetection.sY)) && ((swipeDetection.eX < swipeDetection.sX + maxX) && (swipeDetection.sX > swipeDetection.eX - maxX) && (swipeDetection.eY > 0)))) {
      if (swipeDetection.eY > swipeDetection.sY) {
        direc = 'd';
        console.log('d');
      } else {
        direc = 'u';
        console.log('u');
      }
    }

    if (direc !== '') {
      if (typeof func === 'function') {
        func(direc);
      }
    }

    direc = '';
    swipeDetection.sX = 0;
    swipeDetection.sY = 0;
    swipeDetection.eX = 0;
    swipeDetection.eY = 0;
  }, false);
};

nine.handleSwipe = direction => {
  console.log(direction);
  if (nine.fullscreen && nine.isTouch) {
    if (direction === 'u') {
      nine.nextPage();
    } else {
      nine.prevPage();
    }
  }
};
