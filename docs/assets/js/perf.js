// testing grounds
"use strict";

function isMobile() {
  // Primary check: User-Agent Client Hints (supported in modern Chromium browsers)
  if (navigator.userAgentData && navigator.userAgentData.mobile) {
    return navigator.userAgentData.mobile;
  }

  // Fallback 1: Feature detection for touch/coarse pointers and small screens
  const hasTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
  const isSmallScreen = window.matchMedia("(max-width: 768px)").matches;
  if (hasTouch && isSmallScreen) {
    return true;
  }

  // Fallback 2: Legacy UA regex (use sparingly, as it's not future-proof)
  const ua = navigator.userAgent;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    ua,
  );
}

// protect phones, older / low end devices
if (isMobile()) {
  var explain = "";
  explain +=
    "For safety reasons this page does not work on your machine because it might be very old. In other cases the browser window size is not enough for the animation to work properly, so if that's the case, maximize the window, refresh and proceed with the tests.";
  var warning = '<div style="padding: 20px;">';
  warning += '<h1 class="text-danger">Warning!</h1>';
  warning +=
    '<p class="lead text-danger">This web page is only for high-end desktop computers.</p>';
  warning +=
    '<p class="text-danger">We do not take any responsibility and we are not liable for any damage caused through use of this website, be it indirect, special, incidental or consequential damages to your devices.</p>';
  warning += '<p class="text-info">' + explain + "</p>";
  warning += "</div>";
  document.body.innerHTML = warning;
  throw new Error(
    "This page is only for high-end desktop computers. " + explain,
  );
}

// generate a random number within a given range
function random(min, max) {
  return Math.random() * (max - min) + min;
}

// the variables
var container = document.getElementById("container");
var tws = [];
const group = new TWEEN.Group();

function complete() {
  document.getElementById("info").style.display = "block";
  container.innerHTML = "";
  tws.length = 0;
  // if (engine === "tween") {
  stop();
  group.removeAll();
  // }
}

function buildObjects() {
  var c = document.querySelector("[data-count]"),
    e = document.querySelector("[data-engine]"),
    r = document.querySelector("[data-repeat]"),
    p = document.querySelector("[data-property]"),
    ct = c && document.querySelector("[data-count]").getAttribute("data-count"),
    count = ct ? parseInt(ct) : null,
    engine = (e &&
      document.querySelector("[data-engine]").getAttribute("data-engine")) ||
      null,
    repeat = (r &&
      document.querySelector("[data-repeat]").getAttribute("data-repeat")) ||
      null,
    property = (p &&
      document
        .querySelector("[data-property]")
        .getAttribute("data-property")) ||
      null,
    warning = document.createElement("DIV");

  warning.className = "text-warning padding lead";
  container.innerHTML = "";
  if (count && engine && property && repeat) {
    if (engine === "gsap") {
      document.getElementById("info").style.display = "none";
    }

    createTest(count, property, engine, repeat);
    // since our engines don't do sync, we make it our own here
    if (engine === "kute") {
      document.getElementById("info").style.display = "none";
      startKUTE();
    }
    if (engine === "tween") {
      document.getElementById("info").style.display = "none";
      startTWEEN();
    }
    if (engine === "dnp-tween") {
      document.getElementById("info").style.display = "none";
      startDNPTWEEN();
    }
  } else {
    if (!count && !property && !repeat && !engine) {
      warning.innerHTML = "We are missing all the settings here.";
    } else {
      warning.innerHTML = "Now missing<br>";
      warning.innerHTML += !engine ? "- engine<br>" : "";
      warning.innerHTML += !property ? "- property<br>" : "";
      warning.innerHTML += !repeat ? "- repeat<br>" : "";
      warning.innerHTML += !count ? "- count<br>" : "";
    }

    container.appendChild(warning);
  }
}

let tik = 0;
function animate(time) {
  group.update(time);
  tik = requestAnimationFrame(animate);
}

function stop() {
  cancelAnimationFrame(tik);
}

function startKUTE() {
  var now = window.performance.now(),
    count = tws.length;
  for (var t = 0; t < count; t++) {
    tws[t].start(now + count / 16);
  }
}
function startTWEEN() {
  const now = window.performance.now();
  const gtws = group.getAll();
  const count = gtws.length;
  let t = 0;
  while (t < count) {
    gtws[t++].start(now + count / 16);
  }

  animate();
}

function startDNPTWEEN() {
  requestAnimationFrame(() => {
    const now = performance.now();
    const count = tws.length;

    for (let i = 0; i < count; i++) {
      tws[i].start(now + count / 16);
    }
  });
}

