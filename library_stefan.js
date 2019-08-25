const svg = svg_selector => svg_element("#main_svg", svg_selector);

// Es gibt kein allgemeines Konzept von absoluter Position fuer svg-Elemente.
// Die Funktin timeline_absolute_position erlaubt absolute Positionierung,
// wenn man ihr als letztes Argument eine Definition von absoluter Position uebergibt.
const player_to_absolute_position = (element, duration, value) =>
  timeline_absolute_position("to", element, duration, value, player_absolute_position);
const player_absolute_position = player => ({
  "x": player.querySelector("circle").cx.baseVal.value,
  "y": player.querySelector("circle").cy.baseVal.value
});
const ball_to_absolute_position = (element, duration, value) =>
  timeline_absolute_position("to", element, duration, value, ball_absolute_position);
const ball_absolute_position = ball => ({
  "x": 0.02542068*ball.querySelector("circle").cx.baseVal.value,
  "y": 0.02542067*ball.querySelector("circle").cy.baseVal.value + 10
});
// const player_from_absolute_position =
//   (element, duration, value) =>
//   timeline_absolute_position("from", element, duration, value, player_absolute_position);
const player_along_path = (element, duration, path, value) =>
  timeline_along_path("to", element, duration, path, value, player_absolute_position);
const ball_along_path = (element, duration, path, value) =>
  timeline_along_path("to", element, duration, path, value, ball_absolute_position);

const timeline = new TimelineMax({
  "paused": true,
  "onUpdate": () => {
    position_slider.slider("value", timeline.progress() * 100);
  },
  "onComplete": () => {
    clock.pause();
    music.pause();
    play_button.button("option", "label", "Restart");
  }
});
let clock = TweenMax.to(svg("#hand_clock"), 8, {
    "rotation": "360_cw",
    "transformOrigin": "50% 0%",
    "ease": Power0.easeNone,
    "repeat": -1,
    "paused": true
  });

// GUI
let play_button, position_slider, speed_slider, position_display, speed_display;
$(() => {
  const music = $("#music")[0];
  const music_restart = () => {
    music.currentTime = 0;
    music.play();
  };
  play_button = $("#play").button({"label": "Play"});
  play_button.on("click", event => {
    if (timeline.totalProgress() !== 1) {
      const paused = !timeline.paused();
      if (!paused)
        music.play();
      else
        music.pause();
      timeline.paused(paused);
      clock.paused(paused);
      play_button.button("option", "label", paused ? "Play" : "Pause");
      if (paused)
        position_display.text(timeline.time() + "s");
    }
    else {
      music_restart();
      timeline.restart();
      clock.restart();
      play_button.button("option", "label", "Pause");
    }
  });
  position_slider = $("#position_slider").slider({
    "min": 0,
    "max": 100,
    "step": .1,
    "stop": (event, ui) => {
      music.currentTime = timeline.time();
    },
    "slide": (event, ui) => {
      timeline.progress(ui.value/100).pause();
      clock.totalTime(timeline.time()).pause();
      music.pause();
      play_button.button("option", "label", "Play");
    }
  });
  speed_slider = $("#speed_slider").slider({
    "min": 0,
    "max": 300,
    "step": 1,
    "value": 100,
    "change": (event, ui) => {
      music.playbackRate = ui.value / 100;
      timeline.timeScale(ui.value/100);
      clock.timeScale(ui.value/100);
    },
    "slide": (event, ui) => {
      speed_display.text(ui.value + "%");
    }
  });
  position_display = $("#position_display");
  speed_display = $("#speed_display");
});
