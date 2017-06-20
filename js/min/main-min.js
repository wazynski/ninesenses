"use strict";var nine={canScroll:!0,duration:1e3,scrollContainer:document.getElementById("scroll"),scrollStart:0,pages:document.querySelectorAll(".section"),currentPage:0};nine.scrollSpy=function(){var e={},n=0;Array.prototype.forEach.call(nine.pages,function(n,t){e[t]={classes:n.className.replace("section","").trim(),top:n.offsetTop-50}}),console.log(e),nine.scrollContainer.addEventListener("scroll",function(t){var o=document.documentElement.scrollTop||nine.scrollContainer.scrollTop;for(n in e)e[n].top<=o&&(e[n].classes.includes("light")?nine.changeHeaderClass("dark"):nine.changeHeaderClass("light"))})},nine.changeHeaderClass=function(e){document.querySelector(".header").setAttribute("class","header "+e)},nine.animateLoad=function(){document.body.className="",window.setTimeout(function(){var e=document.querySelectorAll(".hide-left");Array.prototype.forEach.call(e,function(e,n){e.classList.remove("hide-left")});var e=document.querySelectorAll(".hide-down");Array.prototype.forEach.call(e,function(e,n){e.classList.remove("hide-down")})},1e3)},nine.scrollTo=function(e,n){function t(e){e==n&&(cancelAnimationFrame(r),nine.canScroll=!0)}nine.canScroll=!1;var o=n-e,r,l=0,c,i,a=function e(n){return n<.5?4*n*n*n:(n-1)*(2*n-2)*(2*n-2)+1},s=function s(){l+=16,c=l/nine.duration,c>1?(c=1,i=n):i=e+o*a(c),nine.scrollContainer.scrollTop=i,r=requestAnimationFrame(s),t(i)};r=requestAnimationFrame(s)},nine.scrollHandler=function(e){var n=document.getElementById(e),t=n.offsetTop;nine.canScroll=!0;var o=null;window.addEventListener("wheel",function(e){if(nine.scrollStart=nine.scrollContainer.scrollTop,console.log(nine.scrollStart),null!==o)return console.log("timout in progress"),e.preventDefault(),!1;if(nine.canScroll){o=setTimeout(function(){o=null},1.5*nine.duration);var r=n.scrollHeight,l=r/2,c=window.innerHeight,i=nine.scrollStart+c,a=i-t,s=t+r-nine.scrollStart,u=a>=0,d=a>l,f=s>=0,m=s>l,p=e.deltaY>0;(p&&u&&!d||!p&&f&&!m)&&(e.preventDefault(),nine.scrollTo(nine.scrollStart,t))}else e.preventDefault()})},nine.scrollToPage=function(e){nine.scrollStart=nine.scrollContainer.scrollTop;var n=document.getElementById(e).offsetTop;nine.scrollTo(nine.scrollStart,n)},nine.keyboardNav=function(){console.log("here"),document.onkeydown=function(e){e||(e=window.event);var n=e.keyCode;switch(e.charCode&&0==n&&(n=e.charCode),n){case 38:nine.prevPage();break;case 40:nine.nextPage();break}e.preventDefault()}},nine.nextPage=function(){if(nine.currentPage+1<nine.pages.length){var e=nine.pages[nine.currentPage+1].id;return nine.currentPage+=1,nine.scrollToPage(e),nine.updateControls(),!0}return!1},nine.prevPage=function(){if(nine.currentPage-1>=0){var e=nine.pages[nine.currentPage-1].id;return nine.currentPage-=1,nine.scrollToPage(e),nine.updateControls(),!0}return!1},nine.controls=function(){Array.prototype.forEach.call(nine.pages,function(e){document.querySelector(".dots").appendChild(document.createElement("li"))}),document.querySelector(".dots li").classList.add("active"),document.querySelector(".next").addEventListener("click",function(){return nine.nextPage()}),document.querySelector(".prev").addEventListener("click",function(){return nine.prevPage()}),nine.updateControls()},nine.updateControls=function(){document.querySelector(".dots li.active").classList.remove("active"),document.querySelectorAll(".dots li")[nine.currentPage].classList.add("active"),document.querySelector(".next").classList.remove("disabled"),document.querySelector(".prev").classList.remove("disabled"),0==nine.currentPage&&document.querySelector(".prev").classList.add("disabled"),nine.currentPage==nine.pages.length-1&&document.querySelector(".next").classList.add("disabled")},document.addEventListener("DOMContentLoaded",function(){nine.scrollSpy(),console.log(nine.scrollStart),nine.keyboardNav(),nine.controls()}),window.onload=function(){nine.animateLoad()};
//# sourceMappingURL=./main-min.js.map