function createTest(count, property, engine, repeat) {
  let update;
  for (let i = 0; i < count; i++) {
    var div = document.createElement("div"),
      windowHeight = document.documentElement.clientHeight - 10,
      left = random(-200, 200),
      toLeft = random(-200, 200),
      top = Math.round(Math.random() * parseInt(windowHeight)),
      background = "rgb(" +
        parseInt(random(0, 255)) +
        "," +
        parseInt(random(0, 255)) +
        "," +
        parseInt(random(0, 255)) +
        ")",
      fromValues,
      toValues,
      fn = i === count - 1 ? complete : null;
    repeat = parseInt(repeat);

    div.className = "line";
    div.style.top = top + "px";
    div.style.backgroundColor = background;

    if (property === "left") {
      div.style.left = left + "px";
      fromValues = { left };
      toValues = { left: toLeft };
    } else {
      div.style.transform = "translate3d(" + (((left * 10) / 10) >> 0) +
        "px,0px,0px)";

      if (engine === "kute") {
        // fromValues = { translateX: left }
        // toValues = { translateX: toLeft }
        fromValues = { transform: { translate3d: [left, 0, 0] } };
        toValues = { transform: { translate3d: [toLeft, 0, 0] } };
        // fromValues = { transform: {translateX: left }}
        // toValues = { transform: {translateX: toLeft }}
      } else if (engine === "gsap") {
        fromValues = { x: left };
        toValues = { x: toLeft };
      } else if (engine === "tween") {
        fromValues = { x: left, div: div };
        toValues = { x: toLeft };
      } else if (engine === "dnp-tween") {
        fromValues = { x: left };
        toValues = { x: toLeft };
      }
    }

    container.appendChild(div);

    // perf test
    if (engine === "kute") {
      tws.push(
        KUTE.fromTo(div, fromValues, toValues, {
          easing: KUTE.Easing.easingQuadraticInOut,
          repeat: repeat,
          yoyo: true,
          duration: 2000,
          onComplete: fn,
        }),
      );
    } else if (engine === "gsap") {
      if (property === "left") {
        TweenMax.fromTo(div, 2, fromValues, {
          left: toValues.left,
          repeat: repeat,
          yoyo: true,
          ease: Quad.easeInOut,
          onComplete: fn,
        });
      } else {
        TweenMax.fromTo(div, 2, fromValues, {
          x: toValues.x,
          repeat: repeat,
          yoyo: true,
          ease: Quad.easeInOut,
          onComplete: fn,
        });
      }
    } else if (engine === "tween") {
      const target = div;

      if (property === "left") {
        update = (obj) => {
          // target.style.left = (((obj.left * 1000) / 1000) >> 0) + "px";
          target.style.setProperty(
            "left",
            (((obj.left * 1000) / 1000) >> 0) + "px",
          );
        };
      } else if (property === "translateX") {
        update = (obj) => {
          // target.style.transform =
          //   "translate3d(" + (((obj.x * 1000) / 1000) >> 0) + "px,0px,0px)";
          target.style.setProperty(
            "transform",
            "translate3d(" + (((obj.x * 1000) / 1000) >> 0) + "px,0px,0px)",
          );
        };
      }

      group.add(
        new TWEEN.Tween(fromValues)
          .to(toValues, 2000)
          // .group(group)
          .easing(TWEEN.Easing.Quadratic.InOut)
          .onComplete(fn)
          .onUpdate(update)
          .repeat(repeat)
          .yoyo(true),
      );
    } else if (engine === "dnp-tween") {
      const target = div;
      if (property === "left") {
        update = (obj) => {
          // target.style.left = (((obj.left * 1000) / 1000) >> 0) + "px";
          target.style.setProperty(
            "left",
            (((obj.left * 1000) / 1000) >> 0) + "px",
          );
        };
      } else if (property === "translateX") {
        update = (obj) => {
          target.style.setProperty(
            "transform",
            "translate3d(" + (((obj.x * 1000) / 1000) >> 0) + "px,0px,0px)",
          );
          // target.style.transform =
          //   "translate3d(" + (((obj.x * 1000) / 1000) >> 0) + "px,0px,0px)";
        };
      }

      tws.push(
        new DNPTWEEN.Tween(fromValues)
          // .use(property === "translateX" ? "x" : "left", {
          //   interpolate: (start, end, val) => start + (end - start) * val,
          // })
          .to(toValues)
          .easing(DNPTWEEN.Easing.Quadratic.InOut)
          .onComplete(fn)
          .repeat(repeat)
          .onUpdate(update)
          .yoyo(true)
          .duration(2),
      );
    }
  }
}
// the start  button handle
document.getElementById("start").addEventListener("click", buildObjects, false);

//some button toggle
var btnGroups = document.querySelectorAll(".btn-group"),
  l = btnGroups.length;

for (var i = 0; i < l; i++) {
  var g = btnGroups[i],
    links = g.querySelectorAll("a, .dropdown-menu button"),
    ll = links.length;
  for (var j = 0; j < ll; j++) {
    links[j].onclick = function () {
      var link = this,
        b = link.parentNode.parentNode.parentNode.querySelector(".btn");
      b.innerHTML = link.id.toUpperCase() + ' <span class="caret"></span>';
      b.setAttribute(
        "data-" + link.parentNode.parentNode.parentNode.id,
        link.id,
      );
    };
  }
}
