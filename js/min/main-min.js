"use strict";var nine={fullscreen:!1,currentPageIndex:null,currentPage:null,canScroll:!0,scrollDuration:750,scrollContainer:document.getElementById("fullpage"),pages:document.querySelectorAll(".section"),scrollDirection:null,prevTime:(new Date).getTime(),scrollHistory:[],fullScreenWidthEnableFrom:768,fullScreenHeightEnableFrom:928,supports3d:!1,isTouchDevice:navigator.userAgent.match(/(iPhone|iPod|iPad|Android|playbook|silk|BlackBerry|BB10|Windows Phone|Tizen|Bada|webOS|IEMobile|Opera Mini)/),isTouch:"ontouchstart"in window||navigator.msMaxTouchPoints>0||navigator.maxTouchPoints,touchStartY:0,touchEndY:0};nine.support3d=function(){var e=document.createElement("p"),n=void 0,t={webkitTransform:"-webkit-transform",OTransform:"-o-transform",msTransform:"-ms-transform",MozTransform:"-moz-transform",transform:"transform"};document.body.insertBefore(e,null);for(var i in t)void 0!==e.style[i]&&(e.style[i]="translate3d(1px,1px,1px)",n=window.getComputedStyle(e).getPropertyValue(t[i]));return document.body.removeChild(e),void 0!==n&&n.length>0&&"none"!==n},nine.checkFullscreen=function(){var e=nine.windowSize().h,n=nine.windowSize().w;return document.querySelector(".dim").innerHTML=n+" "+e,console.log(n+" "+e),e>=nine.fullScreenHeightEnableFrom&&n>=nine.fullScreenWidthEnableFrom},nine.enableFullscreen=function(){if(nine.checkFullscreen()){nine.fullscreen=!0,nine.addClass(document.body,"fullscreen"),!1===nine.supports3d&&nine.addClass(document.body,"no-css3");var e=nine.windowSize().h+"px";nine.pages.forEach(function(n){console.log(n),n.style.height=e,console.log(n)})}else nine.fullscreen=!1,nine.removeClass(document.body,"fullscreen"),nine.removeClass(document.body,"no-css3")},nine.changeHeaderClass=function(e){document.querySelector(".header").setAttribute("class","header "+e)},nine.animateLoad=function(){window.setTimeout(function(){document.body.classList.add("faded-in"),nine.masonaryHeight(),window.setTimeout(function(){var e=document.querySelectorAll(".hide-left");Array.prototype.forEach.call(e,function(e){e.classList.remove("hide-left")}),e=document.querySelectorAll(".hide-right"),Array.prototype.forEach.call(e,function(e){e.classList.remove("hide-right")}),e=document.querySelectorAll(".background-hide"),Array.prototype.forEach.call(e,function(e){e.classList.remove("background-hide")})},1e3)},1e3)},nine.pageTransisition=function(e,n){n||(n="#E6E6E4"),document.body.style.backgroundColor=n,document.body.classList.add("faded-out"),setTimeout(function(){window.location.href=e},600)},nine.animateLinks=function(){var e=document.getElementsByTagName("a");Array.prototype.forEach.call(e,function(e){e.onclick=function(){return nine.pageTransisition((void 0).href,e.getAttribute("data-bg")),!1}})},nine.masonaryHeight=function(){var e=document.querySelector(".masonary"),n=0,t=0;if(e)if(nine.windowSize().w>=1024){var i=document.querySelectorAll(".block.left"),o=document.querySelectorAll(".block.right");Array.prototype.forEach.call(i,function(e){n+=e.offsetHeight}),Array.prototype.forEach.call(o,function(e){t+=e.offsetHeight});var r=void 0;r=n>=t?n:t+200,r+=1,e.style.height=r+"px"}else e.style.height="auto"},nine.fullscreenMode=function(e){if(nine.checkFullscreen()&&!1===nine.fullscreen?(nine.enableFullscreen(),nine.hashChangeLisener(),nine.addFullscreenNav(),nine.addKeyboardNav(),nine.addScrollInput(),nine.setCurrentPage(),nine.detectswipe("fullpage",nine.handleSwipe)):!1===nine.checkFullscreen()&&!0===nine.fullscreen&&(nine.enableFullscreen(),nine.removeFullscreenNav(),nine.removeKeyboardNav(),nine.removeScrollInput()),e)nine.resetPosition();else{var n=nine.debounce(function(){nine.fullscreenMode(!0)},250);window.addEventListener("resize",n)}},nine.setCurrentPage=function(){var e=nine.getHash();if(e){var n=document.getElementById(e);n&&(nine.updateCurrent(n),nine.scrollStart(n),nine.scrollToSection(n.id,0))}else nine.updateCurrent(document.querySelectorAll(".section")[0])},nine.updateHash=function(e){window.location.hash=e},nine.hashChangeLisener=function(){document.addEventListener?window.addEventListener("hashchange",nine.hashChangeHandler,!1):window.attachEvent("onhashchange",nine.hashChangeHandler)},nine.hashChangeHandler=function(){var e=nine.getHash();e&&e!==nine.currentPage&&nine.scrollToSection(e)},nine.scrollToSection=function(e,n){var t=document.getElementById(e);if(null!==t){null!==n&&void 0!==n||(n=nine.scrollDuration);var i=nine.getSectionIndex(t);i>nine.currentPageIndex?nine.scrollDirection="down":i<nine.currentPageIndex&&(nine.scrollDirection="up");var o=t.offsetTop;nine.supports3d?nine.translateScroll(o,t,n):nine.animateScroll(o,t,n)}},nine.translateScroll=function(e,n,t){var i="translate3d(0px, -"+e+"px, 0px)";if(t>0){var o="all "+t+"ms ease";nine.removeClass(nine.scrollContainer,"notransition"),nine.css(nine.scrollContainer,{"-webkit-transition":o,transition:o}),nine.css(document.querySelector(".portrait"),{"-webkit-transition":o,transition:o})}else nine.addClass(nine.scrollContainer,"notransition");nine.scrollStart(n),nine.canScroll=!1,nine.translatePortrait(e,t),nine.setTransforms(nine.scrollContainer,i),setTimeout(function(){nine.canScroll=!0,nine.scrollEnd(n)},t),setTimeout(function(){nine.removeClass(nine.scrollContainer,"notransition")},10)},nine.translatePortrait=function(e){var n=document.querySelector(".portrait");if(nine.windowSize().w>=1024)if(navigator.userAgent.toLowerCase().indexOf("firefox")>-1){var t=e+"px";nine.css(n,{top:t})}else{var i="translate3d(0px, "+e+"px, 0px)";nine.setTransforms(n,i)}else document.querySelector(".portrait").removeAttribute("style")},nine.animateScroll=function(e,n,t){function i(n){n===e&&(window.cancelAnimationFrame(a),o())}function o(){nine.canScroll=!0,nine.scrollDirection=null,nine.scrollEnd(n)}if(nine.canScroll=!1,null!==e){var r=nine.getScrolledPosition();null===t&&(t=nine.scrollDuration);var l=e-r,a=void 0,c=0,s=void 0,u=void 0,d=function(e){return e<.5?4*e*e*e:(e-1)*(2*e-2)*(2*e-2)+1},m=function n(){c+=16,s=c/t,s>1?(s=1,u=e):u=(r+l)*d(s),nine.scrollContainer.scrollTop=u,a=window.requestAnimationFrame(n),i(u)};nine.scrollStart(n),a=window.requestAnimationFrame(m)}},nine.scrollStart=function(e){e.classList.value.includes("light")?nine.changeHeaderClass("dark"):nine.changeHeaderClass("light");var n=document.querySelector(".header");"services"===e.id?nine.addClass(n,"menu-alt"):nine.removeClass(n,"menu-alt"),setTimeout(function(){var n=document.querySelector(".section.active");n&&(nine.removeClass(n,"active"),nine.removeClass(document.body,n.id+"-active")),nine.addClass(e,"active"),nine.updateControls(nine.getSectionIndex(e))},.33*nine.scrollDuration)},nine.scrollEnd=function(e){null!==e&&(nine.updateHash(e.id),nine.updateCurrent(e),nine.addClass(document.body,e.id+"-active"),nine.updateControls())},nine.updateCurrent=function(e){nine.currentPage=e.id,nine.currentPageIndex=nine.getSectionIndex(e)},nine.getScrolledPosition=function(){return document.documentElement.scrollTop||nine.scrollContainer.scrollTop},nine.resetPosition=function(){if(!0===nine.fullscreen){var e=void 0;null===nine.currentPage?(e=document.querySelectorAll(".sections")[0],nine.currentPage=e.id,nine.currentPageIndex=0):e=document.getElementById(nine.currentPage);var n=e.offsetTop;nine.supports3d?nine.translateScroll(n,e,0):nine.animateScroll(n,e,0)}},nine.addFullscreenNav=function(){var e=document.querySelector(".controls");if(e){e.classList.add("on");var n=document.querySelector(".dots");n&&(Array.prototype.forEach.call(nine.pages,function(e,t){var i=document.createElement("li");i.setAttribute("data-page",t),n.appendChild(i),i.addEventListener("click",function(e){return nine.dotClick(e)})}),document.querySelector(".dots li").classList.add("active"),document.querySelector(".next").addEventListener("click",nine.arrowNextClickHandler),document.querySelector(".prev").addEventListener("click",nine.arrowPrevClickHandler),nine.updateControls())}},nine.removeFullscreenNav=function(){var e=document.querySelector(".controls");if(e){e.classList.remove("on");var n=document.querySelector(".dots"),t=document.querySelectorAll(".dots li");n&&t&&(Array.prototype.forEach.call(t,function(e){e.parentNode.removeChild(e)}),document.querySelector(".next").removeEventListener("click",nine.arrowNextClickHandler),document.querySelector(".prev").removeEventListener("click",nine.arrowPrevClickHandler))}},nine.arrowNextClickHandler=function(){nine.nextPage()},nine.arrowPrevClickHandler=function(){nine.prevPage()},nine.dotClick=function(e,n){null===n&&(n=!1),document.querySelector(".dots li.active").classList.remove("active");var t=e.target.getAttribute("data-page");document.querySelectorAll(".dots li")[t].classList.add("active");var i=nine.pages[t].id;nine.canScroll?nine.scrollToSection(i):!1===n&&setTimeout(function(){nine.dotClick(e,!0)},nine.scrollDuration)},nine.updateControls=function(e){void 0===e&&(e=null),null===e&&null===nine.currentPageIndex?e=0:null===e&&null!==nine.currentPageIndex&&(e=nine.currentPageIndex),document.querySelector(".dots li.active")&&document.querySelector(".dots li.active").classList.remove("active"),document.querySelectorAll(".dots li")[e].classList.add("active"),document.querySelector(".next").classList.remove("disabled"),document.querySelector(".prev").classList.remove("disabled"),0===e&&document.querySelector(".prev").classList.add("disabled"),e===nine.pages.length-1&&document.querySelector(".next").classList.add("disabled")},nine.nextPage=function(e){if(null===e&&(e=!1),nine.currentPageIndex+1<nine.pages.length&&nine.canScroll){var n=nine.pages[nine.currentPageIndex+1].id;return nine.scrollToSection(n),!0}return nine.currentPageIndex+1<nine.pages.length&&!1===e&&setTimeout(function(){nine.nextPage(!0)},nine.scrollDuration),!1},nine.prevPage=function(e){if(null===e&&(e=!1),nine.currentPageIndex-1>=0&&nine.canScroll){var n=nine.pages[nine.currentPageIndex-1].id;return nine.scrollToSection(n),!0}return nine.currentPageIndex-1>=0&&!1===e&&setTimeout(function(){nine.prevPage(!0)},nine.scrollDuration),!1},nine.addKeyboardNav=function(){document.onkeydown=function(e){e||(e=window.event);var n=e.keyCode;switch(e.charCode&&0===n&&(n=e.charCode),n){case 38:e.preventDefault(),nine.prevPage();break;case 40:case 32:e.preventDefault(),nine.nextPage();break;case 33:e.preventDefault(),nine.prevPage();break;case 34:e.preventDefault(),nine.nextPage()}}},nine.removeKeyboardNav=function(){document.onkeydown=null},nine.addScrollInput=function(){var e=window;e.addEventListener?(e.addEventListener("mousewheel",nine.mouseWheelHandler,!1),e.addEventListener("wheel",nine.mouseWheelHandler,!1)):e.attachEvent("onmousewheel",nine.mouseWheelHandler)},nine.removeScrollInput=function(){var e=window;e.addEventListener?(e.removeEventListener("mousewheel",nine.mouseWheelHandler,!1),e.removeEventListener("wheel",nine.mouseWheelHandler,!1)):e.detachEvent("onmousewheel",nine.mouseWheelHandler)},nine.mouseWheelHandler=function(e){function n(e,n){for(var t=0,i=e.slice(Math.max(e.length-n,1)),o=0;o<i.length;o++)t+=i[o];return Math.ceil(t/n)}nine.preventDefault(e);var t=(new Date).getTime();e=window.event||e||e.originalEvent;var i=e.wheelDelta||-e.deltaY||-e.detail,o=Math.max(-1,Math.min(1,i));nine.scrollHistory.length>149&&nine.scrollHistory.shift(),nine.scrollHistory.push(Math.abs(i));var r=t-nine.prevTime;if(nine.prevTime=t,r>200&&(nine.scrollHistory=[]),nine.canScroll){n(nine.scrollHistory,10)>=n(nine.scrollHistory,70)&&(o<0?nine.scrolling("down"):nine.scrolling("up"))}return!1},nine.scrolling=function(e){"down"===e?nine.nextPage():nine.prevPage()},nine.getHash=function(){return window.location.hash.replace("#","").split("/")[0]},nine.addClass=function(e,n){e&&!nine.hasClass(e,n)&&e.classList.add(n)},nine.removeClass=function(e,n){e&&nine.hasClass(e,n)&&e.classList.remove(n)},nine.hasClass=function(e,n){return e.classList.contains(n)},nine.getSectionIndex=function(e){var n=void 0;return Array.prototype.forEach.call(nine.pages,function(t,i){t===e&&(n=i)}),n},nine.windowSize=function(e){if(e=e||window,null!==e.innerWidth)return{w:e.innerWidth,h:e.innerHeight};var n=e.document;return"CSS1Compat"===document.compatMode?{w:n.documentElement.clientWidth,h:n.documentElement.clientHeight}:{w:n.body.clientWidth,h:n.body.clientHeight}},nine.debounce=function(e,n,t){var i=void 0;return function(){var o=this,r=arguments,l=function(){i=null,t||e.apply(o,r)},a=t&&!i;clearTimeout(i),i=setTimeout(l,n),a&&e.apply(o,r)}},nine.preventDefault=function(e){e.preventDefault?e.preventDefault():e.returnValue=!1},nine.setTransforms=function(e,n){nine.css(e,{"-webkit-transform":n,"-moz-transform":n,"-ms-transform":n,transform:n})},nine.css=function(e,n){var t=void 0;for(t in n)Object.prototype.hasOwnProperty.call(n,t)&&null!==t&&(e.style[t]=n[t]);return e},document.addEventListener("DOMContentLoaded",function(){nine.supports3d=nine.support3d(),nine.masonaryHeight(),nine.animateLinks(),window.addEventListener("resize",function(){nine.masonaryHeight()}),nine.fullscreenMode()}),window.onload=function(){nine.animateLoad(),nine.masonaryHeight()},String.prototype.includes||(String.prototype.includes=function(e,n){return"number"!=typeof n&&(n=0),!(n+e.length>this.length)&&-1!==this.indexOf(e,n)}),nine.detectswipe=function(e,n){var t={};t.sX=0,t.sY=0,t.eX=0,t.eY=0;var i="",o=document.getElementById(e);o.addEventListener("touchstart",function(e){var n=e.touches[0];t.sX=n.screenX,t.sY=n.screenY},!1),o.addEventListener("touchmove",function(e){nine.fullscreen&&nine.preventDefault(e);var n=e.touches[0];t.eX=n.screenX,t.eY=n.screenY},!1),o.addEventListener("touchend",function(){(t.eX-30>t.sX||t.eX+30<t.sX)&&t.eY<t.sY+60&&t.sY>t.eY-60&&t.eX>0?t.eX>t.sX?(i="r",console.log("r")):(i="l",console.log("l")):(t.eY-50>t.sY||t.eY+50<t.sY)&&t.eX<t.sX+30&&t.sX>t.eX-30&&t.eY>0&&(t.eY>t.sY?(i="d",console.log("d")):(i="u",console.log("u"))),""!==i&&"function"==typeof n&&n(i),i="",t.sX=0,t.sY=0,t.eX=0,t.eY=0},!1)},nine.handleSwipe=function(e){console.log(e),nine.fullscreen&&nine.isTouch&&("u"===e?nine.nextPage():nine.prevPage())};
//# sourceMappingURL=./main-min.js.map