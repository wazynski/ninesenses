var nine = {
  canScroll: true,
  duration: 500,
  scrollContainer: document.getElementById('scroll'),
  scrollStart: 0,
  pages: document.querySelectorAll(".section"),
  currentPage: 0,
  scrollDirection: null,
  sticky: false,
  scrollListener: null,
};

/* ==========================================================================
    Polyfils
   ========================================================================== */

if (!String.prototype.includes) {
   String.prototype.includes = function(search, start) {
     if (typeof start !== 'number') {
       start = 0;
     }

     if (start + search.length > this.length) {
       return false;
     } else {
       return this.indexOf(search, start) !== -1;
     }
   };
 }

/* ==========================================================================
  nine.scrollSpy()
========================================================================== */

nine.scrollSpy = () => {
  var sections = {};
  var i = 0;

  Array.prototype.forEach.call(nine.pages, function(el, i) {
    sections[i] = {
      classes: el.className.replace('section', '').trim(),
      top: el.offsetTop,
      bottom: el.offsetTop + el.offsetHeight,
      height: el.offsetHeight,
    }
  });

  nine.scrollContainer.addEventListener('scroll', function(event) {

    var scrollPosition = document.documentElement.scrollTop || nine.scrollContainer.scrollTop;

    for (i in sections) {
      if (scrollPosition >= sections[i].top  && scrollPosition <= sections[i].bottom) {

        if (sections[i].classes.includes('light')) {
          nine.changeHeaderClass('dark');
        } else {
          nine.changeHeaderClass('light');
        }
      }

      // Count as being in next page if 25% scrolled into it.
      var scrollOffset = 0.75;

      if ((scrollPosition >= sections[i].top - (sections[i].height * scrollOffset))  && scrollPosition <= sections[i].bottom) {
        if (nine.currentPage != i) {
          nine.currentPage = parseInt(i);
          nine.updateControls();
        }
      }
    }
  });
};

/* ==========================================================================
  nine.scrollTo()
  ========================================================================== */

