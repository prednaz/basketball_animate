// export
let
  player_to_absolute_position,
  ball_to_absolute_position,
  player_along_path,
  ball_along_path,
  timeline,
  svg_main,
  clock_period,
  svg,
  music_set,
  svg_set;

{
  // player and ball positioning
  // Es gibt kein allgemeines Konzept von absoluter Position fuer svg-Elemente.
  // Die Funktin library.timeline_absolute_position erlaubt absolute Positionierung,
  // wenn man ihr als letztes Argument eine Definition von absoluter Position uebergibt.
  player_to_absolute_position = (element, duration, value) =>
    library.timeline_absolute_position("to", element, duration, value, player_absolute_position);
  const player_absolute_position = player => ({
    "x": player.querySelector("circle").cx.baseVal.value,
    "y": player.querySelector("circle").cy.baseVal.value
  });
  ball_to_absolute_position = (element, duration, value) =>
    library.timeline_absolute_position("to", element, duration, value, ball_absolute_position);
  const ball_absolute_position = ball => ({
    "x": 0.02542068*ball.querySelector("circle").cx.baseVal.value,
    "y": 0.02542067*ball.querySelector("circle").cy.baseVal.value + 10
  });
  // const player_from_absolute_position =
  //   (element, duration, value) =>
  //   library.timeline_absolute_position("from", element, duration, value, player_absolute_position);
  player_along_path = (element, duration, path, value) =>
    library.timeline_along_path("to", element, duration, path, value, player_absolute_position);
  ball_along_path = (element, duration, path, value) =>
    library.timeline_along_path("to", element, duration, path, value, ball_absolute_position);

  // initialize animations
  timeline = new TimelineMax({
    "paused": true,
    "onUpdate": () => {
      position_slider.slider("value", timeline.progress() * 100);
    },
    "onComplete": () => {
      clock.pause();
      music_dom.pause();
      play_button.button("option", "label", "Restart");
    }
  });
  svg_main = document.querySelector("#main_svg");
  let clock;
  clock_period = period => {
    clock = TweenMax.to(svg("#hand_clock"), period, {
        "rotation": "360_cw",
        "transformOrigin": "50% 0%",
        "ease": Power0.easeNone,
        "repeat": -1,
        "paused": true
      });
  };

  // user interface
  const music_dom = document.querySelector("#music");
  const music_restart = () => {
    music_dom.currentTime = 0;
    music_dom.play();
  };
  const play_button = $("#play").button({"label": "Play"});
  const position_display = $("#position_display");
  play_button.on("click", event => {
    if (timeline.totalProgress() !== 1) {
      const paused = !timeline.paused();
      if (!paused)
        music_dom.play();
      else
        music_dom.pause();
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
  const position_slider = $("#position_slider").slider({
    "min": 0,
    "max": 100,
    "step": .1,
    "stop": (event, ui) => {
      music_dom.currentTime = timeline.time();
    },
    "slide": (event, ui) => {
      timeline.progress(ui.value/100).pause();
      clock.totalTime(timeline.time()).pause();
      music_dom.pause();
      play_button.button("option", "label", "Play");
    }
  });
  const speed_display = $("#speed_display");
  const speed_slider = $("#speed_slider").slider({
    "min": 0,
    "max": 300,
    "step": 1,
    "value": 100,
    "change": (event, ui) => {
      music_dom.playbackRate = ui.value / 100;
      timeline.timeScale(ui.value/100);
      clock.timeScale(ui.value/100);
    },
    "slide": (event, ui) => {
      speed_display.text(ui.value + "%");
    }
  });

  // svg selector function
  svg = svg_selector => library.svg_element([svg_main], svg_selector);

  // choose media
  music_set = music_path => {
    music_dom.src = music_path;
    music_dom.load();
  };
  svg_set = svg_path => {svg_main.data = svg_path;};
}
