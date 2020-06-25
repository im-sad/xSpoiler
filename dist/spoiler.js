"use strict";

document.addEventListener("DOMContentLoaded", function () {
  "use strict"; // TODO: Add throttle


  (function initSpoilers() {
    var spolersList = document.querySelectorAll("[data-spoiler]");
    var windowWidth = getWindowWidth();

    for (var i = 0; i < spolersList.length; i++) {
      createSpoiler(spolersList[i]);
    }

    window.addEventListener("resize", debounce(updateSpoilers, 200)); // Functions

    function updateSpoilers() {
      var newWindowWidth = getWindowWidth(); // if width change

      if (newWindowWidth !== windowWidth) {
        for (var _i = 0; _i < spolersList.length; _i++) {
          reDraw(spolersList[_i]);
        }

        windowWidth = newWindowWidth;
      }
    }

    function createSpoiler(el) {
      el.classList.add("x-spoiler__inner"); // create text wrapper

      var spoilerWrapper = document.createElement("div");
      spoilerWrapper.className = "x-spoiler";
      el.parentNode.insertBefore(spoilerWrapper, el);
      spoilerWrapper.appendChild(el); // create btn

      var spoilerShowText = el.dataset.spoiler || "Show";
      var spoilerHideText = el.dataset.spoilerHide;
      var spoilerBtn = document.createElement("div");
      var spoilerBtnLink = document.createElement("div");
      var spoilerBtnLinkShow = document.createElement("span");
      spoilerBtn.className = "x-spoiler__more";
      spoilerBtnLink.className = "x-spoiler__more-link";
      spoilerBtnLinkShow.textContent = spoilerShowText;
      spoilerBtnLinkShow.classList.add("x-spoiler__more-show");
      spoilerBtn.appendChild(spoilerBtnLink);
      spoilerWrapper.appendChild(spoilerBtn);
      spoilerBtnLink.appendChild(spoilerBtnLinkShow);

      if (spoilerHideText) {
        var spoilerBtnLinkHide = document.createElement("span");
        spoilerBtnLinkHide.classList.add("x-spoiler__more-hide");
        spoilerBtnLinkHide.textContent = spoilerHideText;
        spoilerBtnLink.appendChild(spoilerBtnLinkHide);
        spoilerWrapper.classList.add("x-spoiler--has-toggle");
      } else {
        spoilerWrapper.classList.add("x-spoiler--no-toggle");
      }

      reDraw(el);
      spoilerBtnLink.addEventListener("click", function (e) {
        toggleVisibility(e.currentTarget);
      }, false);
    }

    function toggleVisibility(el) {
      var mainBlock = el.parentNode.parentNode;
      var mainBlockText = mainBlock.getElementsByClassName("x-spoiler__inner")[0];

      if (mainBlock.classList.contains("is-opened")) {
        mainBlock.classList.remove("is-opened");
        mainBlockText.style.maxHeight = null;
      } else {
        mainBlock.classList.add("is-opened");
        mainBlockText.style.maxHeight = mainBlockText.scrollHeight + "px";
      }
    }

    function reDraw(el) {
      var hasElScroll = el.scrollHeight > el.clientHeight;
      var parentBlock = el.parentNode;
      el.style.maxHeight = null;

      if (hasElScroll) {
        parentBlock.classList.add("x-spoiler--is-collapsed");
        parentBlock.classList.remove("is-opened");
      } else {
        parentBlock.classList.remove("x-spoiler--is-collapsed");
        parentBlock.classList.add("is-opened");
      }
    }

    function getWindowWidth() {
      return window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    }

    function debounce(func, wait, immediate) {
      var timeout;
      return function () {
        var context = this,
            args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(function () {
          timeout = null;
          if (!immediate) func.apply(context, args);
        }, wait);
        if (immediate && !timeout) func.apply(context, args);
      };
    }
  })();
});