nine.scrollTo = (startLocation, endLocation) => {
  nine.canScroll = false;

  // Calculate how far to scroll
  // var startLocation = viewStart;
  // var endLocation = pageStart;
  var distance = endLocation - startLocation;

  var runAnimation;

  // Set the animation variables to 0/undefined.
  var timeLapsed = 0;
  var percentage, position;

  var easing = function (progress) {
   return progress < 0.5 ? 4 * progress * progress * progress : (progress - 1) * (2 * progress - 2) * (2 * progress - 2) + 1; // acceleration until halfway, then deceleration
  };

  function stopAnimationIfRequired(pos) {
   if (pos == endLocation) {
     cancelAnimationFrame(runAnimation);
     finishedScroll();
   }
  }

  function finishedScroll() {
    nine.canScroll = true;
    nine.scrollDirection = null;
  }

  var animate = function () {
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
}

/* ==========================================================================
  nine.scrollHandler()
  ========================================================================== */

// Constructor cannot be ES6 arrow
nine.scrollHandler = function(pageId) {
  var page = document.getElementById(pageId);
  var pageStart = page.offsetTop;
  nine.canScroll = true;
  var timeout = null;

  nine.scrollListener = window.addEventListener('wheel', function(event) {
    nine.scrollStart = nine.scrollContainer.scrollTop;

    if (timeout !== null) {
      console.log('stop');
        event.preventDefault();
        return false;
    }

    if (nine.canScroll) {
      timeout = setTimeout(function(){ timeout = null; }, nine.duration * 3);

      var pageHeight = page.scrollHeight;
      var pageStopPortion = pageHeight / 2;
      var viewHeight = window.innerHeight;

      var viewEnd = nine.scrollStart + viewHeight;
      var pageStartPart = viewEnd - pageStart;
      var pageEndPart = (pageStart + pageHeight) - nine.scrollStart;

      var canJumpDown = pageStartPart >= 0;
      var stopJumpDown = pageStartPart > pageStopPortion;

      var canJumpUp = pageEndPart >= 0;
      var stopJumpUp = pageEndPart > pageStopPortion;

      var scrollingForward = event.deltaY > 0;

      if (  ( scrollingForward && canJumpDown && !stopJumpDown)
         || (!scrollingForward && canJumpUp   && !stopJumpUp)) {
        event.preventDefault();
        nine.scrollTo(nine.scrollStart, pageStart);
      }
    } else {
     event.preventDefault();
    }
  });
}

/* ==========================================================================
  nine.scrollToPage()
   ========================================================================== */

nine.scrollToPage = (pageID, offset) => {
  // Get current scroll location and where the page starts
  nine.scrollStart = nine.scrollContainer.scrollTop;

  if (typeof offset === "undefined") {
    offset = 0;
  }

  var pageStart;

  if (nine.scrollDirection === "up" && nine.sticky === true) {
    pageStart = document.getElementById(pageID).offsetTop - document.getElementById(pageID).offsetHeight - offset;
  } else {
    pageStart = document.getElementById(pageID).offsetTop - offset;
  }

  nine.scrollTo(nine.scrollStart, pageStart);
}

/* ==========================================================================
  nine.keyboardNav()
   ========================================================================== */

nine.keyboardNav = () => {
  document.onkeydown = function(event) {
    if (!event) {
      event = window.event;
    }

    var code = event.keyCode;

    if (event.charCode && code == 0) {
      code = event.charCode;
    }

    switch(code) {
      case 38: // Up
        event.preventDefault();
        nine.prevPage();
        break;
      case 40: // Down
        event.preventDefault();
        nine.nextPage();
      break;
    }

  };
}

/* ==========================================================================
  nine.calculateOffset()
   ========================================================================== */

nine.calculateOffset = () => {
  var prevPage = nine.pages[nine.currentPage - 1].id;
  var offset = 0;

  // If user has manuall scrolled part way onto next one there will be an offset to account for.
  if (nine.sticky) {
     if (nine.currentPage + 1 < nine.pages.length) {
       var nextPageOffset = document.getElementById(nine.pages[nine.currentPage + 1].id).offsetTop
       var prevPageEl = document.getElementById(prevPage);
       var prevPageOffsetBottom = prevPageEl.offsetTop + prevPageEl.offsetHeight;

       if (nextPageOffset != prevPageOffsetBottom) {
         offset = prevPageOffsetBottom - nextPageOffset;
       }
     } else {
       var scrollPosition = document.documentElement.scrollTop || nine.scrollContainer.scrollTop;
       var currentPageOffset = document.getElementById(nine.pages[nine.currentPage].id).offsetTop;

       if (scrollPosition != currentPageOffset) {
         offset = scrollPosition - currentPageOffset;
       }
     }
     return offset;
   } else {
     return 0;
   }
};

/* ==========================================================================
  nine.nextPage()
   ========================================================================== */

nine.nextPage = () => {
  if (nine.currentPage + 1 < nine.pages.length && nine.canScroll) {
    nine.scrollDirection = 'down';
    var nextPage = nine.pages[nine.currentPage + 1].id;

    nine.scrollToPage(nextPage);
    return true;
  }
  return false;
}

/* ==========================================================================
  nine.prevPage()
   ========================================================================== */

nine.prevPage = () => {
  if (nine.currentPage - 1 >= 0 && nine.canScroll) {
    nine.scrollDirection = 'up';
    var prevPage = nine.pages[nine.currentPage - 1].id;

    nine.scrollToPage(prevPage, nine.calculateOffset());
    return true;
  }
  return false;
}


/* ==========================================================================
  nine.controls()
   ========================================================================== */

nine.controls = () => {
  var pageIndex = 0;

  var dots = document.querySelector('.dots')
  if (dots) {
    Array.prototype.forEach.call(nine.pages, function(el) {
      var dot = document.createElement('li');
      dot.setAttribute('data-page', pageIndex);
      dots.appendChild(dot);
      dot.addEventListener('click', (e) => nine.dotClick(e));

      pageIndex++;
    });

    document.querySelector('.dots li').classList.add('active')

    document.querySelector('.next').addEventListener('click', () => nine.nextPage());
    document.querySelector('.prev').addEventListener('click', () => nine.prevPage());

    nine.updateControls();
  }
}

/* ==========================================================================
  nine.dotClick()
   ========================================================================== */

nine.dotClick = (e) => {
  var pageIndex = e.target.getAttribute('data-page');
  var pageId = nine.pages[pageIndex].id
  var offset = 0;
  if (pageIndex > nine.currentPage) {
    nine.scrollDirection = 'down';
  } else if (pageIndex < nine.currentPage) {
    nine.scrollDirection = 'up';
    if (nine.sticky) {
      var gap = nine.currentPage - 1 - pageIndex;

      for (var i = 1; i <= gap; i++) {
        var id = nine.pages[nine.currentPage - i].id

        offset += document.getElementById(id).offsetHeight;
      }
      offset += nine.calculateOffset();
    }
  }

  nine.scrollToPage(pageId, offset);
};

/* ==========================================================================
  nine.updateControls()
   ========================================================================== */

nine.updateControls = () => {
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
}

/* ==========================================================================
  nine.checkSticky() - http://trialstravails.blogspot.co.uk/2016/06/detecting-css-position-sticky-support.html
   ========================================================================== */

nine.checkSticky = () => {
  console.log('Checking Sticky');
  // return false; // turn stick off
  var el = document.createElement('a');
  var mStyle = el.style;

  mStyle.cssText = "position:sticky;position:-webkit-sticky;position:-ms-sticky;";
  var sticky = mStyle.position.indexOf('sticky')!==-1;
  var sections = document.querySelectorAll('.section');

  var windowHeight = nine.windowSize().h;

  if (sticky) {
    sections.forEach(function(el) {
      if (el.offsetHeight > windowHeight) {
        sticky = false;
      }
    });
  }

  if (sticky) {
    document.body.classList.add("sticky-enabled");

    // TODO: enable scroll swipe if sticky on
    // nine.swipeScroll();

    return true;
  } else {
    document.body.classList.remove("sticky-enabled");

    // TODO: disable scroll swipe if sticky off
    // window.removeEventListener('wheel', nine.scrollListener);

    return false;
  }
}

/* ==========================================================================
  nine.swipeScroll()
   ========================================================================== */

nine.swipeScroll = () => {
  Array.prototype.forEach.call(nine.pages, function(el) {
    new nine.scrollHandler(el.id);
  });
}

/* ==========================================================================
  nine.changeHeaderClass
   ========================================================================== */

nine.changeHeaderClass = (className) => {
  document.querySelector('.header').setAttribute('class', `header ${className}`);
};

/* ==========================================================================
  nine.animatation()
   ========================================================================== */

nine.animateLoad = () => {
  window.setTimeout(() => {
    document.body.classList.add('faded-in');
    nine.masonaryHeight();

    window.setTimeout(() => {
      var hidden = document.querySelectorAll(".hide-left");
      Array.prototype.forEach.call(hidden, function(el, i) {
        el.classList.remove('hide-left');
      });

      var hidden = document.querySelectorAll(".hide-down");
      Array.prototype.forEach.call(hidden, function(el, i) {
        el.classList.remove('hide-down');
      });
    }, 1000)
  }, 1000);
};

/* ==========================================================================
  nine.animatePortrait()
   ========================================================================== */

nine.animatePortrait = () => {
  var page = document.getElementById('two');
  var offsetTop = page.offsetTop;
  var portrait = document.querySelector('.portrait .faded');
  var startPoint = 0.98;

  if (portrait) {
    function portraitChange() {
      var scrollPosition = document.documentElement.scrollTop || nine.scrollContainer.scrollTop;

      if (nine.windowSize().w > 1280) {
        startPoint = 0.5;
      } else if (nine.windowSize().w < 1024) {
        offsetTop = page.offsetHeight + document.getElementById('one').offsetHeight - portrait.offsetHeight;
      }

      if (scrollPosition > offsetTop * startPoint) {
        if (portrait.style.opacity == 0) {
          portrait.style.opacity = 1;
        }
      } else {
        if (portrait.style.opacity == 1) {
          portrait.style.opacity = 0;
        }
      }
    }

    nine.scrollContainer.addEventListener('scroll', function(event) {
      portraitChange();
    });
  }
};

/* ==========================================================================
  nine.debounce()
 ========================================================================== */

nine.debounce = (func, wait, immediate) => {
	var timeout;
	return function() {
		var context = this, args = arguments;
		var later = function() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		var callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
};


nine.pageTransisition = (href, bg, slide) => {
  if (!bg) {
    bg = '#E6E6E4';
  }

  document.body.style.backgroundColor = bg;

  // if (slide) {
  //   if (slide == "left") {
  //     document.body.classList.add('slide-left');
  //   } else {
  //     document.body.classList.add('slide-right');
  //   }
  // } else {
  document.body.classList.add('faded-out');
  // }

  setTimeout(function(){
    window.location.href = href;
  }, 600);
};

/* ==========================================================================
  nine.aboutHeight
   ========================================================================== */

nine.masonaryHeight = () => {
  var masonary = document.querySelector('.masonary')
  let lheight = 0;
  let rheight = 0;
  if (masonary) {
    if (nine.windowSize().w >= 1024) {
      var lblocks = document.querySelectorAll('.block.left');
      var rblocks = document.querySelectorAll('.block.right');

      Array.prototype.forEach.call(lblocks, function(el, i) {
        lheight += el.offsetHeight;
      });

      Array.prototype.forEach.call(rblocks, function(el, i) {
        rheight += el.offsetHeight;
      });

      let height;

      if (lheight >= rheight) {
        height = lheight;
      } else {
        height = rheight;
      }

      height += 100;
      masonary.style.height = height + 'px';
    } else {
      masonary.style.height = 'auto';
    }
  }
};

/* ==========================================================================
  nine.animateLinks
   ========================================================================== */

nine.animateLinks = () => {
  var anchorElements = document.getElementsByTagName('a');
  Array.prototype.forEach.call(anchorElements, function(el, i) {
    el.onclick = function() {
      nine.pageTransisition(this.href, el.getAttribute('data-bg'), el.getAttribute('data-slide'));
      return false;
    }
  });
};

/* ==========================================================================
  nine.windowWidth
   ========================================================================== */

nine.windowSize = (w) => {

  // Use the specified window or the current window if no argument
  w = w || window;

  // This works for all browsers except IE8 and before
  if (w.innerWidth != null) return { w: w.innerWidth, h: w.innerHeight };

  // For IE (or any browser) in Standards mode
  var d = w.document;
  if (document.compatMode == "CSS1Compat")
      return { w: d.documentElement.clientWidth,
         h: d.documentElement.clientHeight };

  // For browsers in Quirks mode
  return { w: d.body.clientWidth, h: d.body.clientHeight };
};

/* ==========================================================================
  Document Load
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  nine.scrollSpy();
  nine.sticky = nine.checkSticky();
  nine.keyboardNav();
  nine.controls();
  nine.masonaryHeight();
  nine.animateLinks();

  var checkStickyDebounced = nine.debounce(function() {
  	nine.sticky = nine.checkSticky();
  }, 250);

  window.addEventListener('resize', checkStickyDebounced);

  window.addEventListener('resize', function() {
    nine.masonaryHeight();
  });
});

/* ==========================================================================
  Window Load
   ========================================================================== */

window.onload = () => {
  nine.animateLoad();
  nine.animatePortrait();
  nine.masonaryHeight();
};
